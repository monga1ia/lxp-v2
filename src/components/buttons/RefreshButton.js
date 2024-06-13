import React from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { Button } from 'react-bootstrap'

const RefreshButton = ({ className, styleObj, onClick }) => {
  return (
    <Button onClick={() => onClick?.()} variant='warning' className={`reset-button ${className}`} style={styleObj} >
      <ReplayIcon style={{ width: "24px", height: "24px", color: "white" }} />
    </Button>
  );
};

export default RefreshButton;
