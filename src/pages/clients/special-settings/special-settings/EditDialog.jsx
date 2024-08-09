import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE } from '../../../../features/clients/services/api';

const EditDialog = ({ visible, onHide, onEdit, editedBlock }) => {
    const [localBlock, setLocalBlock] = useState(editedBlock || {});
    const [operations, setOperations] = useState([]);
    const [selectedOperations, setSelectedOperations] = useState({});
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        start: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'operation', value: '' },
        { colName: 'operatioN_DESC', value: '' },
    ]);

    useEffect(() => {
        setLocalBlock(editedBlock || {});
    }, [editedBlock]);

    useEffect(() => {
        if (visible && localBlock.blockeD_CODE) {
            setLoading(true);
            setTimeout(() => {
                fetchOperations();
            }, 500);
        }
    }, [localBlock.blockeD_CODE, visible, filters]);

    const fetchOperations = async () => {
        if (!localBlock.blockeD_CODE) return;

        try {
            const response = await GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE(localBlock.blockeD_CODE, filters);
            const fetchedOperations = response.data.data.map(operation => ({
                ...operation,
                status: !!selectedOperations[operation.id]
            }));
            setOperations(fetchedOperations);
            setTotalRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Error fetching operations data', error);
        } finally {
            setLoading(false);
        }
    };

    const saveChanges = () => {
        const formattedData = {
            blockeD_CODE: localBlock.blockeD_CODE,
            typE_ID: 1,
            operationIds: Object.keys(selectedOperations).filter(id => selectedOperations[id])
        };
        onEdit(formattedData);
    };

    const onPageChange = (event) => {
        const { first, rows } = event;
        setFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            start: first,
            pageSize: rows
        }));
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
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchClick();
                        }
                    }}
                />
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const renderCheckbox = (rowData) => {
        const isChecked = !!selectedOperations[rowData.id];
        return (
            <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                    const { checked } = e.target;
                    setSelectedOperations(prevSelected => ({
                        ...prevSelected,
                        [rowData.id]: checked
                    }));
                }}
            />
        );
    };

    return (
        <Dialog header="Dəyişdir" visible={visible} style={{ width: '70vw' }} onHide={onHide}>
            <div>
                {loading ? (
                    <div style={{textAlign: 'center'}}>Yüklənir...</div>
                ) : (
                    <>
                        <DataTable
                            value={operations}
                            rows={filters.pageSize}
                            totalRecords={totalRecords}
                            dataKey="id"
                            emptyMessage="No operations found"
                        >
                            <Column field="operation" header={renderHeader('operation', 'Əməliyyat')} />
                            <Column field="operatioN_DESC" header={renderHeader('operatioN_DESC', 'Açıqlama')} />
                            <Column body={renderCheckbox} header="#" />
                        </DataTable>
                        <Paginator
                            first={filters.first}
                            rows={filters.pageSize}
                            totalRecords={totalRecords}
                            rowsPerPageOptions={[5, 10, 20]}
                            onPageChange={onPageChange}
                        />
                    </>
                )}
            </div>
            <ButtonWrapper>
                <Button label="Yadda saxla" icon="pi pi-check" onClick={saveChanges} />
            </ButtonWrapper>
        </Dialog>
    );
};

const ButtonWrapper = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
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

export default EditDialog;
