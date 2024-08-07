import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import PropTypes from 'prop-types';
import { GET_REASON_TYPES } from '../../../../features/clients/services/api';

const AddEditDialog = ({ visible, onHide, newReason, setnewReason, onSave, header }) => {
    const [reasonTypes, setReasonTypes] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchReasonTypes = async () => {
            try {
                const response = await GET_REASON_TYPES();
                if (response.statusCode === 200) {
                    setReasonTypes(response.data);
                } else {
                    console.error('Failed to fetch reason types:', response);
                }
            } catch (error) {
                console.error('Error fetching reason types:', error);
            }
        };

        fetchReasonTypes();
    }, []);

    const handleInputChange = (e, field) => {
        setnewReason({ ...newReason, [field]: e.target.value });
    };

    const handleDropdownChange = (e, field) => {
        setnewReason({ ...newReason, [field]: e.value.id });
    };

    const handleStatusChange = (e) => {
        const updatedReason = { ...newReason, status: e.value };
        setnewReason(updatedReason);
        console.log('Updated newReason:', updatedReason);
    };
        const statusOptions = [
        { label: 'Aktiv', value: true },
        { label: 'Passiv', value: false }
    ];

    const validate = () => {
        const errors = {};
        if (!newReason.typE_ID) errors.typE_ID = '* Tipi qeyd edin';
        if (!newReason.name) errors.name = '* Adı qeyd edin';
        if (!newReason.desc) errors.desc = '* Açıqlamanı qeyd edin';
        if (newReason.status === null || newReason.status === undefined) errors.status = '* Statusu qeyd edin';
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
                    <label htmlFor="typE_ID">Tip</label>
                    <Dropdown
                        id="typE_ID"
                        value={reasonTypes.find(type => type.id === newReason.typE_ID)}
                        options={reasonTypes}
                        onChange={(e) => handleDropdownChange(e, 'typE_ID')}
                        optionLabel="name"
                        placeholder="Səbəb tipi seçin"
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                        {validationErrors.typE_ID && <small className="p-error">{validationErrors.typE_ID}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="code">Kod</label>
                    <InputText
                        id="code"
                        value={newReason.code}
                        onChange={(e) => handleInputChange(e, 'code')}
                        className="p-inputtext-lg p-d-block my-2"
                        disabled
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="name">Ad</label>
                    <InputText
                        id="name"
                        value={newReason.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                        {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="desc">Açıqlama</label>
                    <InputText
                        id="desc"
                        value={newReason.desc}
                        onChange={(e) => handleInputChange(e, 'desc')}
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                    {validationErrors.desc && <small className="p-error">{validationErrors.desc}</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="status">Status</label>
                    <Dropdown
                        id="status"
                        value={newReason.status}
                        options={statusOptions}
                        onChange={handleStatusChange}
                        placeholder="Status təyin edin"
                        className="p-inputtext-lg p-d-block my-2"
                        required
                    />
                    {validationErrors.status && <small className="p-error">{validationErrors.status}</small>}
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
    newReason: PropTypes.object.isRequired,
    setnewReason: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
};

export default AddEditDialog;
