# 🚀 Follwr API - Frontend Integration Guide


## 🔐 Authentication

All endpoints require authentication header (except webhooks):
```typescript
headers: {
  'Authorization': 'Bearer <supabase_jwt_token>'
}
```

Get token from Supabase:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 👤 1. CREATORS

### Create Creator Profile
```typescript
POST /creators/profile
Body: {
  displayName: string;      // Required
  username: string;         // Required, unique, 3-30 chars, alphanumeric + underscore
  bio?: string;            // Optional
  profilePictureUrl?: string;
  coverImageUrl?: string;
}

Response: {
  data: CreatorProfile,
  message: "Creator profile created"
}
```

### Get My Creator Profile
```typescript
GET /creators/profile
Auth: Creator only

Response: {
  id, userId, displayName, username, bio,
  profilePictureUrl, coverImageUrl, isVerified,
  subscriptionPrice, totalEarnings, totalSubscribers,
  totalPosts, totalLikes, createdAt, updatedAt
}
```

### Update My Profile
```typescript
PUT /creators/profile
Auth: Creator only
Body: {
  displayName?: string;
  username?: string;
  bio?: string;
  profilePictureUrl?: string;
  coverImageUrl?: string;
}
```

### Get Creator by Username
```typescript
GET /creators/:username

Response: {
  ...profile,
  posts: [...recent posts]
}
```

### Get Creator Stats
```typescript
GET /creators/:creatorId/stats

Response: {
  totalPosts, totalLikes, totalSubscribers, totalEarnings
}
```

---

## 📝 2. POSTS

### Create Post
```typescript
POST /posts
Auth: Creator only
Body: {
  content?: string;
  mediaUrls?: string[];      // Upload files first via /upload/request
  visibility?: 'public' | 'followers' | 'subscribers';  // Default: 'public'
  price?: number;            // Optional paywall
}

Response: {
  data: Post,
  message: "Post created successfully"
}
```

### Get Feed
```typescript
GET /posts?page=1&limit=20

Response: {
  data: Post[],
  pagination: { page, limit, total, totalPages }
}
```

### Get Single Post
```typescript
GET /posts/:id

Response (if has access): {
  data: { ...post, hasAccess: true }
}

Response (if no access): {
  data: { 
    id, creatorId, creator, visibility, price,
    hasAccess: false,
    requiresPurchase: boolean
  },
  message: "Purchase required" or "Subscription required"
}
```

### Delete Post
```typescript
DELETE /posts/:id
Auth: Creator (owner) only

Response: { message: "Post deleted successfully" }
```

### Purchase Post
```typescript
POST /posts/:id/purchase
Body: {
  paymentMethodId: string;  // Stripe payment method ID
}

Response: {
  data: {
    clientSecret: string,   // Use with Stripe Elements
    postId: string
  },
  message: "Payment initiated"
}

// Frontend: Confirm payment with Stripe, then access post
```

---

## 💰 3. SUBSCRIPTIONS

### Subscribe to Creator
```typescript
POST /subscriptions/:creatorId
Body: {
  paymentMethodId: string;  // Stripe payment method ID
}

Response: {
  data: {
    subscription: {...},
    clientSecret: string    // For 3D Secure if needed
  }
}
```

### Get My Subscriptions
```typescript
GET /subscriptions?page=1&limit=20

Response: {
  data: [
    {
      id, subscriberId, creatorId, status,
      startDate, endDate, autoRenew,
      creator: { ...creatorInfo }
    }
  ],
  pagination: {...}
}
```

### Get Subscription Details
```typescript
GET /subscriptions/:id

Response: {
  data: { subscription with creator details }
}
```

### Cancel Subscription
```typescript
DELETE /subscriptions/:id

Response: {
  data: { ...updated subscription with status: 'cancelled' },
  message: "Subscription cancelled successfully"
}
```

### Update Auto-Renewal
```typescript
PUT /subscriptions/:id
Body: {
  autoRenew: boolean
}

Response: {
  data: {...updated subscription},
  message: "Auto-renewal updated successfully"
}
```

---

## 🛍️ 4. PRODUCTS (Digital Goods)

### Create Product
```typescript
POST /products
Auth: Creator only
Body: {
  title: string;
  description?: string;
  price: number;            // Min: 0.01
  productImageUrl?: string;
  fileUrls: string[];       // Upload files first
}

Response: {
  data: Product,
  message: "Product created successfully"
}
```

### List Products
```typescript
GET /products?creatorId=xxx&page=1&limit=20

Response: {
  data: [{ ...product, creator: {...} }],
  pagination: {...}
}
```

### Get Product
```typescript
GET /products/:id

Response: {
  data: { ...product, creator: {...} }
}
```

### Update Product
```typescript
PUT /products/:id
Auth: Creator (owner) only
Body: {
  title?: string;
  description?: string;
  price?: number;
  productImageUrl?: string;
  fileUrls?: string[];
  isActive?: boolean;
}
```

### Delete Product
```typescript
DELETE /products/:id
Auth: Creator (owner) only
```

### Purchase Product
```typescript
POST /products/:id/purchase
Body: {
  paymentMethodId: string
}

Response: {
  data: {
    clientSecret: string,
    productId: string
  }
}
```

### Get My Purchases
```typescript
GET /products/purchases?page=1&limit=20

Response: {
  data: [
    {
      ...purchase,
      product: { ...productDetails }
    }
  ]
}
```

---

## 👥 5. FOLLOWS

### Follow Creator
```typescript
POST /follows/:creatorId

Response: { message: "Successfully followed creator" }
```

### Unfollow Creator
```typescript
DELETE /follows/:creatorId

Response: { message: "Successfully unfollowed creator" }
```

---

## ❤️ 6. LIKES

### Like Post
```typescript
POST /posts/:id/like

Response: { message: "Post liked successfully" }
```

### Unlike Post
```typescript
DELETE /posts/:id/like

Response: { message: "Post unliked successfully" }
```

---

## 💸 7. TIPS

### Send Tip on Post
```typescript
POST /posts/:id/tip
Body: {
  amount: number;           // Min: 0.50
  paymentMethodId?: string;
}

Response: {
  data: {
    clientSecret: string    // For Stripe payment confirmation
  },
  message: "Tip payment initiated"
}
```

### Get Tips Received (Creator)
```typescript
GET /tips/received?page=1&limit=20

Response: {
  data: [
    {
      id, fromUserId, toCreatorId, amount, postId,
      createdAt,
      toCreator: {...},
      post: {...}
    }
  ]
}
```

### Get Tips Sent
```typescript
GET /tips/sent?page=1&limit=20
```

---

## 💬 8. MESSAGES (DMs)

### Get Conversations List
```typescript
GET /messages/conversations?page=1&limit=50

Response: {
  data: [
    {
      partnerId: string,
      partnerCreator: {...} | null,
      lastMessage: {...},
      unreadCount: number
    }
  ]
}
```

### Get Messages with User
```typescript
GET /messages/:userId?page=1&limit=50

Response: {
  data: Message[],  // Sorted oldest first
  pagination: {...}
}
```

### Send Message
```typescript
POST /messages/send
Body: {
  recipientId: string;
  content?: string;
  mediaUrls?: string[];
  price?: number;          // Optional - paid DM
}

Response: {
  data: Message,
  message: "Message sent successfully"
}

// Note: Regular users can only message creators they're subscribed to
//       Creators can message any subscriber
```

### Mark Message as Read
```typescript
PUT /messages/:id/read

Response: { message: "Message marked as read" }
```

### Purchase Paid Message
```typescript
POST /messages/:id/purchase
Body: {
  paymentMethodId: string
}

Response: {
  data: {
    clientSecret: string,
    messageId: string
  }
}
```

---

## 📢 9. BROADCAST (Mass Messaging)

### Get Broadcast Lists
```typescript
GET /broadcast/lists
Auth: Creator only

Response: {
  data: BroadcastList[]
}
```

### Create List
```typescript
POST /broadcast/lists
Auth: Creator only
Body: {
  name: string;
  memberIds: string[];     // Array of user IDs
}

Response: {
  data: BroadcastList,
  message: "Broadcast list created successfully"
}
```

### Update List
```typescript
PUT /broadcast/lists/:id
Auth: Creator only
Body: {
  name?: string;
  memberIds?: string[];
}
```

### Delete List
```typescript
DELETE /broadcast/lists/:id
Auth: Creator only
```

### Send Broadcast
```typescript
POST /broadcast/send
Auth: Creator only
Body: {
  listId: string;
  content?: string;
  mediaUrls?: string[];
  price?: number;
}

Response: {
  data: {
    messagesSent: number,
    recipients: string[]
  }
}
```

---

## 💳 10. BANKING (Creator Payouts)

### Get Balance
```typescript
GET /banking/balance
Auth: Creator only

Response: {
  data: {
    balance: number,
    totalEarnings: number,
    stripeConnectAccountId: string | null
  }
}
```

### Create Stripe Connect Account
```typescript
POST /banking/connect
Auth: Creator only

Response: {
  data: {
    accountId: string,
    onboardingUrl: string    // Redirect user here to complete onboarding
  }
}
```

### Withdraw Funds
```typescript
POST /banking/withdraw
Auth: Creator only
Body: {
  amount: number           // Min: 1.00
}

Response: {
  data: {
    payoutId: string,
    amount: number,
    status: string,
    arrivalDate: Date | null
  }
}
```

### Get Payment Cards
```typescript
GET /banking/cards

Response: {
  data: [
    {
      id, userId, cardType, lastFour,
      expiryMonth, expiryYear, createdAt
    }
  ]
}
```

### Add Payment Card
```typescript
POST /banking/cards
Body: {
  stripePaymentMethodId: string  // From Stripe Elements
}

Response: {
  data: PaymentCard,
  message: "Card added successfully"
}
```

### Remove Card
```typescript
DELETE /banking/cards/:id

Response: { message: "Card removed successfully" }
```

---

## 📤 11. UPLOAD (File Uploads)

### Request Upload URL
```typescript
POST /upload/request
Body: {
  fileType: string;        // e.g., "image/jpeg", "video/mp4"
  fileName: string;        // e.g., "photo.jpg"
}

Response: {
  data: {
    signedUrl: string,     // Upload file here (PUT request)
    fileKey: string,       // Internal reference
    publicUrl: string      // Use this in post.mediaUrls
  }
}

// Frontend flow:
// 1. Request signed URL
// 2. Upload file: fetch(signedUrl, { method: 'PUT', body: file })
// 3. Use publicUrl in post creation
```

### Request Profile/Cover Upload
```typescript
POST /upload/request-profile
Body: {
  fileType: string;        // Must be image/*
  fileName: string;
  uploadType: 'profile' | 'cover';
}

Response: {
  data: {
    signedUrl: string,
    fileKey: string,
    publicUrl: string
  }
}
```

---

## ⚙️ 12. SETTINGS

### Update Profile
```typescript
PUT /settings/profile
Auth: Creator only
Body: {
  displayName?: string;
  username?: string;
  bio?: string;
  profilePictureUrl?: string;
  coverImageUrl?: string;
}
```

### Update Account
```typescript
PUT /settings/account
Body: {
  email?: string;
  phone?: string;
}
```

### Update Password
```typescript
POST /settings/password
Body: {
  currentPassword: string;
  newPassword: string;     // Min: 8 characters
}
```

### Delete Account
```typescript
DELETE /settings/account

Response: { message: "Account deleted successfully" }
```

### Update Subscription Price
```typescript
PUT /settings/subscription-price
Auth: Creator only
Body: {
  price: number            // Min: 1.00
}
```

---

## 🔖 13. SAVED POSTS

### Save Post
```typescript
POST /posts/:id/save

Response: { message: "Post saved successfully" }
```

### Unsave Post
```typescript
DELETE /posts/:id/save

Response: { message: "Post unsaved successfully" }
```

### Get Saved Posts
```typescript
GET /posts/saved?page=1&limit=20

Response: {
  data: Post[],
  pagination: {...}
}
```

---

## 🎨 Quick Frontend Setup Example

```typescript
// lib/api/client.ts
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Auto-attach auth token
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## 🎯 Common User Flows

### Flow 1: User Signs Up & Becomes Creator
```typescript
// 1. Sign up with Supabase
const { data } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// 2. Create creator profile
await apiClient.post('/creators/profile', {
  displayName: 'John Doe',
  username: 'johndoe',
  bio: 'Content creator'
});

// 3. Set subscription price
await apiClient.put('/settings/subscription-price', {
  price: 9.99
});

// 4. Create first post
await apiClient.post('/posts', {
  content: 'Hello world!',
  visibility: 'public'
});
```

### Flow 2: User Subscribes to Creator
```typescript
// 1. Get Stripe payment method (using Stripe Elements)
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: elements.getElement(CardElement),
});

// 2. Subscribe
const res = await apiClient.post(`/subscriptions/${creatorId}`, {
  paymentMethodId: paymentMethod.id
});

// 3. Confirm payment if needed (3D Secure)
if (res.data.data.clientSecret) {
  await stripe.confirmCardPayment(res.data.data.clientSecret);
}

// 4. Now user has access to subscriber-only content
```

### Flow 3: Upload File & Create Post
```typescript
// 1. Request signed URL
const uploadRes = await apiClient.post('/upload/request', {
  fileType: file.type,      // e.g., "image/jpeg"
  fileName: file.name
});

const { signedUrl, publicUrl } = uploadRes.data.data;

// 2. Upload file directly to storage
await fetch(signedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Create post with uploaded file
await apiClient.post('/posts', {
  content: 'Check this out!',
  mediaUrls: [publicUrl],
  visibility: 'public'
});
```

### Flow 4: Purchase Paid Post
```typescript
// 1. User tries to view paid post
const postRes = await apiClient.get(`/posts/${postId}`);

if (!postRes.data.data.hasAccess && postRes.data.data.requiresPurchase) {
  // 2. Show purchase modal
  // 3. Get payment method
  const { paymentMethod } = await stripe.createPaymentMethod({...});
  
  // 4. Purchase post
  const purchaseRes = await apiClient.post(`/posts/${postId}/purchase`, {
    paymentMethodId: paymentMethod.id
  });
  
  // 5. Confirm payment
  await stripe.confirmCardPayment(purchaseRes.data.data.clientSecret);
  
  // 6. Reload post - now has access!
  const updatedPost = await apiClient.get(`/posts/${postId}`);
}
```

### Flow 5: Creator Withdraws Earnings
```typescript
// 1. Check balance
const balanceRes = await apiClient.get('/banking/balance');

// 2. If no Connect account, create one
if (!balanceRes.data.data.stripeConnectAccountId) {
  const connectRes = await apiClient.post('/banking/connect');
  
  // 3. Redirect to Stripe onboarding
  window.location.href = connectRes.data.data.onboardingUrl;
  
  // After return from Stripe...
}

// 4. Withdraw funds
await apiClient.post('/banking/withdraw', {
  amount: 100.00
});
```

---

## 📊 Response Format

### Success Response
```typescript
{
  data: any,              // The actual data
  message?: string,       // Optional success message
  pagination?: {          // For paginated endpoints
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Error Response
```typescript
{
  statusCode: number,     // HTTP status code
  message: string,        // Error message
  error?: string          // Error type
}
```

---

## 🔑 Important Business Rules

### Post Access
- **Public** → Anyone can view
- **Followers** → Must follow creator
- **Subscribers** → Must have active subscription
- **Priced** → Must purchase, regardless of follow/subscription
- **Purchased content** → Permanent access

### Message Access
- Regular users → Can ONLY message creators they're subscribed to
- Creators → Can message any subscriber
- Paid messages → Recipient must purchase to view media

### Service Fee
All transactions include 4.12% service fee:
- User pays: `amount + (amount * 0.0412)`
- Creator receives: `amount`

### Stripe Integration
- Use test keys: `pk_test_...` and `sk_test_...`
- Test cards: `4242 4242 4242 4242` (any future date, any CVC)
- Webhook URL: `https://your-backend.com/stripe/webhook`

---

## 🚀 Quick Start Checklist

**Environment Variables (.env.local in Next.js):**
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**Install Dependencies:**
```bash
npm install @supabase/supabase-js axios @stripe/stripe-js @stripe/react-stripe-js
```

**Test Authentication:**
1. Sign up user via Supabase
2. Create creator profile: `POST /creators/profile`
3. Get feed: `GET /posts`
4. Test endpoints via `http://localhost:3000/api` (Swagger UI)

---

## 🆘 Common Issues

### 401 Unauthorized
→ Check token is being sent in Authorization header
→ Verify token is valid (not expired)

### 403 Forbidden
→ Endpoint requires creator profile (use CreatorGuard)
→ User doesn't own the resource

### 404 Not Found
→ Resource doesn't exist
→ Check IDs are correct UUIDs

### Payment Issues
→ Ensure using Stripe test mode keys
→ Use test cards for development
→ Check webhook is configured in Stripe Dashboard

---

## 📱 Next Steps

1. Set up API client in your Next.js app
2. Test authentication flow
3. Implement creator profile creation
4. Build posts feed
5. Add Stripe Elements for payments
6. Test subscription flow

Happy building! 🎉

