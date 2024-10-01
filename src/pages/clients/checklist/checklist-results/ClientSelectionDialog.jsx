import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GET_ALL_CLIENTS } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { BiSearch, BiPlus } from 'react-icons/bi';
import { Paginator } from 'primereact/paginator';

const ClientSelectionDialog = ({ visible, onHide, onSelect }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("true");
  const [filters, setFilters] = useState({
    pageSize: 10,
    first: 0,
    draw: 0,
    order: 'asc',
    orderColumn: 'id',
    searchList: []
  });

  const [searchCriteria, setSearchCriteria] = useState([
    { colName: 'cari_kod', value: '' },
    { colName: 'cari_isim', value: '' }
  ]);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchList = [
        { colName: "status", value: selectedStatus },
        ...searchCriteria.filter(criteria => criteria.value !== '')
      ];

      const response = await GET_ALL_CLIENTS({
        ...filters,
        start: filters.first,
        pageSize: filters.pageSize,
        searchList: searchList
      });
      setClients(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
    setLoading(false); 
  };

  const handleClientSelect = (client) => {
    onSelect(client.cari_kod);
    onHide();
  };

  const handleSearchClick = () => {
    setLoading(true); 
    setFilters(prevFilters => ({
      ...prevFilters,
      searchList: searchCriteria.filter(criteria => criteria.value !== '')
    }));
    setLoading(false);
  };

  const handleInputChange = (colName, value) => {
    setSearchCriteria(prevCriteria =>
      prevCriteria.map(criteria =>
        criteria.colName === colName ? { ...criteria, value } : criteria
      )
    );
  };

  const onPageChange = (event) => {
    setLoading(true); 
    const { first, rows } = event;
    setFilters(prevFilters => ({
      ...prevFilters,
      first: first,
      pageSize: rows
    }));
    setLoading(false);
  };

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
        <SearchIcon onClick={handleSearchClick}>
          <BiSearch size={18} />
        </SearchIcon>
      </InputContainer>
    </div>
  );

  const actionTemplate = (rowData) => (
    <Button
      icon={<BiPlus />}
      label="Add"
      onClick={() => handleClientSelect(rowData)}
      className="p-button-sm"
    />
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Müştəri seçimi"
      style={{ width: '50vw' }}
      modal
      closable
    >
<DataTableContainer>
    {loading ? (
        <Loading />
    ) : (
        <>
            <DataTable
                value={clients}
                rows={filters.pageSize}
                totalRecords={totalRecords}
                dataKey="id"
                emptyMessage="Məlumat tapılmadı"
                className="p-datatable-sm"
            >
                <Column
                    field="cari_kod"
                    header={renderHeader('cari_kod', 'Müştəri kodu')}
                    body={(rowData) => <Truncate>{rowData.cari_kod}</Truncate>}
                    frozen
                />
                <Column
                    field="cari_isim"
                    header={renderHeader('cari_isim', 'Müştəri adı')}
                    body={(rowData) => <Truncate>{rowData.cari_isim}</Truncate>}
                />
                <Column
                    header="#"
                    body={(rowData) => (
                        <StyledButton
                            icon={<BiPlus size={24} />} // Adjust icon size as needed
                            onClick={() => handleClientSelect(rowData)}
                            className="p-button-text"
                            tooltip="Seç"
                            aria-label="Select"
                        />
                    )}
                />
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
</DataTableContainer>

    </Dialog>
  );
};

const InputContainer = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
`;

const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 82vw;
  font-size: 12px;
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
  max-width: 550px;
`;
const StyledButton = styled(Button)`
    width: 40px; /* Adjust size as needed */
    height: 40px; /* Adjust size as needed */
    border-radius: 4px; /* Square button with slightly rounded corners */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; /* Remove default padding */
`;

export default ClientSelectionDialog;
