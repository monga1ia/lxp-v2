import React from "react";

const ButtonOutline = ({
  text = "",
  onClick,
  className,
  primary,
  leftComponent,
  rightComponent,
}) => (
  <div
    onClick={onClick}
    className={`button-outline ${className} ${primary && "primary"}`}
  >
    {leftComponent}
    {text}
    {rightComponent}
  </div>
);

export default ButtonOutline;
