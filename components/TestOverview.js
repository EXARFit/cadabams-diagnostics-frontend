// TestOverview.js
import React, { useEffect, useRef, useContext, useState } from 'react';
import { Users, ChevronRight, Info, Check } from 'lucide-react';
import { CartContext } from '@/contexts/CartContext';
import styles from './TestOverview.module.css';

const TestOverview = ({ basicInfo, templateName }) => {
  const leftBallRef = useRef(null);
  const rightBallRef = useRef(null);
  const { cart, addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const isInCart = cart?.some(item => item.route === basicInfo.route);
    setIsAdded(isInCart);
  }, [cart, basicInfo.route]);

  useEffect(() => {
    const animateBall = (ballRef, direction) => {
      let position = 0;
      let animationFrameId;

      const animate = () => {
        position += direction;
        if (position > 100 || position < 0) direction *= -1;
        if (ballRef.current) {
          ballRef.current.style.transform = `translateY(${position}px)`;
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };

    const leftCleanup = animateBall(leftBallRef, 1);
    const rightCleanup = animateBall(rightBallRef, -1);

    return () => {
      leftCleanup();
      rightCleanup();
    };
  }, []);

  const handleAddToCart = () => {
    const cartItem = {
      route: basicInfo.route,
      title: basicInfo.name,
      discountedPrice: basicInfo.discountedPrice,
      price: basicInfo.price,
      quantity: 1,
      templateName: templateName || 'labtest',
      basicInfo // Store complete basicInfo for future reference
    };
    addToCart(cartItem);
    setIsAdded(true);
  };

  const showDiscount = basicInfo.price !== basicInfo.discountedPrice;

  return (
    <div className={styles.container}>
      <div 
        className={styles.animatedBall} 
        ref={leftBallRef} 
        style={{ left: '5%', backgroundColor: '#e6f3ff' }} 
      />
      <div 
        className={styles.animatedBall} 
        ref={rightBallRef} 
        style={{ right: '5%', backgroundColor: '#e6f3ff' }} 
      />
      
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>{basicInfo.name}</h1>
            {basicInfo.alsoKnownAs && (
              <p className={styles.subtitle}>
                Also Known As {basicInfo.alsoKnownAs}
              </p>
            )}
            
            <div className={styles.testType}>
              <span className={styles.testTypeLabel}>
                {templateName === 'non-labtest' ? 'Center Visit Only' : 'Lab Test'}
              </span>
            </div>
            
            <div className={styles.pricing}>
              <span className={styles.discountedPrice}>
                ₹{basicInfo.discountedPrice}
              </span>
              {showDiscount && (
                <>
                  <span className={styles.originalPrice}>
                    ₹{basicInfo.price}
                  </span>
                  <span className={styles.discount}>
                    {basicInfo.discount}% off
                  </span>
                </>
              )}
            </div>
            
            <div className={styles.bookings}>
              <Users className={styles.icon} />
              <span>1K+ people booked this test</span>
            </div>
            
            <button 
              className={`${styles.addToCartButton} ${isAdded ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? (
                <>
                  <Check className={styles.buttonIcon} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <ChevronRight className={styles.buttonIcon} />
                </>
              )}
            </button>
            
            <div className={styles.offers}>
              <div className={styles.offer}>
                <span className={styles.offerIcon}>🎖️</span>
                <div className={styles.offerContent}>
                  <h3>SENIOR</h3>
                  <p>FLAT 10% OFF FOR SENIOR CITIZENS</p>
                </div>
                <Info className={styles.infoIcon} />
              </div>
              
              <div className={styles.offer}>
                <span className={styles.offerIcon}>👪</span>
                <div className={styles.offerContent}>
                  <h3>FAMILY</h3>
                  <p>ADD A FAMILY MEMBER FOR 20% DISCOUNT</p>
                </div>
                <Info className={styles.infoIcon} />
              </div>
            </div>
          </div>
          
          <div className={styles.rightContent}>
            <img
              src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png"
              alt="Lab Test"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOverview;