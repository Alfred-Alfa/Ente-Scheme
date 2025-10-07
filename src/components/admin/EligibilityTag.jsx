import React from 'react';

const EligibilityTag = ({ children, color }) => {
    const colorClasses = {
        green: 'eligibility-tag green',
        blue: 'eligibility-tag blue',
        purple: 'eligibility-tag purple',
        yellow: 'eligibility-tag yellow',
        gray: 'eligibility-tag gray',
    };
    return <span className={colorClasses[color] || colorClasses.blue}>{children}</span>;
};

export default EligibilityTag;
