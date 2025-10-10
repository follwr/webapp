import { apiClient } from './client'
import { CreatorProfile } from '../types'

export interface Product {
  id: string
  creatorId: string
  title: string
  description?: string
  price: number
  productImageUrl?: string
  fileUrls: string[]
  isActive: boolean
  totalSales: number
  createdAt: string
  updatedAt: string
  creator?: CreatorProfile
}

export interface ProductPurchase {
  id: string
  buyerId: string
  productId: string
  amount: number
  serviceFee: number
  createdAt: string
  product: Product
}

export const productsApi = {
  // Create product
  createProduct: async (data: {
    title: string
    description?: string
    price: number
    productImageUrl?: string
    fileUrls: string[]
  }) => {
    const response = await apiClient.post<{ data: Product }>('/products', data)
    return response.data.data
  },

  // List products
  listProducts: async (creatorId?: string, page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Product[] }>('/products', {
      params: { creatorId, page, limit }
    })
    return response.data.data
  },

  // Get single product
  getProduct: async (productId: string) => {
    const response = await apiClient.get<{ data: Product }>(`/products/${productId}`)
    return response.data.data
  },

  // Update product
  updateProduct: async (productId: string, data: {
    title?: string
    description?: string
    price?: number
    productImageUrl?: string
    fileUrls?: string[]
    isActive?: boolean
  }) => {
    const response = await apiClient.put<{ data: Product }>(`/products/${productId}`, data)
    return response.data.data
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const response = await apiClient.delete(`/products/${productId}`)
    return response.data
  },

  // Purchase product
  purchaseProduct: async (productId: string, paymentMethodId: string) => {
    const response = await apiClient.post<{ data: { clientSecret: string; productId: string } }>(
      `/products/${productId}/purchase`,
      { paymentMethodId }
    )
    return response.data.data
  },

  // Get my purchases
  getMyPurchases: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: ProductPurchase[] }>('/products/purchases', {
      params: { page, limit }
    })
    return response.data.data
  },
}

