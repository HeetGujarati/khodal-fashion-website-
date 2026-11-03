import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { 
  fetchProductsFromDB, 
  insertProductToDB, 
  deleteProductFromDB, 
  createOrderInDB, 
  fetchOrdersFromDB, 
  fetchStoreConfigFromDB, 
  saveStoreConfigToDB,
  isSupabaseConfigured 
} from '../lib/supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Store Settings (Client configurable)
  const [storeConfig, setStoreConfig] = useState(() => {
    const saved = localStorage.getItem('khodal_store_config') || localStorage.getItem('ditya_store_config');
    let parsed = saved ? JSON.parse(saved) : null;
    if (parsed) {
      if (parsed.whatsappNumber === '7383556275' || !parsed.whatsappNumber) {
        parsed.whatsappNumber = '7575023434';
      }
      if (parsed.storeName?.includes('Ditya') || !parsed.storeName) {
        parsed.storeName = 'Khodal Fashion';
        parsed.supportEmail = 'khodalfashion@gmail.com';
      }
      localStorage.setItem('khodal_store_config', JSON.stringify(parsed));
    }
    return parsed || {
      storeName: 'Khodal Fashion',
      tagline: 'Luxury Watches & Haute Horlogerie',
      whatsappNumber: '7575023434',
      supportEmail: 'khodalfashion@gmail.com',
      storeAddress: 'Office No-111, Green Plaza, Near DMart Mall, Mota Varacha, Surat, Gujarat',
      announcements: [
        '✨ KHODAL FASHION: 100% Genuine Luxury Watches | Certified Quality',
        '💬 Order Directly on WhatsApp for Instant Confirmation & Dispatch',
        '🛡️ 1-Year Movement Warranty & 7-Day Hassle-Free Replacement Included'
      ],
      freeShippingThreshold: 1500
    };
  });

  // Products state (includes admin additions)
  const [products, setProducts] = useState(() => {
    localStorage.removeItem('ditya_products');
    const saved = localStorage.getItem('khodal_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (JSON.stringify(parsed).includes('522335789203') || JSON.stringify(parsed).includes('509042239860') || JSON.stringify(parsed).includes('1547996160-71dfabb1d8a4')) {
          localStorage.setItem('khodal_products', JSON.stringify(INITIAL_PRODUCTS));
          return INITIAL_PRODUCTS;
        }
        return parsed;
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    localStorage.setItem('khodal_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  // Orders state (loaded from Supabase / localStorage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('khodal_orders') || localStorage.getItem('ditya_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('khodal_cart') || localStorage.getItem('ditya_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('khodal_wishlist') || localStorage.getItem('ditya_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Active UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null); // { product, variant }
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeToast, setActiveToast] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(5000);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('khodal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('khodal_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('khodal_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('khodal_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('khodal_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // Sync with Supabase Database on startup if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // 1. Fetch live products from Supabase
    fetchProductsFromDB().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        localStorage.setItem('khodal_products', JSON.stringify(dbProducts));
      }
    });

    // 2. Fetch live store config
    fetchStoreConfigFromDB().then((dbConfig) => {
      if (dbConfig) {
        setStoreConfig((prev) => ({ ...prev, ...dbConfig }));
        localStorage.setItem('khodal_store_config', JSON.stringify(dbConfig));
      }
    });

    // 3. Fetch live orders
    fetchOrdersFromDB().then((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
        localStorage.setItem('khodal_orders', JSON.stringify(dbOrders));
      }
    });
  }, []);

  // Toast Notification
  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 3500);
  };

  // Add Watch (DB + State + LocalStorage)
  const addProduct = async (productData) => {
    setProducts((prev) => [productData, ...prev]);
    if (isSupabaseConfigured()) {
      await insertProductToDB(productData);
    }
  };

  // Delete Watch (DB + State + LocalStorage)
  const deleteProduct = async (id, title) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      await deleteProductFromDB(id);
    }
  };

  // Record an Order (DB + State + LocalStorage)
  const saveOrder = async (orderData) => {
    setOrders((prev) => [orderData, ...prev]);
    const existing = JSON.parse(localStorage.getItem('khodal_orders') || '[]');
    localStorage.setItem('khodal_orders', JSON.stringify([orderData, ...existing]));

    if (isSupabaseConfigured()) {
      await createOrderInDB(orderData);
    }
  };

  // Save Config (DB + State)
  const updateStoreConfig = async (newConfig) => {
    setStoreConfig(newConfig);
    if (isSupabaseConfigured()) {
      await saveStoreConfigToDB(newConfig);
    }
  };

  // Cart Handlers
  const addToCart = (product, variant = null, quantity = 1) => {
    const chosenVariant = variant || (product.variants && product.variants[0]?.name) || 'Standard';
    const cartItemId = `${product.id}-${chosenVariant}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        cartItemId,
        product,
        variant: chosenVariant,
        quantity
      }];
    });

    showToast(`Added "${product.title}" to Cart`);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Handlers
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Added to Wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Total Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WhatsApp Messaging Helpers
  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  // 1. Direct WhatsApp Inquiry
  const sendWhatsAppInquiry = (product, variantName = null) => {
    const variantStr = variantName ? ` (Variant: ${variantName})` : '';
    const message = `👑 *WATCH INQUIRY - ${storeConfig.storeName}* 👑\n\n` +
      `Hello! I would like more information and real live photos/video for this timepiece:\n\n` +
      `⌚ *Model:* ${product.title}\n` +
      `🏷️ *SKU:* ${product.sku}\n` +
      `🎨 *Selected:* ${variantStr || 'Standard Edition'}\n` +
      `💰 *Offer Price:* ₹${product.price.toLocaleString('en-IN')} (MRP: ₹${product.originalPrice?.toLocaleString('en-IN')})\n` +
      `🔗 *Image:* ${product.images?.[0] || ''}\n\n` +
      `Please let me know if this model is ready in stock and share live wrist shot video. Thank you!`;

    const url = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // 2. Direct Express WhatsApp Order (With Customer Address)
  const sendWhatsAppOrder = (product, variantName, customerDetails) => {
    const message = `🔥 *NEW ORDER BOOKING - ${storeConfig.storeName}* 🔥\n\n` +
      `Hello! I want to confirm my order for this luxury watch:\n\n` +
      `⌚ *Watch:* ${product.title}\n` +
      `🏷️ *SKU:* ${product.sku}\n` +
      `🎨 *Dial/Variant:* ${variantName || 'Standard'}\n` +
      `💰 *Price:* ₹${product.price.toLocaleString('en-IN')}\n\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• *Name:* ${customerDetails.name}\n` +
      `• *Phone:* ${customerDetails.phone}\n` +
      `• *Address:* ${customerDetails.address}\n` +
      `• *City / Pincode:* ${customerDetails.city} - ${customerDetails.pincode}\n` +
      `• *Payment Preference:* Cash on Delivery (COD) / WhatsApp Pay\n\n` +
      `Please confirm my order and share courier dispatch tracking details.`;

    const url = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // 3. Multi-Item Cart Order via WhatsApp
  const sendCartWhatsAppOrder = (customerDetails = null) => {
    if (cart.length === 0) return;

    const orderId = `KF-CART-${Math.floor(100000 + Math.random() * 900000)}`;

    let itemsList = '';
    const cartItems = [];
    cart.forEach((item, index) => {
      itemsList += `${index + 1}. *${item.product.title}*\n   - Variant: ${item.variant}\n   - Qty: ${item.quantity} × ₹${item.product.price.toLocaleString('en-IN')}\n\n`;
      cartItems.push({
        title: item.product.title,
        variant: item.variant,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images?.[0] || ''
      });
    });

    // Save cart order into database & localStorage
    const savedCartOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      productTitle: `${cartTotalItems} Luxury Timepieces (${cart[0]?.product.title}...)`,
      variant: 'Multi-Item Cart',
      price: cartSubtotal,
      totalAmount: cartSubtotal,
      customer: customerDetails || { name: 'Direct Customer' },
      items: cartItems,
      status: 'Order Placed (WhatsApp Confirmed)'
    };
    saveOrder(savedCartOrder);

    let message = `🛒 *SHOPPING CART ORDER - ${storeConfig.storeName}* 🛒\n\n` +
      `Order Ref: #${orderId}\n\n` +
      `Hello! I want to order the following ${cartTotalItems} timepieces:\n\n` +
      `${itemsList}` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *TOTAL ORDER VALUE:* ₹${cartSubtotal.toLocaleString('en-IN')}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (customerDetails && customerDetails.name) {
      message += `👤 *DELIVERY ADDRESS:*\n` +
        `• Name: ${customerDetails.name}\n` +
        `• Mobile: ${customerDetails.phone}\n` +
        `• Address: ${customerDetails.address}, ${customerDetails.city} - ${customerDetails.pincode}\n\n`;
    }

    message += `Please confirm availability and dispatch timeline.`;

    const url = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <StoreContext.Provider value={{
      storeConfig,
      setStoreConfig,
      updateStoreConfig,
      products,
      setProducts,
      addProduct,
      deleteProduct,
      orders,
      setOrders,
      saveOrder,
      categories: CATEGORIES,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      cartSubtotal,
      cartTotalItems,
      wishlist,
      toggleWishlist,
      isWishlisted,
      isCartOpen,
      setIsCartOpen,
      quickOrderProduct,
      setQuickOrderProduct,
      quickViewProduct,
      setQuickViewProduct,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      sortBy,
      setSortBy,
      priceRange,
      setPriceRange,
      activeToast,
      showToast,
      sendWhatsAppInquiry,
      sendWhatsAppOrder,
      sendCartWhatsAppOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
