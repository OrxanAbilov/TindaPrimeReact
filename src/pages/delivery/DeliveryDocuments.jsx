import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_DELIVERY_DOCUMENTS } from '../../features/delivery/services/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';
import { Calendar } from 'primereact/calendar';
import DocumentDetailsDialog from './DocumentDetailsDialog';

const DeliveryDocuments = () => {
    const defaultBeginDate = new Date();
    defaultBeginDate.setDate(defaultBeginDate.getDate());
  
    const defaultEndDate = new Date();
  
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [beginDate, setBeginDate] = useState(defaultBeginDate);
    const [endDate, setEndDate] = useState(defaultEndDate);  
    const [allFilters, setallFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        filters: []
    });
    const [selectedRowData, setSelectedRowData] = useState(null); // Store selected row data
    const [dialogVisible, setDialogVisible] = useState(false); // Control dialog visibility
    
    const handleRowDoubleClick = (rowData) => {
        setSelectedRowData(rowData); // Store the selected row data
        setDialogVisible(true); // Open the dialog
    };
    
    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'driveR_CODE' },
        { colName: 'driveR_NAME' },
        { colName: 'caR_PLATE' },
        { colName: 'loaD_CODE' },
        { colName: 'date' },
        { colName: 'totaL_ORDER_QUANTITY' },
        { colName: 'delivereD_ORDER_QUANTITY' },
        { colName: 'beginDate' },
        { colName: 'endDate' }

    ]);

    const formatDateToAPI = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };
    
    useEffect(() => {
        fetchData();
    }, [allFilters]);

    
    const fetchData = async () => {
        setLoading(true);
        setError(null);
    
        const filters = searchCriteria.reduce((acc, curr) => {
            if (curr.value) {
                acc[curr.colName] = curr.value;
            }
            return acc;
        }, {});
    
        // const filters = searchCriteria.reduce((acc, curr) => {
        //     acc[curr.colName] = curr.value !== undefined ? curr.value : "";
        //     return acc;
        // }, {});

        if (beginDate) {
            filters.beginDate = formatDateToAPI(beginDate);
        }
        if (endDate) {
            filters.endDate = formatDateToAPI(endDate);
        }
    
        try {
            const response = await GET_ALL_DELIVERY_DOCUMENTS({
                ...allFilters,
                start: allFilters.first,
                pageSize: allFilters.pageSize,
                filters: filters
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
        const formattedBeginDate = beginDate ? formatDateToAPI(beginDate) : null;
        const formattedEndDate = endDate ? formatDateToAPI(endDate) : null;
    
        const updatedFilters = searchCriteria.reduce((acc, curr) => {
            if (curr.value) {
                acc[curr.colName] = curr.value;
            }
            return acc;
        }, {});
    
        if (formattedBeginDate) {
            updatedFilters.beginDate = formattedBeginDate;
        }
        if (formattedEndDate) {
            updatedFilters.endDate = formattedEndDate;
        }
    
        setallFilters(prevFilters => ({
            ...prevFilters,
            filters: updatedFilters,
            first: 0
        }));
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
        setallFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const handleDateChange = (e, type) => {
        const date = e.value;
        if (type === "begin") {
            setBeginDate(date);
        } else if (type === "end") {
          setEndDate(date);
        }
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
    

    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
                <InputContainer>
                {field === 'date' ? (
                    <Calendar
                        value={searchCriteria.find(criteria => criteria.colName === field)?.value || null}
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

    return (
        <Wrapper>
                  <Container>
                    <DateInputContainer>
                    <DateInputWrapper>
                        <label style={{ color: "#495057", fontWeight: 600 }}>
                        Başlanğıc tarix:
                        </label>
                        <DateInput
                        value={beginDate}
                        onChange={(e) => handleDateChange(e, "begin")}
                        showIcon
                        dateFormat="dd-mm-yy"
                        placeholder="Başlanğıc tarixi seçin"
                        />
                    </DateInputWrapper>

                    <DateInputWrapper>
                        <label style={{ color: "#495057", fontWeight: 600 }}>
                        Son tarix:
                        </label>
                        <DateInput
                        value={endDate}
                        onChange={(e) => handleDateChange(e, "end")}
                        showIcon
                        dateFormat="dd-mm-yy"
                        placeholder="Son tarixi seçin"
                        />
                    </DateInputWrapper>

                    <FilterButton onClick={handleSearchClick}>Filter</FilterButton>
                    </DateInputContainer>
                </Container>
            <DataTableContainer>
                <DataTable
                    value={data}
                    rows={allFilters.pageSize}
                    totalRecords={totalRecords}
                    dataKey="id"
                    emptyMessage="Məlumat tapılmadı"
                    className="p-datatable-sm"
                    onRowDoubleClick={(e) => handleRowDoubleClick(e.data)} // Handle double-click
                >
                    <Column
                        field="driveR_CODE"
                        header={renderHeader('driveR_CODE', 'Sürücü kodu')}
                        body={(rowData) => <Truncate>{rowData.driveR_CODE}</Truncate>}
                        frozen
                    />
                    <Column
                        field="driveR_NAME"
                        header={renderHeader('driveR_NAME', 'Sürücü adı')}
                        body={(rowData) => <Truncate>{rowData.driveR_NAME}</Truncate>}
                    />
                    <Column
                        field="caR_PLATE"
                        header={renderHeader('caR_PLATE', 'Maşın nömrəsi')}
                        body={(rowData) => <Truncate>{rowData.caR_PLATE}</Truncate>}
                    />
                    <Column
                        field="loaD_CODE"
                        header={renderHeader('loaD_CODE', 'Yükləmə kodu')}
                        body={(rowData) => <Truncate>{rowData.loaD_CODE}</Truncate>}
                    />
                    <Column
                        field="date"
                        header={renderHeader('date', 'Tarix')}
                        body={(rowData) => <Truncate>{formatDate(rowData.date)}</Truncate>}
                    />
                    <Column
                        field="totaL_ORDER_QUANTITY"
                        header={renderHeader('totaL_ORDER_QUANTITY', 'Ümumi sifariş sayı')}
                        body={(rowData) => <Truncate>{rowData.totaL_ORDER_QUANTITY}</Truncate>}
                    />
                    <Column
                        field="delivereD_ORDER_QUANTITY"
                        header={renderHeader('delivereD_ORDER_QUANTITY', 'Çatdırılmış sifariş sayı')}
                        body={(rowData) => <Truncate>{rowData.delivereD_ORDER_QUANTITY}</Truncate>}
                    />
                </DataTable>
                <Paginator
                    first={allFilters.first}
                    rows={allFilters.pageSize}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageChange={onPageChange}
                />
                <DocumentDetailsDialog
                    visible={dialogVisible}
                    onHide={() => setDialogVisible(false)}
                    rowData={selectedRowData}
                    beginDate={beginDate}
                    endDate={endDate}    
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


const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const DateInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 5px;
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
`;

const DateInput = styled(Calendar)`
  margin-top: 5px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: #007ad9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  align-self: flex-end;
`;

export default DeliveryDocuments;
