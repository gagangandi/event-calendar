import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useContext } from 'react';
import { CalendarContext } from '../Calendar/CalendarContext';


export default function SearchEvents({setSelectedEvent}) {
    const [value, setValue] = React.useState(null);
    const {selectedDate, events} = useContext(CalendarContext);
    let eventList = [];
    for(let key in events){
      if(new Date(key).toDateString() === selectedDate.toDateString()){
        eventList.push(...events[key]);
      }
    }
    // console.log(eventList);
  return (
    <div>
        { eventList.length>0 && <Autocomplete
            disablePortal
            options={eventList}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="name" />}
            onChange={(event, option) => {setSelectedEvent(option); console.log(option)}}
        />}
    </div>
  );
}
