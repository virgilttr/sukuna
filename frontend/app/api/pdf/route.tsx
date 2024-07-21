import "server-only";
export const runtime = "experimental-edge";

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { summary } = await req.json();

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Define some constants
  const margin = 50;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();

  // Add the company logo
  const logoPath = path.join(process.cwd(), "public", "findevor.png");
  const logoImage = await fs.readFile(logoPath);
  const logo = await pdfDoc.embedPng(logoImage);
  const logoDims = logo.scale(0.5); // Adjust scale as needed
  page.drawImage(logo, {
    x: margin,
    y: pageHeight - margin - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Add title
  page.drawText("Investment Report", {
    x: pageWidth / 2,
    y: pageHeight - margin - 120,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Add summary
  const textWidth = pageWidth - 2 * margin;
  const textHeight = pageHeight - 2 * margin - 150; // Adjust as needed
  page.drawText(summary, {
    x: margin,
    y: textHeight,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
    maxWidth: textWidth,
    lineHeight: 16,
  });

  // Add page number
  page.drawText(`Page 1 of 1`, {
    x: pageWidth / 2,
    y: margin,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Generate the PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Create and return the response
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    },
  });
}
