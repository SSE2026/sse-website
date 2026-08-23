/**
 * Abstract Storage Service Interface
 *
 * This defines the contract for file storage operations.
 * Implementations can use:
 * - LocalStorageService (current - for development)
 * - Cloudflare R2 (future - for production)
 * - S3 (future - alternative)
 */
export interface UploadedFileInput {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  path: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface IStorageService {
  /**
   * Upload a file and return the public URL
   * @param file The file to upload
   * @param folder Optional folder path (e.g., 'banners', 'products')
   * @returns Uploaded file info including URL
   */
  upload(file: UploadedFileInput, folder?: string): Promise<UploadedFile>;

  /**
   * Delete a file by its path
   * @param path The file path (relative to storage root)
   */
  delete(path: string): Promise<void>;

  /**
   * Check if a file exists
   * @param path The file path to check
   * @returns true if file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Get public URL for a file path
   * @param path The file path
   * @returns The public URL
   */
  getUrl(path: string): string;
}
