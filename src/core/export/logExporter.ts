import fs from 'node:fs';
import path from 'node:path';
import { ExportDataPayload, ExportFormat, ExportResult } from './types.js';
import { DataFormatter } from './dataFormatter.js';
import { DocxExporter } from './docxExporter.js';
import { PdfExporter } from './pdfExporter.js';

export class LogExporter {
  static normalizeFilePath(rawPath: string, format: ExportFormat): string {
    let clean = rawPath.trim();
    if (!clean) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      clean = path.join('exported-logs', `zenth_logs_${ts}`);
    }

    const ext = `.${format.toLowerCase()}`;
    if (!clean.toLowerCase().endsWith(ext)) {
      clean += ext;
    }

    return path.resolve(process.cwd(), clean);
  }

  static getDefaultFilename(format: ExportFormat): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
    return `exported-logs/zenth_log_${dateStr}`;
  }

  static async exportToFile(payload: ExportDataPayload, format: ExportFormat, targetPath: string): Promise<ExportResult> {
    try {
      const finalPath = this.normalizeFilePath(targetPath, format);
      const parentDir = path.dirname(finalPath);

      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      switch (format) {
        case 'txt': {
          const content = DataFormatter.toPlainText(payload);
          fs.writeFileSync(finalPath, content, 'utf-8');
          break;
        }
        case 'csv': {
          const content = DataFormatter.toCsv(payload);
          fs.writeFileSync(finalPath, content, 'utf-8');
          break;
        }
        case 'md': {
          const content = DataFormatter.toMarkdown(payload);
          fs.writeFileSync(finalPath, content, 'utf-8');
          break;
        }
        case 'docx': {
          const buffer = DocxExporter.generate(payload);
          fs.writeFileSync(finalPath, buffer);
          break;
        }
        case 'pdf': {
          const buffer = PdfExporter.generate(payload);
          fs.writeFileSync(finalPath, buffer);
          break;
        }
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        filePath: finalPath,
        tradeCount: payload.ledgerEntries.length,
        tickCount: payload.tickLogs.length
      };
    } catch (err) {
      return {
        success: false,
        tradeCount: payload.ledgerEntries.length,
        tickCount: payload.tickLogs.length,
        error: (err as Error).message
      };
    }
  }
}
