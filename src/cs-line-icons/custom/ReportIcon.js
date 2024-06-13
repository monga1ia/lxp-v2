import React from "react";

export default function ReportIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.95888 12.8332L9.80888 8.98319L12.5589 11.7332L15.8589 8.43319M4.03334 19.433C2.81832 19.433 1.83334 18.448 1.83334 17.233V4.03301C1.83334 2.81798 2.81832 1.83301 4.03334 1.83301H17.2333C18.4484 1.83301 19.4333 2.81798 19.4333 4.03301V17.233C19.4333 18.448 18.4484 19.433 17.2333 19.433H4.03334Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
