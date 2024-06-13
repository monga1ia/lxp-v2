import React from "react";

export default function TargetIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.8 11C19.8 15.8601 15.8601 19.8 11 19.8M19.8 11C19.8 6.13989 15.8601 2.2 11 2.2M19.8 11H16.5M11 19.8C6.13991 19.8 2.20001 15.8601 2.20001 11M11 19.8V16.5M2.20001 11C2.20001 6.13989 6.13991 2.2 11 2.2M2.20001 11H5.50001M11 2.2V5.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
