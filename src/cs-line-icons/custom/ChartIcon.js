import React from "react";

export default function ChartIcon({ stroke = "#FF5B1D" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path d="M18 18L4 18C2.89543 18 2 17.1046 2 16L2 2" stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path
                d="M5.00005 11L6.58588 9.41417C7.36693 8.63313 8.63325 8.63314 9.4143 9.41418L10.5858 10.5857C11.3669 11.3668 12.6332 11.3668 13.4143 10.5857L18 5.99998"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    );
}
