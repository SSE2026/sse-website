import { BadRequestException } from '@nestjs/common';

/**
 * Allowed MIME types and extensions for banner media
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
];

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm'];

// Size limits (in bytes)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export interface FileValidationInput {
  originalname: string;
  mimetype: string;
  size: number;
}

export interface BannerFileValidationInput extends FileValidationInput {
  type: 'image' | 'video';
}

/**
 * File Validation Service for Banner Uploads
 *
 * Provides specific validation rules for banner images and videos
 */
export class BannerFileValidationService {
  /**
   * Validate an image file
   */
  validateImage(input: FileValidationInput): void {
    this.validate({
      ...input,
      type: 'image',
    });
  }

  /**
   * Validate a video file
   */
  validateVideo(input: FileValidationInput): void {
    this.validate({
      ...input,
      type: 'video',
    });
  }

  /**
   * Generic validation based on file type
   */
  validate(input: BannerFileValidationInput): void {
    const { originalname, mimetype, size, type } = input;

    // Check MIME type
    const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid ${type} type. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    // Check file extension
    const ext = originalname.toLowerCase().slice(originalname.lastIndexOf('.'));
    const allowedExts = type === 'video' ? ALLOWED_VIDEO_EXTENSIONS : ALLOWED_IMAGE_EXTENSIONS;
    if (!allowedExts.includes(ext)) {
      throw new BadRequestException(
        `Invalid file extension. Allowed extensions: ${allowedExts.join(', ')}`
      );
    }

    // Check file size
    const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new BadRequestException(
        `File too large. Maximum ${type} size is ${maxSizeMB}MB`
      );
    }

    // Minimum size check (prevent empty files)
    if (size < 1024) {
      throw new BadRequestException('File is too small or empty');
    }
  }

  /**
   * Get file type from MIME type
   */
  getFileType(mimetype: string): 'image' | 'video' | 'unknown' {
    if (ALLOWED_IMAGE_TYPES.includes(mimetype)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(mimetype)) return 'video';
    return 'unknown';
  }

  /**
   * Check if MIME type is allowed
   */
  isAllowed(mimetype: string): boolean {
    return ALLOWED_IMAGE_TYPES.includes(mimetype) || ALLOWED_VIDEO_TYPES.includes(mimetype);
  }
}
