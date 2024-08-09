import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { GET_CHECKLIST_PERMISSION_BY_ID } from '../../../../features/clients/services/api';

const Variants = ({ ratE_TYPE_ID, answeR_IMG_PERMISSION_ID, data, setData, operatioN_STATUS, isCopy }) => {
    const [nextId, setNextId] = useState(3);
    const [showDialog, setShowDialog] = useState(false);
    const [newPoint, setNewPoint] = useState(0);
    const [newVariant, setNewVariant] = useState('');
    const [newReasonPermission, setNewReasonPermission] = useState(0);
    const [newImgPermission, setNewImgPermission] = useState(0);
    const [reasonPermissions, setReasonPermissions] = useState([]);
    const [imagePermissions, setImagePermissions] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchPermissions();
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-dropdown .p-dropdown-label.p-placeholder {
                color: #ff4d4d;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const fetchPermissions = async () => {
        try {
            const reasonData = await GET_CHECKLIST_PERMISSION_BY_ID(2); // Assuming 2 is the ID for reason permissions
            setReasonPermissions(reasonData.data.filter(permission => permission.type === 2));

            const imageData = await GET_CHECKLIST_PERMISSION_BY_ID(3); // Assuming 3 is the ID for image permissions
            setImagePermissions(imageData.data.filter(permission => permission.type === 3));
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const addRow = () => {
        setShowDialog(true);
        setEditingRow(null);
    };

    const handleAddVariant = () => {
        if (newVariant.trim() === '') {
            setErrorMessage('Variant adı boş ola bilməz.');
            return;
        }

        if (ratE_TYPE_ID !== 1 && newPoint < 0) {
            setErrorMessage('Bal müsbət bir rəqəm olmalıdır.');
            return;
        }

        const newRow = {
            id: nextId,
            variant: newVariant,
            answeR_REASON_PERMISSION_ID: ratE_TYPE_ID !== 1 ? newReasonPermission : null,
            answeR_IMG_PERMISSION_ID: ratE_TYPE_ID !== 1 && answeR_IMG_PERMISSION_ID !== 1 ? newImgPermission : null,
            varianT_POINT: ratE_TYPE_ID !== 1 ? newPoint : null
        };
        setData([...data, newRow]);
        setNextId(nextId + 1);
        setNewVariant('');
        setNewPoint(0);
        setShowDialog(false);
        setErrorMessage('');
    };

    const handleEditVariant = () => {
        if (newVariant.trim() === '') {
            setErrorMessage('Variant adı boş ola bilməz.');
            return;
        }

        if (ratE_TYPE_ID !== 1 && newPoint < 0) {
            setErrorMessage('Bal müsbət bir rəqəm olmalıdır.');
            return;
        }

        const updatedData = data.map(row => {
            if (row.id === editingRow.id) {
                return {
                    ...row,
                    variant: newVariant,
                    varianT_POINT: ratE_TYPE_ID !== 1 ? newPoint : null
                };
            }
            return row;
        });
        setData(updatedData);
        setShowDialog(false);
        setErrorMessage('');
    };

    const deleteRow = (rowId) => {
        const updatedData = data.filter(row => row.id !== rowId);
        setData(updatedData);
    };

    const openEditDialog = (rowData) => {
        setEditingRow(rowData);
        setNewVariant(rowData.variant);
        setNewPoint(rowData.varianT_POINT);
        setShowDialog(true);
    };

    const isDisabled = !(isCopy || !operatioN_STATUS);

    return (
        <div>
            <DataTable value={data}>
                <Column field="variant" header="Variant" body={(rowData) => rowData.variant} />
                {ratE_TYPE_ID !== 1 && (
                    <Column field="answeR_REASON_PERMISSION_ID" header="Səbəb icazəsi"
                        body={(rowData) =>
                            <Dropdown
                                value={rowData.answeR_REASON_PERMISSION_ID}
                                options={reasonPermissions.map(permission => ({
                                    label: permission.name,
                                    value: permission.id
                                }))}
                                onChange={(e) => {
                                    const newData = data.map(row => {
                                        if (row.id === rowData.id) {
                                            return { ...row, answeR_REASON_PERMISSION_ID: e.value };
                                        }
                                        return row;
                                    });
                                    setData(newData);
                                }}
                                placeholder="Səbəb icazəsi seçin"
                                disabled={isDisabled}
                                className="custom-dropdown"
                            />
                        }
                    />
                )}
                {ratE_TYPE_ID !== 1 && answeR_IMG_PERMISSION_ID !== 1 && (
                    <Column field="answeR_IMG_PERMISSION_ID" header="Şəkil icazəsi"
                        body={(rowData) =>
                            <Dropdown
                                value={rowData.answeR_IMG_PERMISSION_ID}
                                options={imagePermissions.map(permission => ({
                                    label: permission.name,
                                    value: permission.id
                                }))}
                                onChange={(e) => {
                                    const newData = data.map(row => {
                                        if (row.id === rowData.id) {
                                            return { ...row, answeR_IMG_PERMISSION_ID: e.value };
                                        }
                                        return row;
                                    });
                                    setData(newData);
                                }}
                                placeholder="Şəkil icazəsi seçin"
                                disabled={isDisabled}
                                className="custom-dropdown"
                            />
                        }
                    />
                )}
                {ratE_TYPE_ID !== 1 && (
                    <Column field="varianT_POINT" header="Bal" body={(rowData) => rowData.varianT_POINT} />
                )}
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-text p-button-outlined"
                                onClick={() => openEditDialog(rowData)}
                                disabled={isDisabled}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger p-button-outlined"
                                onClick={() => deleteRow(rowData.id)}
                                disabled={isDisabled}
                            />
                        </div>
                    )}
                />
            </DataTable>
            {!isDisabled && (
                <div style={{ marginTop: '10px', width: '15%' }}>
                    <Button
                        icon="pi pi-plus"
                        className="p-button-rounded"
                        label="Variant əlavə et"
                        onClick={addRow}
                        severity="success"
                    />
                </div>
            )}

            <Dialog
                visible={showDialog}
                style={{ width: '30%' }}
                onHide={() => setShowDialog(false)}
                header={editingRow ? "Variantı Düzəldin" : "Yeni variant"}
            >
                <div className="p-grid p-fluid">
                    <div className="p-col-12">
                        <label htmlFor="variant">Variant</label>
                        <InputText
                            id="variant"
                            value={newVariant}
                            onChange={(e) => setNewVariant(e.target.value)}
                            style={{ margin: '10px 0 10px 0' }}
                            disabled={isDisabled}
                        />
                    </div>
                    {ratE_TYPE_ID !== 1 && (
                        <div className="p-col-12">
                            <label htmlFor="varianT_POINT">Bal</label>
                            <InputText
                                id="varianT_POINT"
                                value={newPoint}
                                onChange={(e) => setNewPoint(e.target.value)}
                                style={{ margin: '10px 0 10px 0' }}
                                disabled={isDisabled}
                            />
                        </div>
                    )}
                    {errorMessage && (
                        <div className="p-col-12" style={{ color: 'red' }}>
                            {errorMessage}
                        </div>
                    )}
                    <div className="p-col-12" style={{ margin: '10px 0 10px 0' }}>
                        <Button label={editingRow ? "Yenilə" : "Əlavə et"} onClick={editingRow ? handleEditVariant : handleAddVariant} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Variants;
