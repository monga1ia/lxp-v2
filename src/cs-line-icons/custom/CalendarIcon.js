import React from "react";

export default function CalendarIcon({ stroke = "#FF5B1D", width = 22, height = 22 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.23959 7.76302H18.6771M6.10567 1.83334V3.3804M16.6146 1.83334V3.38021M16.6146 3.38021H6.30209C4.59346 3.38021 3.20834 4.76533 3.20834 6.47396V16.7866C3.20834 18.4952 4.59346 19.8803 6.30209 19.8803H16.6146C18.3232 19.8803 19.7083 18.4952 19.7083 16.7866L19.7083 6.47396C19.7083 4.76533 18.3232 3.38021 16.6146 3.38021ZM8.88022 13.9506L10.4271 15.4974L14.0365 11.8881"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

