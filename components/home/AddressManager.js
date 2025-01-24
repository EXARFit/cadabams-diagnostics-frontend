// components/AddressManager.js
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { addressService } from './addressService';
import styles from '../../styles/AddressManager.module.css';

const AddressForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    label: '',
    fullAddress: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = addressService.validateAddress(formData);
    if (validation.isValid) {
      onSubmit(formData);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addressForm}>
      <div className={styles.formHeader}>
        <h3>{initialData ? 'Edit Address' : 'Add New Address'}</h3>
        <button type="button" onClick={onCancel} className={styles.closeButton}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.formBody}>
        <div className={styles.formGroup}>
          <label>Label*</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Home, Office, etc."
            className={errors.label ? styles.error : ''}
          />
          {errors.label && <span className={styles.errorText}>{errors.label}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Full Address*</label>
          <textarea
            value={formData.fullAddress}
            onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
            placeholder="Enter complete address"
            className={errors.fullAddress ? styles.error : ''}
          />
          {errors.fullAddress && <span className={styles.errorText}>{errors.fullAddress}</span>}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Street</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="Street name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City name"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="State name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Pincode*</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="6-digit pincode"
              maxLength="6"
              className={errors.pincode ? styles.error : ''}
            />
            {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            Set as default address
          </label>
        </div>
      </div>

      <div className={styles.formFooter}>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const AddressCard = ({
  address,
  index,
  selected,
  onSelect,
  onEdit,
  onDelete,
  selectable = true
}) => (
  <div
    className={`${styles.addressCard} ${selected ? styles.selected : ''} ${
      address.isDefault ? styles.default : ''
    }`}
    onClick={() => selectable && onSelect && onSelect(address, index)}
  >
    <div className={styles.addressHeader}>
      <div className={styles.addressLabel}>
        <MapPin size={16} />
        <span>{address.label}</span>
        {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
      </div>
      {selectable && (
        <div className={styles.addressActions}>
          <button onClick={(e) => {
            e.stopPropagation();
            onEdit(address, index);
          }}>
            <Edit2 size={16} />
          </button>
          <button onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this address?')) {
              onDelete(index);
            }
          }}>
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
    <div className={styles.addressContent}>
      <p className={styles.fullAddress}>{address.fullAddress}</p>
      <p className={styles.addressDetails}>
        {[address.street, address.city, address.state, address.pincode]
          .filter(Boolean)
          .join(', ')}
      </p>
    </div>
    {selectable && selected && (
      <div className={styles.selectedCheck}>
        <Check size={16} />
      </div>
    )}
  </div>
);

export const AddressManager = ({
  selectedAddress = null,
  onAddressSelect = null,
  editable = true,
  className = ''
}) => {
  const { user, updateUserProfile } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
    setLoading(false);
  }, [user]);

  const handleAddAddress = async (addressData) => {
    try {
      setLoading(true);
      const result = await addressService.addNewAddress(addressData);
      if (result.success) {
        await updateUserProfile(result.data);
        setShowForm(false);
        setError('');
      }
    } catch (err) {
      setError('Failed to add address. Please try again.');
      console.error('Error adding address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressData) => {
    if (editingIndex === null) return;

    try {
      setLoading(true);
      const result = await addressService.updateAddress(editingIndex, addressData);
      if (result.success) {
        await updateUserProfile(result.data);
        setEditingAddress(null);
        setEditingIndex(null);
        setError('');
      }
    } catch (err) {
      setError('Failed to update address. Please try again.');
      console.error('Error updating address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      setLoading(true);
      const result = await addressService.deleteAddress(index);
      if (result.success) {
        await updateUserProfile(result.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to delete address. Please try again.');
      console.error('Error deleting address:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address, index) => {
    setEditingAddress(address);
    setEditingIndex(index);
  };

  if (loading && !addresses.length) {
    return <div className={styles.loading}>Loading addresses...</div>;
  }

  return (
    <div className={`${styles.addressManager} ${className}`}>
      {error && <div className={styles.error}>{error}</div>}

      {editable && !showForm && !editingAddress && (
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Add New Address
        </button>
      )}

      {(showForm || editingAddress) && (
        <AddressForm
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
            setEditingIndex(null);
          }}
          initialData={editingAddress}
          loading={loading}
        />
      )}

      <div className={styles.addressGrid}>
        {addresses.map((address, index) => (
          <AddressCard
            key={index}
            address={address}
            index={index}
            selected={selectedAddress ? 
              (selectedAddress.fullAddress === address.fullAddress && 
               selectedAddress.pincode === address.pincode) : false}
            onSelect={onAddressSelect}
            onEdit={handleEdit}
            onDelete={handleDeleteAddress}
            selectable={editable}
          />
        ))}
      </div>

      {!addresses.length && !showForm && (
        <div className={styles.emptyState}>
          <MapPin size={24} />
          <p>No addresses saved yet</p>
          {editable && (
            <button onClick={() => setShowForm(true)} className={styles.addButton}>
              Add New Address
            </button>
          )}
        </div>
      )}
    </div>
  );
};