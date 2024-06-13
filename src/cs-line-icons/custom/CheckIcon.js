import React from "react";

export default function CheckIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.125 9.25L9.97229 14.75L7.875 12.8752M23 
            5.125L23 18.8751C23 21.1533 21.1532 23.0001 18.875 
            23.0001H5.125C2.84683 23.0001 1 21.1533 1 18.8751V5.125C1
            2.84683 2.84683 1 5.125 1H18.875C21.1532 1 23 2.84683 23 
            5.125Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>

  );
}
