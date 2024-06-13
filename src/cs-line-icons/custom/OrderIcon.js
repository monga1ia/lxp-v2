import React from "react";

export default function OrderIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.2002 5.5002L16.5002 2.2002M16.5002 2.2002L19.8002 5.5002M16.5002 2.2002L16.5002 19.8002M8.80019 16.5002L5.50019 19.8002M5.50019 19.8002L2.2002 16.5002M5.50019 19.8002L5.5002 2.2002"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
