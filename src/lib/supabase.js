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
