import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'; 
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dropdown } from 'primereact/dropdown';
import { GET_ALL_VISIT_DURATION_BY_ID, POST_NEW_VISIT_DURATION, EDIT_VISIT_DURATION } from '../../../features/clients/services/api';
import Loading from '../../../components/Loading';
import Error from '../../../components/Error';

const VisitDurationEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); 
  const location = useLocation(); 
  const isCopy = location.state?.isCopy; 
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    id: 0,
    desc: '',
    slS_CODE: '*',
    status: true,
    clienT_CODE: '*',
    clspecode: '*',
    clspecodE2: '*',
    clspecodE3: '*',
    clspecodE4: '*',
    clspecodE5: '*',
    cltype: '*',
    clgroup: '*',
    miN_WAIT_MINUTE: 0,
    maX_WAIT_MINUTE: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GET_ALL_VISIT_DURATION_BY_ID(id);
      const fetchedData = isCopy ? { ...data.data, id: undefined } : data.data;
      setFormData(fetchedData);
    } catch (error) {
      console.error('Error fetching visit duration details', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, isCopy]);


  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));

    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleNumberChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));

    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.desc.trim()) errors.desc = 'Açıqlama boş ola bilməz.';
    if (formData.miN_WAIT_MINUTE === null || formData.miN_WAIT_MINUTE === '' || formData.miN_WAIT_MINUTE <= 0) {
      errors.miN_WAIT_MINUTE = 'Minimum gözləmə müddəti 0-dan böyük olmalıdır.';
    }
    if (formData.maX_WAIT_MINUTE === null || formData.maX_WAIT_MINUTE === '' || formData.maX_WAIT_MINUTE <= 0) {
      errors.maX_WAIT_MINUTE = 'Maksimum gözləmə müddəti 0-dan böyük olmalıdır.';
    }
    if (!formData.slS_CODE.trim()) errors.slS_CODE = 'Təmsilçi kodu boş ola bilməz.';
    if (!formData.clienT_CODE.trim()) errors.clienT_CODE = 'Müştəri kodu boş ola bilməz.';
    if (!formData.cltype.trim()) errors.cltype = 'Müştəri tipi boş ola bilməz.';
    if (!formData.clspecode.trim()) errors.clspecode = 'clspecode boş ola bilməz.';
    if (!formData.clspecodE2.trim()) errors.clspecodE2 = 'clspecodE2 tipi boş ola bilməz.';
    if (!formData.clspecodE3.trim()) errors.clspecodE3 = 'clspecodE3 boş ola bilməz.';
    if (!formData.clspecodE4.trim()) errors.clspecodE4 = 'clspecodE4 boş ola bilməz.';
    if (!formData.clspecodE5.trim()) errors.clspecodE5 = 'clspecodE5 boş ola bilməz.';
    return errors;
  };

  const handleSaveClick = async () => {
    const errors = validateForm(); 
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const dataToSave = { ...formData, id: isCopy ? 0 : formData.id };
      if (id && !isCopy) {
        await EDIT_VISIT_DURATION(dataToSave);
      } else {
        await POST_NEW_VISIT_DURATION(dataToSave);
      }
      navigate('/clients/visit-durations');
    } catch (error) {
      console.error('Error saving visit duration', error);
      alert('An error occurred while saving the visit duration.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Wrapper>
      <h2>
        {isCopy ? "Kopyala" : id ? "Dəyişdir" : "Əlavə et"}
      </h2>
      <FormContainer>
        <div className="grid">
          <div className="col-6">
            <label>Açıqlama</label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleInputChange(e, 'desc')}
              className="p-inputtext-sm"
              placeholder="Açıqlama"
              rows={2}
              cols={60}
              style={{ width: '90%'}}   
            />
            {formErrors.desc && <ErrorMessage>{formErrors.desc}</ErrorMessage>}
          </div>
          {[
            { label: 'Minimum gözləmə müddəti', field: 'miN_WAIT_MINUTE', isNumber: true },
            { label: 'Maksimum gözləmə müddəti', field: 'maX_WAIT_MINUTE', isNumber: true },         
            { label: 'Təmsilçi kodu', field: 'slS_CODE' },
            { label: 'Müştəri kodu', field: 'clienT_CODE' },
            { label: 'Müştəri tipi', field: 'cltype' }
          ].map(({ label, field, isNumber }) => (
            <div className="col-3" key={field}>
              <label>{label}</label>
              {isNumber ? ( 
                <InputNumber
                  value={formData[field]}
                  onValueChange={(e) => handleNumberChange(e.value, field)} 
                  className="p-inputtext-sm"
                  placeholder={label}
                  min={0} 
                  mode="decimal" 
                  minFractionDigits={1} 
                  maxFractionDigits={2}          
                  style={{ width: '80%'}}   
                />
              ) : (
                <InputText
                  value={formData[field]}
                  onChange={(e) => handleInputChange(e, field)}
                  className="p-inputtext-sm"
                  placeholder={label}
                  style={{ width: '80%'}}
                />
              )}
              {formErrors[field] && <ErrorMessage>{formErrors[field]}</ErrorMessage>}
            </div>
          ))}
          <div className="col-3">
            <label>Status</label>
            <Dropdown
              value={formData.status}  
              options={[
                { label: 'Aktiv', value: true },  
                { label: 'Passiv', value: false },
              ]}
              onChange={(e) => setFormData({ ...formData, status: e.value })}
              placeholder="Select Status"
              style={{ width: '80%', height: '54%' }}
            />
          </div>
          <div className="col-12">
            <div className="grid">
              {['clspecode', 'clspecodE2', 'clspecodE3', 'clspecodE4', 'clspecodE5'].map((field, index) => (
                <div className="col-3" key={index}>
                  <label>{`Özəl kod ${index + 1}`}</label>
                  <InputText
                    value={formData[field]}
                    onChange={(e) => handleInputChange(e, field)}
                    className="p-inputtext-sm"
                    placeholder={`Custom Code ${index + 1}`}
                    style={{ width: '80%'}}
                  />
                  {formErrors[field] && <ErrorMessage>{formErrors[field]}</ErrorMessage>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ButtonContainer>
          <Button label="Yadda saxla" icon="pi pi-check" onClick={handleSaveClick} />
          <Button label="Ləğv et" icon="pi pi-times" className="p-button-secondary" onClick={() => navigate('/clients/visit-durations')} />
        </ButtonContainer>
      </FormContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0.5rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem; 
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 1rem;
`;
const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

export default VisitDurationEdit;
