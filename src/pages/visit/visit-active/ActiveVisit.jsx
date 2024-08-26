import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_VISIT_ENTERANCE } from '../../../features/visit/services/api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const ActiveVisit = () => {
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
        { colName: 'clienT_CODE' },
        { colName: 'clienT_NAME' },
        { colName: 'slS_CODE' },
        { colName: 'slS_NAME' },
        { colName: 'datE_BEGIN' },
        { colName: 'note' },
        { colName: 'visiT_STATUS' },
    ]);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
    
        // Ensure visiT_STATUS is included in the filters
        const updatedFilters = {
            ...filters,
            searchList: [
                ...(filters.searchList || []),
                { colName: 'visiT_STATUS', value: 'false' }
            ],
            start: filters.first,
            pageSize: filters.pageSize
        };
    
        try {
            const response = await GET_ALL_VISIT_ENTERANCE(updatedFilters);
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

    // const handleFilterChange = (field, value) => {
    //     let newSearchList = searchCriteria.map(criteria =>
    //         criteria.colName === field ? { ...criteria, value } : criteria
    //     );

    //     if (field === 'visiT_STATUS' && value === 'all') {
    //         newSearchList = newSearchList.filter(criteria => criteria.colName !== 'visiT_STATUS');
    //     }

    //     setFilters(prevFilters => ({
    //         ...prevFilters,
    //         [field]: value,
    //         searchList: newSearchList.filter(criteria => criteria.value !== '' && criteria.value !== null && criteria.value !== undefined)
    //     }));
    // };

    const onPageChange = (event) => {
        const { first, rows } = event;
        setFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
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
            {field === 'datE_BEGIN' ? (
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
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    // const statusOptions = [
    //     { label: 'Hamısı', value: 'all' },
    //     { label: 'Aktiv', value: 'true' },
    //     { label: 'Müştəridə olan təmsilçilər', value: 'false' }
    // ];


    return (
        <Wrapper>
            <DataTableContainer>
            {/* <Dropdown
                    value={filters.visiT_STATUS}
                    options={statusOptions}
                    onChange={(e) => handleFilterChange('visiT_STATUS', e.value)}
                    placeholder="Status"
                    style={{ marginRight: 'auto', marginBottom:'1rem' }}
                /> */}
                <DataTable
                    value={data}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    dataKey="id"
                    emptyMessage="Məlumat tapılmadı"
                    className="p-datatable-sm"
                >
                    <Column
                        field="slS_CODE"
                        header={renderHeader('slS_CODE', 'Təmsilçi kodu')}
                        body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
                    />
                    <Column
                        field="slS_NAME"
                        header={renderHeader('slS_NAME', 'Təmsilçi adı')}
                        body={(rowData) => <Truncate>{rowData.slS_NAME}</Truncate>}
                    />
                    <Column
                        field="clienT_CODE"
                        header={renderHeader('clienT_CODE', 'Müştəri kodu')}
                        body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clienT_NAME"
                        header={renderHeader('clienT_NAME', 'Müştəri adı')}
                        body={(rowData) => <Truncate>{rowData.clienT_NAME}</Truncate>}
                    />
                    <Column
                        field="datE_BEGIN"
                        header={renderHeader('datE_BEGIN', 'Giriş vaxtı')}
                        body={(rowData) => <Truncate>{formatDate(rowData.datE_BEGIN)}</Truncate>}
                    />
                    <Column
                        field="note"
                        header={renderHeader('note', 'Qeyd')}
                        body={(rowData) => <Truncate>{rowData.note}</Truncate>}
                    />
                    <Column
                        field="direcT_CLIENT_BEGIN"
                        header={renderHeader('direcT_CLIENT_BEGIN', 'Giriş məsafəsi')}
                        body={(rowData) => <Truncate>{rowData.direcT_CLIENT_BEGIN}</Truncate>}
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

const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 82vw;
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

export default ActiveVisit;
