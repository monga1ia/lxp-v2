import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from 'react-bootstrap'

const CloseButton = ({ className, onClick, style }) => {
  return (
    <Button onClick={() => onClick?.()} variant='empty' className={`close-button ${className}`} style={style}>
      <CloseIcon style={{ width: "24px", height: "24px", color: "white" }} />
    </Button>
  );
};

export default CloseButton;
