//#9013fe
import React from "react";

const IconIncomplete = ({ size, onClick }) => {
  const textStyles = {
    fontFamily: 'MulishRegular',
    fontSize: "80",
    fill: "#9013fe",
    fontWeight: 100,
  };
  const buttonStyles = {
    width: size,
    height: size,
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '1px solid #9013fe',
  };
  return (
    <button style={buttonStyles} onClick={onClick}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" dy=".1em" style={textStyles}>Д</text>
      </svg>
    </button>
  );
};

export default IconIncomplete;