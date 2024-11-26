'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './ScrollSpyNavigation.module.css'

export default function ScrollSpyNavigation({ tabs, children }) {
  const [activeSection, setActiveSection] = useState(0)
  const [navState, setNavState] = useState('normal')
  const sectionRefs = useRef([])
  const navRef = useRef(null)
  const containerRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !navRef.current || sectionRefs.current.length === 0) return

      const { scrollY } = window
      const containerRect = containerRef.current.getBoundingClientRect()
      const navRect = navRef.current.getBoundingClientRect()
      const lastSectionRef = sectionRefs.current[sectionRefs.current.length - 1]

      if (!lastSectionRef) return

      const lastSectionRect = lastSectionRef.getBoundingClientRect()

      if (containerRect.top <= 0 && lastSectionRect.bottom > navRect.height) {
        setNavState('sticky')
      } else if (lastSectionRect.bottom <= navRect.height) {
        setNavState('hidden')
      } else {
        setNavState('normal')
      }

      const navHeight = navRef.current.offsetHeight
      let newActiveSection = 0
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const section = sectionRefs.current[i]
        if (!section) continue

        const sectionRect = section.getBoundingClientRect()
        if (sectionRect.top <= navHeight + 1 && sectionRect.bottom > navHeight) {
          newActiveSection = i
          break
        }
      }

      setActiveSection(newActiveSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Scroll active button into view when it changes
    const activeButton = document.querySelector(`.${styles.navButtonActive}`)
    if (activeButton && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current
      const buttonRect = activeButton.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      
      const scrollLeft = activeButton.offsetLeft - containerRect.width / 2 + buttonRect.width / 2
      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [activeSection])

  const scrollToSection = (index) => {
    if (!navRef.current || !sectionRefs.current[index]) return

    const navHeight = navRef.current.offsetHeight
    const element = sectionRefs.current[index]
    const y = element.getBoundingClientRect().top + window.pageYOffset - navHeight

    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  if (!Array.isArray(tabs) || tabs.length === 0 || !Array.isArray(children) || children.length === 0) {
    return <div>No content provided</div>
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <nav ref={navRef} className={`${styles.nav} ${styles[navState]}`}>
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          <ul className={styles.navList}>
            {tabs.map((tab, index) => (
              <li key={index} className={styles.navItem}>
                <button
                  onClick={() => scrollToSection(index)}
                  className={`${styles.navButton} ${index === activeSection ? styles.navButtonActive : ''}`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className={styles.content}>
        {React.Children.toArray(children).map((child, index) => (
          <section
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={styles.section}
          >
            {child}
          </section>
        ))}
      </div>
    </div>
  )
}