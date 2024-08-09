import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_NOTIFICATIONS, POST_NEW_NOTIFICATION, POST_NEW_NOTIFICATION_OPERATION } from '../../../features/notification/services/api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil, BiTrash, BiPlus } from 'react-icons/bi';
import NotificationSendDialog from './NotificationSendDialog';
import { Button } from 'primereact/button';

const NotificationHistory = () => {
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
        { colName: 'slS_CODE' },
        { colName: 'slS_NAME' },
        { colName: 'body' },
        { colName: 'title' },
        { colName: 'operation' },
        { colName: 'operatioN_DESC' },

    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOperation, setNewOperation] = useState({
        slS_CODE: '',
        slS_NAME: '',
        body: '',
        title: '',
        operation: '',
        operatioN_DESC: '',
    });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_NOTIFICATIONS({
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

    const openModal = () => {
            // setNewOperation({  id: 0, code: '', desc: '', status: true });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // setNewOperation({  id: 0, code: '', desc: '', status: true });
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
    const handleSave = async (payload) => {
        console.log(payload);
        try {
            await POST_NEW_NOTIFICATION(payload);
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Error saving notification', error);
        }
    };


    return (
        <Wrapper>
            <TopBar>
                <Button onClick={openModal} severity="secondary"><BiPlus size={18} />Yeni bildiriş</Button>
            </TopBar>
            <DataTableContainer>
                <DataTable
                    value={data}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    // dataKey="id"
                    emptyMessage="Məlumat tapılmadı"
                    className="p-datatable-sm"
                >
                    <Column
                        field="slS_CODE"
                        header={renderHeader('slS_CODE', 'Təmsilçi kodu')}
                        body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="slS_NAME"
                        header={renderHeader('slS_NAME', 'Təmsilçi adı')}
                        body={(rowData) => <Truncate>{rowData.slS_NAME}</Truncate>}
                    />
                    <Column
                        field="body"
                        header={renderHeader('body', 'Mesaj')}
                        body={(rowData) => <Truncate>{rowData.body}</Truncate>}
                    />
                    <Column
                        field="title"
                        header={renderHeader('title', 'Başlıq')}
                        body={(rowData) => <Truncate>{rowData.title}</Truncate>}
                    />
                    <Column
                        field="operation"
                        header={renderHeader('operation', 'Əməliyyat')}
                        body={(rowData) => <Truncate>{rowData.operation}</Truncate>}
                    />
                    <Column
                        field="operatioN_DESC"
                        header={renderHeader('operatioN_DESC', 'Əməliyyat açıqlaması')}
                        body={(rowData) => <Truncate>{rowData.operatioN_DESC}</Truncate>}
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
            <NotificationSendDialog
                visible={isModalOpen}
                onHide={closeModal}
                onSave={handleSave}
                header={newOperation?.id > 0 ? 'Dəyişdir' : 'Əlavə et'}
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

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export default NotificationHistory;
