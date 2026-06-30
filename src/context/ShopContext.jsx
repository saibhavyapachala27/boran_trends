import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialProducts from '../data/products.json';

const ShopContext = createContext();

const WHATSAPP_NUMBER = '917995395296';

export const ShopProvider = ({ children }) => {
  // 1. Products Catalog State
  const [products, setProductsState] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Force refresh from initialProducts if cached data is outdated
        const hasOutdated = parsed.some(p => 
          p.id.startsWith('real_jeans_folded_jeans_') || 
          p.id.startsWith('prod_gen_') || 
          !parsed.some(item => item.id === 'cargo_tactical_black') ||
          !parsed.some(item => item.id === 'user_tshirt_1') ||
          !parsed.some(item => item.id === 'user_trouser_1') ||
          !parsed.some(item => item.id === 'user_shirt_oxford_blue') ||
          p.images?.some(img => img.includes('photo-1582552938357-40b922a7a496') || img.includes('photo-1517423738875-5ce310acd3da') || img.includes('photo-1479064555552-3ef4979f8908'))
        );
        if (hasOutdated) {
          localStorage.removeItem('boran_products');
          return initialProducts;
        }
        // Filter out removed categories, girls' pants, and clean old Mothkur properties if any remain
        return parsed
          .filter(p => !['Jackets', 'Hoodies', 'Footwear', 'Accessories', 'Co-ord Sets'].includes(p.category))
          .filter(p => !p.name.toLowerCase().includes('blazer'))
          .filter(p => !['real_jeans_folded_jeans_2_3', 'real_jeans_unfolded_purple_jeans'].includes(p.id))
          .map(p => {
            if (p.images) {
              p.images = p.images.map(img => {
                let clean = img.replace('photo-1594633312681-425c7b97ccd1', 'photo-1624378439575-d8705ad7ae80');
                clean = clean.replace('photo-1506630448388-4e683c67ddb0', 'photo-1624378439575-d8705ad7ae80');
                clean = clean.replace('photo-1517423568366-8b83523034fd', 'photo-1624378439575-d8705ad7ae80');
                clean = clean.replace('photo-1620012253295-c05cb1e65d6c', 'photo-1521572267360-ee0c2909d518');
                clean = clean.replace('photo-1602810318383-e386cc2a3ccf', 'photo-1596755094514-f87e34085b2c');
                clean = clean.replace('photo-1621072156002-e2fcc103e86e', 'photo-1596755094514-f87e34085b2c');
                return clean;
              });
            }
            return p;
          });
      }
      return initialProducts;
    } catch (e) {
      console.error('Failed to load products from localStorage, using initial JSON', e);
      return initialProducts;
    }
  });

  // Save products to localStorage when changed
  useEffect(() => {
    localStorage.setItem('boran_products', JSON.stringify(products));
  }, [products]);

  // Helper to reset products to original catalog
  const resetProducts = () => {
    setProductsState(initialProducts);
  };

  // Helper to update, add, or delete product
  const addOrUpdateProduct = (product) => {
    setProductsState((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        // Update
        return prev.map((p) => (p.id === product.id ? { ...p, ...product } : p));
      } else {
        // Add new
        return [
          {
            ...product,
            id: product.id || `local_${Date.now()}`,
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const deleteProduct = (id) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  };

  // 2. Selected Branch State (Bhongir, Jangaon, or Mothkur)
  const [selectedBranch, setSelectedBranchState] = useState(() => {
    const stored = localStorage.getItem('boran_branch');
    return (stored === 'Bhongir' || stored === 'Jangaon' || stored === 'Mothkur') ? stored : 'Bhongir';
  });

  const setSelectedBranch = (branch) => {
    if (branch === 'Bhongir' || branch === 'Jangaon' || branch === 'Mothkur') {
      setSelectedBranchState(branch);
      localStorage.setItem('boran_branch', branch);
    }
  };

  // 3. Customer Session State
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_customer');
      return stored ? JSON.parse(stored) : { email: '', phone: '', role: 'User', loggedIn: false };
    } catch (e) {
      return { email: '', phone: '', role: 'User', loggedIn: false };
    }
  });

  const loginCustomer = useCallback((email, phone = '', role = 'User') => {
    const data = { email, phone, role, loggedIn: true };
    setCustomer(data);
    localStorage.setItem('boran_customer', JSON.stringify(data));
  }, []);

  const logoutCustomer = useCallback(() => {
    const data = { email: '', phone: '', role: 'User', loggedIn: false };
    setCustomer(data);
    localStorage.setItem('boran_customer', JSON.stringify(data));
  }, []);

  // Helper to save checkout inputs
  const saveLastCheckoutDetails = (name, phone, email, address) => {
    const details = { name, phone, email, address };
    localStorage.setItem('boran_last_checkout', JSON.stringify(details));
  };

  const getLastCheckoutDetails = () => {
    try {
      const stored = localStorage.getItem('boran_last_checkout');
      return stored ? JSON.parse(stored) : { name: '', phone: '', email: '', address: '' };
    } catch (e) {
      return { name: '', phone: '', email: '', address: '' };
    }
  };

  // 4. Cart State
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('boran_cart', JSON.stringify(cart));
  }, [cart]);

  // Add Item to Cart
  const addItem = (product, size, color, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product_id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existingIdx !== -1) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const activeVariant = product.variants ? product.variants.find((v) => v.color === color) : null;
        const image = activeVariant ? activeVariant.image : ((product.images && product.images[0]) || '');
        const productName = activeVariant ? `${product.name} - ${color}` : product.name;
        return [
          ...prev,
          {
            product_id: product.id,
            product_name: productName,
            size,
            color,
            quantity,
            price: product.price,
            image,
          },
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeItem = (productId, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product_id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  // Update Item Quantity
  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Computed Values
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 5. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('boran_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  // 5.5 Notifications Feed (Mock)
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_notifications');
      return stored ? JSON.parse(stored) : [
        {
          id: 'initial-setup',
          type: 'info',
          text: 'Boran Trends Admin Panel launched successfully.',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('boran_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (text, type = 'info', metadata = {}) => {
    const newNotif = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      text,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...metadata
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      syncCloudData(orders, updated);
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications((prev) => {
      syncCloudData(orders, []);
      return [];
    });
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notifId ? { ...n, read: true } : n));
      syncCloudData(orders, updated);
      return updated;
    });
  };

  // 6. Orders Tracking Database (Mock & Cloud Synced)
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const fetchCloudData = useCallback(async () => {
    try {
      const response = await fetch('https://api.restful-api.dev/objects/ff8081819d82fab6019f17168930777f');
      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          return {
            orders: Array.isArray(result.data.orders) ? result.data.orders : [],
            notifications: Array.isArray(result.data.notifications) ? result.data.notifications : []
          };
        }
      }
    } catch (e) {
      console.error('Failed to fetch data from cloud KV:', e);
    }
    return null;
  }, []);

  const syncCloudData = async (updatedOrders, updatedNotifications) => {
    try {
      const url = 'https://api.restful-api.dev/objects/ff8081819d82fab6019f17168930777f';
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'BoranTrendsOrders',
          data: {
            orders: updatedOrders,
            notifications: updatedNotifications
          }
        }),
        keepalive: true
      });
    } catch (e) {
      console.error('Failed to sync data to cloud KV:', e);
    }
  };

  useEffect(() => {
    localStorage.setItem('boran_orders', JSON.stringify(orders));
  }, [orders]);

  const mergeOrders = useCallback((localOrders, cloudOrders) => {
    const mergedMap = new Map();
    localOrders.forEach(o => {
      mergedMap.set(o.id, o);
    });
    cloudOrders.forEach(co => {
      if (mergedMap.has(co.id)) {
        const lo = mergedMap.get(co.id);
        const isCloudStatusMoreAdvanced = co.status !== 'Order Placed' && lo.status === 'Order Placed';
        if (isCloudStatusMoreAdvanced || new Date(co.date) > new Date(lo.date)) {
          mergedMap.set(co.id, co);
        }
      } else {
        mergedMap.set(co.id, co);
      }
    });
    return Array.from(mergedMap.values());
  }, []);

  const mergeNotifications = useCallback((localNotifs, cloudNotifs) => {
    const mergedMap = new Map();
    localNotifs.forEach(n => {
      mergedMap.set(n.id, n);
    });
    cloudNotifs.forEach(cn => {
      if (mergedMap.has(cn.id)) {
        const ln = mergedMap.get(cn.id);
        if (cn.read || ln.read) {
          mergedMap.set(cn.id, { ...ln, ...cn, read: true });
        } else {
          mergedMap.set(cn.id, { ...ln, ...cn });
        }
      } else {
        mergedMap.set(cn.id, cn);
      }
    });
    return Array.from(mergedMap.values()).sort((a, b) => b.id.localeCompare(a.id));
  }, []);

  useEffect(() => {
    const syncWithCloud = async () => {
      const cloudData = await fetchCloudData();
      if (!cloudData) return;
      
      const { orders: cloudOrders, notifications: cloudNotifs } = cloudData;
      
      setOrders((currentLocalOrders) => {
        const mergedOrd = mergeOrders(currentLocalOrders, cloudOrders);
        
        setNotifications((currentLocalNotifs) => {
          const mergedNotif = mergeNotifications(currentLocalNotifs, cloudNotifs);
          
          const ordChanged = JSON.stringify(cloudOrders) !== JSON.stringify(mergedOrd);
          const notifChanged = JSON.stringify(cloudNotifs) !== JSON.stringify(mergedNotif);
          if (ordChanged || notifChanged) {
            syncCloudData(mergedOrd, mergedNotif);
          }
          return mergedNotif;
        });
        
        return mergedOrd;
      });
    };
    syncWithCloud();
    const interval = setInterval(syncWithCloud, 10000);
    return () => clearInterval(interval);
  }, [fetchCloudData, mergeOrders, mergeNotifications]);

  const placeMockOrder = (customerName, phone, email, address, locationText = '', itemsToOrder = null) => {
    const orderId = `BT-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = itemsToOrder || [...cart];
    const orderTotal = itemsToOrder
      ? itemsToOrder.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : total;

    const freshOrder = {
      id: orderId,
      items: items,
      total: orderTotal,
      branch: selectedBranch,
      customerName,
      phone,
      email: email || 'Not Provided',
      address,
      locationText,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Order Placed',
      timeline: [
        { label: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString(), completed: true },
        { label: 'Availability Confirmed', time: 'Pending', date: '', completed: false },
        { label: 'Packing & Custom Alterations', time: 'Pending', date: '', completed: false },
        { label: 'Dispatched from Store', time: 'Pending', date: '', completed: false },
        { label: 'Out for Delivery', time: 'Pending', date: '', completed: false },
        { label: 'Delivered', time: 'Pending', date: '', completed: false },
      ],
      paymentMethod: 'WhatsApp Checkout / Cash on Delivery'
    };

    setOrders((prevOrders) => {
      const updatedOrders = [freshOrder, ...prevOrders];
      
      const newNotif = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'order_placed',
        text: `New order ${orderId} placed by ${customerName}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        orderId,
        customerName,
        customerEmail: email || 'Not Provided',
        customerPhone: phone,
        orderTotal,
        paymentMethod: freshOrder.paymentMethod,
        orderDate: freshOrder.date
      };

      setNotifications((prevNotifs) => {
        const updatedNotifs = [newNotif, ...prevNotifs];
        syncCloudData(updatedOrders, updatedNotifs);
        return updatedNotifs;
      });

      return updatedOrders;
    });

    if (!itemsToOrder) {
      clearCart();
    }
    
    return orderId;
  };

  const updateOrderStatus = (orderId, newStatus, timelineLabelToComplete = '') => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        let updatedTimeline = order.timeline || [];
        if (timelineLabelToComplete) {
          updatedTimeline = updatedTimeline.map((step) =>
            step.label === timelineLabelToComplete
              ? {
                  ...step,
                  completed: true,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  date: new Date().toLocaleDateString(),
                }
              : step
          );
        }

        return {
          ...order,
          status: newStatus,
          timeline: updatedTimeline,
        };
      });

      setNotifications((prevNotifs) => {
        const updatedNotifs = prevNotifs.map((n) => {
          if (n.orderId === orderId) {
            return {
              ...n,
              text: `Order ${orderId} status updated to: ${newStatus}`,
              type: newStatus === 'Rejected' || newStatus === 'Cancelled' ? 'order_cancelled' : 'status_updated',
              orderStatus: newStatus
            };
          }
          return n;
        });

        const newNotif = {
          id: `${Date.now()}-${Math.random()}`,
          type: newStatus === 'Rejected' || newStatus === 'Cancelled' ? 'order_cancelled' : 'status_updated',
          text: `Order ${orderId} status updated to: ${newStatus}`,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          orderId
        };
        const finalNotifs = [newNotif, ...updatedNotifs];

        syncCloudData(updatedOrders, finalNotifs);
        return finalNotifs;
      });

      return updatedOrders;
    });
  };

  // 7. Customer Reviews / Feedback State
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('boran_reviews');
      return stored ? JSON.parse(stored) : [
        { name: 'Karthik Reddy', rating: 5, comment: 'Boran Trends has the best baggy jeans! Bhongir store service is amazing.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Anish Goud', rating: 4, comment: 'Very happy with the oversize shirts. Prompt response on WhatsApp.', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'Srinivas Rao', rating: 5, comment: 'Premium collection indeed. High quality stitching at Jangaon.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('boran_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (name, rating, comment) => {
    const newReview = {
      name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString()
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Helper to ensure full URL for product image preview on WhatsApp
  const getImageFullUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const origin = window.location.origin;
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${origin}${path}`;
  };

  // 8. WhatsApp Message Generators
  const generateWhatsAppURL = (customerName, phone, emailAddress, address, locationText = '', orderId = 'BT-MOCK') => {
    const productsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product_name}*
   Color: ${item.color || 'N/A'}
   Size: ${item.size || 'N/A'}
   Quantity: ${item.quantity}
   Price: ₹${(item.price * item.quantity).toLocaleString('en-IN')}
   Link: ${getImageFullUrl(item.image)}`
      )
      .join('\n\n');

    const locationSection = locationText
      ? `\n*Location/Maps Link:*\n${locationText}\n`
      : '';

    const message = `Hello Boran Trends,

I want to place an order. (Order ID: ${orderId})

*Branch:*
${selectedBranch}

*Products:*
${productsList}

*Customer Name:*
${customerName}

*Phone:*
${phone}

*Email:*
${emailAddress}

*Address:*
${address}
${locationSection}
*Total Amount:*
₹${total.toLocaleString('en-IN')}

Please confirm availability.

Thank you.`;

    saveLastCheckoutDetails(customerName, phone, emailAddress, address);

    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  };

  const generateProductWhatsAppURL = (product, size, color, quantity = 1, orderId = 'BT-MOCK') => {
    const saved = getLastCheckoutDetails();
    const customerName = saved.name || 'Not Provided';
    const customerPhone = customer.phone || saved.phone || 'Not Provided';
    const customerEmail = customer.email || saved.email || '';
    const customerLocation = saved.address || '';

    const activeVariant = product.variants ? product.variants.find((v) => v.color === color) : null;
    const imageUrl = activeVariant ? activeVariant.image : ((product.images && product.images[0]) || '');
    const fullImageUrl = getImageFullUrl(imageUrl);

    const colorSection = color ? `\nColor: ${color}` : '';
    const emailSection = customerEmail ? `\nCustomer Email: ${customerEmail}` : '';
    const locationSection = customerLocation ? `\nDelivery Address/Location: ${customerLocation}` : '';

    const message = `Hello Boran Trends,

I want to place an order. (Order ID: ${orderId})

*Product:*
*${product.name}*${colorSection}
Size: ${size}
Quantity: ${quantity}
Price: ₹${(product.price * quantity).toLocaleString('en-IN')}
Branch: ${selectedBranch}
Link: ${fullImageUrl}

*Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}${emailSection}${locationSection}

Please confirm availability.

Thank you.`;

    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts: setProductsState,
        resetProducts,
        addOrUpdateProduct,
        deleteProduct,
        selectedBranch,
        setSelectedBranch,
        customer,
        loginCustomer,
        logoutCustomer,
        getLastCheckoutDetails,
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        placeMockOrder,
        updateOrderStatus,
        notifications,
        clearNotifications,
        markNotificationAsRead,
        reviews,
        addReview,
        generateWhatsAppURL,
        generateProductWhatsAppURL,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
