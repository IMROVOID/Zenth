export function escapePdfText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]+/g, ' ');
}

export interface PdfPageContent {
  stream: string;
}

export function compilePdfDocument(pages: PdfPageContent[]): Buffer {
  const numPages = pages.length;
  const pageObjStart = 6;
  const kids = Array.from({ length: numPages }, (_, i) => `${pageObjStart + i * 2} 0 R`).join(' ');

  const objects: string[] = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [ ${kids} ] /Count ${numPages} >>\nendobj\n`);
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n');

  pages.forEach((pg, i) => {
    const pageObjNum = pageObjStart + i * 2;
    const streamObjNum = pageObjNum + 1;

    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${streamObjNum} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>\nendobj\n`
    );

    const streamBytes = Buffer.from(pg.stream, 'utf-8');
    objects.push(
      `${streamObjNum} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${pg.stream}\nendstream\nendobj\n`
    );
  });

  const header = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';
  let output = header;
  const xrefOffsets: number[] = [0];

  for (const obj of objects) {
    xrefOffsets.push(Buffer.byteLength(output, 'utf-8'));
    output += obj;
  }

  const startXref = Buffer.byteLength(output, 'utf-8');
  const totalObjs = objects.length + 1;
  let xref = `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;

  for (let i = 1; i < totalObjs; i++) {
    const off = String(xrefOffsets[i]).padStart(10, '0');
    xref += `${off} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  output += xref + trailer;

  return Buffer.from(output, 'utf-8');
}
