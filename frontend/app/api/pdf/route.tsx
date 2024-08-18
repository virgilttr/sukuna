import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { summary, logo, logoType } = await req.json();

  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const fontSize = 12;
  const headingSize = 16;
  const lineHeight = 1.5 * fontSize;
  const paragraphSpacing = 10;

  const addPage = async () => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const addLogo = async () => {
      let logoImage;
      if (logo) {
        // Use the uploaded logo
        if (logoType.startsWith("image/png")) {
          logoImage = await pdfDoc.embedPng(Buffer.from(logo));
        } else if (logoType.startsWith("image/jpeg")) {
          logoImage = await pdfDoc.embedJpg(Buffer.from(logo));
        } else {
          // Fallback to default logo if unsupported format
          const logoPath = path.join(process.cwd(), "public", "findevor.png");
          const defaultLogoImage = await fs.readFile(logoPath);
          logoImage = await pdfDoc.embedPng(defaultLogoImage);
        }
      } else {
        // Use the default Findevor logo
        const logoPath = path.join(process.cwd(), "public", "findevor.png");
        const defaultLogoImage = await fs.readFile(logoPath);
        logoImage = await pdfDoc.embedPng(defaultLogoImage);
      }

      const logoWidth = 150;
      const logoHeight = logoImage.height * (logoWidth / logoImage.width);
      page.drawImage(logoImage, {
        x: (pageWidth - logoWidth) / 2,
        y: pageHeight - margin - logoHeight,
        width: logoWidth,
        height: logoHeight,
      });
      return logoHeight;
    };

    const logoHeight = await addLogo();
    return { page, pageWidth, pageHeight, logoHeight };
  };

  let pageInfo = await addPage();
  let { page, pageWidth, pageHeight, logoHeight } = pageInfo;
  let y = pageHeight - margin - logoHeight - 40;
  let pageNumber = 1;

  const drawText = async (
    text: string,
    {
      size = fontSize,
      font = regularFont,
      indent = 0,
      addSpacing = true,
    }: { size?: number; font?: PDFFont; indent?: number; addSpacing?: boolean }
  ) => {
    const textWidth = pageWidth - 2 * margin - indent;
    const lines = text.split("\n");

    for (const line of lines) {
      const words = line.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const lineWidth = font.widthOfTextAtSize(testLine, size);

        if (lineWidth <= textWidth) {
          currentLine = testLine;
        } else {
          if (y < margin + lineHeight) {
            page.drawText(`Page ${pageNumber}`, {
              x: pageWidth / 2,
              y: margin,
              size: 10,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
            pageInfo = await addPage();
            ({ page, pageWidth, pageHeight, logoHeight } = pageInfo);
            y = pageHeight - margin - logoHeight - 40;
            pageNumber++;
          }

          page.drawText(currentLine, {
            x: margin + indent,
            y: y,
            size: size,
            font: font,
            color: rgb(0, 0, 0),
          });
          y -= lineHeight;
          currentLine = word;
        }
      }

      if (currentLine) {
        if (y < margin + lineHeight) {
          page.drawText(`Page ${pageNumber}`, {
            x: pageWidth / 2,
            y: margin,
            size: 10,
            font: regularFont,
            color: rgb(0, 0, 0),
          });
          pageInfo = await addPage();
          ({ page, pageWidth, pageHeight, logoHeight } = pageInfo);
          y = pageHeight - margin - logoHeight - 40;
          pageNumber++;
        }

        page.drawText(currentLine, {
          x: margin + indent,
          y: y,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
    }

    if (addSpacing) {
      y -= paragraphSpacing;
    }
  };

  // Add centered title
  const title = "Underwriting Report";
  const titleWidth = boldFont.widthOfTextAtSize(title, 24);
  page.drawText(title, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;

  // Process summary content
  const sections = summary.split(/\n(?=[A-Z ]+\n)/);

  for (const section of sections) {
    const [heading, ...content] = section.split("\n");

    await drawText(heading, { size: headingSize, font: boldFont });

    for (const paragraph of content.join("\n").split(/\n\n+/)) {
      if (paragraph.trim().startsWith("-")) {
        // Bullet points
        for (const point of paragraph.split("\n")) {
          await drawText(point.trim(), { indent: 20, addSpacing: false });
        }
        y -= paragraphSpacing;
      } else {
        // Regular paragraph
        await drawText(paragraph, { indent: 0, addSpacing: true });
      }
    }
  }

  // Add page number to the last page
  page.drawText(`Page ${pageNumber}`, {
    x: pageWidth / 2,
    y: margin,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    },
  });
}
