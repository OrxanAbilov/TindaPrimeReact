import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';

const AddEditDialog = ({ visible, onHide, newJob, setNewJob, onSave, header }) => {
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e, field) => {
        setNewJob({ ...newJob, [field]: e.target.value });
    };

    const validate = () => {
        const errors = {};
        if (!newJob.code) errors.code = '* Code qeyd edin';
        if (!newJob.desc) errors.desc = '* Açıqlamanı qeyd edin';
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
                        value={newJob.code}
                        onChange={(e) => handleInputChange(e, 'code')}
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                {validationErrors.code && <small className="p-error">{validationErrors.code}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="desc">Açıqlama</label>
                    <InputText
                        id="desc"
                        value={newJob.desc}
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
    newJob: PropTypes.object.isRequired,
    setNewJob: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
};

export default AddEditDialog;
