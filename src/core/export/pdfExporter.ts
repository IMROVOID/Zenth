import { ExportDataPayload } from './types.js';
import { generatePdfReport } from './pdf/pdfReportLayout.js';

export class PdfExporter {
  static generate(p: ExportDataPayload): Buffer {
    return generatePdfReport(p);
  }
}
