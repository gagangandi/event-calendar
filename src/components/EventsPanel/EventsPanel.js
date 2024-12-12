import React, { useContext, useState } from 'react';
import { CalendarContext } from '../Calendar/CalendarContext';
import EventItem from '../EventItem/EventItem';
import './EventsPanel.css';
import SearchEvents from '../SearchEvents/SearchEvents';

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const handleAddEvent = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const startTime = form.startTime.value;
    const endTime = form.endTime.value;
    const description = form.description.value;
    const eventType = form.eventType.value;

    if (name && startTime && endTime) {
      const newEvent = { name: name, startTime: startTime, endTime: endTime, description: description, eventType: eventType };

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
      <SearchEvents setSelectedEvent={setSelectedEvent}/>
      {selectedEvent && <div>
        <ul>
            {(events[selectedDate.toDateString()] || []).filter((event)=>event.name===selectedEvent.name).map((event, index) => (
              <EventItem key={index} index={index} />
            ))}
        </ul>
      </div>}
      {!selectedEvent && selectedDate ? (
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
              <select name="eventType">
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="others">Others</option>
              </select>
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
      ) : ( !selectedEvent && <p>Select a day to view or add events.</p>)}
    </div>
  );
};

export default EventsPanel;
