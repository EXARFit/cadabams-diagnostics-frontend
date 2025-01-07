// hooks/useAnalytics.js
import { useCallback } from 'react';

export const useAnalytics = () => {
  const pushEvent = useCallback((eventName, eventData) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ ecommerce: null }); // Clear previous object
      window.dataLayer.push({
        event: eventName,
        ecommerce: eventData
      });
    }
  }, []);

  const createItemData = useCallback((test) => ({
    item_id: test._id || test.id,
    item_name: test.testName,
    affiliation: 'Cadabams Diagnostics',
    coupon: test.couponCode || '',
    discount: test.alldata?.[0]?.basic_info?.discount || 0,
    index: test.index,
    item_brand: 'Cadabams Diagnostics',
    item_category: test.alldata?.[0]?.basic_info?.category || 'Lab Tests',
    item_category2: test.alldata?.[0]?.basic_info?.subcategory || '',
    price: test.alldata?.[0]?.basic_info?.price || 0,
    quantity: test.quantity || 1
  }), []);

  const viewItem = useCallback((test) => {
    pushEvent('view_item', {
      currency: 'INR',
      value: test.alldata?.[0]?.basic_info?.price || 0,
      items: [createItemData(test)]
    });
  }, [createItemData, pushEvent]);

  const viewItemList = useCallback((items, listName = 'Test List') => {
    pushEvent('view_item_list', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: items.map((item, index) => ({
        ...createItemData(item),
        index
      }))
    });
  }, [createItemData, pushEvent]);

  const selectItem = useCallback((item, index, listName = 'Test List') => {
    pushEvent('select_item', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: [{
        ...createItemData(item),
        index
      }]
    });
  }, [createItemData, pushEvent]);

  const addToCart = useCallback((test, quantity = 1) => {
    pushEvent('add_to_cart', {
      currency: 'INR',
      value: (test.alldata?.[0]?.basic_info?.price || 0) * quantity,
      items: [{
        ...createItemData(test),
        quantity
      }]
    });
  }, [createItemData, pushEvent]);

  const removeFromCart = useCallback((test, quantity = 1) => {
    pushEvent('remove_from_cart', {
      currency: 'INR',
      value: (test.alldata?.[0]?.basic_info?.price || 0) * quantity,
      items: [{
        ...createItemData(test),
        quantity
      }]
    });
  }, [createItemData, pushEvent]);

  const viewCart = useCallback((items, value) => {
    pushEvent('view_cart', {
      currency: 'INR',
      value: value,
      items: items.map(createItemData)
    });
  }, [createItemData, pushEvent]);

  const beginCheckout = useCallback((items, value) => {
    pushEvent('begin_checkout', {
      currency: 'INR',
      value: value,
      items: items.map(createItemData)
    });
  }, [createItemData, pushEvent]);

  const addShippingInfo = useCallback((items, value, shippingInfo) => {
    pushEvent('add_shipping_info', {
      currency: 'INR',
      value: value,
      shipping_tier: 'Home Collection',
      items: items.map(createItemData)
    });
  }, [createItemData, pushEvent]);

  const addPaymentInfo = useCallback((items, value, paymentType) => {
    pushEvent('add_payment_info', {
      currency: 'INR',
      value: value,
      payment_type: paymentType,
      items: items.map(createItemData)
    });
  }, [createItemData, pushEvent]);

  let purchaseTracked = false;
  const purchase = useCallback((transactionData) => {
    if (purchaseTracked) return;
    
    pushEvent('purchase', {
      transaction_id: transactionData.id,
      value: transactionData.value,
      tax: transactionData.tax || 0,
      shipping: transactionData.shipping || 0,
      currency: 'INR',
      items: transactionData.items.map(createItemData)
    });
    
    purchaseTracked = true;
  }, [createItemData, pushEvent]);

  return {
    viewItem,
    viewItemList,
    selectItem,
    addToCart,
    removeFromCart,
    viewCart,
    beginCheckout,
    addShippingInfo,
    addPaymentInfo,
    purchase
  };
};