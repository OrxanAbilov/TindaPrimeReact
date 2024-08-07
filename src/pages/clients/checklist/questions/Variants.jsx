import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { GET_CHECKLIST_PERMISSION_BY_ID } from '../../../../features/clients/services/api';

const Variants = ({ ratE_TYPE_ID, answeR_IMG_PERMISSION_ID, data, setData }) => {
    const [nextId, setNextId] = useState(3);
    const [showDialog, setShowDialog] = useState(false);
    const [newPoint, setNewPoint] = useState(0);
    const [newVariant, setNewVariant] = useState('');
    const [newReasonPermission, setNewReasonPermission] = useState(1);
    const [newImgPermission, setNewImgPermission] = useState(1);
    const [reasonPermissions, setReasonPermissions] = useState([]);
    const [imagePermissions, setImagePermissions] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [editingField, setEditingField] = useState('');

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const reasonData = await GET_CHECKLIST_PERMISSION_BY_ID(2); // Assuming 2 is the ID for reason permissions
            setReasonPermissions(reasonData.data.filter(permission => permission.type === 2));

            const imageData = await GET_CHECKLIST_PERMISSION_BY_ID(3); // Assuming 1 is the ID for image permissions
            setImagePermissions(imageData.data.filter(permission => permission.type === 3));
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const addRow = () => {
        setShowDialog(true);
    };

    const handleAddVariant = () => {
        if (newVariant.trim() !== '') {
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
        }
    };

    const deleteRow = (rowId) => {
        const updatedData = data.filter(row => row.id !== rowId);
        setData(updatedData);
    };

    const handleDoubleClick = (rowData, field) => {
        setEditingRow(rowData.id);
        setEditingField(field);
    };

    const handleEditChange = (e, rowData, field) => {
        const value = e.value !== undefined ? e.value : e.target.value;
        const newData = data.map(row => {
            if (row.id === rowData.id) {
                return { ...row, [field]: value };
            }
            return row;
        });
        setData(newData);
    };

    const handleEditBlur = () => {
        setEditingRow(null);
        setEditingField('');
    };

    return (
        <div>
            <DataTable value={data}>
                <Column field="variant" header="Variant"
                    body={(rowData) =>
                        editingRow === rowData.id && editingField === 'variant' ?
                            <InputText style={{ width: '60%' }} value={rowData.variant} onChange={(e) => handleEditChange(e, rowData, 'variant')} onBlur={handleEditBlur} autoFocus />
                            :
                            <span onDoubleClick={() => handleDoubleClick(rowData, 'variant')}>{rowData.variant}</span>
                    }
                />
                {ratE_TYPE_ID !== 1 && (
                    <Column field="answeR_REASON_PERMISSION_ID" header="Səbəb icazəsi"
                        body={(rowData) =>
                            <Dropdown
                                value={rowData.answeR_REASON_PERMISSION_ID}
                                options={reasonPermissions.map(permission => ({
                                    label: permission.name,
                                    value: permission.id
                                }))}
                                onChange={(e) => handleEditChange(e, rowData, 'answeR_REASON_PERMISSION_ID')}
                                placeholder="Səbəb icazəsi seçin"
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
                                onChange={(e) => handleEditChange(e, rowData, 'answeR_IMG_PERMISSION_ID')}
                                placeholder="Şəkil icazəsi seçin"
                            />
                        }
                    />
                )}
                {ratE_TYPE_ID !== 1 && (
                    <Column field="varianT_POINT" header="Bal"
                        body={(rowData) =>
                            editingRow === rowData.id && editingField === 'varianT_POINT' ?
                                <InputText style={{ width: '60%' }} value={rowData.varianT_POINT} onChange={(e) => handleEditChange(e, rowData, 'varianT_POINT')} onBlur={handleEditBlur} autoFocus />
                                :
                                <span onDoubleClick={() => handleDoubleClick(rowData, 'varianT_POINT')}>{rowData.varianT_POINT}</span>
                        }
                    />
                )}
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div>
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger p-button-outlined"
                                onClick={() => deleteRow(rowData.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>
            <div style={{ marginTop: '10px', width: '15%' }}>
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded"
                    label="Variant əlavə et"
                    onClick={addRow}
                    severity="success"
                />
            </div>

            <Dialog
                visible={showDialog}
                style={{ width: '30%' }}
                onHide={() => setShowDialog(false)}
                header="Yeni variant"
            >
                <div className="p-grid p-fluid">
                    <div className="p-col-12">
                        <label htmlFor="variant" >Variant</label>
                        <InputText
                            id="variant"
                            value={newVariant}
                            onChange={(e) => setNewVariant(e.target.value)}
                            style={{ margin: '10px 0 10px 0' }}
                        />
                    </div>
                    {ratE_TYPE_ID !== 1 && (
                        <div className="p-col-12">
                            <label htmlFor="varianT_POINT" >Bal</label>
                            <InputText
                                id="varianT_POINT"
                                value={newPoint}
                                onChange={(e) => setNewPoint(e.target.value)}
                                style={{ margin: '10px 0 10px 0' }}
                            />
                        </div>
                    )}
                    <div className="p-col-12" style={{ margin: '10px 0 10px 0' }}>
                        <Button label="Əlavə et" onClick={handleAddVariant} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Variants;
