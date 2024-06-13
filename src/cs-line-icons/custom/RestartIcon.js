import React from "react";

export default function RestartIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.91302 13.7502C4.06779 17.2635 7.37506 19.8002 11.2748 19.8002C16.1349 19.8002 20.0748 15.8603 20.0748 11.0002C20.0748 6.14009 16.1349 2.2002 11.2748 2.2002C8.01756 2.2002 5.17365 3.96987 3.65209 6.60019M2.91302 5.74049L4.12516 6.87528M6.3248 7.70019H1.9248V3.3002L6.3248 7.70019Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
