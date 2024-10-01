import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { BiSearch } from 'react-icons/bi';
import { GET_ORDER_ITEMS } from '../../features/delivery/services/api';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const OrderItems = () => {
    const [documentDetails, setDocumentDetails] = useState([]);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const [searchQuery, setSearchQuery] = useState({
        slS_CODE: '',
        ficheno: '',
        loaD_CODE: '',
        iteM_CODE: '',
        iteM_NAME: '',
        amount: 0,
        unit: 0,
        price: 0,
        discount: 0,
        discper: 0,
        grosstotal: 0,
        nettotal: 0,
        tax: 0,
    });
    const [filteredData, setFilteredData] = useState([]);

    const ficheno = searchParams.get('ficheno');

    useEffect(() => {
        if (ficheno) {
            fetchDocumentDetails(ficheno);
        }
    }, [ficheno]);


    const fetchDocumentDetails = async (ficheno) => {
        setLoading(true);
        try {
            const response = await GET_ORDER_ITEMS({ ficheno });
            setDocumentDetails(response.data.data); 
            setFilteredData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
        setLoading(false);
    };
        
    const onPageChange = (event) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const handleSearchChange = (field, value) => {
        setSearchQuery(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setFilteredData(filterData(documentDetails));
    };

    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filterData = (data) => {
        return data.filter(item =>
            (!searchQuery.iteM_CODE || item.iteM_CODE.toLowerCase().includes(searchQuery.iteM_CODE.toLowerCase())) &&
            (!searchQuery.iteM_NAME || item.iteM_NAME.toLowerCase().includes(searchQuery.iteM_NAME.toLowerCase())) 
        );
    };

    const paginatedData = filteredData.slice(page * rows, (page + 1) * rows);

    return (
        <Wrapper>
            <DataTableContainer>
            {loading ? (
                <p>Yüklənir...</p>
            ) : (
                <div>
                    {paginatedData.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '1rem',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}>
                            {`${paginatedData[0]?.ficheno} - ${paginatedData[0]?.slS_CODE} - ${paginatedData[0]?.slS_NAME}`}
                        </div>
                    )}

                    <DataTable
                        value={paginatedData}
                        paginator
                        rows={rows}
                        totalRecords={filteredData.length}
                        lazy
                        first={page * rows}
                        onPage={onPageChange}
                        emptyMessage="Nəticə tapılmadı"
                        rowsPerPageOptions={[5, 10, 20]}
                        paginatorPosition="bottom"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    >
                        <Column
                            field="iteM_CODE"
                            header={
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.iteM_CODE}
                                            onChange={(e) => handleSearchChange('iteM_CODE', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'iteM_CODE')}
                                            placeholder="Mal kodu..."
                                            style={{ width: '90%' }}
                                        />
                                        <BiSearch
                                            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                                            onClick={handleSearch}
                                            size={18}
                                        />
                                    </div>
                                </>
                            }
                        />
                        <Column
                            field="iteM_NAME"
                            header={
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.iteM_NAME}
                                            onChange={(e) => handleSearchChange('iteM_NAME', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'iteM_NAME')}
                                            placeholder="Mal adı..."
                                            style={{ width: '90%' }}
                                        />
                                        <BiSearch
                                            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                                            onClick={handleSearch}
                                            size={18}
                                        />
                                    </div>
                                </>
                            }
                        />
                        <Column
                            header="Miqdar"
                            body={(rowData) => (
                                <>
                                    {rowData.amount} {rowData.uniT_CODE}
                                </>
                            )}
                        />
                        <Column
                            header="Qiymət"
                            body={(rowData) => (
                                <>
                                    {rowData.price} ₼
                                </>
                            )}
                        />
                        <Column
                            header="Endirim"
                            body={(rowData) => (
                                <>
                                    {rowData.discount} ₼
                                </>
                            )}
                        />
                        <Column
                            header="Gross Total"
                            body={(rowData) => (
                                <>
                                    {rowData.grosstotal} ₼
                                </>
                            )}
                        />
                        <Column
                            header="Net Total"
                            body={(rowData) => (
                                <>
                                    {rowData.nettotal} ₼
                                </>
                            )}
                        />
                        <Column
                            header="Vergi"
                            body={(rowData) => (
                                <>
                                    {rowData.tax} ₼
                                </>
                            )}
                        />
                    </DataTable>
                </div>
            )}
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


export default OrderItems;
