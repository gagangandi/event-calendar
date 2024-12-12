import React, { useContext } from 'react';
import { CalendarContext } from '../Calendar/CalendarContext';
import EventItem from '../EventItem/EventItem';
import './EventsPanel.css';

const EventsPanel = () => {
  const {
    selectedDate,
    events,
    setEvents,
    editIndex,
    setEditIndex,
    isFormVisible,
    setIsFormVisible,
  } = useContext(CalendarContext);

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
  

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  return (
    <div className="events-panel">
      {selectedDate ? (
        <div>
          <div className="events-panel-header">
            <h3>Events on {selectedDate.toDateString()}</h3>
            <button onClick={toggleFormVisibility}>
              {isFormVisible ? 'Cancel' : 'Add Event'}
            </button>
          </div>
          {isFormVisible && (
            <form onSubmit={handleAddEvent} >
              <input type="text" name="name" placeholder="Event Name" required />
              <input type="time" name="startTime" required />
              <input type="time" name="endTime" required />
              <textarea name="description" placeholder="Optional Description"></textarea>
              <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
            </form>
          )}

          <ul>
            {(events[selectedDate.toDateString()] || []).map((event, index) => (
              <EventItem key={index} index={index} />
            ))}
          </ul>
        </div>
      ) : (
        <p>Select a day to view or add events.</p>
      )}
    </div>
  );
};

export default EventsPanel;
