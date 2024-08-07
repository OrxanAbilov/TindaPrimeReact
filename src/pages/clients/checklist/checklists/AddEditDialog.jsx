import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { BiSearch, BiPencil, BiTrash, BiPlus } from 'react-icons/bi';
import { 
    GET_CHECKLIST_CLIENT_REL_BY_CHEKLIST_ID,
    GET_QUESTIONS_BY_CHECKLIST_ID,
    GET_ALL_QUESTIONS,
    GET_SALESMEN_BY_CHECKLIST_ID,
    GET_ALL_SALESMEN,
    POST_NEW_CHECKLIST,
    EDIT_CHECKLIST
} from '../../../../features/clients/services/api';

const AddEditDialog = ({ visible, onHide, newChecklist, setNewChecklist, onSave, header }) => {

    const [clientData, setClientData] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10); 
    const [questionsData, setQuestionsData] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionDialogVisible, setQuestionDialogVisible] = useState(false);
    const [allQuestions, setAllQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [allQuestionsLoading, setAllQuestionsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const [salesmenData, setSalesmenData] = useState([]);
    const [salesmenLoading, setSalesmenLoading] = useState(false);
    const [salesmanDialogVisible, setSalesmanDialogVisible] = useState(false);
    const [allSalesmen, setAllSalesmen] = useState([]);
    const [selectedSalesmen, setSelectedSalesmen] = useState([]);
    const [allSalesmenLoading, setAllSalesmenLoading] = useState(false);

    
    // const onPageChange1 = (event) => {
    //     setFirst(event.first);
    //     setRows(event.rows);
    // };
    
    const onPageChange = (event) => {
        const { first, rows } = event;
        setFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const rowsPerPageOptions = [5, 10, 50, 100];

    
    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
            <InputContainer>
                {field === 'begiN_DATE' || field === 'enD_DATE' ? (
                    <Calendar
                        value={filters[field]}
                        onChange={(e) => handleInputChange(field, e.value)}
                        dateFormat="dd-mm-yy"
                        placeholder={placeholder}
                        showIcon
                        className="p-inputtext"
                        style={{ fontSize: '4px', padding: '0px', minWidth: '12rem' }}
                    />
                ) : (
                    <input
                        type="text"
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
                )}
                <SearchIcon onClick={handleSearchClick}><BiSearch size={16} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'slS_CODE' },
        { colName: 'slS_NAME' },
        { colName: 'manageR_SLS_CODE' },
        { colName: 'question' },
        { colName: 'desc' },
        { colName: 'questioN_GROUP_NAME' },
        { colName: 'ratE_TYPE' },
        { colName: 'answeR_TYPE' },
    ]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
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

    useEffect(() => {
        if (visible) {
            fetchData();
        }
    }, [visible]);

    useEffect(() => {
        if (!newChecklist.checkListClientRelPostDtos) {
            setNewChecklist({
                ...newChecklist,
                checkListClientRelPostDtos: {
                    clienT_CODE: '*',
                    clspecode: '*',
                    clspecodE2: '*',
                    clspecodE3: '*',
                    clspecodE4: '*',
                    clspecodE5: '*',
                    cltype: '*',
                    clgroup: '*'
                }
            });
        }
    }, [newChecklist, setNewChecklist]);

    const fetchData = async () => {
        try {
            const data = await GET_CHECKLIST_CLIENT_REL_BY_CHEKLIST_ID(newChecklist.id);
            setClientData(data.data);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const statusOptions = [
        { label: 'Aktiv', value: true },
        { label: 'Passiv', value: false }
    ];

    const handleDateChange = (name, value) => {
        const utcDate = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)) : null;
        setNewChecklist({
            ...newChecklist,
            [name]: utcDate
        });
    };

    const addEntry = () => {
        if (editMode) {
            const updatedData = [...clientData];
            updatedData[editIndex] = { ...newChecklist.checkListClientRelPostDtos };
            setClientData(updatedData);
            setEditMode(false);
            setEditIndex(null);
        } else {
            const newEntry = {
                clienT_CODE: newChecklist.checkListClientRelPostDtos.clienT_CODE || '*',
                clspecode: newChecklist.checkListClientRelPostDtos.clspecode || '*',
                clspecodE2: newChecklist.checkListClientRelPostDtos.clspecodE2 || '*',
                clspecodE3: newChecklist.checkListClientRelPostDtos.clspecodE3 || '*',
                clspecodE4: newChecklist.checkListClientRelPostDtos.clspecodE4 || '*',
                clspecodE5: newChecklist.checkListClientRelPostDtos.clspecodE5 || '*',
                cltype: newChecklist.checkListClientRelPostDtos.cltype || '*',
                clgroup: newChecklist.checkListClientRelPostDtos.clgroup || '*'
            };
            setClientData([...clientData, newEntry]);
        }
        setNewChecklist({
            ...newChecklist,
            checkListClientRelPostDtos: {
                clienT_CODE: '*',
                clspecode: '*',
                clspecodE2: '*',
                clspecodE3: '*',
                clspecodE4: '*',
                clspecodE5: '*',
                cltype: '*',
                clgroup: '*'
            }
        });
    };
    

    const deleteRow = (rowData) => {
        const updatedData = clientData.filter(item => item !== rowData);
        setClientData(updatedData);
    };

    const editRow = (rowData, index) => {
        setNewChecklist({
            ...newChecklist,
            checkListClientRelPostDtos: { ...rowData }
        });
        setEditMode(true);
        setEditIndex(index);
    };
    

    const deleteQuestion = (rowData) => {
        const updatedQuestions = questionsData.filter(question => question.id !== rowData.id);
        setQuestionsData(updatedQuestions);
    };

    const deleteSalesman = (rowData) => {
        const updatedSalesmen = salesmenData.filter(item => item !== rowData);
        setSalesmenData(updatedSalesmen);
    };

    
    const deleteButtonTemplate = (rowData) => {
        return (
            <Button icon="pi pi-trash" onClick={() => deleteRow(rowData)} className="p-button-rounded p-button-text"
            style={{color: 'red'}} />
        );
    };
    
    const editButtonTemplate = (rowData, { rowIndex }) => {
        return (
            <Button icon="pi pi-pencil" onClick={() => editRow(rowData, rowIndex)} className="p-button-rounded p-button-text"
            style={{color: 'blue'}} />
        );
    };
    
    const deleteButtonTemplate2 = (rowData) => {
        return (
            <Button icon="pi pi-trash" onClick={() => deleteQuestion(rowData)} className="p-button-rounded p-button-text"
            style={{color: 'red'}} />
        );
    };

    const deleteButtonTemplate3 = (rowData) => {
        return (
            <Button icon="pi pi-trash" onClick={() => deleteSalesman(rowData)} className="p-button-rounded p-button-text"
            style={{color: 'red'}} />
        );
    };

    const handleSave = async () => {
        if (validate()) {
        const mappedClientData = clientData.map(entry => ({
            cL_ID: newChecklist.id,
            clienT_CODE: entry.clienT_CODE,
            clspecode: entry.clspecode,
            clspecodE2: entry.clspecodE2,
            clspecodE3: entry.clspecodE3,
            clspecodE4: entry.clspecodE4,
            clspecodE5: entry.clspecodE5,
            cltype: entry.cltype,
            clgroup: entry.clgroup
        }));
    
        const mappedQuestions = questionsData.map(question => ({
            cL_ID: newChecklist.id,
            q_ID: question.q_ID || question.id
        }));
    
        const mappedSalesmen = salesmenData.map(salesman => ({
            cL_ID: newChecklist.id,
            slS_CODE: salesman.slS_CODE
        }));
    

        const postData = {
            id: newChecklist.isCopy ? 0 : newChecklist.id, // Use 0 for a new copy, original ID for editing
            code: newChecklist.code,
            desC_: newChecklist.desC_,
            specode: newChecklist.specode,
            begiN_DATE: newChecklist.begiN_DATE,
            enD_DATE: newChecklist.enD_DATE,
            statuS_: newChecklist.statuS_,
            deL_STATUS: false,
            checkListQuestionRelPostDto: mappedQuestions,
            checkListSalesmanRelPostDtos: mappedSalesmen,
            checkListClientRelPostDtos: mappedClientData
        };
        onSave();
        if (postData?.id > 0) {
            try {
                console.log('editData CHECKLIST:',postData);
                await EDIT_CHECKLIST(postData);
                } catch (error) {
                    console.error('Error saving question', error);
                }
            } 
            else {
            try {
                console.log('postData CHECKLIST:',postData);
                await POST_NEW_CHECKLIST(postData);
                } catch (error) {
                console.error('Error saving question', error);
                }
            }
        }
    };

    const fetchQuestions = async () => {
        setQuestionsLoading(true);
        try {
            const data = await GET_QUESTIONS_BY_CHECKLIST_ID(newChecklist.id, { start: 0, pageSize: 500 });
            setQuestionsData(data.data.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };
    
    useEffect(() => {
        if (visible) {
            fetchQuestions();
        }
    }, [visible]);

    const fetchAllQuestions = async () => {
        setAllQuestionsLoading(true);
        try {
            const data = await GET_ALL_QUESTIONS({ 
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize
             });
            setAllQuestions(data.data.data);
            setTotalRecords(data.data.totalRecords);
        } catch (error) {
            console.error('Error fetching all questions:', error);
        } finally {
            setAllQuestionsLoading(false);
        }
    };

    useEffect(() => {
        if (questionDialogVisible) {
            fetchAllQuestions();
        }
    }, [questionDialogVisible, filters]);


    const fetchSalesmen = async () => {
        setSalesmenLoading(true);
        try {
            const data = await GET_SALESMEN_BY_CHECKLIST_ID(newChecklist.id, {start: 0, pageSize: 500});
            setSalesmenData(data.data.data);
        } catch (error) {
            console.error('Error fetching salesmen:', error);
        } finally {
            setSalesmenLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchSalesmen();
        }
    }, [visible]);

    const fetchAllSalesmen = async () => {
        setAllSalesmenLoading(true);
        try {
            const data = await GET_ALL_SALESMEN({
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize
            });
            setAllSalesmen(data.data.data);
            setTotalRecords(data.data.totalRecords);
        } catch (error) {
            console.error('Error fetching all salesmen:', error);
        } finally {
            setAllSalesmenLoading(false);
        }
    };

    useEffect(() => {
        if (salesmanDialogVisible) {
            fetchAllSalesmen();
        }
    }, [salesmanDialogVisible,filters]);

    const addSelectedQuestions = () => {
        const uniqueQuestions = selectedQuestions.filter(selectedQuestion => {
            return !questionsData.some(question => (question.q_ID === selectedQuestion.id) || (question.id === selectedQuestion.id));
        });
    
        setQuestionsData(prevQuestions => [...prevQuestions, ...uniqueQuestions]);
        setQuestionDialogVisible(false);
        setSelectedQuestions([]);
    };

    const addSelectedSalesmen = () => {
        const uniqueSalesmen = selectedSalesmen.filter(selectedSalesmen => {
            return !salesmenData.some(salesman => salesman.slS_CODE === selectedSalesmen.slS_CODE);
        });
    
        setSalesmenData(prevSalesmen => [...prevSalesmen, ...uniqueSalesmen]);
        setSalesmanDialogVisible(false);
        setSelectedSalesmen([]);

    };

    const validate = () => {
        const errors = {};
        if (!newChecklist.desC_) errors.desC_ = '* Açıqlamanı qeyd edin';
        if (!newChecklist.begiN_DATE) errors.begiN_DATE = '* Başlama vaxtını qeyd edin';
        if (!newChecklist.enD_DATE) errors.enD_DATE = '* Bitmə vaxtını qeyd edin';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    return (
        <Dialog header={header} visible={visible} style={{ width: '95vw' }} modal onHide={onHide}>
            <TabView>
                <TabPanel header="Əsas">
                    <div className="p-fluid">
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="code">Kod</label>
                                <InputText
                                    id="code"
                                    value={newChecklist.code}
                                    onChange={(e) => setNewChecklist({ ...newChecklist, code: e.target.value })}
                                    className="p-inputtext-lg p-d-block my-2"
                                    disabled
                                />
                            </div>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="desC_">Açıqlama</label>
                                <InputText
                                    id="desc"
                                    value={newChecklist.desC_}
                                    onChange={(e) => setNewChecklist({ ...newChecklist, desC_: e.target.value })}
                                    className="p-inputtext-lg p-d-block my-2"
                                    required
                                />
                            {validationErrors.desC_ && <small className="p-error">{validationErrors.desC_}</small>}
                            </div>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="specode">Özəl kod</label>
                                <InputText
                                    id="name"
                                    value={newChecklist.specode}
                                    onChange={(e) => setNewChecklist({ ...newChecklist, specode: e.target.value })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                        </div>
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="begiN_DATE">Başlama vaxtı</label>
                                <Calendar
                                    id="begiN_DATE"
                                    name="begiN_DATE"
                                    value={newChecklist.begiN_DATE}
                                    onChange={(e) => handleDateChange('begiN_DATE', e.value)}
                                    dateFormat='dd-mm-yy'
                                    className="p-inputtext-lg p-d-block my-2"
                                    required
                                />
                            {validationErrors.begiN_DATE && <small className="p-error">{validationErrors.begiN_DATE}</small>}
                            </div>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="enD_DATE">Bitmə vaxtı</label>
                                <Calendar
                                    id="enD_DATE"
                                    name="enD_DATE"
                                    value={newChecklist.enD_DATE}
                                    onChange={(e) => handleDateChange('enD_DATE', e.value)}
                                    className="p-inputtext-lg p-d-block my-2"
                                    dateFormat='dd-mm-yy'
                                    required
                                />
                                {validationErrors.enD_DATE && <small className="p-error">{validationErrors.enD_DATE}</small>}
                            </div>
                            <div className="p-field" style={{ width: '33.3%' }}>
                                <label htmlFor="statuS_">Status</label>
                                <Dropdown
                                    id="statuS_"
                                    value={newChecklist.statuS_}
                                    options={statusOptions}
                                    onChange={(e) => setNewChecklist({ ...newChecklist, statuS_: e.value })}
                                    placeholder="Status seçin"
                                    className="p-inputtext-lg p-d-block my-2"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </TabPanel>
                
                <TabPanel header="Suallar">
                    <div className="p-fluid">
                    <Button style={{margin:'1rem 0 1rem 0'}} label="Yeni Sual Əlavə Et" icon="pi pi-plus" onClick={() => setQuestionDialogVisible(true)} />
                        {questionsLoading ? (
                            <p>Yüklənir...</p>
                        ) : (
                            <DataTable value={questionsData} paginator rows={5}                                 rowsPerPageOptions={rowsPerPageOptions}>
                                <Column field="question" header="Ad" />
                                <Column field="desc" header="Sual" />
                                <Column field="questioN_GROUP_NAME" header="Sual qrupu" />
                                <Column field="ratE_TYPE" header="Qiymətləndirmə tipi" />
                                <Column field="answeR_TYPE" header="Cavab tipi" />
                                <Column headerStyle={{ width: '6rem' }} body={deleteButtonTemplate2} />
                            </DataTable>
                        )}
                    </div>
                </TabPanel>

                <TabPanel header="Təmsilçilər">
                <div className="p-fluid">
                    <Button style={{margin:'1rem 0 1rem 0'}} label="Yeni Təmsilçi Əlavə Et" icon="pi pi-plus" onClick={() => setSalesmanDialogVisible(true)} />
                        {salesmenLoading ? (
                            <p>Yüklənir...</p>
                        ) : (
                            <DataTableContainer>
                                <DataTable value={salesmenData}
                                    paginator
                                    rows={5}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                >
                                    <Column field="slS_CODE" header="Kod" />
                                    <Column field="slS_NAME" header="Ad" />
                                    <Column field="manageR_SLS_CODE" header="Menecer Kodu" />
                                    <Column headerStyle={{ width: '6rem' }} header="#" body={deleteButtonTemplate3} />
                                </DataTable>
                            </DataTableContainer>
                        )}
                    </div>
                </TabPanel>
                
                <TabPanel header="Müştərilər">
                    <div className="p-fluid">
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clienT_CODE">Müştəri Kodu</label>
                                <InputText
                                    id="clienT_CODE"
                                    value={newChecklist.checkListClientRelPostDtos?.clienT_CODE}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clienT_CODE: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clspecode">Özəl Kod 1</label>
                                <InputText
                                    id="clspecode"
                                    value={newChecklist.checkListClientRelPostDtos?.clspecode}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clspecode: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clspecodE2">Özəl Kod 2</label>
                                <InputText
                                    id="clspecodE2"
                                    value={newChecklist.checkListClientRelPostDtos?.clspecodE2}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clspecodE2: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clspecodE3">Özəl Kod 3</label>
                                <InputText
                                    id="clspecodE3"
                                    value={newChecklist.checkListClientRelPostDtos?.clspecodE3}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clspecodE3: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                        </div>
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clspecodE4">Özəl Kod 4</label>
                                <InputText
                                    id="clspecodE4"
                                    value={newChecklist.checkListClientRelPostDtos?.clspecodE4}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clspecodE4: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clspecodE5">Özəl Kod 5</label>
                                <InputText
                                    id="clspecodE5"
                                    value={newChecklist.checkListClientRelPostDtos?.clspecodE5}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clspecodE5: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="cltype">Müştəri Tipi</label>
                                <InputText
                                    id="cltype"
                                    value={newChecklist.checkListClientRelPostDtos?.cltype}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            cltype: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                            <div className="p-field" style={{ width: '23%' }}>
                                <label htmlFor="clgroup">Müştəri Qrupu</label>
                                <InputText
                                    id="clgroup"
                                    value={newChecklist.checkListClientRelPostDtos?.clgroup}
                                    onChange={(e) => setNewChecklist({
                                        ...newChecklist,
                                        checkListClientRelPostDtos: {
                                            ...newChecklist.checkListClientRelPostDtos,
                                            clgroup: e.target.value
                                        }
                                    })}
                                    className="p-inputtext-lg p-d-block my-2"
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ marginBottom: '1rem', width:'15%'}}>
                                {/* <Button onClick={addEntry} severity="secondary" ><BiPlus size={18} />Əlavə et</Button> */}
                                <Button label={editMode ? "Dəyişdir" : "Əlavə et"} severity="secondary" icon={ editMode? "pi pi-check" : "pi pi-plus"} onClick={addEntry} />
                            </div>
                            <DataTableContainer>
                                <DataTable value={clientData}
                                paginator
                                rows={5}
                                rowsPerPageOptions={rowsPerPageOptions}
                                >
                                    <Column field="clienT_CODE" header="Müştəri kodu" />
                                    <Column field="clspecode" header="Özəl kod" />
                                    <Column field="clspecodE2" header="Özəl kod2" />
                                    <Column field="clspecodE3" header="Özəl kod3" />
                                    <Column field="clspecodE4" header="Özəl kod4" />
                                    <Column field="clspecodE5" header="Özəl kod5" />
                                    <Column field="cltype" header="Müştəri tipi" />
                                    <Column field="clgroup" header="Müştəri qrupu" />
                                    {/* <Column body={editButtonTemplate} style={{ textAlign: 'center', width: '8em' }} /> */}
                                    <Column headerStyle={{ width: '1rem' }} body={deleteButtonTemplate} />
                                    <Column headerStyle={{ width: '1rem' }} body={editButtonTemplate} />
                                </DataTable>
                            </DataTableContainer>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
            <div className="p-dialog-footer" style={{ marginTop: '15px', padding: '0' }}>
                <Button label="Yadda saxla" onClick={handleSave} className="p-button-primary" />
                <Button label="Ləğv et" onClick={onHide} className="p-button-secondary" />
            </div>

            <Dialog header="Sual seç" visible={questionDialogVisible} style={{ width: '70vw' }} modal onHide={() => setQuestionDialogVisible(false)}>
                <div className="p-fluid">
                    {allQuestionsLoading ? (
                        <p>Yüklənir...</p>
                    ) : (
                        <DataTableContainer>
                            <DataTable 
                                value={allQuestions} 
                                selection={selectedQuestions}
                                onSelectionChange={e => setSelectedQuestions(e.value)} 
                                paginator={false}
                                rows={filters.pageSize}
                                totalRecords={totalRecords}
                                lazy
                                onPage={onPageChange}
                                first={filters.first}
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="question" header={renderHeader('question', 'Ad')} />
                                <Column field="desc" header={renderHeader('desc', 'Sual')} />
                                <Column field="questioN_GROUP_NAME" header={renderHeader('questioN_GROUP_NAME', 'Sual qrupu')} />
                                <Column field="ratE_TYPE"  header={renderHeader('ratE_TYPE', 'Qiymətləndirmə tipi')} />
                                <Column field="answeR_TYPE"  header={renderHeader('answeR_TYPE', 'Cavab tipi')} />
                            </DataTable>
                            <Paginator
                                first={filters.first}
                                rows={filters.pageSize}
                                totalRecords={totalRecords}
                                rowsPerPageOptions={[5, 10, 50, 100]}
                                onPageChange={onPageChange}
                            />
                        </DataTableContainer>
                    )}
                </div>
                <div className="p-dialog-footer mt-6">
                    <Button label="Əlavə et" icon="pi pi-check" onClick={addSelectedQuestions} className="p-button-primary" />
                    <Button label="Ləğv et" icon="pi pi-times" onClick={() => setQuestionDialogVisible(false)} className="p-button-secondary" />
                </div>
             </Dialog>

             <Dialog header="Təmsilçi seç" visible={salesmanDialogVisible} style={{ width: '70vw' }} modal onHide={() => setSalesmanDialogVisible(false)}>
                <div className="p-fluid">
                    {allSalesmenLoading ? (
                        <p>Yüklənir...</p>
                    ) : (
                        <DataTableContainer>
                            <DataTable
                            value={allSalesmen}
                            selection={selectedSalesmen}
                            onSelectionChange={e => setSelectedSalesmen(e.value)} 
                            paginator={false}
                            rows={filters.pageSize}
                            totalRecords={totalRecords}
                            lazy
                            onPage={onPageChange}
                            first={filters.first}
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="slS_CODE"  header={renderHeader('slS_CODE', 'Təmsilçi Kod')} />
                                <Column field="slS_NAME" header={renderHeader('slS_NAME', 'Təmsilçi Ad')} />
                                <Column field="manageR_SLS_CODE" header={renderHeader('manageR_SLS_CODE', 'Menecer Kod')} />
                            </DataTable>
                            <Paginator
                                first={filters.first}
                                rows={filters.pageSize}
                                totalRecords={totalRecords}
                                rowsPerPageOptions={[5, 10, 50, 100]}
                                onPageChange={onPageChange}
                            />
                        </DataTableContainer>
                    )}
                </div>
                <div className="p-dialog-footer mt-6">
                    <Button label="Əlavə et" icon="pi pi-check" onClick={addSelectedSalesmen} className="p-button-primary" />
                    <Button label="Ləğv et" icon="pi pi-times" onClick={() => setSalesmanDialogVisible(false)} className="p-button-secondary" />
                </div>
             </Dialog>

        </Dialog>
    );
};

AddEditDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    newChecklist: PropTypes.object.isRequired,
    setNewChecklist: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
};

const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 1350px;
  font-size: 12px;
`;

const Truncate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
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

export default AddEditDialog;
