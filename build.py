"""Genera index.html uniendo src/shell.html con config, contenido, niveles y app."""
from pathlib import Path
root = Path(__file__).parent
src = root / "src"
read = lambda p: p.read_text(encoding="utf-8")
content = "\n".join([read(src / "config.js"), read(src / "content.js")] + [read(p) for p in sorted((src / "levels").glob("*.js"))])
html = read(src / "shell.html").replace("/*CONTENT*/", content).replace("/*APP*/", read(src / "app.js"))
(root / "index.html").write_text(html, encoding="utf-8")
print("index.html generado:", len(html), "bytes")
