import React from "react";

export default function TrashIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.20001 4.95002H19.8M7.70001 1.65002H14.3M8.80001 15.95V9.35003M13.2 15.95V9.35003M14.85 20.35H7.15001C5.93499 20.35 4.95001 19.3651 4.95001 18.15L4.44775 6.09582C4.42171 5.47088 4.92132 4.95002 5.5468 4.95002H16.4532C17.0787 4.95002 17.5783 5.47088 17.5523 6.09582L17.05 18.15C17.05 19.3651 16.065 20.35 14.85 20.35Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
