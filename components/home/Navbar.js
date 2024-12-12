// Navbar.js
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import {
  FaFlask,
  FaUserMd,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
  FaChevronDown,
  FaClinicMedical,
  FaBlog
} from 'react-icons/fa';
import styles from './Navbar.module.css';
import { 
  BANGALORE_LOCATIONS, 
  RADIOLOGY_OPTIONS,
  getLocationFromPath,
  getLocationAwarePath 
} from '../../config/locations';

// Import AuthModal component
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRadiologyDropdownOpen, setIsRadiologyDropdownOpen] = useState(false);
  const [isCentersDropdownOpen, setIsCentersDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(BANGALORE_LOCATIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useContext(CartContext);

  // Filter centers to only include specific locations
  const centerLocations = BANGALORE_LOCATIONS.filter(location => 
    ['indiranagar', 'banashankari', 'jayanagar'].includes(location.value)
  );

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setIsRadiologyDropdownOpen(false);
      setIsCentersDropdownOpen(false);
      setShowResults(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  useEffect(() => {
    const currentLocation = getLocationFromPath(router.asPath);
    setSelectedLocation(currentLocation);
  }, [router.asPath]);

  const handleLocationChange = (e) => {
    const newLocation = BANGALORE_LOCATIONS.find(loc => loc.value === e.target.value);
    setSelectedLocation(newLocation);
    const currentPath = router.asPath.split('/');
    if (currentPath.length > 2) {
      const pathType = currentPath[currentPath.length - 1];
      if (RADIOLOGY_OPTIONS.some(opt => opt.path === `/${pathType}`)) {
        router.push(`/bangalore/${newLocation.value}/${pathType}`);
      } else {
        router.push(newLocation.path);
      }
    } else {
      router.push(newLocation.path);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/user/search/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testName: searchQuery })
      });
      
      if (response.ok) {
        const data = await response.json();
        const transformedResults = data.map(test => ({
          name: test.testName || test.name,
          route: test.route,
          isLabTest: test.templateName === 'labtest',
          price: test.price
        }));
        setSearchResults(transformedResults);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    const baseUrl = '/bangalore';
    const routePrefix = result.isLabTest ? 'lab-test' : 'xray-scan';
    const fullRoute = `${baseUrl}/${routePrefix}${result.route}`;
    router.push(fullRoute);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchInputWrapper}`)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logo}>
              <Image
                src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1728018316689-966136917.png"
                alt="Logo"
                width={120}
                height={48}
                priority
              />
            </Link>

            <div className={styles.locationDropdownWrapper}>
              <div className={styles.locationDropdown}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <select
                  value={selectedLocation.value}
                  onChange={handleLocationChange}
                  className={styles.locationSelect}
                >
                  {BANGALORE_LOCATIONS.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.dropdownArrow} />
              </div>
            </div>

            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className={styles.centerSection}>
            <div className={styles.searchForm}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search tests or scans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                
                {showResults && (
                  <div className={styles.searchDropdownContainer}>
                    <div className={styles.searchDropdown}>
                      {isLoading ? (
                        <div className={styles.loadingText}>Searching...</div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <div 
                            key={index}
                            className={styles.searchResult}
                            onClick={() => handleResultClick(result)}
                          >
                            <div className={styles.resultContent}>
                              <div className={styles.resultName}>{result.name}</div>
                              {result.price && (
                                <div className={styles.resultPrice}>₹{result.price}</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.loadingText}>No results found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ''}`}>
              <Link 
                href={getLocationAwarePath('/lab-test', selectedLocation)} 
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaFlask />
                <span>Lab Tests</span>
              </Link>

              <div className={styles.dropdownContainer}>
                <button
                  className={`${styles.navLink} ${isRadiologyDropdownOpen ? styles.active : ''}`}
                  onClick={() => {
                    setIsRadiologyDropdownOpen(!isRadiologyDropdownOpen);
                    setIsCentersDropdownOpen(false);
                  }}
                >
                  <FaUserMd />
                  <span>Radiology</span>
                  <FaChevronDown className={`${styles.dropdownArrow} ${isRadiologyDropdownOpen ? styles.rotated : ''}`} />
                </button>
                
                <div className={`${styles.dropdownContent} ${isRadiologyDropdownOpen ? styles.visible : ''}`}>
                  {RADIOLOGY_OPTIONS.map((option) => (
                    <Link
                      key={option.path}
                      href={getLocationAwarePath(option.path, selectedLocation)}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setIsRadiologyDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.dropdownContainer}>
                <button
                  className={`${styles.navLink} ${isCentersDropdownOpen ? styles.active : ''}`}
                  onClick={() => {
                    setIsCentersDropdownOpen(!isCentersDropdownOpen);
                    setIsRadiologyDropdownOpen(false);
                  }}
                >
                  <FaClinicMedical />
                  <span>Centers</span>
                  <FaChevronDown className={`${styles.dropdownArrow} ${isCentersDropdownOpen ? styles.rotated : ''}`} />
                </button>
                
                <div className={`${styles.dropdownContent} ${isCentersDropdownOpen ? styles.visible : ''}`}>
                  {centerLocations.map((location) => (
                    <Link
                      key={location.path}
                      href={`/bangalore/center/${location.value}`}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setIsCentersDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/blogs" 
                className={styles.navLink} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBlog />
                <span>Blogs</span>
              </Link>

              <Link 
                href="/cart" 
                className={styles.navLink} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={styles.cartWrapper}>
                  <FaShoppingCart />
                  {cart.length > 0 && (
                    <span className={styles.cartCount}>{cart.length}</span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              <button 
                onClick={handleAuthAction} 
                className={styles.navLink}
              >
                {isAuthenticated ? (
                  <>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Login</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add AuthModal component */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}