import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as crypto from 'crypto';
import {
  IStorageService,
  UploadedFileInput,
  UploadedFile
} from '../interfaces/storage-service.interface';
import { BannerFileValidationService } from './banner-file-validation.service';

/**
 * Cloudinary Storage Service Implementation
 *
 * Uses Cloudinary for media storage and CDN delivery.
 * Environment variables required:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET (server-side only, never expose to frontend)
 */
@Injectable()
export class CloudinaryStorageService implements IStorageService {
  private readonly logger = new Logger(CloudinaryStorageService.name);
  private readonly fileValidation: BannerFileValidationService;
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.fileValidation = new BannerFileValidationService();

    // Load Cloudinary configuration from environment
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME', '');
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY', '');
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET', '');
    this.baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
    });

    this.logger.log(`Cloudinary configured for cloud: ${this.cloudName}`);
  }

  /**
   * Upload a file to Cloudinary
   */
  async upload(file: UploadedFileInput, folder: string = 'banners'): Promise<UploadedFile> {
    // Determine file type for validation
    const fileType = this.getFileType(file.mimetype);

    if (fileType === 'unknown') {
      throw new InternalServerErrorException('Unsupported file type');
    }

    // Validate file
    this.fileValidation.validate({
      ...file,
      type: fileType,
    });

    // Generate unique filename
    const publicId = this.generatePublicId(file.originalname, folder);

    // Upload to Cloudinary using buffer (works with serverless)
    const result = await this.uploadToCloudinary(file.buffer, publicId, folder, file.mimetype);

    this.logger.debug(`File uploaded to Cloudinary: ${result.public_id}`);

    return {
      path: result.public_id,
      url: result.secure_url,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Delete a file from Cloudinary
   */
  async delete(path: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(path);

      if (result.result !== 'ok') {
        this.logger.warn(`Failed to delete file from Cloudinary: ${path}`);
      } else {
        this.logger.debug(`File deleted from Cloudinary: ${path}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file from Cloudinary: ${path}`, error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  /**
   * Check if a file exists in Cloudinary
   */
  async exists(path: string): Promise<boolean> {
    try {
      const result = await cloudinary.api.resource(path);
      return !!result;
    } catch {
      return false;
    }
  }

  /**
   * Get public URL for a file path
   */
  getUrl(path: string): string {
    return cloudinary.url(path, {
      secure: true,
    });
  }

  /**
   * Generate a signed upload URL for direct browser uploads
   * Returns the signature data needed for client-side uploads
   */
  generateUploadSignature(folder: string = 'banners'): {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
    folder: string;
  } {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      this.apiSecret
    );

    return {
      timestamp,
      signature,
      cloudName: this.cloudName,
      apiKey: this.apiKey,
      folder,
    };
  }

  /**
   * Upload buffer to Cloudinary (serverless-compatible)
   */
  private uploadToCloudinary(
    buffer: Buffer,
    publicId: string,
    folder: string,
    mimeType: string
  ): Promise<{ public_id: string; secure_url: string; [key: string]: any }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: folder,
          resource_type: this.isVideo(mimeType) ? 'video' : 'image',
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error', error);
            reject(new InternalServerErrorException('Failed to upload file'));
          } else if (result) {
            resolve(result);
          } else {
            reject(new InternalServerErrorException('No result from Cloudinary'));
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Generate unique public ID for Cloudinary
   */
  private generatePublicId(originalName: string, folder: string): string {
    const ext = originalName.slice(originalName.lastIndexOf('.'));
    const random = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now().toString(36);
    return `${folder}/${timestamp}_${random}`;
  }

  /**
   * Determine file type from MIME type
   */
  private getFileType(mimeType: string): 'image' | 'video' | 'unknown' {
    if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
      return 'image';
    }
    if (['video/mp4', 'video/webm'].includes(mimeType)) {
      return 'video';
    }
    return 'unknown';
  }

  /**
   * Check if MIME type is video
   */
  private isVideo(mimeType: string): boolean {
    return ['video/mp4', 'video/webm'].includes(mimeType);
  }
}

// Re-export types
export { UploadedFileInput, UploadedFile } from '../interfaces/storage-service.interface';
