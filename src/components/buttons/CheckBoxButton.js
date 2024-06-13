import React from "react";

const CheckBoxButton = ({ checked = false, onCheck, className, label, labelClassName, readOnly = false, disabled = false }) => {
    return (
        <div className={`cursor-pointer ${className}`}>
            <label className={label ? "checkbox-container pl-11" : "checkbox-container"}>
                <div className={`d-inline-block ${labelClassName}`}>{label}</div>
                <input type="checkbox" checked={checked} onChange={onCheck} readOnly={readOnly} disabled={disabled}/>
                <span className="checkmark" />
            </label>
        </div>
    );
};

export default CheckBoxButton
