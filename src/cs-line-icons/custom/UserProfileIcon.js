import React from "react";

export default function UserProfileIcon({ stroke = "#FF5B1D" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.2 18.803C2.2 15.3421 5.09143 12.5365 11 
            12.5365C16.9086 12.5365 19.8 15.3421 19.8 18.803C19.8 
            19.3536 19.3983 19.7999 18.9027 19.7999H3.09725C2.60171 
            19.7999 2.2 19.3536 2.2 18.803Z" stroke={stroke} strokeWidth="2"
        />
        <path d="M14.3 5.49995C14.3 7.32249 12.8225 8.79995 11 8.79995C9.17746 
            8.79995 7.7 7.32249 7.7 5.49995C7.7 3.67741 9.17746 2.19995 11 
            2.19995C12.8225 2.19995 14.3 3.67741 14.3 5.49995Z" stroke={stroke} strokeWidth="2"
        />
    </svg>
  );
}
