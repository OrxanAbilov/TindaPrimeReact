import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { GET_ALL_DOCUMENTS_FOR_HISTORY } from '../../features/clients/services/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil } from 'react-icons/bi';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const Checklist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    pageSize: 10,
    first: 0,
    isActive: true,
    code: '',
    desC_: '',
    specode: '',
    begiN_DATE: null,
    enD_DATE: null,
    statuS_: false,
    slS_CODE: '',
    clienT_CODE: '',
    clspecode: '',
    clspecodE2: '',
    clspecodE3: '',
    clspecodE4: '',
    clspecodE5: '',
    cltype: '',
    clgroup: '',
    deL_STATUS: false
  });

  const [searchCriteria, setSearchCriteria] = useState({
    code: '',
    desC_: '',
    specode: '',
    slS_CODE: '',
    clienT_CODE: '',
    clspecode: '',
    clspecodE2: '',
    clspecodE3: '',
    clspecodE4: '',
    clspecodE5: '',
    cltype: '',
    clgroup: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GET_ALL_DOCUMENTS_FOR_HISTORY({
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

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
  };

  const handleSearchClick = () => {
    setFilters({
      ...filters,
      code: searchCriteria.code,
      desC_: searchCriteria.desC_,
      specode: searchCriteria.specode,
      slS_CODE: searchCriteria.slS_CODE,
      clienT_CODE: searchCriteria.clienT_CODE,
      clspecode: searchCriteria.clspecode,
      clspecodE2: searchCriteria.clspecodE2,
      clspecodE3: searchCriteria.clspecodE3,
      clspecodE4: searchCriteria.clspecodE4,
      clspecodE5: searchCriteria.clspecodE5,
      cltype: searchCriteria.cltype,
      clgroup: searchCriteria.clgroup,
    });
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
    navigate(`/client/editchecklist/${rowData.id}`);
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
        {field === 'begiN_DATE' || field === 'enD_DATE' ? (
          <Calendar
            value={filters[field]}
            onChange={(e) => handleFilterChange(field, e.value)}
            dateFormat="dd-mm-yy"
            placeholder={placeholder}
            showIcon
            className="p-inputtext"
            style={{ fontSize: '4px', padding: '0px', minWidth: '12rem' }}
          />
        ) : (
          <input
            type="text"
            value={searchCriteria[field]}
            onChange={(e) => setSearchCriteria({ ...searchCriteria, [field]: e.target.value })}
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
        <SearchIcon onClick={handleSearchClick}><BiSearch size={16} /></SearchIcon>
      </InputContainer>
    </div>
  );

  const statusOptions = [
    { label: 'Aktiv', value: true },
    { label: 'Passiv', value: false }
  ];

  const editButtonTemplate = (rowData) => (
    <ButtonContainer>
      <EditButton onClick={() => handleEditClick(rowData)}>
        <BiPencil size={16} />
      </EditButton>
    </ButtonContainer>
  );

  return (
    <Wrapper>
      <FiltersContainer>
        <Dropdown
          value={filters.isActive}
          options={statusOptions}
          onChange={(e) => handleFilterChange('isActive', e.value)}
          placeholder="Select Status"
          style={{ width: '200px' }}
        />
      </FiltersContainer>
      <DataTableContainer>
        <DataTable
          value={data}
          rows={filters.pageSize}
          totalRecords={totalRecords}
          dataKey="id"
          emptyMessage="No documents found"
          className="p-datatable-sm"
        >
          <Column
            field="code"
            header={renderHeader('code', 'Kod')}
            body={(rowData) => <Truncate>{rowData.code}</Truncate>}
            frozen
          >
          </Column>
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
            field="slS_CODE"
            header={renderHeader('slS_CODE', 'Təmsilçi kodu')}
            body={(rowData) => <Truncate>{rowData.slS_CODE}</Truncate>}
          />
          <Column
            field="clienT_CODE"
            header={renderHeader('clienT_CODE', 'Müştəri kodu')}
            body={(rowData) => <Truncate>{rowData.clienT_CODE}</Truncate>}
          />
          <Column
            field="clspecode"
            header={renderHeader('clspecode', 'Müştəri özəl kodu')}
            body={(rowData) => <Truncate>{rowData.clspecode}</Truncate>}
          />
          <Column
            field="clspecodE2"
            header={renderHeader('clspecodE2', 'Müştəri özəl kodu2')}
            body={(rowData) => <Truncate>{rowData.clspecodE2}</Truncate>}
          />
          <Column
            field="clspecodE3"
            header={renderHeader('clspecodE3', 'Müştəri özəl kodu3')}
            body={(rowData) => <Truncate>{rowData.clspecodE3}</Truncate>}
          />
          <Column
            field="clspecodE4"
            header={renderHeader('clspecodE4', 'Müştəri özəl kodu4')}
            body={(rowData) => <Truncate>{rowData.clspecodE4}</Truncate>}
          />
          <Column
            field="clspecodE5"
            header={renderHeader('clspecodE5', 'Müştəri özəl kodu5')}
            body={(rowData) => <Truncate>{rowData.clspecodE5}</Truncate>}
          />
          <Column
            field="cltype"
            header={renderHeader('cltype', 'Müştəri tipi')}
            body={(rowData) => <Truncate>{rowData.cltype}</Truncate>}
          />
          <Column
            field="clgroup"
            header={renderHeader('clgroup', 'Müştəri qrupu')}
            body={(rowData) => <Truncate>{rowData.clgroup}</Truncate>}
          />
          <Column
          header={'#'}
            body={editButtonTemplate}
            style={{ textAlign: 'center', width: '5%', right: '0', position: 'sticky',background:'white' }}
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FiltersContainer = styled.div`
  margin-bottom: 10px;
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
  max-width: 150px; /* Adjust the max-width as needed */
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

export default Checklist;
