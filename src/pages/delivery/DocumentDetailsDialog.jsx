import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { GET_DOCUMENT_DETAILS } from '../../features/delivery/services/api';

const DocumentDetailsDialog = ({ visible, onHide, rowData, beginDate, endDate }) => {
    const [documentDetails, setDocumentDetails] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const [searchQuery, setSearchQuery] = useState({
        slS_CODE: '',
        doC_NUMBER: '',
        loaD_CODE: '',
        iN_CLIENT: '',
        ordeR_STATUS: '',
        entrancE_DATE: null,
        exiT_DATE: null
    });
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (rowData && visible) {
            fetchDocumentDetails();
        }
    }, [rowData, visible, beginDate, endDate, debouncedQuery]);

    const formatDateToAPI = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchDocumentDetails = async () => {
        setLoading(true);
        try {
            const requestData = {
                driverCode: rowData.driveR_CODE,
                loadCode: rowData.loaD_CODE,
                beginDate: formatDateToAPI(beginDate),
                endDate: formatDateToAPI(endDate),
            };

            const response = await GET_DOCUMENT_DETAILS(requestData);
            setDocumentDetails(response.data.data);
            setTotalRecords(response.data.totalRecords); // Assuming totalRecords is included in the response
            setPage(0); // Reset to first page when new data is fetched
        } catch (error) {
            console.error('Error fetching document details', error);
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

    const convertStatusTextToValue = (text) => {
        if (!text) return text;
        const lowerText = text.toLowerCase();
        if (['hə', 'he', 'h'].includes(lowerText)) return 1;
        if (['yox', 'y', 'yo'].includes(lowerText)) return 0;
        return text;
    };

    const filterData = (data) => {
        return data.filter(item =>
            (!debouncedQuery.slS_CODE || item.slS_CODE.toLowerCase().includes(debouncedQuery.slS_CODE.toLowerCase())) &&
            (!debouncedQuery.doC_NUMBER || item.doC_NUMBER.toLowerCase().includes(debouncedQuery.doC_NUMBER.toLowerCase())) &&
            (!debouncedQuery.iN_CLIENT || String(item.iN_CLIENT).toLowerCase().includes(convertStatusTextToValue(debouncedQuery.iN_CLIENT))) &&
            (!debouncedQuery.ordeR_STATUS || String(item.ordeR_STATUS).toLowerCase().includes(convertStatusTextToValue(debouncedQuery.ordeR_STATUS))) &&
            (!debouncedQuery.entrancE_DATE || formatDateToAPI(new Date(item.entrancE_DATE)).includes(formatDateToAPI(new Date(debouncedQuery.entrancE_DATE)))) &&
            (!debouncedQuery.exiT_DATE || formatDateToAPI(new Date(item.exiT_DATE)).includes(formatDateToAPI(new Date(debouncedQuery.exiT_DATE))))
        );
    };

    const statusFormatter = (value) => {
        return value === 1 ? 'Hə' : 'Yox';
    };

    // Compute paginated data
    const filteredData = filterData(documentDetails);
    const paginatedData = filteredData.slice(page * rows, (page + 1) * rows);

    return (
        <Dialog visible={visible} onHide={onHide} header="Sənəd detalları" style={{ width: '90vw' }}>
            {loading ? (
                <p>Yüklənir...</p>
            ) : (
                <div>
                    {filteredData.length > 0 ? (
                        <DataTable
                            value={paginatedData}
                            paginator
                            rows={rows}
                            totalRecords={filteredData.length}
                            lazy
                            first={page * rows}
                            onPage={onPageChange}
                            emptyMessage="No records found"
                            rowsPerPageOptions={[5, 10, 20]}
                            paginatorPosition="bottom"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        >
                            <Column
                                field="slS_CODE"
                                header={
                                    <>
                                        Təmsilçi kodu
                                        <InputText
                                            value={searchQuery.slS_CODE}
                                            onChange={(e) => handleSearchChange('slS_CODE', e.target.value)}
                                            placeholder="Təmsilçi kodu"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                            />
                            <Column
                                field="doC_NUMBER"
                                header={
                                    <>
                                        Sənəd nömrəsi
                                        <InputText
                                            value={searchQuery.doC_NUMBER}
                                            onChange={(e) => handleSearchChange('doC_NUMBER', e.target.value)}
                                            placeholder="Sənəd nömrəsi"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                            />
                            <Column
                                field="iN_CLIENT"
                                header={
                                    <>
                                        Müştəridə statusu
                                        <InputText
                                            value={searchQuery.iN_CLIENT}
                                            onChange={(e) => handleSearchChange('iN_CLIENT', e.target.value)}
                                            placeholder="Müştəridə statusu"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                                body={(rowData) => statusFormatter(rowData.iN_CLIENT)}
                            />
                            <Column
                                field="ordeR_STATUS"
                                header={
                                    <>
                                        Çatdırılma statusu
                                        <InputText
                                            value={searchQuery.ordeR_STATUS}
                                            onChange={(e) => handleSearchChange('ordeR_STATUS', e.target.value)}
                                            placeholder="Çatdırılma statusu"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                                body={(rowData) => statusFormatter(rowData.ordeR_STATUS)}
                            />
                            <Column
                                field="entrancE_DATE"
                                header={
                                    <>
                                        Giriş tarixi
                                        <Calendar
                                            value={searchQuery.entrancE_DATE}
                                            onChange={(e) => handleSearchChange('entrancE_DATE', e.value)}
                                            dateFormat="yy-mm-dd"
                                            placeholder="Giriş tarixi"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                                body={(rowData) => formatDateToAPI(new Date(rowData.entrancE_DATE))}
                            />
                            <Column
                                field="exiT_DATE"
                                header={
                                    <>
                                        Çıxış tarixi
                                        <Calendar
                                            value={searchQuery.exiT_DATE}
                                            onChange={(e) => handleSearchChange('exiT_DATE', e.value)}
                                            dateFormat="yy-mm-dd"
                                            placeholder="Çıxış tarixi"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        />
                                    </>
                                }
                                body={(rowData) => formatDateToAPI(new Date(rowData.exiT_DATE))}
                            />
                        </DataTable>
                    ) : (
                        <p>Nəticə tapılmadı.</p>
                    )}
                </div>
            )}
        </Dialog>
    );
};

export default DocumentDetailsDialog;
