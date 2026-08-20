import { Injectable, Logger } from '@nestjs/common';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import * as crypto from 'crypto';
import { FileValidationService } from './file-validation.service';

/**
 * File interface for uploads
 */
export interface UploadedFileInput {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Storage Service Interface
 */
export interface StorageService {
  upload(file: UploadedFileInput, folder?: string): Promise<UploadedFile>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  getUrl(path: string): string;
}

export interface UploadedFile {
  path: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

/**
 * Local Storage Service Implementation
 */
@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  private readonly fileValidation: FileValidationService;

  constructor() {
    this.uploadDir = './uploads';
    this.baseUrl = '/uploads';
    this.fileValidation = new FileValidationService();
  }

  async upload(file: UploadedFileInput, folder: string = 'inquiries'): Promise<UploadedFile> {
    // Validate file
    this.fileValidation.validate({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Ensure directory exists
    const folderPath = join(this.uploadDir, folder);
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }

    // Generate random filename
    const filename = this.generateRandomFilename(file.originalname);
    const filePath = join(folderPath, filename);
    const relativePath = join(folder, filename);

    // Write file
    await writeFile(filePath, file.buffer);

    this.logger.debug(`File uploaded: ${relativePath}`);

    return {
      path: relativePath,
      url: `${this.baseUrl}/${relativePath.replace(/\\/g, '/')}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async delete(path: string): Promise<void> {
    const fullPath = join(this.uploadDir, path);

    if (!existsSync(fullPath)) {
      this.logger.debug(`File not found for deletion: ${path}`);
      return;
    }

    try {
      await unlink(fullPath);
      this.logger.debug(`File deleted: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${path}`, error);
      throw error;
    }
  }

  async exists(path: string): Promise<boolean> {
    const fullPath = join(this.uploadDir, path);
    return existsSync(fullPath);
  }

  getUrl(path: string): string {
    return `${this.baseUrl}/${path.replace(/\\/g, '/')}`;
  }

  private generateRandomFilename(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const random = crypto.randomBytes(16).toString('hex');
    return `${random}${ext}`;
  }
}
