import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css"

export interface DateInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

export const DateInput = (props: DateInputProps) => {

  return (
    <DatePicker 
      dateFormat="d/M/yyyy"
      selected={props.selected}
      onChange={props.onChange}
      disabledKeyboardNavigation  
    />
    
  )
}