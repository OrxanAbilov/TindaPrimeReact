import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from "primereact/toast";
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { GET_CARI_HESAPLAR_FOR_DROP_DOWN, ADD_NEW_SUGGESTION, GET_CURR_BY_CLIENTCODE } from '../../../features/procurement/services/api';
import { InputNumber } from 'primereact/inputnumber';
import {
    setData,
    setError,
    setIsLoading,
} from "../../../features/procurement/procurementDetails/procurementDetailSlice";
import { useSelector } from 'react-redux';
import { useToast } from '../../../context/ToastContext';
import { setRef } from '@mui/material';
import { InputSwitch } from 'primereact/inputswitch';
import { Checkbox } from 'primereact/checkbox';


export default function SuggestionNewDialog({ procDetails, onClose, setRefresh }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedCurr, setSelectedCurr] = useState(null);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownOptionsCurr, setDropdownOptionsCurr] = useState([]);
    const [items, setItems] = useState([]);
    const toast = useRef(null);
    const [files, setFiles] = useState([]);
    //const [price, setPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { data, error, isLoading } = useSelector((state) => state.procurementDetailSlice);
    const { showToast } = useToast()
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await GET_CARI_HESAPLAR_FOR_DROP_DOWN();
            setDropdownOptions(res.data);
            setError(false);
        } catch (error) {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            fetchData();
        }

        return () => {
            mounted = false;
        };
    }, [data, error, isLoading]);

    useEffect(() => {
        const fetchDataCurr = async () => {
            try {
                setSelectedCurr(null);
                const res = await GET_CURR_BY_CLIENTCODE(selectedValue);
                setDropdownOptionsCurr(res.data);
            } catch (error) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedValue !== null) {
            fetchDataCurr();
        }
    }, [selectedValue]);

    useEffect(() => {
        const newItems = procDetails.procurementLines.map(item => ({
            procurementId: item.procurementId,
            cardType: item.cardType,
            itemCode: item.itemCode,
            itemName: item.itemName,
            erpId: item.erpId,
            amount: null,
            suggestedAmount: item.amount,
            description: item.description,
            sonAlis: item.sonAlis,
            aktivDepo: item.aktivDepo,

            umumiDepo: item.umumiDepo,
            price: null,
            total: 0,
            isIncludeVat: false,
            procurementLineId: item.id
        }));
        setItems(newItems);
    }, []);



    const roundToTwoDecimals = (num) => {
        return Math.round(num * 100) / 100;
    };


    const handlePriceChange = (value, rowIndex) => {
        let updatedItems = [...items];
        updatedItems[rowIndex].price = value;
        updatedItems[rowIndex].total = roundToTwoDecimals(value * updatedItems[rowIndex].amount);
        setItems(updatedItems);
    };

    const handleAmountChange = (value, rowIndex) => {
        let updatedItems = [...items];
        updatedItems[rowIndex].amount = value;
        updatedItems[rowIndex].total = roundToTwoDecimals(value * updatedItems[rowIndex].price);
        setItems(updatedItems);
    };

    const handleFileUpload = (event) => {
        const uploadedFiles = event.files.map(file => ({
            id: 0,
            fileName: file.name,
            base64File: '' // Placeholder for base64
        }));

        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        };

        Promise.all(event.files.map(file => readFileAsBase64(file)))
            .then(base64Files => {
                const updatedFiles = uploadedFiles.map((file, index) => ({
                    ...file,
                    base64File: base64Files[index]
                }));
                setFiles(updatedFiles);
            })
            .catch(error => {
                console.error("Error reading file as base64: ", error);
            });
    };

    const handleSubmit = async () => {
        const postData = {
            id: 0,
            isSelected: false,
            procurementId: procDetails.id,
            clientCode: selectedValue,
            clientName: '',
            curr: selectedCurr,
            items: selectedItems,
            total: selectedItems.reduce((acc, item) => acc + item.total, 0),
            files: files
        };

        try {
            const responseData = await ADD_NEW_SUGGESTION(postData);
            showToast('success', 'Uğurlu əməliyyat', 'Məlumat uğurla göndərildi', 3000);
            onClose();
            setRefresh();
        } catch (error) {
            // Handle error
            showToast('error', 'Xəta', error.response.data.Exception[0], 3000);
        }

    };

    const onFileSelect = (e) => {
        // Collect files from the event and update the state
        const newFiles = Array.from(e.files);
        setSelectedFiles([...selectedFiles, ...newFiles]);
    };

    const confirm1 = () => {
        confirmDialog({
            message: 'Məlumatları yadda saxlamaq istəyirsinizmi?',
            header: 'Təstiq',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: handleSubmit,
            acceptLabel: "Yadda saxla",
            rejectLabel: "Ləğv et",
            handleSubmit: true

        });
    };

    const handleVatChange = (checked, rowIndex) => {
        let updatedItems = [...items];
        updatedItems[rowIndex].isIncludeVat = checked;
        setItems(updatedItems);
    };

    const isRowSelected = (rowData) => {
        return selectedItems.some(item => item.id === rowData.id);
    };

    return (
        <NewForm>
            <Toast ref={toast} />
            <Card>
                <label>Təchizatçı: </label>
                <Dropdown
                    value={selectedValue}
                    options={dropdownOptions}
                    onChange={(e) => setSelectedValue(e.value)}
                    placeholder="Təchizatçı seçin"
                    optionLabel="name"
                    optionValue="code"
                    style={{ width: '250px' }}
                    filter
                    className="w-full md:w-14rem"
                />

                <label style={{ marginLeft: '20px' }}>Valyuta: </label>
                <Dropdown
                    value={selectedCurr}
                    options={dropdownOptionsCurr}
                    onChange={(e) => setSelectedCurr(e.value)}
                    placeholder="Valyuta Seçin"
                    style={{ width: '100px', marginLeft: '20px' }}
                    filter
                    defaultValue={dropdownOptionsCurr[0]}
                    className="w-full md:w-14rem"
                />
            </Card>
            <Card>
                <DataTable
                    value={items}
                    selectionMode="checkbox"
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    dataKey="procurementLineId"
                    tableStyle={{ minWidth: '45rem' }}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="itemCode" header="Mal Kodu" />
                    <Column field="itemName" header="Mal Adı" />
                    
                    <Column fiels='cardType' header="Tip" sortable></Column>
                    <Column field="sonAlis" header="Son Alış" sortable></Column>
                    <Column field="suggestedAmount" header="Tələb miqdarı" />
                    <Column field="amount" header="Təklif miqdarı" />
                    <Column
                        field="amount"
                        header="Təklif miqdarı"
                        body={(rowData, options) => (
                            <InputNumber
                                minFractionDigits={2}
                                value={rowData.amount}
                                onValueChange={(e) => handleAmountChange(e.value, options.rowIndex)}
                                disabled={!isRowSelected(rowData)}
                            />
                        )}
                    />
                    <Column
                        field="price"
                        header="Qiymət"
                        body={(rowData, options) => (
                            <InputNumber
                                minFractionDigits={2}
                                value={rowData.price}
                                onValueChange={(e) => handlePriceChange(e.value, options.rowIndex)}
                                disabled={!isRowSelected(rowData)}
                            />
                        )}
                    />
                    <Column
                        field="isIncludeVat"
                        header="ƏDV-li"
                        body={(rowData, options) => (
                            <Checkbox
                                checked={rowData.isIncludeVat}
                                onChange={(e) => handleVatChange(e.checked, options.rowIndex)}
                                disabled={!isRowSelected(rowData)}
                            />
                        )}
                    />
                    <Column field="total" header="Məbləğ" />
                </DataTable>

            </Card>
            <Card>
                <FileUpload
                    name="demo[]"
                    multiple
                    customUpload
                    auto
                    onSelect={onFileSelect}
                    chooseLabel="Browse"
                    uploadLabel=""
                    cancelLabel=""
                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                    itemTemplate=""
                    uploadHandler={handleFileUpload}
                />


            </Card>
            <ConfirmDialog />
            <Btn>
            <Button label="Yadda Saxla" icon="pi pi-check" onClick={confirm1} />
            </Btn>
            <br />
        </NewForm>
    );
};


const NewForm = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .p-fileupload-file-badge{
        display:none;
    }
`;

const Card = styled.div`
    margin-bottom: 20px;
    margin-top: 20px;
`;

const Btn = styled.div`
    display: flex;
`;