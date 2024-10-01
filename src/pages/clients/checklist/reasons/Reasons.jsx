import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { EDIT_REASON, POST_NEW_REASON, REMOVE_REASON } from '../../../../features/clients/services/api';
import { GET_ALL_REASONS } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil, BiTrash, BiPlus } from 'react-icons/bi';
import AddEditDialog from './AddEditDialog';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { Button } from 'primereact/button';

const Reasons = () => {
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
        { colName: 'typE_ID'},
        { colName: 'type'},
        { colName: 'code'},
        { colName: 'name'},
        { colName: 'desc'},
        { colName: 'status'}
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReason, setnewReason] = useState({
        typE_ID: 0,
        type: '',
        code: '',
        name: '',
        desc: '',
        status: true
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters, selectedStatus]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_REASONS({
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize,
                searchList: filters.searchList // Pass searchList from filters
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

    const handleStatusChange = (e) => {
        const selectedValue = e.value.toString(); // Convert to string
        setSelectedStatus(selectedValue); // Update selected status filter

        if (selectedValue === 'all') {
            setFilters(prevFilters => ({
                ...prevFilters,
                searchList: [] // Reset searchList
            }));
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                searchList: [
                    ...prevFilters.searchList.filter(item => item.colName !== 'status'), // Remove existing status filter
                    { colName: 'status', value: selectedValue }
                ]
            }));
        }
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
        setnewReason({ typE_ID: rowData.typE_ID, id: rowData.id, code: rowData.code, name: rowData.name, desc: rowData.desc, status: rowData.status });
        setIsModalOpen(true);
    };

    const handleRemoveClick = (rowData) => {
        setItemToDelete(rowData);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            await REMOVE_REASON(item.id);
            setShowDeleteModal(false);
            fetchData(); 
        } catch (error) {
            console.error('Error deleting question group', error);
        }
    };

    const openModal = () => {
        setnewReason({ id: 0, code: '', name: '', desc: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setnewReason({ id: 0, code: '', name: '', desc: '' });
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
        { label: 'Hamısı', value: 'all' },
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
                {field !== 'status' && <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>}
            </InputContainer>
        </div>
    );

    const editButtonTemplate = (rowData) => (
        <ButtonContainer>
            <EditButton onClick={() => handleEditClick(rowData)}>
                <BiPencil size={18} />
            </EditButton>
            <RemoveButton onClick={() => handleRemoveClick(rowData)}>
                <BiTrash size={18} />
            </RemoveButton>
        </ButtonContainer>
    );

    const onSave = async () => {
        if (newReason?.id > 0) {
            try {
                await EDIT_REASON(newReason);
                closeModal();
                fetchData();
            } catch (error) {
                alert('Bilinməyən bir xəta baş verdi', error);
            }
        } else {
            try {
                await POST_NEW_REASON(newReason);
                closeModal();
                fetchData();
            } catch (error) {
                alert('Bilinməyən bir xəta baş verdi', error);
            }
        }
    };

    return (
        <Wrapper>
    <TopBar>
    {/* <InputContainer1>
        <Label htmlFor="statusDropdown">Status</Label>
    </InputContainer1> */}
    <Dropdown
        id="statusDropdown"
        value={selectedStatus}
        options={statusOptions}
        onChange={handleStatusChange}
        placeholder="Status"
        className="p-d-block"
        />
    <Button onClick={openModal} severity="secondary">
        <BiPlus size={18} /> Yeni səbəb
    </Button>
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
                        field="type"
                        header={renderHeader('type', 'Tip')}
                        body={(rowData) => <Truncate>{rowData.type}</Truncate>}
                        frozen
                    />
                    <Column
                        field="code"
                        header={renderHeader('code', 'Kod')}
                        body={(rowData) => <Truncate>{rowData.code}</Truncate>}
                        frozen
                    />
                    <Column
                        field="desc"
                        header={renderHeader('desc', 'Açıqlama')}
                        body={(rowData) => <Truncate>{rowData.desc}</Truncate>}
                    />
                    <Column
                        field="name"
                        header={renderHeader('name', 'Ad')}
                        body={(rowData) => <Truncate>{rowData.name}</Truncate>}
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
            <AddEditDialog
                visible={isModalOpen}
                onHide={closeModal}
                onSave={onSave}
                newReason={newReason}
                setnewReason={setnewReason}
                header={newReason?.id > 0 ? 'Dəyişdir' : 'Əlavə et'}
            />
            <DeleteConfirmationModal
                visible={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemToDelete={itemToDelete}
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
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 0 20px 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const InputContainer1 = styled.div`
  flex-grow: 1; /* Allows the Dropdown to take remaining space */
  margin-right: 10px; /* Optional: Adjust spacing between Dropdown and button */
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

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export default Reasons;
