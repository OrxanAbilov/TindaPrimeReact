import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { GET_SPECIAL_SETTINGS_OPERATIONS, GET_ALL_CLIENTS } from '../../../../features/clients/services/api';
import { BiSearch } from 'react-icons/bi';
import styled from 'styled-components';

const AddDialog = ({ visible, onHide, onSave, newBlock, setNewBlock }) => {
    const [localBlock, setLocalBlock] = useState({
        blockeD_CODEs: [],
        typE_ID: 0,
        operatioN_IDs: []
    });

    const [operations, setOperations] = useState([]);
    const [clients, setClients] = useState([]);
    const [loadingOperations, setLoadingOperations] = useState(true);
    const [loadingClients, setLoadingClients] = useState(true);
    const [totalOperationRecords, setTotalOperationRecords] = useState(0);
    const [totalClientRecords, setTotalClientRecords] = useState(0);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedOperations, setSelectedOperations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [operationFilters, setOperationFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });
    const [clientFilters, setClientFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });

    const [clientSearch, setClientSearch] = useState({
        cari_kod: '',
        cari_isim: ''
    });

    const [operationSearch, setOperationSearch] = useState({
        name: '',
        desc: ''
    });

    useEffect(() => {
        setLocalBlock(newBlock || {
            blockeD_CODEs: [],
            typE_ID: 0,
            operatioN_IDs: []
        });
    }, [newBlock]);

    useEffect(() => {
        fetchOperations();
    }, [operationFilters]);

    useEffect(() => {
        fetchClients();
    }, [clientFilters]);

    const fetchOperations = async () => {
        setLoadingOperations(true);
        try {
            const response = await GET_SPECIAL_SETTINGS_OPERATIONS({
                ...operationFilters,
                start: operationFilters.first,
                pageSize: operationFilters.pageSize
            });
            setOperations(response.data.data);
            setTotalOperationRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Error fetching operations', error);
        }
        setLoadingOperations(false);
    };

    const fetchClients = async () => {
        setLoadingClients(true);
        try {
            const response = await GET_ALL_CLIENTS({
                ...clientFilters,
                start: clientFilters.first,
                pageSize: clientFilters.pageSize
            });
            setClients(response.data.data);
            setTotalClientRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Error fetching clients', error);
        }
        setLoadingClients(false);
    };

    const handleSearchChange = (e, colName, searchSetter) => {
        const { value } = e.target;
        searchSetter(prev => ({ ...prev, [colName]: value }));
    };

    const handleSearchClick = (filterSetter, currentFilters) => {
        const searchList = Object.keys(clientSearch).filter(key => clientSearch[key]).map(key => ({
            colName: key,
            value: clientSearch[key]
        }));
        filterSetter({
            ...currentFilters,
            first: 0,
            searchList
        });
    };

    const handleSearchClickOpe = (filterSetter, currentFilters) => {
        const searchList = Object.keys(operationSearch).filter(key => operationSearch[key]).map(key => ({
            colName: key,
            value: operationSearch[key]
        }));
        filterSetter({
            ...currentFilters,
            first: 0,
            searchList
        });
    };

    const handleKeyPress = (event, filterSetter, currentFilters) => {
        if (event.key === 'Enter') {
            handleSearchClick(filterSetter, currentFilters);
        }
    };

    const handleKeyPress2 = (event, filterSetter, currentFilters) => {
        if (event.key === 'Enter') {
            handleSearchClickOpe(filterSetter, currentFilters);
        }
    };


    const handleSave = () => {
        if (selectedClients.length === 0 || selectedOperations.length === 0) {
            setErrorMessage('Ən azı 1 müştəri və əməliyyat seçilməlidir .');
            return;
        }
        
        const blockToSave = {
            ...localBlock,
            blockeD_CODEs: selectedClients.map(client => client.cari_kod),
            operatioN_IDs: selectedOperations.map(operation => operation.id),
            typE_ID: 1
        };
        setErrorMessage('');
        onSave(blockToSave);
    };
    
    const onOperationPageChange = (event) => {
        const { first, rows } = event;
        setOperationFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const onClientPageChange = (event) => {
        const { first, rows } = event;
        setClientFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const clearSelections = () => {
        setSelectedClients([]);
        setSelectedOperations([]);
    };

    const handleCloseDialog = () => {
        clearSelections();
        setErrorMessage(''); 
        onHide();
    };

    const renderClientHeader = () => (
        <div>
            <InputContainer>
                <input
                    type="text"
                    value={clientSearch.cari_kod}
                    onChange={(e) => handleSearchChange(e, 'cari_kod', setClientSearch)}
                    placeholder="Müştəri Kod"
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '8px'
                    }}
                    onKeyPress={(e) => handleKeyPress(e, setClientFilters, clientFilters)}
                />
                <input
                    type="text"
                    value={clientSearch.cari_isim}
                    onChange={(e) => handleSearchChange(e, 'cari_isim', setClientSearch)}
                    placeholder="Müştəri Ad"
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onKeyPress={(e) => handleKeyPress(e, setClientFilters, clientFilters)}
                />
                <SearchIcon onClick={() => handleSearchClick(setClientFilters, clientFilters)}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const renderOperationHeader = () => (
        <div>
            <InputContainer>
                <input
                    type="text"
                    value={operationSearch.name}
                    onChange={(e) => handleSearchChange(e, 'name', setOperationSearch)}
                    placeholder="Ad"
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '8px'
                    }}
                    onKeyPress={(e) => handleKeyPress2(e, setOperationFilters, operationFilters)}
                />
                <input
                    type="text"
                    value={operationSearch.desc}
                    onChange={(e) => handleSearchChange(e, 'desc', setOperationSearch)}
                    placeholder="Açıqlama"
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onKeyPress={(e) => handleKeyPress(e, setOperationFilters, operationFilters)}
                />
                <SearchIcon onClick={() => handleSearchClickOpe(setOperationFilters, operationFilters)}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    return (
        <Dialog visible={visible} onHide={handleCloseDialog} header="Yeni əməliyyat bloku" style={{ width: '90vw' }}>
            <div className="p-fluid" style={{ display: 'flex', gap: '2rem' }}>
                <div className="p-field" style={{ flex: 1 }}>
                    <label>Müştərilər</label>
                    <DataTable
                        value={clients}
                        selection={selectedClients}
                        onSelectionChange={(e) => {
                            setSelectedClients(e.value);
                            setLocalBlock(prevBlock => ({
                                ...prevBlock,
                                blockeD_CODEs: e.value.map(client => client.cari_kod)
                            }));
                        }}
                        rows={clientFilters.pageSize}
                        totalRecords={totalClientRecords}
                        dataKey="cari_kod"
                        onPage={onClientPageChange}
                        loading={loadingClients}
                        header={renderClientHeader()}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="cari_kod" header="Müştəri Kod" />
                        <Column field="cari_isim" header="Müştəri Ad" />
                    </DataTable>
                    <Paginator
                        first={clientFilters.first}
                        rows={clientFilters.pageSize}
                        totalRecords={totalClientRecords}
                        rowsPerPageOptions={[5, 10, 50, 100]}
                        onPageChange={onClientPageChange}
                    />
                </div>
                <div className="p-field" style={{ flex: 1 }}>
                    <label>Əməliyyatlar</label>
                    <DataTable
                        value={operations}
                        selection={selectedOperations}
                        onSelectionChange={(e) => {
                            setSelectedOperations(e.value);
                            setLocalBlock(prevBlock => ({
                                ...prevBlock,
                                operatioN_IDs: e.value.map(operation => operation.id)
                            }));
                        }}
                        rows={operationFilters.pageSize}
                        totalRecords={totalOperationRecords}
                        dataKey="id"
                        onPage={onOperationPageChange}
                        loading={loadingOperations}
                        header={renderOperationHeader()}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="name" header="Name" />
                        <Column field="desc" header="Des" />
                    </DataTable>

                    <Paginator
                        first={operationFilters.first}
                        rows={operationFilters.pageSize}
                        totalRecords={totalOperationRecords}
                        rowsPerPageOptions={[5, 10, 50, 100]}
                        onPageChange={onOperationPageChange}
                    />
                </div>
            </div>
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
            <div className="p-field">
                <Button label="Əlavə et" onClick={handleSave} />
            </div>
        </Dialog>
    );
};

const InputContainer = styled.div`
    display: flex;
    align-items: center;
`;

const SearchIcon = styled.div`
    padding: 0 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

export default AddDialog;
