"""Importa las fotos de Pixabay elegidas (archivo JSON exportado desde el navegador).
Uso: python tools/import_photos.py pixabay_fotos.json
Crea img/px/<palabra>.webp y src/extras/px.js con los créditos."""
import base64, json, re, sys
from pathlib import Path
root = Path(__file__).resolve().parent.parent
data = {}
for p in sys.argv[1:]:
    data.update(json.loads(Path(p).read_text(encoding="utf-8")))
out = root / "img" / "px"; out.mkdir(parents=True, exist_ok=True)
meta = {}
slug = lambda w: re.sub(r"[^a-z0-9]+", "-", w.lower()).strip("-")
for word, x in sorted(data.items()):
    f = slug(word)
    (out / f"{f}.webp").write_bytes(base64.b64decode(x["b64"]))
    meta[word] = [f, x["user"], x["id"]]
js = ("// ===== FOTOS (Pixabay, licencia de contenido de Pixabay) =====\n"
      "// palabra: [archivo en img/px/, autor en Pixabay, id de la foto (pixabay.com/photos/<id>)]\n"
      "const PX_PHOTOS = " + json.dumps(meta, ensure_ascii=False, separators=(",", ":")) + ";\n")
(root / "src" / "extras" / "px.js").write_text(js, encoding="utf-8")
print(len(meta), "fotos")
