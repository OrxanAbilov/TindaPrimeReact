import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_CHECKLIST_RESULTS } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil } from 'react-icons/bi';
import { Calendar } from 'primereact/calendar';

const ChecklistResults = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });

    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'code' },
        { colName: 'slS_CODE' },
        { colName: 'slS_NAME' },
        { colName: 'date' },
        { colName: 'clienT_CODE' },
        { colName: 'clienT_NAME' },
        { colName: 'checK_LIST_DESC' },
        { colName: 'checK_LIST_SPECODE' },
        { colName: 'totaL_ANSWER_POINT' },
        { colName: 'totaL_QUESTION_POINT' },
        { colName: 'checK_LIST_PERCENTAGE' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChecklist, setNewChecklist] = useState({
        id: 0,
        slS_CODE: '',
        slS_NAME: '',
        date: '',
        clienT_CODE: '',
        clienT_NAME: '',
        checK_LIST_DESC: '',
        checK_LIST_SPECODE: '',
        totaL_ANSWER_POINT: '',
        totaL_QUESTION_POINT: '',
        checK_LIST_PERCENTAGE: ''
        });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_CHECKLIST_RESULTS({
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

    const handleEditClick = (rowData) => {
        setNewChecklist({
            id: rowData.id,
            code: rowData.code,
            desC_: rowData.desC_,
            specode: rowData.specode,
            begiN_DATE: rowData.begiN_DATE ? new Date(rowData.begiN_DATE) : null,
            enD_DATE: rowData.enD_DATE ? new Date(rowData.enD_DATE) : null,
            questioN_COUNT: rowData.questioN_COUNT,
            slS_COUNT: rowData.slS_COUNT,
            statuS_: rowData.statuS_
        });
        setIsModalOpen(true);
    };

    const openModal = () => {
        setNewChecklist({
            id: 0,
            code: '',
            desC_: '',
            specode: '',
            begiN_DATE: '',
            enD_DATE: '',
            questioN_COUNT: '',
            slS_COUNT: '',
            statuS_: true
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewChecklist({
            id: 0,
            code: '',
            desC_: '',
            specode: '',
            begiN_DATE: '',
            enD_DATE: '',
            questioN_COUNT: '',
            slS_COUNT: '',
            statuS_: true
        });
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error />;
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };
    

    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
            <InputContainer>
                {field === 'date' ? (
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
                            alignItems: 'center',
                            width: '150px'
                        }}
                        onKeyPress={handleKeyPress}
                    />
                )}
                <SearchIcon onClick={handleSearchClick}><BiSearch size={16} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const editButtonTemplate = (rowData) => (
        <ButtonContainer>
            <EditButton onClick={() => handleEditClick(rowData)}>
                <BiPencil size={16} />
            </EditButton>
        </ButtonContainer>
    );

    return (
        <Wrapper>
            <DataTableContainer>
                <DataTable
                    value={data}
                    paginator={false}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    lazy
                    loading={loading}
                    onPage={onPageChange}
                    first={filters.first}
                >
                    <Column
                        field="code"
                        header={renderHeader('code', 'Kod')}
                        body={(rowData) => <Truncate>{rowData.code}</Truncate>}
                    />
                    <Column
                        field="slS_CODE"
                        header={renderHeader('slS_CODE', 'Təmsilçi kod')}
                        body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
                    />
                    <Column
                        field="slS_NAME"
                        header={renderHeader('slS_NAME', 'Təmsilçi ad')}
                        body={(rowData) => <Truncate>{rowData.slS_NAME}</Truncate>}
                    />
                    <Column
                        field="date"
                        header={renderHeader('date', 'Tarix')}
                        body={(rowData) => <Truncate>{formatDate(rowData.date)}</Truncate>}
                    />
                    <Column
                        field="clienT_CODE"
                        header={renderHeader('clienT_CODE', 'Müştəri kod')}
                        body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
                    />
                    <Column
                        field="clienT_NAME"
                        header={renderHeader('clienT_NAME', 'Müştəri ad')}
                        body={(rowData) => <Truncate>{rowData.clienT_NAME}</Truncate>}
                    />
                    <Column
                        field="checK_LIST_CODE"
                        header={renderHeader('checK_LIST_CODE', 'Sorğu kodu')}
                        body={(rowData) => <Truncate>{rowData.checK_LIST_CODE}</Truncate>}
                    />
                    <Column
                        field="checK_LIST_DESC"
                        header={renderHeader('checK_LIST_DESC', 'Sorğu')}
                        body={(rowData) => <Truncate>{rowData.checK_LIST_DESC}</Truncate>}
                    />
                    <Column
                        field="checK_LIST_SPECODE"
                        header={renderHeader('checK_LIST_SPECODE', 'Sorğu özəl kod')}
                        body={(rowData) => <Truncate>{rowData.checK_LIST_SPECODE}</Truncate>}
                    />
                    <Column
                        field="totaL_ANSWER_POINT"
                        header={renderHeader('totaL_ANSWER_POINT', 'Təmsilçi balı')}
                        body={(rowData) => <Truncate>{rowData.totaL_ANSWER_POINT}</Truncate>}
                    />
                    <Column
                        field="totaL_QUESTION_POINT"
                        header={renderHeader('totaL_QUESTION_POINT', 'Maksimum bal')}
                        body={(rowData) => <Truncate>{rowData.totaL_QUESTION_POINT}</Truncate>}
                    />
                    <Column
                        field="checK_LIST_PERCENTAGE"
                        header={renderHeader('checK_LIST_PERCENTAGE', 'Sorğu nəticəsi')}
                        body={(rowData) => <Truncate>{rowData.checK_LIST_PERCENTAGE} %</Truncate>}
                    />
                    <Column
                        header={'#'}
                        body={editButtonTemplate}
                        style={{ textAlign: 'center', width: '5%', right: '0', position: 'sticky', background: 'white' }}
                    />
                </DataTable>
                <Paginator
                    first={filters.first}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageChange={onPageChange}
                />
            </DataTableContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 1200px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export default ChecklistResults;
