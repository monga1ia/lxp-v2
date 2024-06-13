import React from "react";

export default function ListIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.90001 4.4H19.8M9.90001 11H19.8M11 17.6H19.8M2.20001 15.4C2.20001 14.8165 2.4318 14.2569 2.84438 13.8444C3.25696 13.4318 3.81654 13.2 4.40001 13.2C4.98349 13.2 5.54307 13.4318 5.95565 13.8444C6.36823 14.2569 6.60001 14.8165 6.60001 15.4C6.60001 16.0501 6.05001 16.5 5.50001 17.05L2.20001 19.8H6.60001M4.40001 8.8V2.2L2.20001 4.4"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
