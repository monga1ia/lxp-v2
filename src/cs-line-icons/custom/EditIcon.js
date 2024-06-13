import React from "react";

export default function EditIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.76083 19.761H4.36082C3.14579 19.761 2.16082 18.776 2.16083 17.5609L2.16091 4.361C2.16092 3.14598 3.14589 2.16101 4.36091 2.16101H14.2612C15.4762 2.16101 16.4612 3.14598 16.4612 4.36101V8.76101M12.061 16.7278L16.7279 12.0609L19.8392 15.1722L15.1723 19.8391H12.061V16.7278Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
