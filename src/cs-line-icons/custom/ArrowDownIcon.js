import React from "react";

export default function ArrowDownIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="29.5" y="29.5" width="29" height="29" rx="5.5" transform="rotate(-180 29.5 29.5)" fill={stroke} fillOpacity="0.1" stroke="#868AA8"/>
        <path d="M22.5 14.5L15 22" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
        <path d="M6.5 14.5L14 22" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
        <path d="M14.5 6.5L14.5 21.5" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );
}
