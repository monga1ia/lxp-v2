//#e02020
import React from "react";

const IconMissing = ({ size, onClick }) => {
  const textStyles = {
    fontFamily: 'MulishRegular',
    fontSize: "80",
    fill: "#e02020",
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
    border: '1px solid #e02020',
    backgroundColor: 'transparent'
  };
  return (
    <button style={buttonStyles} onClick={onClick}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" dy=".1em" style={textStyles}>ХГ</text>
      </svg>
    </button>
  );
};

export default IconMissing;