//#3ebfa3
import React from "react";

const IconComplete = ({ size, onClick }) => {
  const textStyles = {
    fontFamily: 'MulishRegular',
    fontSize: "80",
    fill: "#fff",
    fontWeight: 100,
  };
  const buttonStyles = {
    width: size,
    height: size,
    borderRadius: '10px',
    backgroundColor: '#3ebfa3',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none'
  };
  return (
    <button style={buttonStyles} onClick={onClick}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" dy=".1em" style={textStyles}>Б</text>
      </svg>
    </button>
  );
};

export default IconComplete;
