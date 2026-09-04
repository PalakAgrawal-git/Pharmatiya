"""Parse MehtaRR_Publications.pdf into data/publications.json.

Only the published record is used — no personal contact details, no licence
numbers, and no client engagements that do not appear in the literature.
"""
import json, re, io, sys
import pypdf

BULLET = chr(0x2751)

reader = pypdf.PdfReader(r"C:\Users\Palak Agrawal\Desktop\pharmatiya\MehtaRR_Publications.pdf")
raw = "\n".join(p.extract_text() for p in reader.pages)
raw = re.sub(r"\s+", " ", raw)

parts = [p.strip() for p in raw.split(BULLET) if p.strip()]

# Section markers are appended to the tail of the preceding entry.
SECTION_MARKERS = ["Presentations:", "Book Chapter:"]

entries = []
section = "publication"
for part in parts:
    if part.startswith("Publications"):
        continue
    text = part
    trailing_section = None
    for marker in SECTION_MARKERS:
        if text.endswith(marker):
            text = text[: -len(marker)].strip()
            trailing_section = marker
    if text:
        entries.append((section, text))
    if trailing_section == "Presentations:":
        section = "presentation"
    elif trailing_section == "Book Chapter:":
        section = "book chapter"

# The arXiv DOI line is a continuation of the preceding entry, not its own.
merged = []
for sec, text in entries:
    if text.startswith("https://doi.org") and merged:
        merged[-1] = (merged[-1][0], merged[-1][1].rstrip(". ") + ". " + text)
    else:
        merged.append((sec, text))

TOPIC_MAP = {
    "Atrial fibrillation": ["atrial fibrillation", "mstops", "ecg"],
    "Type 2 diabetes": ["diabetes", "hba1c"],
    "Infectious disease": [
        "infection", "antibiotic", "antimicrobial", "clostridium", "difficile",
        "staphylococcus", "mrsa", "pneumoniae", "bacteremia", "abssai", "abssi",
        "abssti", "abssai", "abssei", "abssi", "abss", "streptococcus",
        "urinary tract", "sepsis", "vaccine", "pcv13", "microbiology",
        "nosocomial", "antibacterial",
    ],
    "COVID-19": ["covid"],
    "Psoriasis": ["psoriasis", "psoriatic"],
    "Haemophilia": ["hemophilia", "haemophilia"],
    "Mental health": ["mood and anxiety", "depress", "anxiety", "pharmacogenetic"],
    "Opioid utilisation": ["opioid"],
    "Asthma": ["asthma"],
    "Cardiovascular": ["cvd", "cardiovascular", "heart failure"],
    "Trauma": ["trauma"],
    "Pharmacovigilance": ["pharmacovigilance", "sentinel", "drug safety"],
}

METHOD_MAP = {
    "Machine learning": ["machine learning"],
    "Meta-analysis": ["meta-analysis", "systematic review"],
    "Propensity score matching": ["propensity-score", "propensity score"],
    "Logistic regression": ["logistic regression"],
    "Randomised / pragmatic trial": ["pragmatic", "randomized", "randomised"],
    "Surveillance": ["surveillance", "point-prevalence", "genotyping",
                     "strain-relatedness", "prevalence survey"],
    "Claims analysis": ["claims"],
    "Cost & resource use": ["cost", "resource utilization", "reimbursement"],
}

JOURNALS = [
    "JAMA", "Circulation", "Diabetes Obes Metab", "Vaccine",
    "Contemp Clin Trials Commun", "Depress Anxiety", "American Heart Journal",
    "Journal of Trauma",
]


def classify(text, mapping):
    lowered = text.lower()
    hits = []
    for label, needles in mapping.items():
        if any(n.lower() in lowered for n in needles):
            hits.append(label)
    return hits


def kind(sec, text):
    if sec != "publication":
        return sec
    if "Patent" in text:
        return "patent"
    if "(Poster" in text or "(Poster)" in text:
        return "poster"
    if "(Abstract" in text:
        return "abstract"
    return "publication"


def year_of(text):
    years = re.findall(r"(19|20)\d{2}", text)
    if not years:
        return None
    all_years = re.findall(r"((?:19|20)\d{2})", text)
    return max(int(y) for y in all_years)


def venue_of(text):
    for j in JOURNALS:
        if j in text:
            return j
    m = re.search(r"(ISPOR|AMCP|ID Week|IDWeek|IDSA|ICAAC|SHEA|ASM|ASHP|"
                  r"American Heart Association|ACC \d{4}|American College of Surgeons|"
                  r"European Association for Haemophilia[^.]*)", text)
    return m.group(1).strip() if m else None


def link_of(text):
    m = re.search(r"(https?://\S+?)(?:[.,]?\s|$)", text)
    if m:
        return m.group(1).rstrip(".,")
    m = re.search(r"doi:\s*(10\.\S+?)(?:[.,]?\s|$)", text)
    if m:
        return "https://doi.org/" + m.group(1).rstrip(".,")
    m = re.search(r"PMID:\s*(\d+)", text)
    if m:
        return "https://pubmed.ncbi.nlm.nih.gov/" + m.group(1)
    m = re.search(r"US Patent:\s*([\d,]+)", text)
    if m:
        return "https://patents.google.com/patent/US" + m.group(1).replace(",", "")
    return None


records = []
for i, (sec, text) in enumerate(merged):
    text = re.sub(r"\s+", " ", text).strip()
    records.append({
        "id": f"p{i+1}",
        "citation": text,
        "year": year_of(text),
        "type": kind(sec, text),
        "venue": venue_of(text),
        "link": link_of(text),
        "topics": classify(text, TOPIC_MAP),
        "methods": classify(text, METHOD_MAP),
    })

# The supplied bibliography lists the ABSSSI poster twice; collapse exact
# repeats after normalising whitespace and punctuation spacing.
def norm(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())

seen = set()
deduped = []
for record in records:
    key = norm(record["citation"])
    if key in seen:
        continue
    seen.add(key)
    deduped.append(record)

removed = len(records) - len(deduped)
records = deduped
print("duplicates removed:", removed)

records.sort(key=lambda r: (r["year"] or 0), reverse=True)

counts = {}
for r in records:
    counts[r["type"]] = counts.get(r["type"], 0) + 1

out = {
    "generatedAt": None,
    "source": "MehtaRR_Publications.pdf, supplied by Pharmatiya",
    "note": "Published record only. Derived from the supplied bibliography; "
            "no personal contact details, licence numbers or unpublished "
            "client engagements are included.",
    "counts": counts,
    "total": len(records),
    "publications": records,
}

path = r"C:\Users\Palak Agrawal\Desktop\pharmatiya\data\publications.json"
io.open(path, "w", encoding="utf8", newline="\n").write(
    json.dumps(out, indent=2, ensure_ascii=False) + "\n"
)

print("total:", len(records))
print("by type:", counts)
print("years:", min(r["year"] for r in records if r["year"]), "-",
      max(r["year"] for r in records if r["year"]))
print("with links:", sum(1 for r in records if r["link"]))
topics = {}
for r in records:
    for t in r["topics"]:
        topics[t] = topics.get(t, 0) + 1
print("topics:", dict(sorted(topics.items(), key=lambda x: -x[1])))
methods = {}
for r in records:
    for m in r["methods"]:
        methods[m] = methods.get(m, 0) + 1
print("methods:", dict(sorted(methods.items(), key=lambda x: -x[1])))
print("untagged:", sum(1 for r in records if not r["topics"]))
