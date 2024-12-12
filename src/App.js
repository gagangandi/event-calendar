import './App.css';
import Calender from './components/Calendar/Calender';
import Navbar from './components/Navbar/Navbar';
import EventsPanel from './components/Events-panel/Events-panel';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Calender/>
      {/* <EventsPanel/> */}
    </div>
  );
}

export default App;
