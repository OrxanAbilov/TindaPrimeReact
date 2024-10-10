import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_JOB_HEADERS, POST_NEW_JOB_HEADER, EDIT_JOB_HEADER, REMOVE_JOB } from '../../../features/mobile-terminal/services/api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil, BiTrash, BiPlus } from 'react-icons/bi';
import AddEditDialog from './AddEditDialog';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const JobOrder = () => {
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
        { colName: 'desc' },
        { colName: 'joB_COUNT' },
        { colName: 'desc' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJobOrder, setNewJobOrder] = useState({
        code: '',
        desc: '',
        deL_STATUS: 0,
        joB_COUNT: 0
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
            const response = await GET_ALL_JOB_HEADERS({
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

    const handleStatusChange = (e) => {
        const selectedValue = e.value.toString(); 
        setSelectedStatus(selectedValue);

        if (selectedValue === 'all') {
            setFilters(prevFilters => ({
                ...prevFilters,
                searchList: []
            }));
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                searchList: [
                    ...prevFilters.searchList.filter(item => item.colName !== 'deL_STATUS'),
                    { colName: 'deL_STATUS', value: selectedValue }
                ]
            }));
        }
    };

    const handleEditClick = (rowData) => {
        setNewJobOrder({ id: rowData.id, code: rowData.code, desc: rowData.desc });
        setIsModalOpen(true);
    };

    const handleRemoveClick = (rowData) => {
        setItemToDelete(rowData);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async (item) => {
        // try {
        //     await REMOVE_JOB(item.id);
        //     setShowDeleteModal(false);
        //     fetchData();
        // } catch (error) {
        //     alert('Əməliyyatl silərkən xəta baş verdi', error);
        // }
    };

    const openModal = () => {
        setNewJobOrder({ id: 0, code: '', desc: '', deL_STATUS: false, joB_COUNT: 0, status: true });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewJobOrder({ id: 0, code: '', desc: '', deL_STATUS: false, joB_COUNT: 0, status: true });
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
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
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

    const transformJobOrder = (jobOrder) => {
        return {
            id: jobOrder.id,
            code: jobOrder.code,
            desc: jobOrder.desc,
            deL_STATUS: jobOrder.deL_STATUS,
            jobs: jobOrder.relations.map(relation => ({
                joB_ID: relation.job.id,
                joB_ROW_NUMBER: relation.roW_NUMBER,
                joB_COMPULSORY_STATUS: relation.compulsorY_STATUS
            }))
        };
    };
    
    const onSave = async () => {
        const transformedJobOrder = transformJobOrder(newJobOrder);

        if (newJobOrder?.id > 0) {
            console.log(transformedJobOrder);
            try {
                await EDIT_JOB_HEADER(transformedJobOrder);
                closeModal();
                fetchData();
            } catch (error) {
                console.error('Error saving job', error);
            }
        } else {
            console.log(transformedJobOrder);
            try {
                await POST_NEW_JOB_HEADER(transformedJobOrder);
                closeModal();
                fetchData();
            } catch (error) {
                console.error('Error saving job', error);
            }
        }
    };

    return (
        <Wrapper>
            <TopBar>
            <Dropdown
                id="statusDropdown"
                value={selectedStatus}
                options={statusOptions}
                onChange={handleStatusChange}
                placeholder="Status"
                className="p-d-block"
                />
                <Button onClick={openModal} severity="secondary"><BiPlus size={18} />Yeni əməliyyat</Button>
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
                        field="code"
                        header={renderHeader('code', 'Kod')}
                        body={(rowData) => rowData.code}
                        frozen
                    />
                    <Column
                        field="desc"
                        header={renderHeader('desc', 'Açıqlama')}
                        body={(rowData) => rowData.desc}
                    />
                    <Column
                        field="joB_COUNT"
                        header={renderHeader('joB_COUNT', 'Əməliyyat sayı')}
                        body={(rowData) => rowData.joB_COUNT}
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
                newJobOrder={newJobOrder}
                setNewJobOrder={setNewJobOrder}
                header={newJobOrder?.id > 0 ? 'Dəyişdir' : 'Əlavə et'}
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

export default JobOrder;
