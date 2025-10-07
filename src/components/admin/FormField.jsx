import React from 'react';
import Tooltip from './Tooltip';
import { InfoIcon } from './icons';

const FormField = ({ label, children, tip }) => (
    <div>
        <label className="form-label">
            <span>{label}</span>
            {tip && <Tooltip text={tip}><InfoIcon c="ml-1.5 text-slate-400" s={14} /></Tooltip>}
        </label>
        {children}
    </div>
);

export default FormField;
