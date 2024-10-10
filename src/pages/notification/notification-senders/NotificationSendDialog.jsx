import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import { GET_ALL_SALESMEN, GET_NOTIFICATION_OPERATIONS_FOR_DROPDOWN } from '../../../features/notification/services/api';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';

const NotificationSendDialog = ({ visible, onHide, header, onSave }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'userS_ID',
        searchList: []
    });
    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'slS_CODE' },
        { colName: 'slS_NAME' },
        { colName: 'manageR_SLS_CODE' },
    ]);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [selectedSalesmen, setSelectedSalesmen] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        body: '',
        image: '',
        operation: '',
        salesman: ''
    });

    useEffect(() => {
        if (visible) {
            fetchData();
            fetchDropdownOptions();
        }
    }, [visible, filters]);

    useEffect(() => {
        if (!visible) {
            // Clear errors when modal is closed
            setFieldErrors({
                title: '',
                body: '',
                image: '',
                operation: '',
                salesman: ''
            });
        }
    }, [visible]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_SALESMEN({
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize
            });
            setData(response.data.data);
            setTotalRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Error fetching data', error);
            setError('Error fetching data');
        }
        setLoading(false);
    };

    const fetchDropdownOptions = async () => {
        try {
            const response = await GET_NOTIFICATION_OPERATIONS_FOR_DROPDOWN();
            setDropdownOptions(response.data || []);
        } catch (error) {
            console.error('Error fetching dropdown options', error);
            setDropdownOptions([]);
        }
    };

    const handleSearchClick = () => {
        setFilters({
            ...filters,
            searchList: searchCriteria.filter(criteria => criteria.value !== '' && criteria.value !== null && criteria.value !== undefined)
        });
    };

    const handleInputChange = (colName, value) => {
        setSearchCriteria(prevCriteria =>
            prevCriteria.map(criteria =>
                criteria.colName === colName ? { ...criteria, value } : criteria
            )
        );
    };

    const onPageChange = (event) => {
        const { first, rows } = event;
        setFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const validateFields = () => {
        const errors = {};
        if (!title.trim()) errors.title = 'Başlıq boş ola bilməz';
        if (!body.trim()) errors.body = 'Mesaj boş ola bilməz';
        // if (!image.trim()) errors.image = 'Şəkil boş ola bilməz';
        if (!selectedOperation) errors.operation = 'Əməliyyat seçilməlidir';
        if (selectedSalesmen.length === 0) errors.salesman = 'Ən azı bir satışçı seçilməlidir';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        // Validate fields
        if (!validateFields()) {
            return;
        }

        const userIds = selectedSalesmen.map(salesman => salesman.userS_ID);

        const payload = {
            userIds,
            body,
            title,
            image,
            operation: selectedOperation?.code || '',
            operatioN_DESC: selectedOperation?.desc || ''
        };

        onSave(payload);
    };

    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
            <InputContainer>
                <InputText
                    value={searchCriteria.find(criteria => criteria.colName === field)?.value || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onKeyPress={handleKeyPress}
                />
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    return (
        <Dialog header={header} visible={visible} style={{ width: '80vw' }} modal onHide={onHide}>
            <DialogContent>
                <FormContainer>
                    <div>
                        <label htmlFor="title">Başlıq</label>
                        <InputText
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        {fieldErrors.title && <ErrorText>{fieldErrors.title}</ErrorText>}
                    </div>
                    <div>
                        <label htmlFor="body">Mesaj</label>
                        <InputText
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Body"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        {fieldErrors.body && <ErrorText>{fieldErrors.body}</ErrorText>}
                    </div>
                    <div>
                        <label htmlFor="image">Şəkil</label>
                        <InputText
                            id="image"
                            value= {image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Image"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        {fieldErrors.image && <ErrorText>{fieldErrors.image}</ErrorText>}
                    </div>
                    <div>
                        <label htmlFor="operation">Əməliyyat seç</label>
                        <Dropdown
                            id="operation"
                            value={selectedOperation}
                            options={dropdownOptions}
                            onChange={(e) => setSelectedOperation(e.value)}
                            placeholder="Əməliyyat seç"
                            optionLabel="desc"
                            style={{ width: '100%' }}
                        />
                        {fieldErrors.operation && <ErrorText>{fieldErrors.operation}</ErrorText>}
                    </div>
                </FormContainer>
                <LeftPane>
                    {loading && <Loading />}
                    {error && <Error />}
                    {fieldErrors.salesman && <ErrorText>{fieldErrors.salesman}</ErrorText>}
                    {!loading && !error && (
                        <>
                            <DataTableContainer>
                                <DataTable
                                    value={data}
                                    rows={filters.pageSize}
                                    totalRecords={totalRecords}
                                    emptyMessage="Məlumat tapılmadı"
                                    className="p-datatable-sm"
                                    selectionMode="checkbox"
                                    selection={selectedSalesmen}
                                    onSelectionChange={e => setSelectedSalesmen(e.value)}
                                >
                                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                                    <Column
                                        field="slS_CODE"
                                        header={renderHeader('slS_CODE', 'Kod')}
                                        body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
                                    />
                                    <Column
                                        field="slS_NAME"
                                        header={renderHeader('slS_NAME', 'Ad')}
                                        body={(rowData) => <Truncate>{rowData.slS_NAME}</Truncate>}
                                    />
                                    <Column
                                        field="manageR_SLS_CODE"
                                        header={renderHeader('manageR_SLS_CODE', 'Manager Kod')}
                                        body={(rowData) => <Truncate>{rowData.manageR_SLS_CODE}</Truncate>}
                                    />
                                </DataTable>
                                <Paginator
                                    first={filters.first}
                                    rows={filters.pageSize}
                                    totalRecords={totalRecords}
                                    rowsPerPageOptions={[5, 10, 20, 100, 1000]}
                                    onPageChange={onPageChange}
                                />
                            </DataTableContainer>
                        </>
                    )}
                </LeftPane>
            </DialogContent>
            <Button
                label="Göndər"
                onClick={handleSave}
                style={{ marginTop: '20px', marginLeft: '90%' }}
            />
        </Dialog>
    );
};

NotificationSendDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired
};

const DialogContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const LeftPane = styled.div`
    flex: 1;
    padding-top: 10px;
`;

const DataTableContainer = styled.div`
    overflow-y: auto;
    width: 100%;
    font-size: 12px;
`;

const InputContainer = styled.div`
    margin-top: 5px;
    display: flex;
    align-items: center;
`;

const SearchIcon = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px;
`;

const Truncate = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
`;

const FormContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    margin-bottom: 20px;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 12px;
    margin-top: 2px;
`;

export default NotificationSendDialog;
