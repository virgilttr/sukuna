import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { summary } = await req.json();

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Define some constants
  const margin = 50;
  const fontSize = 12;
  const lineHeight = 16;

  // Function to add a new page and return it
  const addPage = () => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    // Add the company logo
    const addLogo = async () => {
      const logoPath = path.join(process.cwd(), "public", "findevor.png");
      const logoImage = await fs.readFile(logoPath);
      const logo = await pdfDoc.embedPng(logoImage);

      const logoWidth = 150; // Set a fixed width
      const logoHeight = logo.height * (logoWidth / logo.width);

      page.drawImage(logo, {
        x: (pageWidth - logoWidth) / 2,
        y: pageHeight - margin - logoHeight,
        width: logoWidth,
        height: logoHeight,
      });

      return logoHeight;
    };

    return { page, pageWidth, pageHeight, addLogo };
  };

  // Add the first page
  let { page, pageWidth, pageHeight, addLogo } = addPage();
  let logoHeight = await addLogo();

  // Add centered title
  const title = "Investment Report";
  const titleWidth = font.widthOfTextAtSize(title, 24);
  page.drawText(title, {
    x: (pageWidth - titleWidth) / 2,
    y: pageHeight - margin - logoHeight - 40,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Split summary into lines, handling newlines and special characters
  const textWidth = pageWidth - 2 * margin;
  const lines = [];
  const paragraphs = summary.split(/\n+/);

  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(
        testLine.replace(/[^\x00-\x7F]/g, "?"),
        fontSize
      );

      if (lineWidth <= textWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    lines.push(""); // Add an empty line between paragraphs
  }

  // Draw text across pages
  let y = pageHeight - margin - logoHeight - 100;
  let pageNumber = 1;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      // Add page number to the current page
      page.drawText(`Page ${pageNumber}`, {
        x: pageWidth / 2,
        y: margin,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });

      // Start a new page
      ({ page, pageWidth, pageHeight, addLogo } = addPage());
      logoHeight = await addLogo();
      y = pageHeight - margin - logoHeight - 40;
      pageNumber++;
    }

    if (line) {
      page.drawText(line.replace(/[^\x00-\x7F]/g, "?"), {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    y -= lineHeight;
  }

  // Add page number to the last page
  page.drawText(`Page ${pageNumber}`, {
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
