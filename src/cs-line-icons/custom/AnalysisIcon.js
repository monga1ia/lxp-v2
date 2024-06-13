import React from "react";

export default function AnalysisIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4 15.4002V9.90019M11 15.4002V6.60019M6.60001 15.4002V13.2002M4.40001 19.8002C3.18498 19.8002 2.20001 18.8152 2.20001 17.6002V4.4002C2.20001 3.18517 3.18499 2.2002 4.40001 2.2002H17.6C18.815 2.2002 19.8 3.18517 19.8 4.4002V17.6002C19.8 18.8152 18.815 19.8002 17.6 19.8002H4.40001Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
