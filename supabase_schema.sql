-- ==============================================================================
-- KHODAL FASHION - HAUTE HORLOGERIE & LUXURY WATCHES BOUTIQUE
-- COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Click "Run"
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. STORAGE BUCKET CREATION (FOR WATCH PHOTOS)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('watch-images', 'watch-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Public Upload & View
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for watch-images' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Access for watch-images"
    ON storage.objects FOR ALL
    USING (bucket_id = 'watch-images')
    WITH CHECK (bucket_id = 'watch-images');
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE (WATCH CATALOG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sku TEXT,
  brand TEXT DEFAULT 'Khodal Fashion',
  category TEXT DEFAULT 'mens-watches',
  is_trending BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percent NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 5,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 12,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast queries by category & recency
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);


-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE (CUSTOMER WHATSAPP & STORE ORDERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  city TEXT,
  pincode TEXT,
  product_title TEXT,
  variant TEXT,
  total_amount NUMERIC NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
  status TEXT DEFAULT 'Order Placed (WhatsApp Confirmed)',
  source TEXT DEFAULT 'WhatsApp Store Checkout',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast order lookups
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);


-- ------------------------------------------------------------------------------
-- 4. STORE CONFIGURATION TABLE (SETTINGS & WHATSAPP NUMBER)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT DEFAULT 'Khodal Fashion',
  tagline TEXT DEFAULT 'Luxury Watches & Haute Horlogerie',
  whatsapp_number TEXT DEFAULT '7575023434',
  support_email TEXT DEFAULT 'khodalfashion@gmail.com',
  store_address TEXT DEFAULT 'Office No-111, Green Plaza, Near DMart Mall, Mota Varacha, Surat, Gujarat',
  announcements JSONB DEFAULT '["✨ KHODAL FASHION: Free Insured Delivery Across India | 100% Genuine Watches", "💬 Order Directly on WhatsApp for Instant Confirmation & Dispatch", "🛡️ 1-Year Movement Warranty & 7-Day Hassle-Free Replacement Included"]'::jsonb,
  free_shipping_threshold NUMERIC DEFAULT 1500,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- Drop existing if re-running
DROP POLICY IF EXISTS "Public Full Access on products" ON public.products;
DROP POLICY IF EXISTS "Public Full Access on orders" ON public.orders;
DROP POLICY IF EXISTS "Public Full Access on store_config" ON public.store_config;

-- Allow public read & write (Products, Orders, Store Config)
CREATE POLICY "Public Full Access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access on store_config" ON public.store_config FOR ALL USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 6. INITIAL STORE CONFIG SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.store_config (id, store_name, tagline, whatsapp_number, support_email, store_address, free_shipping_threshold)
VALUES (
  'default',
  'Khodal Fashion',
  'Luxury Watches & Haute Horlogerie',
  '7575023434',
  'khodalfashion@gmail.com',
  'Office No-111, Green Plaza, Near DMart Mall, Mota Varacha, Surat, Gujarat',
  1500
)
ON CONFLICT (id) DO UPDATE SET
  whatsapp_number = '7575023434',
  store_name = 'Khodal Fashion';


-- ------------------------------------------------------------------------------
-- 7. INITIAL WATCHES CATALOG SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.products (
  id, title, sku, brand, category, is_trending, is_best_seller, is_new,
  price, original_price, discount_percent, stock, rating, reviews_count,
  description, images, variants, specs
)
VALUES
(
  'g-shock-gm2100-camo',
  'Casio G-Shock GM2100 Octagon Metal Bezel',
  'CS-GM2100-BL',
  'Casio',
  'chronograph',
  true, true, false,
  1898, 7699, 75, 4, 4.9, 168,
  'Iconic octagon metal bezel with custom camo accent dial, double LED illuminator, 200m water resistance, and carbon core guard structure. The most sought-after CasiOak steel horology edition.',
  '["https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Arctic Ice Blue", "colorCode": "#38bdf8", "inStock": true}, {"name": "Sunset Orange", "colorCode": "#f97316", "inStock": true}, {"name": "Stealth Black", "colorCode": "#18181b", "inStock": true}]'::jsonb,
  '{"movement": "Japanese Tough Quartz Multi-Function Module", "caseDiameter": "44.4 mm", "glass": "Scratch-Resistant Hardlex Mineral Crystal", "waterResistance": "20 ATM / 200 Meters", "strap": "Flexible Bio-Resin with Steel Buckle"}'::jsonb
),
(
  'tissot-prx-tiffany-blue',
  'Tissot 1853 PRX Powermatic Silver Ice-Blue',
  'TS-PRX-1853-IB',
  'Tissot',
  'mens-watches',
  true, true, true,
  1848, 11198, 83, 3, 5.0, 240,
  'The retro-futuristic icon from 1978 reborn. Featuring the sensational Tiffany / Sky-Ice Blue waffle textured dial, integrated satin-finished stainless steel bracelet, and luminescent baton hands.',
  '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Tiffany Sky-Blue", "colorCode": "#7dd3fc", "inStock": true}, {"name": "Emerald Sunburst Green", "colorCode": "#15803d", "inStock": true}, {"name": "Midnight Navy Blue", "colorCode": "#1e3a8a", "inStock": true}]'::jsonb,
  '{"movement": "High-Precision Swiss-Calibre Quartz Movement", "caseDiameter": "40.0 mm", "glass": "Scratch-Resistant Sapphire Crystal", "waterResistance": "10 ATM / 100 Meters", "strap": "Integrated 316L Solid Stainless Steel"}'::jsonb
),
(
  'seiko-5-sports-emerald-green',
  'Seiko 5 Sports Automatic Diver Emerald Green',
  'SK-5SP-GRN-01',
  'Seiko',
  'automatic',
  true, false, true,
  1998, 9499, 79, 5, 4.8, 142,
  'Legendary dive watch DNA with emerald sunray dial, unidirectional rotating ceramic-finish bezel, exhibition see-through skeleton caseback, and LumiBrite hands that glow brightly in low light.',
  '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Emerald Sunray Green", "colorCode": "#059669", "inStock": true}, {"name": "Deep Ocean Blue", "colorCode": "#0284c7", "inStock": true}]'::jsonb,
  '{"movement": "Seiko Calibre 4R36 Automatic Self-Winding", "caseDiameter": "42.5 mm", "glass": "Hardlex Crystal Curved Lens", "waterResistance": "10 ATM / 100 Meters", "strap": "Stainless Steel 3-Link Oyster Bracelet"}'::jsonb
),
(
  'gucci-interlocking-g-two-tone',
  'Gucci Interlocking G Two-Tone Rose Gold & Emerald',
  'GC-INTL-G-RG',
  'Gucci',
  'ladies-watches',
  false, true, true,
  1948, 14500, 87, 2, 4.9, 115,
  'High-fashion statement timepiece showcasing the interlocking GG monogram bezel in polished rose gold PVD, adorned with a sun-brushed malachite emerald dial and luxury oyster links.',
  '["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Rose Gold & Emerald", "colorCode": "#e0a96d", "inStock": true}]'::jsonb,
  '{"movement": "Swiss-Made Ronda Quartz Calibre", "caseDiameter": "37.0 mm", "glass": "Sapphire Crystal with Anti-Reflective Coating", "waterResistance": "5 ATM / 50 Meters", "strap": "Two-Tone Stainless Steel & Rose Gold PVD"}'::jsonb
),
(
  'rado-centrix-ceramic-gold-black',
  'Rado Centrix Ceramic Chronograph Gold-Black',
  'RD-CTX-CER-GB',
  'Rado',
  'chronograph',
  true, false, false,
  1998, 16800, 88, 3, 5.0, 189,
  'Master of materials. Combining high-tech scratchproof black ceramic center links with yellow gold PVD casing. Edge-to-edge sapphire crystal lens with gold hands and date window.',
  '["https://images.unsplash.com/photo-1547996160-71dfabb1d8a4?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Jet Black Ceramic & Gold", "colorCode": "#171717", "inStock": true}]'::jsonb,
  '{"movement": "Swiss High-Precision Chronograph Quartz", "caseDiameter": "38.0 mm", "glass": "Edge-to-Edge Curved Sapphire Crystal", "waterResistance": "5 ATM / 50 Meters", "strap": "High-Tech Black Ceramic & Stainless Steel"}'::jsonb
),
(
  'audemars-royal-oak-skeleton',
  'Audemars Royal Oak Selfwinding Skeleton Masterpiece',
  'AP-RO-SKEL-41',
  'Audemars Piguet',
  'automatic',
  true, true, true,
  2498, 28999, 91, 2, 5.0, 310,
  'Haute Horlogerie at its pinnacle. Openworked skeleton dial displaying the mesmerizing gear train and balance wheel in motion. Signature octagonal bezel with 8 hexagonal white gold screws.',
  '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Silver Steel Skeleton", "colorCode": "#94a3b8", "inStock": true}, {"name": "Rose Gold Skeleton", "colorCode": "#fb7185", "inStock": true}]'::jsonb,
  '{"movement": "Mechanical Skeleton Automatic Self-Winding", "caseDiameter": "41.0 mm", "glass": "Double Glareproofed Sapphire Crystal", "waterResistance": "5 ATM / 50 Meters", "strap": "Integrated Stainless Steel Bracelet with AP Folding Clasp"}'::jsonb
),
(
  'submariner-date-ceramic-hulk',
  'Submariner Date Ceramic Bezel 41mm "Hulk"',
  'RLX-SUB-HULK-41',
  'Rolex Style',
  'mens-watches',
  true, true, false,
  2198, 24500, 91, 4, 4.9, 420,
  'The quintessential diver timepiece. Deep green Cerachrom ceramic unidirectional bezel with platinum gradations, radiant green dial with large luminescent hour markers, and Cyclops date magnifier.',
  '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Emerald Hulk Green", "colorCode": "#15803d", "inStock": true}, {"name": "Classic Submariner Black", "colorCode": "#000000", "inStock": true}]'::jsonb,
  '{"movement": "Perpetual Calibre Automatic Self-Winding", "caseDiameter": "41.0 mm", "glass": "Scratch-Resistant Sapphire with Cyclops Lens Over Date", "waterResistance": "30 ATM / 300 Meters", "strap": "Solid 904L Steel Oyster with Glidelock Extension Clasp"}'::jsonb
),
(
  'cartier-panthere-diamond-rose-gold',
  'Cartier Panthère Square Bezel Diamond Rose Gold',
  'CRT-PAN-RG-01',
  'Cartier Style',
  'ladies-watches',
  false, true, true,
  1898, 15999, 88, 3, 5.0, 174,
  'An icon of jewelry watchmaking. Delicate square case surrounded by brilliant pavé-cut micro-crystals, sword-shaped blued steel hands, Roman numeral markers, and ultra-supple multi-link bracelet.',
  '["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80"]'::jsonb,
  '[{"name": "Rose Gold Diamond", "colorCode": "#f43f5e", "inStock": true}, {"name": "Pure Silver Steel", "colorCode": "#e2e8f0", "inStock": true}]'::jsonb,
  '{"movement": "High-Autonomy Swiss Quartz Calibre", "caseDiameter": "27.0 mm", "glass": "Scratch-Resistant Sapphire Crystal", "waterResistance": "3 ATM / 30 Meters", "strap": "Flexible Rose Gold PVD Multi-Link Bracelet"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  description = EXCLUDED.description;

