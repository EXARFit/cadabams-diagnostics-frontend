// hooks/useAnalytics.js
import { useCallback } from 'react';

export const useAnalytics = () => {
  const createItemData = useCallback((test, index = 0) => {
    const basicInfo = test?.alldata?.[0]?.basic_info || test?.basicInfo || {};
    return {
      item_id: test._id || test.id || basicInfo?.route,
      item_name: test.testName || basicInfo?.name || test?.title,
      affiliation: "Cadabam's Diagnostics",
      coupon: test.couponCode || '',
      discount: basicInfo?.discount || 0,
      index,
      item_brand: "Cadabam's Diagnostics",
      item_category: basicInfo?.category || test?.templateName || 'Lab Tests',
      item_category2: basicInfo?.subcategory || '',
      price: basicInfo?.price || 0,
      quantity: test.quantity || 1
    };
  }, []);

  const pushEvent = useCallback((eventName, eventData) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: eventName,
        ecommerce: {
          currency: 'INR',
          ...eventData
        }
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('GTM Event:', eventName, eventData);
      }
    }
  }, []);

  const trackViewItemList = useCallback((items, listName = 'Test List') => {
    if (!items?.length) return;

    pushEvent('view_item_list', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: items.map((item, index) => createItemData(item, index))
    });
  }, [createItemData, pushEvent]);

  const trackViewItem = useCallback((test) => {
    if (!test) return;

    pushEvent('view_item', {
      value: test.alldata?.[0]?.basic_info?.price || 0,
      items: [createItemData(test)]
    });
  }, [createItemData, pushEvent]);

  const trackSelectItem = useCallback((test, listName = 'Test List', index = 0) => {
    if (!test) return;

    pushEvent('select_item', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: [createItemData(test, index)]
    });
  }, [createItemData, pushEvent]);

  const trackAddToCart = useCallback((test, quantity = 1, listName = '') => {
    if (!test) return;

    const itemData = createItemData(test);
    pushEvent('add_to_cart', {
      value: (itemData.price * quantity),
      ...(listName && {
        item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
        item_list_name: listName,
      }),
      items: [{
        ...itemData,
        quantity
      }]
    });
  }, [createItemData, pushEvent]);

  const trackRemoveFromCart = useCallback((test, quantity = 1) => {
    if (!test) return;

    const itemData = createItemData(test);
    pushEvent('remove_from_cart', {
      value: (itemData.price * quantity),
      items: [{
        ...itemData,
        quantity
      }]
    });
  }, [createItemData, pushEvent]);

  const trackViewCart = useCallback((items, value) => {
    if (!items?.length) return;

    pushEvent('view_cart', {
      value,
      items: items.map((item, index) => createItemData(item, index))
    });
  }, [createItemData, pushEvent]);

  const trackBeginCheckout = useCallback((items, value) => {
    if (!items?.length) return;

    pushEvent('begin_checkout', {
      value,
      items: items.map((item, index) => createItemData(item, index))
    });
  }, [createItemData, pushEvent]);

  const trackAddShippingInfo = useCallback((items, value, shippingTier = 'Home Collection') => {
    if (!items?.length) return;

    pushEvent('add_shipping_info', {
      value,
      shipping_tier: shippingTier,
      items: items.map((item, index) => createItemData(item, index))
    });
  }, [createItemData, pushEvent]);

  const trackAddPaymentInfo = useCallback((items, value, paymentType) => {
    if (!items?.length) return;

    pushEvent('add_payment_info', {
      value,
      payment_type: paymentType,
      items: items.map((item, index) => createItemData(item, index))
    });
  }, [createItemData, pushEvent]);

  let purchaseTracked = false;
  const trackPurchase = useCallback((transactionData) => {
    if (purchaseTracked || !transactionData?.items?.length) return;

    pushEvent('purchase', {
      transaction_id: transactionData.id || `TR-${Date.now()}`,
      value: transactionData.value,
      tax: transactionData.tax || 0,
      shipping: transactionData.shipping || 0,
      items: transactionData.items.map((item, index) => createItemData(item, index))
    });

    purchaseTracked = true;
  }, [createItemData, pushEvent]);

  return {
    trackViewItemList,
    trackViewItem,
    trackSelectItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackPurchase
  };
};

export default useAnalytics;