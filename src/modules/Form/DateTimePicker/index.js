import React from "react";
import format from "date-fns/format";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import TextField from "@mui/material/TextField";

const DateTimePickerComp = ({ value, onChange, ...rest }) => {
  const handleChange = (date) => {
    const formatted = format(date, "y-MM-dd HH:mm");
    onChange?.(formatted, date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Responsive"
        renderInput={(params) => <TextField {...params} />}
        value={value ? new Date(value) : null}
        onChange={handleChange}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComp;
