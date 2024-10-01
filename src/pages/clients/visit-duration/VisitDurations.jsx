import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_VISIT_DURATIONS } from '../../../features/clients/services/api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { BiSearch, BiPencil, BiTrash, BiPlus, BiCopy } from 'react-icons/bi';
import { Dropdown } from 'primereact/dropdown';

const VisitDurations = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("true");
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: [{ colName: 'status', value: selectedStatus }]
    });

    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'desc' },
        { colName: 'miN_WAIT_MINUTE' },
        { colName: 'maX_WAIT_MINUTE' },
        { colName: 'clienT_CODE' },
        { colName: 'clspecode' },
        { colName: 'clspecodE2' },
        { colName: 'clspecodE3' },
        { colName: 'clspecodE4' },
        { colName: 'clspecodE5' },
        { colName: 'cltype' },
        { colName: 'clgroup' },
        { colName: 'status' }
    ]);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const searchList = [
                { colName: "status", value: selectedStatus },
                ...searchCriteria.filter(criteria => criteria.value !== '' && criteria.value !== null && criteria.value !== undefined)
            ];
            
            const response = await GET_ALL_VISIT_DURATIONS({
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize,
                searchList: searchList
            });
            console.log("filters", filters);
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
    
    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        setFilters(prevFilters => {
            const updatedSearchList = prevFilters.searchList.filter(criteria => criteria.colName !== "status");
            
            updatedSearchList.push({ colName: "status", value });
    
            return {
                ...prevFilters,
                searchList: updatedSearchList
            };
        });
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
        navigate(`/clients/visit-duration-edit/${rowData.id}`);
    };

    const handleCopyClick = (rowData) => {
        navigate(`/clients/visit-duration-edit/${rowData.id}`, {
            state: { isCopy: true } // Passing the copy flag
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

    const statusOptions = [
        { label: 'Aktiv', value: 'true' },
        { label: 'Passiv', value: 'false' }
    ];

    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
            <InputContainer>
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
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const editButtonTemplate = (rowData) => (
        <ButtonContainer>
            <EditButton onClick={() => handleEditClick(rowData)}>
                <BiPencil size={18} />
            </EditButton>
            <CopyButton onClick={() => handleCopyClick(rowData)}>
                <BiCopy size={18} />
            </CopyButton>
        </ButtonContainer>
    );
    const handlePlusClick = () => {
        console.log("CLICKED");
        navigate('/clients/visit-duration-edit');
      };
    
    return (
        <Wrapper>
            <TopBar>
                <Dropdown
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e) => handleStatusChange(e.value)}
                    placeholder="Status"
                    style={{ marginRight: 'auto' }}
                />
                <Button onClick={handlePlusClick} severity="secondary"><BiPlus size={18} />Yeni limit</Button>
            </TopBar>
            <DataTableContainer>
                <DataTable
                    value={data}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    dataKey="id"
                    emptyMessage="Məlumat tapılmadı"
                    className="p-datatable-sm"
                >
                    <Column
                        field="desc"
                        header={renderHeader('desc', 'Açıqlama')}
                        body={(rowData) => <Truncate>{rowData.desc}</Truncate>}
                    />
                    <Column
                        field="miN_WAIT_MINUTE"
                        header={renderHeader('miN_WAIT_MINUTE', 'Minimum müddət')}
                        body={(rowData) => <Truncate>{rowData.miN_WAIT_MINUTE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="maX_WAIT_MINUTE"
                        header={renderHeader('maX_WAIT_MINUTE', 'Maksimum müddət')}
                        body={(rowData) => <Truncate>{rowData.maX_WAIT_MINUTE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="slS_CODE"
                        header={renderHeader('slS_CODE', 'Təmsilçi kodu')}
                        body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clienT_CODE"
                        header={renderHeader('clienT_CODE', 'Müştəri kodu')}
                        body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clspecode"
                        header={renderHeader('clspecode', 'Özəl kod')}
                        body={(rowData) => <Truncate>{rowData.clspecode}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clspecodE2"
                        header={renderHeader('clspecodE2', 'Özəl kod2')}
                        body={(rowData) => <Truncate>{rowData.clspecodE2}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clspecodE3"
                        header={renderHeader('clspecodE3', 'Özəl kod3')}
                        body={(rowData) => <Truncate>{rowData.clspecodE3}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clspecodE4"
                        header={renderHeader('clspecodE4', 'Özəl kod4')}
                        body={(rowData) => <Truncate>{rowData.clspecodE4}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clspecodE5"
                        header={renderHeader('clspecodE5', 'Özəl kod5')}
                        body={(rowData) => <Truncate>{rowData.clspecodE5}</Truncate>}
                        frozen
                    />
                    <Column
                        field="cltype"
                        header={renderHeader('cltype', 'Müştəri tipi')}
                        body={(rowData) => <Truncate>{rowData.cltype}</Truncate>}
                        frozen
                    />
                    <Column
                        field="clgroup"
                        header={renderHeader('clgroup', 'Müştəri qrupu')}
                        body={(rowData) => <Truncate>{rowData.clgroup}</Truncate>}
                        frozen
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
export default VisitDurations;
