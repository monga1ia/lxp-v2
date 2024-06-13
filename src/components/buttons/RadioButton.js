import React from "react";

const RadioButton = ({ checked = false, onCheck, className, styleObj }) => {
  return (
    <div className={`radio cursor-pointer ${className}`} onClick={onCheck} style={styleObj}>
      {checked && <div className="radio-checked" />}
    </div>
  );
};

export default RadioButton;
// export default React.memo(
//   RadioButton,
//   (prev, next) => prev.checked === next.checked
// );
