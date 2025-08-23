import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { DocumentProcessingJobData, DocumentJobResult } from '../jobs/types'
import { getPrismaClient } from '@caring-compass/database/src/utils'
import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
import mime from 'mime-types'

const prisma = getPrismaClient()

// Storage configuration
interface StorageConfig {
  provider: 'SUPABASE' | 'S3'
  supabase?: {
    url: string
    serviceKey: string
    bucket: string
  }
  s3?: {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
  }
  maxFileSize: number // in bytes
  allowedFileTypes: string[]
  compression: {
    images: boolean
    pdfs: boolean
    quality: number
  }
}

// File metadata interface
export interface FileMetadata {
  id: string
  originalName: string
  fileName: string
  mimeType: string
  size: number
  uploadedBy: string
  documentType: 'AGREEMENT' | 'CREDENTIAL' | 'INVOICE' | 'REPORT' | 'PHOTO' | 'OTHER'
  accessLevel: 'PRIVATE' | 'CLIENT_ONLY' | 'CAREGIVER_ONLY' | 'COORDINATOR_ONLY' | 'PUBLIC'
  tags?: string[]
  expiresAt?: Date
}

// Upload options
export interface UploadOptions {
  compress?: boolean
  generateThumbnail?: boolean
  watermark?: boolean
  encryption?: boolean
  folder?: string
  publicAccess?: boolean
}

// Download options
export interface DownloadOptions {
  transform?: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpeg' | 'png' | 'webp'
  }
  watermark?: boolean
  expiresIn?: number // seconds
}

// File validation utilities
export class FileValidator {
  static validateFileType(fileName: string, allowedTypes: string[]): boolean {
    const extension = this.getFileExtension(fileName)
    return allowedTypes.includes(extension.toLowerCase())
  }

  static validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize
  }

  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || ''
  }

  static getMimeType(fileName: string): string {
    return mime.lookup(fileName) || 'application/octet-stream'
  }

  static isImageFile(fileName: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff']
    return imageExtensions.includes(this.getFileExtension(fileName))
  }

  static isPdfFile(fileName: string): boolean {
    return this.getFileExtension(fileName) === 'pdf'
  }

  static isDocumentFile(fileName: string): boolean {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf']
    return docExtensions.includes(this.getFileExtension(fileName))
  }

  static generateUniqueFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = this.getFileExtension(originalName)
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
    
    return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${random}.${extension}`
  }
}

// File storage service
export class FileStorageService {
  private config: StorageConfig
  private supabase?: SupabaseClient

  constructor(config: StorageConfig) {
    this.config = config
    this.initializeProvider()
  }

  private initializeProvider(): void {
    switch (this.config.provider) {
      case 'SUPABASE':
        if (!this.config.supabase?.url || !this.config.supabase?.serviceKey) {
          throw new Error('Supabase configuration is required')
        }
        this.supabase = createClient(
          this.config.supabase.url,
          this.config.supabase.serviceKey
        )
        break

      case 'S3':
        // S3 implementation would go here
        throw new Error('S3 provider not yet implemented')

      default:
        throw new Error(`Unsupported storage provider: ${this.config.provider}`)
    }
  }

  async uploadFile(
    file: Buffer | Uint8Array,
    metadata: FileMetadata,
    options: UploadOptions = {}
  ): Promise<DocumentJobResult> {
    const startTime = Date.now()

    try {
      // Validate file
      this.validateUpload(file, metadata)

      // Process file if needed
      const processedFile = await this.processFile(file, metadata, options)

      // Generate file path
      const filePath = this.generateFilePath(metadata, options.folder)

      // Upload to storage provider
      const uploadResult = await this.uploadToProvider(
        processedFile.data,
        filePath,
        metadata,
        options
      )

      // Generate thumbnail if requested
      let thumbnailUrl: string | undefined
      if (options.generateThumbnail && FileValidator.isImageFile(metadata.originalName)) {
        thumbnailUrl = await this.generateThumbnail(file, filePath, metadata)
      }

      // Save metadata to database
      const documentRecord = await this.saveFileMetadata({
        ...metadata,
        fileName: filePath,
        size: processedFile.size,
        storageUrl: uploadResult.url,
        thumbnailUrl
      })

      const executionTime = Date.now() - startTime

      return {
        success: true,
        documentUrl: uploadResult.url,
        processedSize: processedFile.size,
        processingTime: executionTime,
        data: {
          documentId: documentRecord.id,
          fileName: filePath,
          thumbnailUrl,
          publicUrl: uploadResult.publicUrl
        }
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        retryable: this.isRetryableError(error)
      }
    }
  }

  async downloadFile(
    fileId: string,
    userId: string,
    options: DownloadOptions = {}
  ): Promise<{ data: Buffer; metadata: FileMetadata; url?: string }> {
    try {
      // Get file metadata and check permissions
      const document = await this.getFileMetadata(fileId)
      await this.checkDownloadPermissions(document, userId)

      // Get file from storage
      let fileData: Buffer

      if (options.transform && FileValidator.isImageFile(document.fileName)) {
        // Apply image transformations
        fileData = await this.transformImage(document.storageUrl, options.transform)
      } else {
        // Download original file
        fileData = await this.downloadFromProvider(document.storageUrl)
      }

      // Generate signed URL if requested
      let signedUrl: string | undefined
      if (options.expiresIn) {
        signedUrl = await this.generateSignedUrl(document.storageUrl, options.expiresIn)
      }

      // Log download activity
      await this.logFileActivity('download', {
        documentId: fileId,
        userId,
        fileName: document.fileName,
        size: fileData.length
      })

      return {
        data: fileData,
        metadata: document,
        url: signedUrl
      }

    } catch (error) {
      await this.logFileActivity('download_failed', {
        documentId: fileId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      // Get file metadata and check permissions
      const document = await this.getFileMetadata(fileId)
      await this.checkDeletePermissions(document, userId)

      // Delete from storage provider
      await this.deleteFromProvider(document.storageUrl)

      // Delete thumbnail if exists
      if (document.thumbnailUrl) {
        await this.deleteFromProvider(document.thumbnailUrl)
      }

      // Update database record
      await prisma.document.update({
        where: { id: fileId },
        data: {
          status: 'DELETED',
          deletedAt: new Date(),
          deletedBy: userId
        }
      })

      // Log deletion activity
      await this.logFileActivity('delete', {
        documentId: fileId,
        userId,
        fileName: document.fileName
      })

      return true

    } catch (error) {
      await this.logFileActivity('delete_failed', {
        documentId: fileId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  async listFiles(
    userId: string,
    filters?: {
      documentType?: string
      accessLevel?: string
      tags?: string[]
      startDate?: Date
      endDate?: Date
    }
  ): Promise<FileMetadata[]> {
    const where: any = {
      status: 'ACTIVE'
    }

    // Apply access control
    // This would check user permissions and filter accordingly
    const userPermissions = await this.getUserFilePermissions(userId)
    where.OR = userPermissions

    // Apply filters
    if (filters?.documentType) {
      where.documentType = filters.documentType
    }

    if (filters?.accessLevel) {
      where.accessLevel = filters.accessLevel
    }

    if (filters?.tags?.length) {
      where.tags = {
        hasSome: filters.tags
      }
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = filters.startDate
      if (filters.endDate) where.createdAt.lte = filters.endDate
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return documents.map(doc => ({
      id: doc.id,
      originalName: doc.originalName,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      size: doc.size,
      uploadedBy: doc.uploadedById,
      documentType: doc.documentType as any,
      accessLevel: doc.accessLevel as any,
      tags: doc.tags,
      expiresAt: doc.expiresAt
    }))
  }

  private validateUpload(file: Buffer | Uint8Array, metadata: FileMetadata): void {
    // Validate file size
    if (!FileValidator.validateFileSize(file.length, this.config.maxFileSize)) {
      throw new Error(`File too large. Maximum size: ${this.config.maxFileSize} bytes`)
    }

    // Validate file type
    if (!FileValidator.validateFileType(metadata.originalName, this.config.allowedFileTypes)) {
      throw new Error(`File type not allowed. Allowed types: ${this.config.allowedFileTypes.join(', ')}`)
    }

    // Validate metadata
    if (!metadata.uploadedBy) {
      throw new Error('uploadedBy is required')
    }

    if (!metadata.documentType) {
      throw new Error('documentType is required')
    }
  }

  private async processFile(
    file: Buffer | Uint8Array,
    metadata: FileMetadata,
    options: UploadOptions
  ): Promise<{ data: Buffer; size: number }> {
    let processedData = Buffer.from(file)

    // Image processing
    if (FileValidator.isImageFile(metadata.originalName)) {
      if (options.compress !== false && this.config.compression.images) {
        processedData = await this.compressImage(processedData)
      }

      if (options.watermark) {
        processedData = await this.addWatermark(processedData)
      }
    }

    // PDF processing
    if (FileValidator.isPdfFile(metadata.originalName)) {
      if (options.compress !== false && this.config.compression.pdfs) {
        processedData = await this.compressPdf(processedData)
      }
    }

    return {
      data: processedData,
      size: processedData.length
    }
  }

  private async compressImage(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer)
      .jpeg({ quality: this.config.compression.quality })
      .toBuffer()
  }

  private async compressPdf(pdfBuffer: Buffer): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer)
      // Basic PDF compression - remove metadata and optimize
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false
      })
      return Buffer.from(compressedPdf)
    } catch (error) {
      console.warn('PDF compression failed, returning original:', error)
      return pdfBuffer
    }
  }

  private async addWatermark(imageBuffer: Buffer): Promise<Buffer> {
    // Simple text watermark
    return await sharp(imageBuffer)
      .composite([{
        input: Buffer.from(
          `<svg width="200" height="50">
            <text x="10" y="30" font-family="Arial" font-size="20" fill="rgba(255,255,255,0.5)">
              Caring Compass
            </text>
          </svg>`
        ),
        gravity: 'southeast'
      }])
      .toBuffer()
  }

  private async generateThumbnail(
    imageBuffer: Buffer | Uint8Array,
    originalPath: string,
    metadata: FileMetadata
  ): Promise<string> {
    const thumbnailBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    const thumbnailPath = originalPath.replace(/\.[^/.]+$/, '_thumb.jpg')
    
    const uploadResult = await this.uploadToProvider(
      thumbnailBuffer,
      thumbnailPath,
      { ...metadata, mimeType: 'image/jpeg' },
      { publicAccess: true }
    )

    return uploadResult.url
  }

  private generateFilePath(metadata: FileMetadata, folder?: string): string {
    const sanitizedName = FileValidator.generateUniqueFileName(
      metadata.originalName,
      metadata.documentType.toLowerCase()
    )

    const pathParts = [
      folder || 'documents',
      metadata.documentType.toLowerCase(),
      new Date().getFullYear().toString(),
      (new Date().getMonth() + 1).toString().padStart(2, '0'),
      sanitizedName
    ]

    return pathParts.join('/')
  }

  private async uploadToProvider(
    data: Buffer,
    path: string,
    metadata: FileMetadata,
    options: UploadOptions
  ): Promise<{ url: string; publicUrl?: string }> {
    if (!this.supabase) {
      throw new Error('Storage provider not initialized')
    }

    const { data: uploadData, error } = await this.supabase.storage
      .from(this.config.supabase!.bucket)
      .upload(path, data, {
        contentType: metadata.mimeType,
        metadata: {
          originalName: metadata.originalName,
          uploadedBy: metadata.uploadedBy,
          documentType: metadata.documentType
        },
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    const { data: urlData } = this.supabase.storage
      .from(this.config.supabase!.bucket)
      .getPublicUrl(path)

    return {
      url: uploadData.path,
      publicUrl: options.publicAccess ? urlData.publicUrl : undefined
    }
  }

  private async downloadFromProvider(path: string): Promise<Buffer> {
    if (!this.supabase) {
      throw new Error('Storage provider not initialized')
    }

    const { data, error } = await this.supabase.storage
      .from(this.config.supabase!.bucket)
      .download(path)

    if (error) {
      throw new Error(`Download failed: ${error.message}`)
    }

    return Buffer.from(await data.arrayBuffer())
  }

  private async deleteFromProvider(path: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Storage provider not initialized')
    }

    const { error } = await this.supabase.storage
      .from(this.config.supabase!.bucket)
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  }

  private async generateSignedUrl(path: string, expiresIn: number): Promise<string> {
    if (!this.supabase) {
      throw new Error('Storage provider not initialized')
    }

    const { data, error } = await this.supabase.storage
      .from(this.config.supabase!.bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`)
    }

    return data.signedUrl
  }

  private async transformImage(
    path: string,
    transform: NonNullable<DownloadOptions['transform']>
  ): Promise<Buffer> {
    const originalData = await this.downloadFromProvider(path)
    
    let sharpInstance = sharp(originalData)

    if (transform.width || transform.height) {
      sharpInstance = sharpInstance.resize(transform.width, transform.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    if (transform.format && transform.format !== 'jpeg') {
      switch (transform.format) {
        case 'png':
          sharpInstance = sharpInstance.png({ quality: transform.quality || 90 })
          break
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: transform.quality || 90 })
          break
      }
    } else {
      sharpInstance = sharpInstance.jpeg({ quality: transform.quality || 90 })
    }

    return await sharpInstance.toBuffer()
  }

  private async getFileMetadata(fileId: string): Promise<FileMetadata> {
    const document = await prisma.document.findUnique({
      where: { id: fileId, status: 'ACTIVE' }
    })

    if (!document) {
      throw new Error('File not found')
    }

    return {
      id: document.id,
      originalName: document.originalName,
      fileName: document.fileName,
      mimeType: document.mimeType,
      size: document.size,
      uploadedBy: document.uploadedById,
      documentType: document.documentType as any,
      accessLevel: document.accessLevel as any,
      tags: document.tags,
      expiresAt: document.expiresAt
    }
  }

  private async saveFileMetadata(metadata: FileMetadata & { 
    storageUrl: string
    thumbnailUrl?: string 
  }): Promise<{ id: string }> {
    const document = await prisma.document.create({
      data: {
        originalName: metadata.originalName,
        fileName: metadata.fileName,
        mimeType: metadata.mimeType,
        size: metadata.size,
        uploadedById: metadata.uploadedBy,
        documentType: metadata.documentType,
        accessLevel: metadata.accessLevel,
        storageUrl: metadata.storageUrl,
        thumbnailUrl: metadata.thumbnailUrl,
        tags: metadata.tags,
        expiresAt: metadata.expiresAt,
        status: 'ACTIVE'
      }
    })

    return { id: document.id }
  }

  private async checkDownloadPermissions(document: FileMetadata, userId: string): Promise<void> {
    // Implement permission checking logic based on access level and user role
    // This is a simplified version
    if (document.accessLevel === 'PRIVATE' && document.uploadedBy !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user || (user.role !== 'ADMIN' && user.role !== 'COORDINATOR')) {
        throw new Error('Access denied')
      }
    }
  }

  private async checkDeletePermissions(document: FileMetadata, userId: string): Promise<void> {
    // Only uploader, admin, or coordinator can delete
    if (document.uploadedBy !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user || (user.role !== 'ADMIN' && user.role !== 'COORDINATOR')) {
        throw new Error('Delete permission denied')
      }
    }
  }

  private async getUserFilePermissions(userId: string): Promise<any[]> {
    // Return permission filters based on user role
    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    if (!user) return []

    switch (user.role) {
      case 'ADMIN':
      case 'COORDINATOR':
        return [{}] // Can access all files

      case 'CLIENT':
        return [
          { uploadedById: userId },
          { accessLevel: 'CLIENT_ONLY' },
          { accessLevel: 'PUBLIC' }
        ]

      case 'CAREGIVER':
        return [
          { uploadedById: userId },
          { accessLevel: 'CAREGIVER_ONLY' },
          { accessLevel: 'PUBLIC' }
        ]

      default:
        return [{ uploadedById: userId }]
    }
  }

  private async logFileActivity(action: string, data: any): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action,
          resourceType: 'DOCUMENT',
          resourceId: data.documentId || 'unknown',
          details: `File ${action}`,
          metadata: data,
          timestamp: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log file activity:', error)
    }
  }

  private isRetryableError(error: any): boolean {
    // Network errors and temporary storage issues are retryable
    const retryableMessages = [
      'timeout',
      'network',
      'connection',
      'temporary',
      'rate limit'
    ]

    const errorMessage = (error?.message || '').toLowerCase()
    return retryableMessages.some(msg => errorMessage.includes(msg))
  }

  async getStorageStats() {
    const stats = await prisma.document.groupBy({
      by: ['documentType', 'status'],
      _count: { id: true },
      _sum: { size: true }
    })

    return stats.reduce((acc, stat) => {
      const key = `${stat.documentType}_${stat.status}`
      acc[key] = {
        count: stat._count.id,
        totalSize: stat._sum.size || 0
      }
      return acc
    }, {} as Record<string, { count: number; totalSize: number }>)
  }
}

// File storage service factory
export function createFileStorageService(): FileStorageService {
  const config: StorageConfig = {
    provider: 'SUPABASE',
    supabase: {
      url: process.env.SUPABASE_URL!,
      serviceKey: process.env.SUPABASE_SERVICE_KEY!,
      bucket: process.env.SUPABASE_STORAGE_BUCKET || 'documents'
    },
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png,gif').split(','),
    compression: {
      images: process.env.COMPRESS_IMAGES !== 'false',
      pdfs: process.env.COMPRESS_PDFS !== 'false',
      quality: parseInt(process.env.COMPRESSION_QUALITY || '85')
    }
  }

  return new FileStorageService(config)
}

export default FileStorageService