import { uploadApi } from '../api/upload'

/**
 * Complete upload flow: request signed URL, upload file, return public URL
 */
export const uploadFile = async (file: File): Promise<string> => {
  try {
    // Step 1: Request signed URL
    const { signedUrl, publicUrl } = await uploadApi.requestUpload(file.type, file.name)
    
    // Step 2: Upload file to signed URL
    await uploadApi.uploadFile(signedUrl, file)
    
    // Step 3: Return public URL for use in posts/products
    return publicUrl
  } catch (error) {
    console.error('File upload failed:', error)
    throw new Error('Failed to upload file')
  }
}

/**
 * Upload multiple files and return array of public URLs
 */
export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadFile(file))
  return Promise.all(uploadPromises)
}

/**
 * Upload profile or cover image
 */
export const uploadProfileImage = async (
  file: File,
  type: 'profile' | 'cover'
): Promise<string> => {
  try {
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Step 1: Request signed URL for profile/cover
    const { signedUrl, publicUrl } = await uploadApi.requestProfileUpload(
      file.type,
      file.name,
      type
    )
    
    // Step 2: Upload file
    await uploadApi.uploadFile(signedUrl, file)
    
    // Step 3: Return public URL
    return publicUrl
  } catch (error) {
    console.error('Profile image upload failed:', error)
    throw new Error('Failed to upload profile image')
  }
}

