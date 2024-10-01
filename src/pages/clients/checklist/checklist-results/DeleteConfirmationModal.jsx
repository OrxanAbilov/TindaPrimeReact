import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const DeleteConfirmationModal = ({ visible, onHide, onConfirm, itemToDelete }) => {
  if (!itemToDelete) return null;
  return (
    <Dialog header="Təsdiqlə" visible={visible} style={{ width: '30vw' }} modal onHide={onHide}>
      <h3>Statusu dəyişmək istədiyinizdən əminsiniz?</h3>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button label="Ləğv et" onClick={onHide} className="p-button-secondary mr-2" />
        <Button label="Dəyiş" onClick={() => onConfirm(itemToDelete)} className="p-button-danger" />
      </div>
    </Dialog>
  );
};

DeleteConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemToDelete: PropTypes.object,
};

export default DeleteConfirmationModal;
