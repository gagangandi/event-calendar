import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CalendarContext = createContext();

// Provide the context
export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load events and selectedDate from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    const storedDate = localStorage.getItem('selectedDate');
    if (storedDate) {
      setSelectedDate(new Date(storedDate));
    }
  }, []);

  // Shared state and functions
  const contextValue = {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    editIndex,
    setEditIndex,
    isFormVisible,
    setIsFormVisible,
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};
