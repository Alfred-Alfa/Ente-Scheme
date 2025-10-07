import React from 'react';
import { Trash2Icon } from './icons';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, schemeName }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay modal-overlay-animated">
            <div className="delete-modal-content modal-content-animated">
                <div className="delete-modal-icon-container">
                    <Trash2Icon s={32} />
                </div>
                <h2>Confirm Deletion</h2>
                <p>Delete "<strong>{schemeName}</strong>"? This action is final.</p>
                <div className="delete-modal-actions">
                    <button onClick={onClose} className="modal-btn cancel">Cancel</button>
                    <button onClick={onConfirm} className="modal-btn confirm-delete">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
