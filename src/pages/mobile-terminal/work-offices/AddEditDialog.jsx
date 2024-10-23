import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast'; 

const AddEditDialog = ({ office, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: 0,
    code: '',
    name: '',
    locX: '',
    locY: '',
  });
  
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null); 

  useEffect(() => {
    if (office) {
      setFormData({
        id: office.id,
        code: office.code,
        name: office.name,
        locX: office.locX,
        locY: office.locY,
      });
    }
  }, [office]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); 
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = 'Kod boş ola bilməz!';
    if (!formData.name) newErrors.name = 'Ad boş ola bilməz!';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
        toastRef.current.show({ severity: 'error', summary: 'Xəta', detail: 'Bütün tələb olunan sahələri doldurun.' });
        return;
    }

    // Set locX and locY to null if they are empty strings
    const dataToSubmit = {
        ...formData,
        locX: formData.locX ? parseFloat(formData.locX) : null, // Convert to float or null
        locY: formData.locY ? parseFloat(formData.locY) : null, // Convert to float or null
    };
    console.log(dataToSubmit);
    onSubmit(dataToSubmit);
    onClose();
};

  return (
    <Dialog header={office ? 'Dəyişdir' : 'Əlavə et'} visible={true} onHide={onClose} style={{ width: '40vw' }}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="code">Kod:</label>
          <InputText
            id="code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className={errors.code ? 'p-invalid' : ''}
          />
          {errors.code && <small className="p-error">{errors.code}</small>}
        </div>
        <div className="p-field">
          <label htmlFor="name">Ad:</label>
          <InputText
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'p-invalid' : ''}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
        </div>
        <div className="p-field">
          <label htmlFor="locX">Location X:</label>
          <InputText
            id="locX"
            name="locX"
            value={formData.locX}
            onChange={handleInputChange}
            className={errors.locX ? 'p-invalid' : ''}
          />
          {errors.locX && <small className="p-error">{errors.locX}</small>}
        </div>
        <div className="p-field">
          <label htmlFor="locY">Location Y:</label>
          <InputText
            id="locY"
            name="locY"
            value={formData.locY}
            onChange={handleInputChange}
            className={errors.locY ? 'p-invalid' : ''}
          />
          {errors.locY && <small className="p-error">{errors.locY}</small>}
        </div>
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button label="Geri" onClick={onClose} className="p-button-secondary" />
        <Button label="Təsdiqlə" onClick={handleSubmit} className="p-button-primary ml-2" />
      </div>
      <Toast ref={toastRef} />
    </Dialog>
  );
};

export default AddEditDialog;
