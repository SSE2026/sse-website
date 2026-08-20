import { BadRequestException } from '@nestjs/common';

/**
 * File Validation Service
 * Handles all file upload security checks
 */
export class FileValidationService {
  // Maximum file sizes from environment or defaults
  private readonly maxFileSize: number;
  private readonly maxTotalSize: number;

  // Allowed MIME types
  private readonly allowedMimeTypes = [
    'application/pdf',
    'application/ms-excel',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ];

  // Allowed extensions
  private readonly allowedExtensions = ['.pdf', '.xls', '.xlsx', '.doc', '.docx', '.png', '.jpg', '.jpeg'];

  // Dangerous extensions that should never be allowed
  private readonly dangerousExtensions = [
    '.exe',
    '.bat',
    '.sh',
    '.cmd',
    '.com',
    '.scr',
    '.vbs',
    '.js',
    '.jar',
    '.war',
    '.pif',
    '.msi',
    '.app',
    '.dmg',
    '.pkg',
  ];

  constructor(options?: { maxFileSize?: number; maxTotalSize?: number }) {
    this.maxFileSize = options?.maxFileSize || 20 * 1024 * 1024; // 20MB default
    this.maxTotalSize = options?.maxTotalSize || 50 * 1024 * 1024; // 50MB default
  }

  /**
   * Validate a single file
   */
  validate(file: { originalname: string; mimetype: string; size: number }): void {
    // 1. MIME type validation
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        code: 'INVALID_FILE_TYPE',
        message: `Invalid file type: ${file.mimetype}. Allowed types: PDF, Excel, Word, PNG, JPG`,
      });
    }

    // 2. Extension validation
    const ext = this.getExtension(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new BadRequestException({
        code: 'INVALID_FILE_EXTENSION',
        message: `Invalid file extension: ${ext}. Allowed extensions: pdf, xls, xlsx, doc, docx, png, jpg, jpeg`,
      });
    }

    // 3. MIME matches extension check
    if (!this.mimeMatchesExtension(file.mimetype, ext)) {
      throw new BadRequestException({
        code: 'MIME_EXTENSION_MISMATCH',
        message: 'File extension does not match MIME type',
      });
    }

    // 4. File size validation
    if (file.size > this.maxFileSize) {
      throw new BadRequestException({
        code: 'FILE_TOO_LARGE',
        message: `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`,
      });
    }

    // 5. Dangerous extension check
    if (this.dangerousExtensions.includes(ext)) {
      throw new BadRequestException({
        code: 'DANGEROUS_FILE_TYPE',
        message: 'Executable files are not allowed',
      });
    }

    // 6. Double extension attack check (e.g., malware.exe.jpg)
    const doubleExtPattern = /\.[a-zA-Z0-9]+\.(exe|bat|sh|cmd|com|scr|vbs|js|jar)$/i;
    if (doubleExtPattern.test(file.originalname)) {
      throw new BadRequestException({
        code: 'SUSPICIOUS_FILENAME',
        message: 'Suspicious file name detected',
      });
    }

    // 7. Hidden file check (starting with .)
    if (file.originalname.startsWith('.')) {
      throw new BadRequestException({
        code: 'INVALID_FILENAME',
        message: 'Hidden files are not allowed',
      });
    }
  }

  /**
   * Validate total size of multiple files
   */
  validateTotalSize(files: { size: number }[]): void {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > this.maxTotalSize) {
      throw new BadRequestException({
        code: 'TOTAL_FILE_SIZE_EXCEEDED',
        message: `Total attachment size exceeds ${this.maxTotalSize / 1024 / 1024}MB limit`,
      });
    }
  }

  /**
   * Sanitize filename to prevent path traversal
   */
  sanitizeFilename(filename: string): string {
    // Remove any path components
    const sanitized = filename.split(/[/\\]/).pop() || 'file';
    // Remove special characters but keep extension
    const ext = this.getExtension(sanitized);
    const name = sanitized.slice(0, -ext.length).replace(/[^a-zA-Z0-9._-]/g, '_');
    return name + ext;
  }

  /**
   * Generate a random filename while preserving extension
   */
  generateRandomFilename(originalName: string): string {
    const ext = this.getExtension(originalName).toLowerCase();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${random}${ext}`;
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.slice(lastDot) : '';
  }

  private mimeMatchesExtension(mimeType: string, ext: string): boolean {
    const mimeMap: Record<string, string[]> = {
      'application/pdf': ['.pdf'],
      'application/ms-excel': ['.xls'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    };

    const allowedExts = mimeMap[mimeType];
    if (!allowedExts) return false;
    return allowedExts.includes(ext);
  }
}
