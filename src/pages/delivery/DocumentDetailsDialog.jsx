import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { GET_DOCUMENT_DETAILS } from '../../features/delivery/services/api';

const DocumentDetailsDialog = ({ visible, onHide, rowData, beginDate, endDate }) => {
    const [documentDetails, setDocumentDetails] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const [searchQuery, setSearchQuery] = useState({
        slS_CODE: '',
        ficheno: '',
        loaD_CODE: '',
        iN_CLIENT: '',
        ordeR_STATUS: '',
        clienT_CODE: '',
        clienT_NAME: '',
        entrancE_DATE: null,
        exiT_DATE: null,
        waiT_MINUTE: 0
    });
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (rowData && visible) {
            fetchDocumentDetails();
        }
    }, [rowData, visible, beginDate, endDate]);

    const formatDateToAPI = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
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
            setTotalRecords(response.data.totalRecords);
            setFilteredData(response.data.data); 
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
        const newValue = field === 'waiT_MINUTE' ? Number(value) : value;

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
            (!searchQuery.slS_CODE || item.slS_CODE.toLowerCase().includes(searchQuery.slS_CODE.toLowerCase())) &&
            (!searchQuery.ficheno || item.ficheno.toLowerCase().includes(searchQuery.ficheno.toLowerCase())) &&
            (!searchQuery.iN_CLIENT || String(item.iN_CLIENT).toLowerCase().includes(convertStatusTextToValue(searchQuery.iN_CLIENT))) &&
            (!searchQuery.ordeR_STATUS || String(item.ordeR_STATUS).toLowerCase().includes(convertStatusTextToValue(searchQuery.ordeR_STATUS))) &&
            (!searchQuery.clienT_CODE || item.clienT_CODE.toLowerCase().includes(searchQuery.clienT_CODE.toLowerCase())) &&
            (!searchQuery.clienT_NAME || item.clienT_NAME.toLowerCase().includes(searchQuery.clienT_NAME.toLowerCase())) &&
            (!searchQuery.entrancE_DATE || formatDateToAPI(new Date(item.entrancE_DATE)).includes(formatDateToAPI(searchQuery.entrancE_DATE))) &&
            (!searchQuery.exiT_DATE || formatDateToAPI(new Date(item.exiT_DATE)).includes(formatDateToAPI(searchQuery.exiT_DATE))) 
        );
    };

    const convertStatusTextToValue = (text) => {
        if (!text) return text;
        const lowerText = text.toLowerCase();
        if (['hə', 'he', 'h'].includes(lowerText)) return 1;
        if (['yox', 'y', 'yo'].includes(lowerText)) return 0;
        return text;
    };

    const statusFormatter = (value) => {
        return value === 1 ? 'Hə' : 'Yox';
    };

    const handleRowDoubleClick = (rowData) => {
        const ficheno = rowData.ficheno;
        window.open(`/delivery/order-items?ficheno=${ficheno}`, '_blank');
    };

    const paginatedData = filteredData.slice(page * rows, (page + 1) * rows);

    return (
        <Dialog visible={visible} onHide={onHide} header="Sənəd detalları" style={{ width: '90vw' }}>
            {loading ? (
                <p>Yüklənir...</p>
            ) : (
                <div>
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
                        onRowDoubleClick={(e) => handleRowDoubleClick(e.data)} // Add double-click event
                    >
                        <Column
                            field="slS_CODE"
                            header={
                                <>
                                    Təmsilçi kodu
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.slS_CODE}
                                            onChange={(e) => handleSearchChange('slS_CODE', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'slS_CODE')}
                                            placeholder="Axtar..."
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
                            field="ficheno"
                            header={
                                <>
                                    Sənəd nömrəsi
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.ficheno}
                                            onChange={(e) => handleSearchChange('ficheno', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'ficheno')}
                                            placeholder="Axtar..."
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
                            field="clienT_CODE"
                            header={
                                <>
                                    Müştəri kodu
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.clienT_CODE}
                                            onChange={(e) => handleSearchChange('clienT_CODE', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'clienT_CODE')}
                                            placeholder="Axtar..."
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
                            field="clienT_NAME"
                            header={
                                <>
                                    Müştəri adı
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.clienT_NAME}
                                            onChange={(e) => handleSearchChange('clienT_NAME', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'clienT_NAME')}
                                            placeholder="Axtar..."
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
                            field="iN_CLIENT"
                            header={
                                <>
                                    Müştəridə statusu
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.iN_CLIENT}
                                            onChange={(e) => handleSearchChange('iN_CLIENT', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'iN_CLIENT')}
                                            placeholder="Axtar..."
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
                            body={(rowData) => statusFormatter(rowData.iN_CLIENT)}
                        />
                        <Column
                            field="ordeR_STATUS"
                            header={
                                <>
                                    Çatdırılma statusu
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <InputText
                                            value={searchQuery.ordeR_STATUS}
                                            onChange={(e) => handleSearchChange('ordeR_STATUS', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'ordeR_STATUS')}
                                            placeholder="Axtar..."
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
                            body={(rowData) => statusFormatter(rowData.ordeR_STATUS)}
                        />
                        <Column
                            field="entrancE_DATE"
                            header={
                                <>
                                    Giriş tarixi
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <Calendar
                                            value={searchQuery.entrancE_DATE}
                                            onChange={(e) => handleSearchChange('entrancE_DATE', e.value)}
                                            dateFormat="yy-mm-dd"
                                            placeholder="Axtar..."
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
                            body={(rowData) => formatDate(rowData.entrancE_DATE)}
                        />
                        <Column
                            field="exiT_DATE"
                            header={
                                <>
                                    Çıxış tarixi
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <Calendar
                                            value={searchQuery.exiT_DATE}
                                            onChange={(e) => handleSearchChange('exiT_DATE', e.value)}
                                            dateFormat="yy-mm-dd"
                                            placeholder="Axtar..."
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
                            body={(rowData) => formatDate(rowData.exiT_DATE)}
                        />
                        <Column
                            field="waiT_MINUTE"
                            header={
                                <>
                                    Müştəridə keçirdiyi vaxt
                                </>
                            }
                        />
                    </DataTable>
                </div>
            )}
        </Dialog>
    );
};

export default DocumentDetailsDialog;
