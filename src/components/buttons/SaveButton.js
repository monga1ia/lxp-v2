import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import { Button } from 'react-bootstrap'

const SaveButton = ({ className, onClick }) => {
  return (
    <Button onClick={() => onClick?.()} variant='empty' className={`save-icon ${className}`}>
      <CheckIcon style={{ width: 30, height: 30, background: '#66bca4', color: "#fff", borderRadius: 6, fontSize: 12 }} />
    </Button>
  );
};

export default SaveButton;
