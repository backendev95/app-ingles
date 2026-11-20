"""Genera src/extras/phon.js: pronunciación de todas las palabras del curso.

Fuente: CMU Pronouncing Dictionary (dominio público, inglés estadounidense).
Para cada palabra calcula:
  - IPA (fonética internacional) con la sílaba fuerte marcada
  - pronunciación escrita "a la española", con la sílaba fuerte en MAYÚSCULAS
  - códigos de trampas típicas para hispanohablantes (la app los convierte en consejos)

Uso:
  pip download cmudict --no-deps -d /tmp/cmu && (cd /tmp/cmu && unzip -o cmudict-*.whl)
  node tools/dump_words.js > /tmp/words.json
  python tools/build_pron.py /tmp/cmu/cmudict/data/cmudict.dict /tmp/words.json
"""
import json, re, sys
from pathlib import Path

VOW = {"AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY", "OW", "OY", "UH", "UW"}
IPA_V = {"AA": "ɑ", "AE": "æ", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ", "EH": "ɛ", "EY": "eɪ", "IH": "ɪ", "IY": "i", "OW": "oʊ", "OY": "ɔɪ", "UH": "ʊ", "UW": "u"}
IPA_C = {"B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "F": "f", "G": "ɡ", "HH": "h", "JH": "dʒ", "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ŋ", "P": "p", "R": "r", "S": "s", "SH": "ʃ", "T": "t", "TH": "θ", "V": "v", "W": "w", "Y": "j", "Z": "z", "ZH": "ʒ"}
ES_V = {"AA": "a", "AE": "a", "AO": "o", "AW": "au", "AY": "ai", "EH": "e", "ER": "er", "EY": "ei", "IH": "i", "IY": "ii", "OW": "ou", "OY": "oi", "UH": "u", "UW": "uu"}
ES_C = {"B": "b", "CH": "ch", "D": "d", "DH": "d", "F": "f", "G": "g", "HH": "j", "JH": "y", "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ng", "P": "p", "R": "r", "S": "s", "SH": "sh", "T": "t", "TH": "z", "V": "v", "W": "u", "Y": "y", "Z": "s", "ZH": "sh"}
ONSETS = {tuple(x.split()) for x in """P R|P L|B R|B L|T R|T W|D R|D W|K R|K L|K W|G R|G L|G W|F R|F L|TH R|TH W|SH R|S P|S T|S K|S M|S N|S L|S W|S F|S P R|S P L|S T R|S K R|S K W|S K L|P Y|B Y|K Y|F Y|M Y|V Y|HH Y|G Y|L Y|S Y|N Y|T Y|D Y|V R|HH W""".split("|")}

MANUAL = {
    "spelt": "S P EH1 L T", "hotfix": "HH AA1 T F IH2 K S", "microservice": "M AY1 K R OW0 S ER2 V IH0 S",
    "onboarding": "AA1 N B AO2 R D IH0 NG", "maintainable": "M EY0 N T EY1 N AH0 B AH0 L", "refactor": "R IY0 F AE1 K T ER0",
    "rebase": "R IY0 B EY1 S", "colonel": "K ER1 N AH0 L",
}
# Palabras famosas por engañar: se fuerza la variante más común y se agrega un consejo.
FORCE = {"comfortable": "K AH1 M F T ER0 B AH0 L", "vegetable": "V EH1 JH T AH0 B AH0 L", "chocolate": "CH AO1 K L AH0 T",
         "different": "D IH1 F R AH0 N T", "interesting": "IH1 N T R AH0 S T IH0 NG", "every": "EH1 V R IY0", "family": "F AE1 M L IY0",
         "camera": "K AE1 M R AH0", "restaurant": "R EH1 S T R AA0 N T", "temperature": "T EH1 M P R AH0 CH ER0", "business": "B IH1 Z N AH0 S",
         "evening": "IY1 V N IH0 NG", "favorite": "F EY1 V R IH0 T", "favourite": "F EY1 V R IH0 T", "several": "S EH1 V R AH0 L",
         "often": "AO1 F AH0 N", "probably": "P R AA1 B AH0 B L IY0", "wednesday": "W EH1 N Z D EY2", "february": "F EH1 B Y UW0 EH2 R IY0",
         "the": "DH AH0", "a": "AH0", "to": "T UW1", "and": "AE1 N D", "of": "AH1 V", "for": "F AO1 R", "your": "Y AO1 R", "our": "AW1 ER0"}

def load_cmu(p):
    d = {}
    for line in open(p, encoding="utf-8"):
        line = line.split("#")[0].strip()
        if not line: continue
        w, *ph = line.split()
        d.setdefault(re.sub(r"\(\d\)$", "", w), []).append(ph)
    return d

def lookup(w, cmu):
    w = w.lower()
    if w in FORCE: return FORCE[w].split()
    if w in MANUAL: return MANUAL[w].split()
    for cand in (w, re.sub(r"is(e|ed|es|ing|ation)$", r"iz\1", w), w.replace("our", "or")):
        if cand in cmu:
            # la variante con menos sílabas suele ser la habitual (comfortable, interesting…)
            vs = cmu[cand]
            return min(vs, key=lambda v: (sum(p[-1].isdigit() for p in v), vs.index(v)))
    for suf, add in (("s", None), ("ed", None)):
        if w.endswith(suf) and len(w) > 4:
            b = lookup(w[: -len(suf)], cmu) or (lookup(w[:-1], cmu) if suf == "ed" else None)
            if b:
                last = b[-1].rstrip("012")
                if suf == "s": return b + (["IH0", "Z"] if last in ("S", "Z", "SH", "CH", "JH") else ["S"] if last in ("P", "T", "K", "F", "TH") else ["Z"])
                return b + (["IH0", "D"] if last in ("T", "D") else ["T"] if last in ("P", "K", "F", "S", "SH", "CH", "TH") else ["D"])
    return None

def syllables(ph):
    """Divide en sílabas con el principio de máximo ataque."""
    idx = [i for i, p in enumerate(ph) if p.rstrip("012") in VOW]
    if not idx: return [ph]
    cuts = [0]
    for a, b in zip(idx, idx[1:]):
        cons = ph[a + 1:b]
        k = len(cons)
        if k == 0: cut = b
        else:
            cut = b - 1
            for n in range(min(3, k), 1, -1):
                if tuple(c for c in cons[-n:]) in ONSETS:
                    cut = b - n; break
        cuts.append(cut)
    cuts.append(len(ph))
    return [ph[cuts[i]:cuts[i + 1]] for i in range(len(cuts) - 1)]

def stress_of(syl):
    for p in syl:
        if p[-1].isdigit(): return int(p[-1])
    return 0

def to_ipa(sylls):
    out = []
    multi = len(sylls) > 1
    for s in sylls:
        st = stress_of(s)
        txt = ""
        for p in s:
            b = p.rstrip("012")
            if b in VOW:
                d = p[-1]
                if b == "AH": txt += "ʌ" if d == "1" else "ə"
                elif b == "ER": txt += "ɝ" if d == "1" else "ɚ"
                else: txt += IPA_V[b]
            else: txt += IPA_C[b]
        out.append(("ˈ" if st == 1 and multi else "ˌ" if st == 2 and multi else "") + txt)
    return "".join(out)

def to_es(sylls):
    parts = []
    sylls = sylls
    multi = len(sylls) > 1
    for s in sylls:
        txt = ""
        for i, p in enumerate(s):
            b = p.rstrip("012")
            if b in VOW:
                v = "e" if b == "AH" and p[-1] == "0" else "a" if b == "AH" else "i" if b == "IY" and p[-1] != "1" and len(sylls) > 1 else ES_V[b]
                txt += v
            else:
                c = ES_C[b]
                nxt = s[i + 1].rstrip("012") if i + 1 < len(s) else ""
                if b == "G" and nxt in ("EH", "IH", "IY", "EY", "ER"): c = "gu"
                if b == "W" and not nxt: c = "u"
                txt += c
        txt = txt.replace("uu", "u") if txt.startswith("uu") else txt
        parts.append(txt.upper() if multi and stress_of(s) == 1 else txt)
    return "-".join(parts)

SILENT = [  # (regex en la ortografía, condición sobre los fonemas, código)
    (r"^kn", lambda ph: ph[0] == "N", "silent_k"), (r"^wr", lambda ph: ph[0] == "R", "silent_w"), (r"mb$", lambda ph: ph[-1] == "M", "silent_b"),
    (r"^ps", lambda ph: ph[0] == "S", "silent_p"), (r"^h", lambda ph: ph[0] != "HH" and ph[0] != "W", "silent_h"),
    (r"stle$|sten$", lambda ph: "T" not in ph[-3:], "silent_t"), (r"(al|ol)(k|m)", lambda ph: "L" not in ph, "silent_l"),
    (r"igh", lambda ph: "G" not in ph and "F" not in ph, "silent_gh"), (r"ough|augh", lambda ph: "G" not in ph and "F" not in ph, "silent_gh"),
    (r"^is", lambda ph: ph[:2] == ["AY1", "L"], "silent_s"), (r"bt$|bt", lambda ph: "B" not in ph, "silent_b"), (r"gn$|^gn", lambda ph: "G" not in ph, "silent_g"),
]

def tips(word, ph, sylls):
    w = word.lower(); base = [p.rstrip("012") for p in ph]; codes = []
    for rx, cond, code in SILENT:
        if re.search(rx, w) and cond(ph) and code not in codes: codes.append(code)
    if w == "wednesday": codes.append("silent_d")
    # sílabas: la ortografía sugiere más sílabas de las que tiene
    vg = len(re.findall(r"[aeiouy]+", re.sub(r"(?<![l])e$|es$|ed$", "", w))) or 1
    if len(w) > 5 and vg > len(sylls) and not re.search(r"(ea|ou|ai|oi|ie|ee|oo|ue|ui|ay|ey|oy|ia|io)", w): codes.append("syl%d" % len(sylls))
    if re.search(r"[^e]ed$|ied$", w) and len(w) > 3:
        if base[-1] == "D" and len(base) > 1 and base[-2] in ("IH", "AH"): codes.append("ed_id")
        elif base[-1] == "T": codes.append("ed_t")
        elif base[-1] == "D": codes.append("ed_d")
    if base[0] == "S" and len(base) > 1 and base[1] in ("P", "T", "K", "M", "N", "L", "W"): codes.append("s_cons")
    for b, code in (("TH", "th"), ("DH", "dh"), ("V", "v"), ("Z", "z"), ("SH", "sh"), ("JH", "jh"), ("HH", "h"), ("AE", "ae"), ("NG", "ng"), ("ZH", "zh")):
        if b in base and code not in codes: codes.append(code)
    if "IH" in base and "IY" not in base: codes.append("ih")
    if "IY" in base and len(sylls) == 1: codes.append("iy")
    if "ER" in base or "R" in base: codes.append("r")
    if any(p in ("AH0", "ER0") for p in ph) and len(sylls) > 1: codes.append("schwa")
    if base[-1] not in VOW and len(base) > 2 and base[-2] not in VOW and base[-1] not in ("S", "Z"): codes.append("final")
    # prioridad: primero lo que más engaña
    order = ["silent_k", "silent_w", "silent_b", "silent_p", "silent_h", "silent_t", "silent_l", "silent_gh", "silent_s", "silent_d", "silent_g"] + [c for c in codes if c.startswith("syl")] + ["ed_t", "ed_d", "ed_id", "s_cons", "th", "dh", "v", "ih", "iy", "ae", "schwa", "sh", "jh", "z", "zh", "h", "r", "ng", "final"]
    return [c for c in order if c in codes][:3]

def main():
    cmu = load_cmu(sys.argv[1]); d = json.load(open(sys.argv[2], encoding="utf-8"))
    tok = lambda s: re.findall(r"[A-Za-z]+(?:'[a-z]+)?", s or "")
    words = sorted({w.lower() for it in d["items"] for w in tok(it["en"])} | {w.lower() for t in d["texts"] for w in tok(t)})
    out, miss = {}, []
    for w in words:
        ph = lookup(w, cmu)
        if not ph: miss.append(w); continue
        sy = syllables(ph)
        out[w] = [to_ipa(sy), to_es(sy), ",".join(tips(w, ph, sy))]
    js = "// Generado por tools/build_pron.py a partir del CMU Pronouncing Dictionary (inglés estadounidense).\n// palabra: [IPA, pronunciación a la española (MAYÚSCULAS = sílaba fuerte), códigos de consejos]\nconst PHON = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    Path(__file__).resolve().parent.parent.joinpath("src/extras/phon.js").write_text(js, encoding="utf-8")
    print(len(out), "palabras;", len(miss), "sin datos:", miss[:40], "| tamaño", len(js.encode()) // 1024, "KB")

if __name__ == "__main__":
    main()
