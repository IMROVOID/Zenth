import { ExportDataPayload } from './types.js';
import { buildZip, ZipEntry } from './docxZip.js';
import { buildDocumentXml } from './docxDocumentXml.js';

export class DocxExporter {
  static generate(p: ExportDataPayload): Buffer {
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

    const documentXml = buildDocumentXml(p);

    const entries: ZipEntry[] = [
      { path: '[Content_Types].xml', data: Buffer.from(contentTypesXml, 'utf-8') },
      { path: '_rels/.rels', data: Buffer.from(relsXml, 'utf-8') },
      { path: 'word/_rels/document.xml.rels', data: Buffer.from(wordRelsXml, 'utf-8') },
      { path: 'word/document.xml', data: Buffer.from(documentXml, 'utf-8') }
    ];

    return buildZip(entries);
  }
}
