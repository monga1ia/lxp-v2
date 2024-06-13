import React from "react";
import { FormCheck } from "react-bootstrap";

const Checkbox = ({
    className = '',
    checked = false,
    style = {},
    label,
    onChange,
    size = 18,
    ...rest
}) => {
    const handleClick = () => {
        !rest.disabled && onChange?.(checked);
    };

    return (
        <div
            className={className}
            style={{
                display: "flex",
                alignItems: "center",
                height: `${size}px`,
                ...style
            }}
        >
            <FormCheck
                id="test"
                // label={label}
                checked={checked}
                {...rest}
                onChange={handleClick}
                className="custom-cbox"
            />
            {label && (
                <span
                    htmlFor="test"
                    onClick={handleClick}
                    style={{ cursor: "pointer", userSelect: "none", paddingLeft: 5 }}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

export default Checkbox;
