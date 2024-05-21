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
import { GET_CARI_HESAPLAR_FOR_DROP_DOWN,ADD_NEW_SUGGESTION } from '../../../features/procurement/services/api';
import { InputNumber } from 'primereact/inputnumber';
import {
    setData,
    setError,
    setIsLoading,
} from "../../../features/procurement/procurementDetails/procurementDetailSlice";
import { useSelector } from 'react-redux';


export default function SuggestionNewDialog({ procDetails,onClose  }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [items, setItems] = useState([]);
    const toast = useRef(null);
    const [files, setFiles] = useState([]);
    //const [price, setPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { data, error, isLoading } = useSelector((state) => state.procurementDetailSlice);
    const [refresh, setRefresh] = useState(false);

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
    }, [refresh]);

    useEffect(() => {
        const newItems = procDetails.procurementLines.map(item => ({
            ...item,
            price: null,
            total: 0
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

    // const handleFileUpload = (event) => {
    //     const uploadedFiles = event.files.map(file => ({
    //         id: 0,
    //         fileName: file.name,
    //         base64File: '' // You need to convert the file to base64
    //     }));
    //     setFiles(uploadedFiles);
    // };

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
            items: selectedItems,
            total: selectedItems.reduce((acc, item) => acc + item.total, 0),
            files: files
        };
        try {
            const responseData = await ADD_NEW_SUGGESTION(postData);
            toast.current.show({ severity: 'success', summary: 'Uğurlu əməliyyat', detail: 'Məlumat uğurla göndərildi', life: 3000 });
            onClose();
        } catch (error) {
            // Handle error
            console.log('Error adding new suggestion:', error.response.data.Exception[0]);
            toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
            // Optionally, you can show an error message to the user
        }
        
    };

    const editorInputText = (rowData, field) => {
        return (
            <InputText
                value={rowData[field]}
                onChange={(e) => onEditorValueChange(rowData, field, e.target.value)}
            />
        );
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
            defaultFocus: 'handleSubmit',
            accept: handleSubmit,
            acceptLabel: "Yadda saxla",
            rejectLabel: "Ləğv et",
            handleSubmit:true
            
        });
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
                    optionLabel="cari_unvan1"
                    optionValue="cari_kod"
                    style={{ width: '350px' }}
                    filter
                    className="w-full md:w-14rem"
                />
            </Card>
            <Card>
                <DataTable
                    value={items}
                    selectionMode="checkbox"
                    selection={selectedItems}
                    onSelectionChange={(e) => setSelectedItems(e.value)}
                    dataKey="id"
                    tableStyle={{ minWidth: '45rem' }}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="itemCode" header="Mal Kodu" />
                    <Column field="itemName" header="Mal Adı" />
                    <Column field="amount" header="Miqdar" />
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
                    <Column field="total" header="Məbləğ" />
                </DataTable>

            </Card>
            <Card>
                {/* <FileUpload 
                    name="demo[]" 
                    url={'/api/upload'} 
                    multiple 
                    accept="image/*" 
                    maxFileSize={1000000} 
                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>} 
                    onUpload={onFileUpload} 
                /> */}

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
                <ConfirmDialog/>
            <Button label="Yadda Saxla" icon="pi pi-check" onClick={confirm1} />
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