import './App.css';
import Calender from './components/Calendar/Calender';
import Navbar from './components/Navbar/Navbar';
import EventsPanel from './components/EventsPanel/EventsPanel';
import { CalendarProvider } from './components/Calendar/CalendarContext';

function App() {
  return (
    <div className="App">
      <CalendarProvider>
        <Navbar />
        <div className="calendar-events-container">
          <Calender />
          <EventsPanel />
        </div>
      </CalendarProvider>
    </div>
  );
}

export default App;
