import React from 'react';

const CheckboxPill = ({ id, name, value, checked, onChange, children }) => (
    <label htmlFor={id} className="checkbox-pill-label">
        <input type="checkbox" id={id} name={name} value={value} checked={checked} onChange={onChange} className="custom-checkbox" />
        <span className="checkbox-pill-span">{children}</span>
    </label>
);

export default CheckboxPill;
