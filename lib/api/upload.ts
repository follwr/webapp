import { apiClient } from './client'

export interface UploadResponse {
  signedUrl: string
  fileKey: string
  publicUrl: string
}

export const uploadApi = {
  // Request upload URL for general content
  requestUpload: async (fileType: string, fileName: string) => {
    const response = await apiClient.post<{ data: UploadResponse }>('/upload/request', {
      fileType,
      fileName
    })
    return response.data.data
  },

  // Request upload URL for profile/cover images
  requestProfileUpload: async (fileType: string, fileName: string, uploadType: 'profile' | 'cover') => {
    const response = await apiClient.post<{ data: UploadResponse }>('/upload/request-profile', {
      fileType,
      fileName,
      uploadType
    })
    return response.data.data
  },

  // Upload file to signed URL
  uploadFile: async (signedUrl: string, file: File) => {
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    })
  },

  // Complete upload flow: request URL + upload file
  uploadFileComplete: async (file: File) => {
    const { signedUrl, publicUrl } = await uploadApi.requestUpload(file.type, file.name)
    await uploadApi.uploadFile(signedUrl, file)
    return publicUrl
  },

  // Complete upload flow for profile/cover images
  uploadProfileImageComplete: async (file: File, uploadType: 'profile' | 'cover') => {
    const { signedUrl, publicUrl } = await uploadApi.requestProfileUpload(file.type, file.name, uploadType)
    await uploadApi.uploadFile(signedUrl, file)
    return publicUrl
  },
}

