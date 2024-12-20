import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { CreditCard, User, Mail, Phone, MapPin, Crosshair, Home, Hospital, Calendar, Smartphone } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import TimeSlotSelector from './TimeSlotSelector';
import styles from '../../styles/Checkout.module.css';
import AuthModal from './AuthModal';
import ThankYouModal from './ThankYouModal';
import axios from 'axios';

// API Configuration
const BASE_URL = 'https://cadabamsapi.exar.ai/api/v1';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDt543BUtXayBsSltJ5N4b62QC-FrRIuO8';

// Form validation helpers
const validateMobile = (mobile) => {
  const cleanMobile = mobile.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleanMobile);
};

const validateAge = (age) => {
  return /^\d+\s+Years$/i.test(age);
};

const formatMobile = (mobile) => {
  return mobile.replace(/\D/g, '');
};

// Date formatting helper for IST
const formatToIST = (date) => {
  // Create a new date object
  const istDate = new Date(date);
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = new Date(istDate.getTime() + istOffset);
  
  // Format as required by the API: "YYYY-MM-DDTHH:mm:ssZ+05:30"
  return istTime.toISOString().replace('.000Z', '') + '+05:30';
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

const libraries = ['places'];

const clinicLocations = [
  {
    id: 1,
    name: "Cadabam's Diagnostics Centre - Banashankari",
    address: 'No. 1/A, Bhavani HBCS, near Devegowda petrol Bunk, 1st Block, Banashankari 3rd Stage, Bengaluru, Karnataka 560070',
    coordinates: {
      lat: 12.9277,
      lng: 77.5476
    }
  },
  {
    id: 2,
    name: 'Cadabams Megsan Diagnostics - Indiranagar',
    address: '725, Chinmaya Mission Hospital Rd, near CHINMAYA MISSION HOSPITAL, Indira Nagar 1st Stage, Defence Colony, Indiranagar, Bengaluru, Karnataka 560038',
    coordinates: {
      lat: 12.9784,
      lng: 77.6408
    }
  }
];

export default function Checkout() {
  // Authentication and routing setup
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();

  // Form processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [labPatientId] = useState(`LAB${Date.now()}`);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Appointment states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    const itemPrice = parseFloat(item.discountedPrice) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return total + (itemPrice * quantity);
  }, 0);

  // Cart type checks
  const hasLabTests = cart.some(item => item.templateName === 'labtest');
  const hasNonLabTests = cart.some(item => item.templateName === 'non-labtest');

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    age: '',
    gender: 'Male',
    designation: 'MR.',
    pincode: '',
    city: 'Bangalore',
    area: '',
    dob: '',
    patientType: 'patient'
  });

  // Map and location states
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);
  const [collectionMethod, setCollectionMethod] = useState(() => {
    if (hasNonLabTests && !hasLabTests) return 'clinic';
    return 'home';
  });
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);

  // Time slot selection handler
  const handleSlotSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // Enhanced input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = null;

    switch (name) {
      case 'phone':
        newValue = formatMobile(value);
        if (newValue && !validateMobile(newValue)) {
          error = 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'age':
        if (value && !value.toLowerCase().endsWith('years')) {
          newValue = `${value.replace(/\s*years\s*$/i, '')} Years`;
        }
        if (newValue && !validateAge(newValue)) {
          error = 'Age must be in format "X Years"';
        }
        break;
      case 'dob':
        const dobDate = new Date(value);
        const today = new Date();
        if (dobDate > today) {
          error = 'Date of Birth cannot be in the future';
        }
        break;
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setUserDetails(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'gender' ? { designation: value === 'Female' ? 'MS.' : 'MR.' } : {})
    }));
  };

  // Age-DOB sync helper
  const calculateAgeFromDOB = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    return `${age} Years`;
  };

  // Effect to sync age when DOB changes
  useEffect(() => {
    if (userDetails.dob) {
      const calculatedAge = calculateAgeFromDOB(userDetails.dob);
      setUserDetails(prev => ({
        ...prev,
        age: calculatedAge
      }));
    }
  }, [userDetails.dob]);

  // Map interaction handlers
  const handleMapClick = useCallback((e) => {
    if (collectionMethod === 'home') {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setSelectedLocation(newLocation);
      updateAddress(newLocation);
    }
  }, [collectionMethod]);

  const updateAddress = useCallback((location) => {
    if (map) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const addressComponents = results[0].address_components;
          const area = addressComponents.find(c => c.types.includes('sublocality'))?.long_name || '';
          const pincode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
          
          setUserDetails(prev => ({
            ...prev,
            address: results[0].formatted_address,
            area: area,
            pincode: pincode
          }));
        }
      });
    }
  }, [map]);

  const handleGetUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(userLocation);
          updateAddress(userLocation);
          map?.panTo(userLocation);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your address manually.');
    }
  }, [map, updateAddress]);

  // Map loading handlers
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onSearchBoxLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setSelectedLocation(newLocation);
      setUserDetails(prev => ({
        ...prev,
        address: place.formatted_address,
        area: place.address_components.find(c => c.types.includes('sublocality'))?.long_name || '',
        pincode: place.address_components.find(c => c.types.includes('postal_code'))?.long_name || ''
      }));
      map?.panTo(newLocation);
    }
  }, [map]);

  const handleCollectionMethodChange = (method) => {
    setCollectionMethod(method);
    setSelectedClinic(null);
    if (method === 'clinic') {
      setMapMarkers(clinicLocations.map(clinic => ({
        position: clinic.coordinates,
        title: clinic.name
      })));
      map?.setCenter(defaultCenter);
      map?.setZoom(11);
    } else {
      setMapMarkers([]);
    }
  };

  const handleClinicSelection = (clinic) => {
    setSelectedClinic(clinic);
    setUserDetails(prev => ({
      ...prev,
      address: clinic.address,
      area: clinic.area || '',
      pincode: clinic.pincode || ''
    }));
    if (map) {
      map.panTo(clinic.coordinates);
      map.setZoom(15);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!userDetails.name) {
      errors.name = 'Name is required';
    }

    if (!validateMobile(userDetails.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!userDetails.email) {
      errors.email = 'Email is required';
    }

    if (!validateAge(userDetails.age)) {
      errors.age = 'Age must be in format "X Years"';
    }

    if (!userDetails.dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const dobDate = new Date(userDetails.dob);
      const today = new Date();
      if (dobDate > today) {
        errors.dob = 'Date of Birth cannot be in the future';
      }
    }

    if (!userDetails.pincode) {
      errors.pincode = 'Pincode is required';
    }

    if (collectionMethod === 'home' && !userDetails.address) {
      errors.address = 'Address is required for home collection';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Payment handler with updated logic
  const handlePayment = async (appointmentData) => {
    try {
      let updatedAppointmentData = {
        ...appointmentData,
        billDetails: {
          ...appointmentData.billDetails,
          totalAmount: paymentMethod === 'phonePe' ? appointmentData.billDetails.totalAmount : "0",
          advance: paymentMethod === 'phonePe' ? appointmentData.billDetails.totalAmount : "0",
          paymentType: paymentMethod === 'cash' ? 'Cash' : 'Online',
          paymentList: [{
            paymentType: paymentMethod === 'cash' ? 'Cash' : 'Online',
            paymentAmount: paymentMethod === 'phonePe' ? appointmentData.billDetails.totalAmount : "0",
            issueBank: ""
          }]
        }
      };

      if (paymentMethod === 'cash') {
        const response = await axios.post(`${BASE_URL}/crelio/appointment`, updatedAppointmentData);
        clearCart();
        return response.data;
      } else {
        const payload = {
          appointmentData: updatedAppointmentData,
          appointmentType: collectionMethod === 'home' ? 'home' : 'lab'
        };
        
        const response = await axios.post(`${BASE_URL}/payment/initialize`, payload);
        
        if (response.data?.data?.paymentUrl) {
          clearCart();
          window.location.href = response.data.data.paymentUrl;
          return null;
        }
        
        return response.data;
      }
    } catch (error) {
      console.error('Payment error:', error);
      throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please correct the errors in the form before proceeding.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select an appointment date and time');
      return;
    }
    
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Convert selected time to Date object
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(`${selectedDate}T${selectedTime}`);
      
      // Create UTC dates for start and end times
      const utcDate = new Date(Date.UTC(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
        parseInt(hours),
        parseInt(minutes)
      ));
      
      const endAppointmentDate = new Date(utcDate.getTime() + 60 * 60 * 1000); // Add 1 hour

      // Format all dates in IST
      const startDateTime = formatToIST(utcDate);
      const endDateTime = formatToIST(endAppointmentDate);
      const billDateTime = formatToIST(new Date()); // Current time in IST
      
      const testList = cart.map(item => ({
        testID: item.basicInfo.testId || "",
        testCode: "",
        integrationCode: "",
        dictionaryId: ""
      }));

      const appointmentData = {
        countryCode: "91",
        mobile: formatMobile(userDetails.phone),
        email: userDetails.email,
        designation: userDetails.designation,
        fullName: userDetails.name,
        "Patient Name": userDetails.name,
        firstName: userDetails.name.split(' ')[0],
        middleName: "",
        lastName: userDetails.name.split(' ').slice(1).join(' ') || ".",
        age: parseInt(userDetails.age),
        gender: userDetails.gender,
        area: userDetails.area,
        city: userDetails.city,
        patientType: "IP",
        labPatientId: labPatientId,
        pincode: userDetails.pincode,
        patientId: "",
        dob: userDetails.dob,
        passportNo: "",
        panNumber: "",
        aadharNumber: "",
        insuranceNo: "",
        nationality: "Indian",
        ethnicity: "",
        nationalIdentityNumber: "",
        workerCode: "",
        doctorCode: "",
        areaOfResidence: userDetails.area,
        state: "Karnataka",
        isAppointmentRequest: 1,
        startDate: startDateTime,
        endDate: endDateTime,
        sampleCollectionDate: startDateTime,
        billDetails: {
          emergencyFlag: "0",
          totalAmount: totalPrice.toString(),
          advance: "0",
          billConcession: "0",
          additionalAmount: "0",
          billDate: billDateTime,
          paymentType: paymentMethod === 'cash' ? 'Cash' : 'Online',
          referralName: "Self",
          otherReferral: "",
          sampleId: `SP${Date.now()}`,
          orderNumber: `ORD${Date.now()}`,
          referralIdLH: "",
          organisationName: "",
          organizationIdLH: "598387",
          comments: "New Patient Registration",
          testList: testList,
          paymentList: [{
            paymentType: paymentMethod === 'cash' ? 'Cash' : 'Online',
            paymentAmount: totalPrice.toString(),
            issueBank: ""
          }]
        }
      };

      if (collectionMethod === 'home') {
        appointmentData.isHomecollection = 1;
        appointmentData.homeCollectionDateTime = startDateTime;
        appointmentData.address = userDetails.address;
      }

      const paymentResponse = await handlePayment(appointmentData);

      if (paymentMethod === 'phonePe' && !paymentResponse) {
        return;
      }

      if (paymentResponse?.data?.code === 200) {
        setBookingDetails({
          patientId: paymentResponse.data.patientId,
          billId: paymentResponse.data.billId,
          appointmentId: paymentResponse.data.appointmentId
        });
        setIsThankYouModalOpen(true);
      } else {
        router.push({
          pathname: '/payment',
          query: {
            orderId: paymentResponse.data.billId,
            patientId: paymentResponse.data.patientId,
            paymentMethod
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'There was an error processing your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Checkout</h1>
      <div className={styles.checkoutContent}>
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          {/* Personal Details Section */}
          <div className={styles.formSection}>
            <h2>Personal Details</h2>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                <User size={18} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
                className={`${styles.whiteInput} ${formErrors.name ? styles.error : ''}`}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <span className={styles.errorMessage}>{formErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                required
                className={`${styles.whiteInput} ${formErrors.email ? styles.error : ''}`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <span className={styles.errorMessage}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                <Phone size={18} />
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
                className={`${styles.whiteInput} ${formErrors.phone ? styles.error : ''}`}
                placeholder="10-digit mobile number"
                maxLength="10"
              />
              {formErrors.phone && (
                <span className={styles.errorMessage}>{formErrors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dob">
                <Calendar size={18} />
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userDetails.dob}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className={`${styles.whiteInput} ${formErrors.dob ? styles.error : ''}`}
              />
              {formErrors.dob && (
                <span className={styles.errorMessage}>{formErrors.dob}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="age">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                value={userDetails.age}
                onChange={handleInputChange}
                required
                className={`${styles.whiteInput} ${formErrors.age ? styles.error : ''}`}
                placeholder="e.g., 49 Years"
                readOnly
              />
              {formErrors.age && (
                <span className={styles.errorMessage}>{formErrors.age}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                name="gender"
                value={userDetails.gender}
                onChange={handleInputChange}
                className={styles.whiteInput}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={userDetails.pincode}
                onChange={handleInputChange}
                className={`${styles.whiteInput} ${formErrors.pincode ? styles.error : ''}`}
                placeholder="Enter pincode"
                required
              />
              {formErrors.pincode && (
                <span className={styles.errorMessage}>{formErrors.pincode}</span>
              )}
            </div>
          </div>

          {/* Collection Method Section */}
          <div className={styles.formSection}>
            <h2>Collection Method</h2>
            <div className={styles.collectionMethodContainer}>
              {(hasLabTests || !hasNonLabTests) && (
                <button
                  type="button"
                  className={`${styles.collectionMethodButton} ${collectionMethod === 'home' ? styles.active : ''}`}
                  onClick={() => handleCollectionMethodChange('home')}
                >
                  <Home size={18} />
                  Home Collection
                </button>
              )}
              <button
                type="button"
                className={`${styles.collectionMethodButton} ${collectionMethod === 'clinic' ? styles.active : ''}`}
                onClick={() => handleCollectionMethodChange('clinic')}
              >
                <Hospital size={18} />
                Visit Clinic
              </button>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className={styles.formSection}>
            <h2>Payment Method</h2>
            <div className={styles.paymentMethodContainer}>
              <button
                type="button"
                className={`${styles.paymentMethodButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <CreditCard size={18} />
                Cash Payment
              </button>
              <button
                type="button"
                className={`${styles.paymentMethodButton} ${paymentMethod === 'phonePe' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('phonePe')}
              >
                <Smartphone size={18} />
                Pay with PhonePe
              </button>
            </div>
          </div>

          {/* Appointment Time Selection */}
          <div className={styles.formSection}>
            <h2>Appointment Time</h2>
            <TimeSlotSelector
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>

          {/* Location Details - Conditional Rendering */}
          {collectionMethod === 'home' ? (
            <div className={styles.formSection}>
              <h2>Home Collection Details</h2>
              <div className={styles.formGroup}>
                <label htmlFor="address">
                  <MapPin size={18} />
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  required
                  className={`${styles.whiteInput} ${formErrors.address ? styles.error : ''}`}
                  placeholder="Enter your complete address for home collection"
                />
                {formErrors.address && (
                  <span className={styles.errorMessage}>{formErrors.address}</span>
                )}
              </div>

              <div className={styles.mapContainer}>
                <LoadScript 
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <StandaloneSearchBox
                    onLoad={onSearchBoxLoad}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for your address"
                      className={styles.searchBox}
                    />
                  </StandaloneSearchBox>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedLocation}
                    zoom={14}
                    onClick={handleMapClick}
                    onLoad={onLoad}
                  >
                    <Marker position={selectedLocation} />
                  </GoogleMap>
                  <button 
                    type="button" 
                    onClick={handleGetUserLocation} 
                    className={styles.locationButton}
                  >
                    <Crosshair size={18} />
                    Use My Location
                  </button>
                </LoadScript>
              </div>
            </div>
          ) : (
            <div className={styles.formSection}>
              <h2>Select Clinic</h2>
              <div className={styles.clinicList}>
                {clinicLocations.map(clinic => (
                  <button
                    key={clinic.id}
                    type="button"
                    className={`${styles.clinicButton} ${selectedClinic?.id === clinic.id ? styles.active : ''}`}
                    onClick={() => handleClinicSelection(clinic)}
                  >
                    <strong>{clinic.name}</strong>
                    <span>{clinic.address}</span>
                  </button>
                ))}
              </div>
              <div className={styles.mapContainer}>
                <LoadScript 
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={selectedClinic?.coordinates || defaultCenter}
                    zoom={11}
                    onLoad={onLoad}
                  >
                    {mapMarkers.map((marker, index) => (
                      <Marker
                        key={index}
                        position={marker.position}
                        title={marker.title}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.checkoutButton}
            disabled={isProcessing}
          >
            <CreditCard size={18} />
            {isProcessing ? 'Processing...' : `Proceed to Payment (₹${totalPrice.toFixed(2)})`}
          </button>
        </form>

        {/* Order Summary Section */}
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <div className={styles.orderItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemType}>
                    {item.templateName === 'labtest' ? 'Lab Test' : 'Center Visit Only'}
                  </span>
                </div>
                <span className={styles.itemPrice}>
                  ₹{parseFloat(item.discountedPrice).toFixed(2)} x {item.quantity || 1}
                </span>
              </div>
            ))}
          </div>
                      <div className={styles.orderTotal}>
              <strong>Total:</strong>
              <strong>₹{totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        
        {/* Thank You Modal */}
        <ThankYouModal 
          isOpen={isThankYouModalOpen} 
          onClose={() => {
            setIsThankYouModalOpen(false);
            router.push('/');  // Redirect to home page when modal is closed
          }}
          bookingDetails={bookingDetails}
        />
      </div>
   
  );
}