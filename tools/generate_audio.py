"""Genera audios MP3 con voz neuronal (Kokoro, código abierto) para el contenido fijo del curso.

Requisitos (una sola vez):
  pip install kokoro-onnx soundfile
  Descarga kokoro-v1.0.int8.onnx y voices-v1.0.bin de
  https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
  y ten ffmpeg instalado.

Uso:
  node tools/audio_texts.js > audio/texts.json        (o con --all para incluir más)
  python tools/generate_audio.py --model kokoro-v1.0.int8.onnx --voices voices-v1.0.bin

Es incremental: solo genera los audios que faltan. Puedes interrumpirlo y continuar luego.
"""
import argparse, json, os, subprocess, sys, tempfile, time
from pathlib import Path

VOICES = {"A": ("af_heart", "en-us"), "B": ("bm_george", "en-gb"), "C": ("am_michael", "en-us")}

def fnv(s: str) -> str:
    h = 0x811C9DC5
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--voices", required=True)
    ap.add_argument("--texts", default="audio/texts.json")
    ap.add_argument("--out", default="audio")
    ap.add_argument("--max-seconds", type=float, default=0, help="Detenerse después de N segundos (0 = sin límite)")
    ap.add_argument("--only", default="", help="Categorías separadas por coma (word,sentence,dialogue,...)")
    ap.add_argument("--part", default="", help="Dividir el trabajo, ej. 1/2 y 2/2 en dos computadores")
    a = ap.parse_args()
    import soundfile as sf
    from kokoro_onnx import Kokoro
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    items = json.loads(Path(a.texts).read_text(encoding="utf-8"))
    if a.only:
        cats = set(a.only.split(","))
        items = [x for x in items if x["cat"] in cats]
    if a.part:
        i, n = map(int, a.part.split("/"))
        items = items[i - 1::n]
    todo = [x for x in items if not (out / f"{fnv(x['v'] + '|' + x['t'])}.mp3").exists()]
    print(f"{len(items)} textos, {len(todo)} por generar", flush=True)
    k = Kokoro(a.model, a.voices)
    t0 = time.time(); done = 0
    for x in todo:
        if a.max_seconds and time.time() - t0 > a.max_seconds:
            break
        voice, lang = VOICES[x["v"]]
        samples, sr = k.create(x["t"], voice=voice, speed=1.0, lang=lang)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            sf.write(tmp.name, samples, sr)
        dest = out / f"{fnv(x['v'] + '|' + x['t'])}.mp3"
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", tmp.name, "-ac", "1", "-b:a", "48k", str(dest)], check=True)
        os.unlink(tmp.name)
        done += 1
        if done % 25 == 0:
            print(f"  {done}/{len(todo)} ({time.time() - t0:.0f}s)", flush=True)
    index = sorted(p.stem for p in out.glob("*.mp3"))
    (out / "index.json").write_text(json.dumps(index), encoding="utf-8")
    print(f"Listo: {done} nuevos. Total de audios: {len(index)}. Faltan: {len(todo) - done}", flush=True)

if __name__ == "__main__":
    main()
