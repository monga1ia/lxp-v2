import React from "react";

export default function ArrowUpIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="29" height="29" rx="5.5" fill={stroke} fillOpacity="0.1" stroke="#868AA8"/>
        <path d="M7.5 15.5L15 8" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
        <path d="M23.5 15.5L16 8" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
        <path d="M15.5 23.5V8.5" stroke="#868AA8" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );
}
