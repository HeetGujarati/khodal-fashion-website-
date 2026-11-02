import { createClient } from '@supabase/supabase-js';
import { fileToBase64 } from '../utils/imageCompressor';

const STORAGE_KEY = 'khodal_supabase_config';

/**
 * Retrieve active Supabase credentials
 */
export const getSupabaseConfig = () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    bucket: import.meta.env.VITE_SUPABASE_BUCKET || 'watch-images'
  };
};

/**
 * Save Supabase credentials to localStorage
 */
export const saveSupabaseConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    url: (config.url || '').trim(),
    anonKey: (config.anonKey || '').trim(),
    bucket: (config.bucket || 'watch-images').trim()
  }));
};

/**
 * Check if Supabase credentials are configured
 */
export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

/**
 * Get or create Supabase client instance
 */
let cachedClient = null;
let cachedConfigKey = '';

export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  const configKey = `${config.url}::${config.anonKey}`;
  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false }
    });
    cachedConfigKey = configKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return { success: false, message: 'Please enter Supabase URL and Anon Key.' };
  }

  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Invalid Supabase client initialization.' };
    }

    // Attempt to list buckets or query
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      return { success: false, message: error.message };
    }

    const hasTargetBucket = buckets?.some(b => b.name === config.bucket);
    return {
      success: true,
      message: hasTargetBucket 
        ? `Connected successfully! Storage bucket "${config.bucket}" is ready.`
        : `Connected to Supabase! Note: Please ensure bucket "${config.bucket}" exists or is set to Public in Supabase dashboard.`,
      buckets: buckets || []
    };
  } catch (err) {
    return { success: false, message: err.message || 'Connection test failed.' };
  }
};

/**
 * Upload compressed watch image to Supabase Storage
 * Returns: { publicUrl, storagePath, isCloud: true/false }
 */
export const uploadWatchImage = async (compressedFile, customFilename) => {
  const config = getSupabaseConfig();
  const client = getSupabaseClient();

  // If Supabase is NOT configured, fallback cleanly to high-efficiency Base64
  if (!client || !config.url || !config.anonKey) {
    console.info('Supabase not configured. Using compressed Base64 preview data.');
    const base64Data = await fileToBase64(compressedFile);
    return {
      publicUrl: base64Data,
      storagePath: null,
      isCloud: false,
      message: 'Saved locally as compressed WebP (Supabase cloud upload optional)'
    };
  }

  const bucketName = config.bucket || 'watch-images';
  const ext = compressedFile.name.split('.').pop() || 'webp';
  const uniqueName = customFilename 
    ? `${customFilename.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}.${ext}`
    : `watch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

  const storagePath = `catalog/${uniqueName}`;

  try {
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(storagePath, compressedFile, {
        contentType: compressedFile.type || 'image/webp',
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase upload error, falling back to compressed local:', error);
      const base64Data = await fileToBase64(compressedFile);
      return {
        publicUrl: base64Data,
        storagePath: null,
        isCloud: false,
        error: error.message,
        message: `Cloud upload error (${error.message}). Saved locally as optimized WebP.`
      };
    }

    // Get public URL from Supabase
    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(data.path);

    return {
      publicUrl: urlData.publicUrl,
      storagePath: data.path,
      isCloud: true,
      message: 'Uploaded directly to Supabase Storage!'
    };
  } catch (err) {
    console.error('Unexpected upload error:', err);
    const base64Data = await fileToBase64(compressedFile);
    return {
      publicUrl: base64Data,
      storagePath: null,
      isCloud: false,
      error: err.message,
      message: 'Saved locally as compressed WebP.'
    };
  }
};

/* ==============================================================================
 * DATABASE OPERATIONS (PRODUCTS, ORDERS, STORE CONFIG)
 * ============================================================================== */

// Product Mappers
export const mapProductFromDB = (row) => ({
  id: row.id,
  title: row.title,
  sku: row.sku || '',
  brand: row.brand || 'Khodal Fashion',
  category: row.category || 'mens-watches',
  price: Number(row.price),
  originalPrice: Number(row.original_price || (row.price * 2)),
  discountPercent: Number(row.discount_percent || 0),
  stock: Number(row.stock || 5),
  rating: Number(row.rating || 5.0),
  reviewsCount: Number(row.reviews_count || 12),
  description: row.description || '',
  images: Array.isArray(row.images) ? row.images : (row.images ? [row.images] : []),
  variants: Array.isArray(row.variants) ? row.variants : [{ name: 'Standard Edition', inStock: true }],
  specs: (typeof row.specs === 'object' && row.specs) ? row.specs : {},
  isTrending: Boolean(row.is_trending),
  isBestSeller: Boolean(row.is_best_seller),
  isNew: Boolean(row.is_new),
  createdAt: row.created_at
});

export const mapProductToDB = (p) => ({
  id: String(p.id),
  title: p.title,
  sku: p.sku || `KF-${Math.floor(1000 + Math.random() * 9000)}`,
  brand: p.brand || 'Khodal Fashion',
  category: p.category || 'mens-watches',
  price: Number(p.price),
  original_price: Number(p.originalPrice || p.price),
  discount_percent: Number(p.discountPercent || 0),
  stock: Number(p.stock || 5),
  rating: Number(p.rating || 5.0),
  reviews_count: Number(p.reviewsCount || 12),
  description: p.description || '',
  images: p.images || [],
  variants: p.variants || [],
  specs: p.specs || {},
  is_trending: Boolean(p.isTrending),
  is_best_seller: Boolean(p.isBestSeller),
  is_new: Boolean(p.isNew)
});

/**
 * Fetch all watches from Supabase Database
 */
export const fetchProductsFromDB = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase DB fetch products error:', error.message);
      return null;
    }

    return (data || []).map(mapProductFromDB);
  } catch (err) {
    console.warn('Supabase DB products unexpected error:', err);
    return null;
  }
};

/**
 * Upsert a watch into Supabase Database
 */
export const insertProductToDB = async (product) => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const dbPayload = mapProductToDB(product);
    const { data, error } = await client
      .from('products')
      .upsert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error('Failed to insert product in Supabase:', error.message);
      return null;
    }

    return data ? mapProductFromDB(data) : null;
  } catch (err) {
    console.error('Insert product error:', err);
    return null;
  }
};

/**
 * Delete a watch from Supabase Database
 */
export const deleteProductFromDB = async (id) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.error('Failed to delete product in Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete product error:', err);
    return false;
  }
};

// Orders Mappers
export const mapOrderFromDB = (row) => ({
  orderId: row.id,
  id: row.id,
  createdAt: row.created_at,
  productTitle: row.product_title || row.items?.[0]?.title || 'Luxury Watch',
  variant: row.variant || row.items?.[0]?.variant || 'Standard',
  price: Number(row.total_amount || 0),
  totalAmount: Number(row.total_amount || 0),
  customer: {
    name: row.customer_name || '',
    phone: row.customer_phone || '',
    address: row.delivery_address || '',
    city: row.city || '',
    pincode: row.pincode || ''
  },
  items: row.items || [],
  paymentMethod: row.payment_method || 'Cash on Delivery (COD)',
  status: row.status || 'Order Placed (WhatsApp Confirmed)'
});

export const mapOrderToDB = (order) => ({
  id: String(order.orderId || order.id || `KF-${Date.now()}`),
  order_id: String(order.orderId || order.id || `KF-${Date.now()}`),
  customer_name: order.customer?.name || order.customerName || 'Customer',
  customer_phone: order.customer?.phone || order.phone || '',
  delivery_address: order.customer?.address || order.address || '',
  city: order.customer?.city || order.city || '',
  pincode: order.customer?.pincode || order.pincode || '',
  product_title: order.productTitle || order.items?.[0]?.title || 'Luxury Watch',
  variant: order.variant || order.items?.[0]?.variant || '',
  total_amount: Number(order.price || order.totalAmount || 0),
  items: order.items || [{ title: order.productTitle, variant: order.variant, price: order.price }],
  payment_method: order.paymentMethod || 'Cash on Delivery (COD)',
  status: order.status || 'Order Placed (WhatsApp Confirmed)'
});

/**
 * Fetch all orders from Supabase Database
 */
export const fetchOrdersFromDB = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase DB fetch orders error:', error.message);
      return null;
    }

    return (data || []).map(mapOrderFromDB);
  } catch (err) {
    console.warn('Supabase DB orders unexpected error:', err);
    return null;
  }
};

/**
 * Record a new customer order into Supabase Database
 */
export const createOrderInDB = async (order) => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const dbPayload = mapOrderToDB(order);
    const { data, error } = await client
      .from('orders')
      .upsert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error('Failed to save order in Supabase:', error.message);
      return null;
    }

    return data ? mapOrderFromDB(data) : null;
  } catch (err) {
    console.error('Create order error:', err);
    return null;
  }
};

/**
 * Fetch store configuration from Supabase Database
 */
export const fetchStoreConfigFromDB = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('store_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) return null;

    return {
      storeName: data.store_name || 'Khodal Fashion',
      tagline: data.tagline || 'Luxury Watches & Haute Horlogerie',
      whatsappNumber: data.whatsapp_number || '7575023434',
      supportEmail: data.support_email || 'khodalfashion@gmail.com',
      storeAddress: data.store_address || '',
      announcements: Array.isArray(data.announcements) ? data.announcements : [],
      freeShippingThreshold: Number(data.free_shipping_threshold || 1500)
    };
  } catch {
    return null;
  }
};

/**
 * Save store configuration to Supabase Database
 */
export const saveStoreConfigToDB = async (config) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('store_config')
      .upsert({
        id: 'default',
        store_name: config.storeName,
        tagline: config.tagline,
        whatsapp_number: config.whatsappNumber,
        support_email: config.supportEmail,
        store_address: config.storeAddress,
        announcements: config.announcements || [],
        free_shipping_threshold: Number(config.freeShippingThreshold || 1500),
        updated_at: new Date().toISOString()
      });

    return !error;
  } catch {
    return false;
  }
};
