// services/addressService.js
import axios from 'axios';

const BASE_URL = 'https://api-prod.cadabamsdiagnostics.com/api/v1';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const addressService = {
  async getUserProfile() {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/auth/user-details`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(profileData) {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/auth/update-profile`,
        profileData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async addNewAddress(address) {
    try {
      const currentProfile = await this.getUserProfile();
      const currentAddresses = currentProfile.data.addresses || [];
      
      // If this is the first address or isDefault is true, make it default
      if (currentAddresses.length === 0 || address.isDefault) {
        currentAddresses.forEach(addr => addr.isDefault = false);
      }

      const response = await this.updateUserProfile({
        addresses: [...currentAddresses, address]
      });

      return response;
    } catch (error) {
      console.error('Error adding new address:', error);
      throw error;
    }
  },

  async updateAddress(addressIndex, updatedAddress) {
    try {
      const currentProfile = await this.getUserProfile();
      const currentAddresses = currentProfile.data.addresses || [];

      if (addressIndex < 0 || addressIndex >= currentAddresses.length) {
        throw new Error('Invalid address index');
      }

      if (updatedAddress.isDefault) {
        currentAddresses.forEach(addr => addr.isDefault = false);
      }

      currentAddresses[addressIndex] = {
        ...currentAddresses[addressIndex],
        ...updatedAddress
      };

      const response = await this.updateUserProfile({
        addresses: currentAddresses
      });

      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(addressIndex) {
    try {
      const currentProfile = await this.getUserProfile();
      const currentAddresses = currentProfile.data.addresses || [];

      if (addressIndex < 0 || addressIndex >= currentAddresses.length) {
        throw new Error('Invalid address index');
      }

      const updatedAddresses = currentAddresses.filter((_, index) => index !== addressIndex);

      // If we deleted the default address and there are other addresses,
      // make the first one default
      if (currentAddresses[addressIndex].isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      const response = await this.updateUserProfile({
        addresses: updatedAddresses
      });

      return response;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  validateAddress(address) {
    const errors = {};

    if (!address.label?.trim()) {
      errors.label = 'Label is required';
    }

    if (!address.fullAddress?.trim()) {
      errors.fullAddress = 'Full address is required';
    }

    if (!address.pincode?.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
