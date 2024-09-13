import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_SPECIAL_SETTINGS, POST_NEW_SPEACIAL_SETTING, GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE, UPDATE_SPEACIAL_SETTING } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiBlock, BiTrash, BiPlus } from 'react-icons/bi';
import { Button } from 'primereact/button';
import AddDialog from './AddDialog';
import EditDialog from './EditDialog';

const SpecialSettings = () => {
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
        { colName: 'blockeD_CODE' },
        { colName: 'blockeD_NAME' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBlock, setNewBlock] = useState({
        blockeD_CODEs: [],
        typE_ID: 0,
        operatioN_IDs: []
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedBlock, setEditedBlock] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_SPECIAL_SETTINGS({
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

    const handleEditClick = async (rowData) => {
        try {
            const response = await GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE(rowData.blockeD_CODE, filters);
            console.log(response.data);
            const operations = response.data.data;
            setEditedBlock({ ...rowData, operations });
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching operations data', error);
            setError('Error fetching operations data');
        }
    };
    
    const openAddModal = () => {
        setNewBlock({ blockeD_CODEs: [], typE_ID: 0, operatioN_IDs: 0 });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewBlock({ blockeD_CODEs: [], typE_ID: 0, operatioN_IDs: 0 });
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditedBlock(null);
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
                <BiBlock size={18} />
            </EditButton>
        </ButtonContainer>
    );

    
    const onSave = async (blockData) => {
        console.log('POSTDATA:',blockData)
            try {
                await POST_NEW_SPEACIAL_SETTING(blockData);
                closeModal();
                fetchData();
            } catch (error) {
                console.error('Error saving question group', error);
            }
    };

    const onEdit = async (blockData) => {
        console.log('putdata:',blockData)
        try {
            await UPDATE_SPEACIAL_SETTING(blockData);
            closeEditModal();
            fetchData();
        } catch (error) {
            console.error('Error saving question group', error);
        }
    };



    return (
        <Wrapper>
            <TopBar>
                <Button onClick={openAddModal} severity="secondary"><BiPlus size={18} />Əlavə et</Button>
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
                        field="blockeD_CODE"
                        header={renderHeader('blockeD_CODE', 'Kod')}
                        body={(rowData) => <Truncate>{rowData.blockeD_CODE	}</Truncate>}
                    />
                    <Column
                        field="blockeD_NAME"
                        header={renderHeader('blockeD_NAME', 'Ad')}
                        body={(rowData) => <Truncate>{rowData.blockeD_NAME}</Truncate>}
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
            <AddDialog
                visible={isModalOpen}
                onHide={closeModal}
                onSave={onSave}
                newBlock={newBlock}
                setNewBlock={setNewBlock}
            />
            <EditDialog
                visible={isEditModalOpen}
                onHide={closeEditModal}
                onEdit={onEdit}
                editedBlock={editedBlock}
                setEditedBlock={setEditedBlock}
            />
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
  max-width: 85vw;
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
  max-width: 450px;
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


export default SpecialSettings;
