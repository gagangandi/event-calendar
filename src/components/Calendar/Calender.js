import React, { useState, useEffect } from 'react';
import './Calender.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);


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
  

  const getMonthDays = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayOfWeek = date.getDay();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    while (date.getMonth() === month) {
      days.push({ date: new Date(date), isCurrentMonth: true });
      date.setDate(date.getDate() + 1);
    }

    while (days.length % 7 !== 0) {
      days.push({ date: new Date(date), isCurrentMonth: false });
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    localStorage.setItem('selectedDate', date.toISOString()); // Save in ISO format
  };

  const handleAddEvent = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const startTime = form.startTime.value;
    const endTime = form.endTime.value;
    const description = form.description.value;

    if (name && startTime && endTime) {
      const newEvent = { name, startTime, endTime, description: description || '' };

      setEvents((prev) => {
        const dateKey = selectedDate.toDateString();
        const updatedEvents = [...(prev[dateKey] || [])];

        if (editIndex !== null) {
          updatedEvents[editIndex] = newEvent;
        } else {
          updatedEvents.push(newEvent);
        }

        const newEvents = { ...prev, [dateKey]: updatedEvents };
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
        return newEvents;
      });

      setEditIndex(null);
      setIsFormVisible(false);
      form.reset();
    }
  };

  const handleDeleteEvent = (index) => {
    setEvents((prev) => {
      const dateKey = selectedDate.toDateString();
      const updatedEvents = [...(prev[dateKey] || [])];
      updatedEvents.splice(index, 1);

      const newEvents = { ...prev, [dateKey]: updatedEvents };
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      return newEvents;
    });
  };

  const handleEditEvent = (index) => {
    const dateKey = selectedDate.toDateString();
    const eventToEdit = events[dateKey][index];

    const form = document.querySelector('form');
    form.name.value = eventToEdit.name;
    form.startTime.value = eventToEdit.startTime;
    form.endTime.value = eventToEdit.endTime;
    form.description.value = eventToEdit.description;

    setEditIndex(index);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const today = new Date();

  const days = getMonthDays(year, month);

  return (
    <div>
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>&lt;</button>
            <h2>{monthName} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>&gt;</button>
          </div>
          <div className="calendar-days-of-week">
            {daysOfWeek.map((day) => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {days.map(({ date, isCurrentMonth }, index) => (
              <div
                key={index}
                className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} 
                  ${date.toDateString() === today.toDateString() ? 'today' : ''} 
                  ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
              >
                {date.getDate()}
              </div>
            ))}
          </div>
        </div>
        <div className="events-panel">
          {selectedDate ? (
            <div>
              <div className='events-panel-header'>
                <h3>Events on {selectedDate.toDateString()}</h3>
                <button onClick={toggleFormVisibility}>
                  {isFormVisible ? 'Cancel' : 'Add Event'}
                </button>
              </div>
              {isFormVisible && (
                <form onSubmit={handleAddEvent}>
                  <input type="text" name="name" placeholder="Event Name" required />
                  <input type="time" name="startTime" required />
                  <input type="time" name="endTime" required />
                  <textarea name="description" placeholder="Optional Description"></textarea>
                  <button type="submit">Submit</button>
                </form>
              )}

              <ul>
                {(events[selectedDate.toDateString()] || []).map((event, index) => (
                  <li key={index} className="event-item">
                    <strong>{event.name}</strong> ({event.startTime} - {event.endTime})
                    {event.description && <p>{event.description}</p>}
                    <button onClick={() => handleEditEvent(index)}>Edit</button>
                    <button onClick={() => handleDeleteEvent(index)}>Delete</button>
                  </li>
                ))}
              </ul>

            </div>
          ) : (
            <p>Select a day to view or add events.</p>
          )}
        </div>
        
      </div>
      
    </div>
  );
};

export default Calendar;
