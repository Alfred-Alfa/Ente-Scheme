import React from 'react';

const Tooltip = ({ text, children }) => (
    <div className="tooltip-container">
        {children}
        <div className="tooltip-content">
            {text}
        </div>
    </div>
);

export default Tooltip;
