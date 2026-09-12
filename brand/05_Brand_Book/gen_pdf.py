"""Render brand_book.md to brand_book.pdf via fpdf2 (texto; sem dependencias pesadas)."""
import re
from fpdf import FPDF

BASE = "C:/PauloOS/70_AI_OS/AGENT_STUDIO/brand/05_Brand_Book"
src = open(f"{BASE}/brand_book.md", encoding="utf-8").read()

def tx(t):
    return (t.replace("—", "-").replace("–", "-").replace("“", '"').replace("”", '"')
             .replace("’", "'").replace("•", "-").replace("→", "->").replace("✓", "v")
             .replace("…", "...").replace("©", "(c)"))

pdf = FPDF(format="A4")
pdf.set_auto_page_break(True, margin=20)
pdf.add_page()
pdf.set_font("Helvetica", "B", 22)
pdf.cell(0, 12, tx("SyncSet - Brand Book v1.0"), new_x="LMARGIN", new_y="NEXT")
pdf.set_font("Helvetica", "", 10)
pdf.cell(0, 8, tx("Agencia de IA - automacao de workflows | 2026-09-11"), new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)

for line in src.splitlines():
    pdf.set_x(pdf.l_margin)
    s = line.rstrip()
    if not s:
        pdf.ln(3)
        continue
    if s.startswith("### "):
        pdf.set_font("Helvetica", "B", 12)
        pdf.multi_cell(0, 7, tx(s[4:]))
    elif s.startswith("## "):
        pdf.ln(2)
        pdf.set_font("Helvetica", "B", 15)
        pdf.set_text_color(11, 19, 43)
        pdf.multi_cell(0, 9, tx(s[3:]))
        pdf.set_text_color(0, 0, 0)
    elif s.startswith("# "):
        pdf.set_font("Helvetica", "B", 17)
        pdf.multi_cell(0, 10, tx(s[2:]))
    elif s.startswith(("- ", "* ")):
        pdf.set_font("Helvetica", "", 10)
        clean = re.sub(r"\*\*(.+?)\*\*", r"\1", s[2:])
        pdf.multi_cell(0, 6, tx(chr(8226) + " " + clean))
    elif re.match(r"^\d+\. ", s):
        pdf.set_font("Helvetica", "", 10)
        clean = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
        pdf.multi_cell(0, 6, tx(clean))
    elif s.startswith("|"):
        cells = [c.strip() for c in s.strip().strip("|").split("|")]
        if all(set(c) <= set("-: ") for c in cells):
            continue
        cells = [(c[:45] + "...") if len(c) > 46 else c for c in cells]
        pdf.set_font("Courier", "", 8)
        pdf.multi_cell(0, 5, tx(" | ".join(cells)))
        pdf.set_font("Helvetica", "", 10)
    else:
        pdf.set_font("Helvetica", "", 10)
        clean = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
        pdf.multi_cell(0, 6, tx(clean))

pdf.output(f"{BASE}/brand_book.pdf")
print("PDF ok")
