import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './TimeSlotSelector.module.css';

const TimeSlotSelector = ({ onSlotSelect, selectedDate, selectedTime }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDateObj, setSelectedDateObj] = useState(null);

  // Generate available dates (next 7 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Format date for display
      const formattedDate = {
        value: date.toISOString().split('T')[0],
        display: new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }).format(date),
        dayOfWeek: date.getDay()
      };
      
      dates.push(formattedDate);
    }
    
    setAvailableDates(dates);
  }, []);

  // Generate time slots based on selected date
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const isSunday = date.getDay() === 0;
      
      const slots = [];
      const startTime = '07:30';
      const endTime = isSunday ? '13:00' : '20:00';
      
      let currentTime = startTime;
      while (currentTime <= endTime) {
        // Format time for display
        const [hours, minutes] = currentTime.split(':');
        const timeObj = new Date();
        timeObj.setHours(parseInt(hours), parseInt(minutes));
        
        slots.push({
          value: currentTime,
          display: timeObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        });

        // Add 30 minutes
        let totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + 30;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      }
      
      setAvailableSlots(slots);
    }
  }, [selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDateObj(date);
    onSlotSelect(date.value, null);
  };

  const handleTimeClick = (time) => {
    onSlotSelect(selectedDate, time.value);
  };

  return (
    <div className={styles.timeSlotContainer}>
      {/* Date Selection */}
      <div className={styles.dateSection}>
        <div className={styles.sectionHeader}>
          <Calendar className={styles.icon} />
          <span>Select Date</span>
        </div>
        <div className={styles.dateGrid}>
          {availableDates.map(date => (
            <button
              key={date.value}
              className={`${styles.dateButton} ${selectedDate === date.value ? styles.active : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <span className={styles.dayOfWeek}>
                {new Date(date.value).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className={styles.dayOfMonth}>
                {new Date(date.value).getDate()}
              </span>
              <span className={styles.month}>
                {new Date(date.value).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className={styles.timeSection}>
          <div className={styles.sectionHeader}>
            <Clock className={styles.icon} />
            <span>Select Time</span>
          </div>
          <div className={styles.timeGrid}>
            {availableSlots.map(time => (
              <button
                key={time.value}
                className={`${styles.timeButton} ${selectedTime === time.value ? styles.active : ''}`}
                onClick={() => handleTimeClick(time)}
              >
                {time.display}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;