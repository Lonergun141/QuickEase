import React from 'react';
import Modal from './Modal'
import Button from './button';

export function SessionExpiredModal({ isOpen, onClose, onLogout }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Expired">
      <div className="text-center mb-6">
        <p className="text-gray-700 mb-4">
          Your session has expired. Please log in again to continue.
        </p>
        <Button onClick={onLogout} className="w-full max-w-xs">
          Log Out
        </Button>
      </div>
    </Modal>
  );
}