import React, { useContext } from 'react';
import './Calender.css';
import { CalendarContext } from './CalendarContext';

const Calendar = () => {
  const { currentDate, setCurrentDate, selectedDate, setSelectedDate, events } = useContext(CalendarContext);

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
    localStorage.setItem('selectedDate', date.toISOString());
  };

  const downloadEvents = () => {
    // download events of this month
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    let monthEvents = {};
    for(let key in events){
      if(new Date(key).getMonth() === month && new Date(key).getFullYear() === year){
        monthEvents[key] = events[key];
      }
    }
    const filename = `${year}-${month}-events.json`;
    const data = JSON.stringify(monthEvents);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const today = new Date();

  const days = getMonthDays(year, month);

  return (
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
      <div className="monthly-schedule">
          {/* add a button to download the events */}
          <button onClick={downloadEvents}>Download Events</button>
      </div>
    </div>
  );
};

export default Calendar;
