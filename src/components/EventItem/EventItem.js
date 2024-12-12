import React, { useContext, useState } from 'react';
import { CalendarContext } from '../Calendar/CalendarContext';
import './EventItem.css';

const EventItem = ({ index }) => {
  const { selectedDate, events, setEvents, setEditIndex, setIsFormVisible } = useContext(CalendarContext);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const handleEditEvent = () => {
    const dateKey = selectedDate.toDateString();
    const eventToEdit = events[dateKey][index];

    if (!eventToEdit) {
      console.error(`Event not found at index ${index} for date ${dateKey}`);
      return;
    }

    const form = document.querySelector('form');
    form.name.value = eventToEdit.name;
    form.startTime.value = eventToEdit.startTime;
    form.endTime.value = eventToEdit.endTime;
    form.description.value = eventToEdit.description;

    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDeleteEvent = () => {
    setEvents((prev) => {
      const dateKey = selectedDate.toDateString();
      const updatedEvents = [...(prev[dateKey] || [])];
      updatedEvents.splice(index, 1);

      const newEvents = { ...prev, [dateKey]: updatedEvents };
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
      return newEvents;
    });
  };

  const event = events[selectedDate.toDateString()][index];

  return (
    <li className="event-item">
      <div className="event-name">
        <strong>{event.name}</strong>
        <div className='event-modify'>
          <button onClick={handleEditEvent}>Edit</button>
          <button onClick={handleDeleteEvent}>Delete</button>
        </div>
      </div>
      {isDetailsVisible && (
        <div className="event-details">
          <p>Time: {event.startTime} - {event.endTime}</p>
          {event.description && <p>Description: {event.description}</p>}
        </div>
      )}
      <div className="event-actions">
        <button onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
          {isDetailsVisible ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </li>
  );
};

export default EventItem;
