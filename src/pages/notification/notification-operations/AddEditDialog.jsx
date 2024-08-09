import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';

const AddEditDialog = ({ visible, onHide, newOperation, setNewOperation, onSave, header }) => {
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e, field) => {
        setNewOperation({ ...newOperation, [field]: e.target.value });
    };

    const validate = () => {
        const errors = {};
        if (!newOperation.code) errors.code = '* Kodu qeyd edin';
        if (!newOperation.desc) errors.desc = '* Açıqlamanı qeyd edin';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave();
        }
    };

    return (
        <Dialog header={header} visible={visible} style={{ width: '50vw' }} modal onHide={onHide}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="code">Kod</label>
                    <InputText
                        id="code"
                        value={newOperation.code}
                        onChange={(e) => handleInputChange(e, 'code')}
                        className="p-inputtext-lg p-d-block my-2"
                    />
                    {validationErrors.code && <small className="p-error">{validationErrors.code}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="desc">Açıqlama</label>
                    <InputText
                        id="desc"
                        value={newOperation.desc}
                        onChange={(e) => handleInputChange(e, 'desc')}
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                    {validationErrors.desc && <small className="p-error">{validationErrors.desc}</small>}
                </div>
            </div>
            <div className="p-dialog-footer" style={{ marginTop: '15px', padding: '0' }}>
                <Button label="Yadda saxla" onClick={handleSave} className="p-button-primary" />
                <Button label="Ləğv et" onClick={onHide} className="p-button-secondary" />
            </div>
        </Dialog>
    );
};

AddEditDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    newOperation: PropTypes.object.isRequired,
    setNewOperation: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
};

export default AddEditDialog;
