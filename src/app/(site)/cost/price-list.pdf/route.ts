import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { COST_DISCLAIMER, COST_ESTIMATOR_NOTE } from "@/content/cost-estimator";
import { formatBand, isPricedBand } from "@/lib/cost-bands";
import { getContactDetails, getCostEstimator, getPrimaryLocation } from "@/lib/queries";
import { SITE_URL } from "@/lib/schema";

// Prerendered, then regenerated whenever an admin edit revalidates the site,
// so the PDF always matches the prices on /cost.
export const dynamic = "force-static";

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 48;
const FOREST = rgb(0.15, 0.3, 0.22);
const TERRACOTTA = rgb(0.55, 0.25, 0.14);
const MUTED = rgb(0.38, 0.4, 0.42);
const RULE = rgb(0.86, 0.87, 0.85);

// Inter (SIL OFL 1.1, see src/assets/fonts/OFL.txt): the standard PDF fonts have no ₹ glyph.
async function loadFont(file: string) {
  return readFile(path.join(process.cwd(), "src/assets/fonts", file));
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function GET() {
  const [categories, contact, location] = await Promise.all([
    getCostEstimator(),
    getContactDetails(),
    getPrimaryLocation(),
  ]);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [regular, bold] = await Promise.all([
    loadFont("Inter-Regular.ttf").then((b) => pdf.embedFont(b, { subset: true })),
    loadFont("Inter-Bold.ttf").then((b) => pdf.embedFont(b, { subset: true })),
  ]);
  pdf.setTitle("Aaravya Hospital — Estimated Treatment Costs");
  pdf.setAuthor("Aaravya Hospital");

  const contentWidth = A4.width - MARGIN * 2;
  const costColX = A4.width - MARGIN - 130;
  const medColX = MARGIN + contentWidth * 0.42;
  let page: PDFPage = pdf.addPage([A4.width, A4.height]);
  let y = A4.height - MARGIN;

  const ensure = (needed: number) => {
    if (y - needed < MARGIN + 20) {
      page = pdf.addPage([A4.width, A4.height]);
      y = A4.height - MARGIN;
    }
  };
  const text = (t: string, x: number, size: number, font = regular, color = rgb(0.1, 0.1, 0.1)) =>
    page.drawText(t, { x, y, size, font, color });
  const paragraph = (t: string, size: number, font = regular, color = MUTED, width = contentWidth) => {
    for (const line of wrap(t, font, size, width)) {
      ensure(size + 4);
      text(line, MARGIN, size, font, color);
      y -= size + 4;
    }
  };

  text("AARAVYA HOSPITAL", MARGIN, 10, bold, TERRACOTTA);
  y -= 24;
  text("Estimated Treatment Costs — Proctology", MARGIN, 18, bold, FOREST);
  y -= 16;
  const updated = categories
    .flatMap((c) => c.treatments.map((t) => t.updatedAt))
    .reduce<Date | null>((a, b) => (!a || b > a ? b : a), null);
  if (updated) {
    text(`Updated ${updated.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, MARGIN, 9, regular, MUTED);
    y -= 14;
  }
  paragraph("Indicative estimates for planning only. Each estimate uses a standardized ₹5,000 band that depends on procedure complexity.", 9);
  y -= 10;

  for (const category of categories.filter((c) => c.treatments.length > 0)) {
    ensure(48);
    page.drawRectangle({ x: MARGIN, y: y - 6, width: contentWidth, height: 20, color: rgb(0.93, 0.96, 0.94) });
    text(category.name, MARGIN + 8, 11, bold, FOREST);
    y -= 24;
    text("Treatment", MARGIN + 8, 8, bold, MUTED);
    text("Medical name", medColX, 8, bold, MUTED);
    text("Estimated Treatment Cost", costColX, 8, bold, MUTED);
    y -= 12;

    for (const t of category.treatments) {
      const nameLines = wrap(t.name, regular, 9.5, medColX - MARGIN - 16);
      const medLines = wrap(t.medicalName ?? "—", regular, 9, costColX - medColX - 10);
      const rows = Math.max(nameLines.length, medLines.length);
      ensure(rows * 13 + 6);
      nameLines.forEach((l, i) => page.drawText(l, { x: MARGIN + 8, y: y - i * 13, size: 9.5, font: regular }));
      medLines.forEach((l, i) => page.drawText(l, { x: medColX, y: y - i * 13, size: 9, font: regular, color: MUTED }));
      page.drawText(`${formatBand(t.band)}${isPricedBand(t.band) ? "*" : ""}`, {
        x: costColX,
        y,
        size: 9.5,
        font: bold,
        color: TERRACOTTA,
      });
      y -= rows * 13 + 2;
      page.drawLine({ start: { x: MARGIN, y: y + 6 }, end: { x: A4.width - MARGIN, y: y + 6 }, thickness: 0.5, color: RULE });
      y -= 4;
    }
    y -= 10;
  }

  ensure(60);
  paragraph(`*${COST_DISCLAIMER}`, 8.5, bold, rgb(0.2, 0.2, 0.2));
  y -= 6;
  for (const p of COST_ESTIMATOR_NOTE) {
    paragraph(p, 8.5);
    y -= 4;
  }
  y -= 8;
  ensure(40);
  paragraph(`For a personal estimate call ${contact.phone} or WhatsApp +${contact.whatsapp}.`, 9, bold, FOREST);
  if (location?.address) paragraph(location.address, 8.5);
  paragraph(`${SITE_URL}/cost`, 8.5);

  const bytes = await pdf.save();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Aaravya-Hospital-Price-List.pdf"',
    },
  });
}
