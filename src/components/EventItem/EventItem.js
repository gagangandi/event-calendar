import React, { useContext, useState } from 'react';
import { CalendarContext } from '../Calendar/CalendarContext';
import './EventItem.css';

const EventItem = ({ index }) => {
  const { selectedDate, events, setEvents, setEditIndex, isFormVisible, setIsFormVisible } = useContext(CalendarContext);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleUpdateEvent = () => {
    console.log(events);
    const dateKey = selectedDate.toDateString();
    const eventToEdit = events[dateKey][index];

    if (!eventToEdit) {
      console.error(`Event not found at index ${index} for date ${dateKey}`);
      return;
    }
    console.log(eventToEdit);
    const form = document.querySelector('form');
    console.log(form);
    form.name.value = eventToEdit.name;
    form.startTime.value = eventToEdit.startTime;
    form.endTime.value = eventToEdit.endTime;
    form.description.value = eventToEdit.description;
    form.eventType.value = eventToEdit.eventType;
    setEditIndex(index);
    console.log(events);
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
    <div>
      {showEditForm && 
        <form onSubmit={handleUpdateEvent} >
          <input type="text" name="name" placeholder="Event Name" required />
          <input type="time" name="startTime" required />
          <input type="time" name="endTime" required />
          <select name="eventType">
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="others">Others</option>
          </select>
          <textarea name="description" placeholder="Optional Description"></textarea>
          <button type="submit">Update</button>
        </form>}
      <li className={`event-item ${event.eventType}`}>
        <div className="event-name">
          <strong>{event.name}</strong>
          <div className='event-modify'>
            <button onClick={()=>setShowEditForm(true)}>Edit</button>
            <button onClick={handleDeleteEvent}>Delete</button>
          </div>
        </div>
        {isDetailsVisible && (
          <div className="event-details">
            <p>Time: {event.startTime} - {event.endTime}</p>
            <p>Type: {event.eventType}</p>
            {event.description && <p>Description: {event.description}</p>}
          </div>
        )}
        <div className="event-actions">
          <button onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
            {isDetailsVisible ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </li>
    </div>
  );
};

export default EventItem;
