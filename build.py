"""Genera index.html uniendo src/shell.html con config, contenido, niveles, extras y app."""
from pathlib import Path
root = Path(__file__).parent
src = root / "src"
read = lambda p: p.read_text(encoding="utf-8")
content = "\n".join([read(src / "config.js"), read(src / "content.js")]
                    + [read(p) for p in sorted((src / "levels").glob("*.js"))]
                    + [read(p) for p in sorted((src / "extras").glob("*.js"))])
app = "\n".join(read(src / f) for f in ["app.js", "app2.js", "app3.js", "app4.js", "app5.js", "app6.js", "start.js"])
html = read(src / "shell.html").replace("/*CONTENT*/", content).replace("/*APP*/", app)
(root / "index.html").write_text(html, encoding="utf-8")
print("index.html generado:", len(html), "bytes")
