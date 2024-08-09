import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_CHECKLISTS } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil, BiTrash, BiPlus, BiCopy } from 'react-icons/bi';
import DeleteConfirmationModal from '../questions/DeleteConfirmationModal';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import AddEditDialog from './AddEditDialog';

const Checklists = () => {
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
        { colName: 'desC_' },
        { colName: 'specode' },
        { colName: 'begiN_DATE' },
        { colName: 'enD_DATE' },
        { colName: 'questioN_COUNT' },
        { colName: 'slS_COUNT' },
        { colName: 'statuS_' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChecklist, setNewChecklist] = useState({
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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_CHECKLISTS({
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

    const handleFilterChange = (field, value) => {
        let newSearchList = searchCriteria.map(criteria =>
            criteria.colName === field ? { ...criteria, value } : criteria
        );

        if (field === 'statuS_' && value === 'all') {
            newSearchList = newSearchList.filter(criteria => criteria.colName !== 'statuS_');
        }

        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: value,
            searchList: newSearchList.filter(criteria => criteria.value !== '' && criteria.value !== null && criteria.value !== undefined)
        }));
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

    const handleCopyClick = (rowData) => {
        setNewChecklist({
            ...rowData,
            id: rowData.id,
            isCopy: true,   // Add a flag to indicate this is a copy
            begiN_DATE: rowData.begiN_DATE ? new Date(rowData.begiN_DATE) : null,
            enD_DATE: rowData.enD_DATE ? new Date(rowData.enD_DATE) : null,
        });
        setIsModalOpen(true);
    };
    

    const handleRemoveClick = (rowData) => {
        setItemToDelete(rowData);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            // await REMOVE_QUESTION_GROUP(item.id);
            setShowDeleteModal(false);
            fetchData();
        } catch (error) {
            alert('Bilinməyən bir xəta baş verdi', error);
        }
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
        return `${day}-${month}-${year}`;
    };

    const onSave = async () => {
        closeModal();
        fetchData();
    };

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

    const statusOptions = [
        { label: 'Hamısı', value: 'all' },
        { label: 'Aktiv', value: 'true' },
        { label: 'Passiv', value: 'false' }
    ];

    return (
        <Wrapper>
            <TopBar>
                <Dropdown
                    value={filters.statuS_}
                    options={statusOptions}
                    onChange={(e) => handleFilterChange('statuS_', e.value)}
                    placeholder="Status"
                    style={{ marginRight: 'auto' }}
                />
                <Button onClick={openModal} severity="secondary"><BiPlus size={18} />Yeni çeklist</Button>
            </TopBar>
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
                        field="desC_"
                        header={renderHeader('desC_', 'Açıqlama')}
                        body={(rowData) => <Truncate>{rowData.desC_}</Truncate>}
                    />
                    <Column
                        field="specode"
                        header={renderHeader('specode', 'Özəl kod')}
                        body={(rowData) => <Truncate>{rowData.specode}</Truncate>}
                    />
                    <Column
                        field="begiN_DATE"
                        header={renderHeader('begiN_DATE', 'Başlama vaxtı')}
                        body={(rowData) => <Truncate>{formatDate(rowData.begiN_DATE)}</Truncate>}
                    />
                    <Column
                        field="enD_DATE"
                        header={renderHeader('enD_DATE', 'Bitmə vaxtı')}
                        body={(rowData) => <Truncate>{formatDate(rowData.enD_DATE)}</Truncate>}
                    />
                    <Column
                        field="questioN_COUNT"
                        header={renderHeader('questioN_COUNT', 'Sual sayı')}
                        body={(rowData) => <Truncate>{rowData.questioN_COUNT}</Truncate>}
                    />
                    <Column
                        field="slS_COUNT"
                        header={renderHeader('slS_COUNT', 'Təmsilçi sayı')}
                        body={(rowData) => <Truncate>{rowData.slS_COUNT}</Truncate>}
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
                newChecklist={newChecklist}
                setNewChecklist={setNewChecklist}
                header={(newChecklist?.id == 0 || newChecklist.isCopy)? 'Əlavə et' : 'Dəyişdir' }
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

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export default Checklists;
