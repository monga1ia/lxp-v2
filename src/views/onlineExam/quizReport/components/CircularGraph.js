import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function CircularGraph({ percentage = 0, totalCount = '', studentCount = '', showFooter = true }) {
  return (
    <>
      <div
        style={{
          width: 132,
          height: 132,
          padding: 1,
          position: "relative"
        }}
      >
        <CircularProgressbar
          value={percentage}
          counterClockwise
          styles={{
            path: {
              stroke: `#36A3F7`,
              strokeLinecap: "round",
              strokeWidth: 8,
              transition: "stroke-dashoffset 0.5s ease 0s",
            },
            trail: {
              stroke: "#d6d6d6",
              strokeWidth: 8,
            },
          }}
        />
        <div className="graph-title circle-graph-title mt-2">{percentage}%</div>
      </div>
      {showFooter && (
        <div className="icon-16 font-bold mt-2 font-heading">{studentCount} | {totalCount}</div>
      )}
    </>
  );
}
