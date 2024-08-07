import React, { useState } from 'react';
import { POST_NEW_CHECKLIST } from '../../features/clients/services/api';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from "primereact/inputtextarea"
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const AddCheckList = () => {
  const [formData, setFormData] = useState({
    code: '*',
    desC_: '*',
    specode: '*',
    begiN_DATE: null,
    enD_DATE: null,
    statuS_: true,
    slS_CODE: '*',
    clienT_CODE: '*',
    clspecode: '*',
    clspecodE2: '*',
    clspecodE3: '*',
    clspecodE4: '*',
    clspecodE5: '*',
    cltype: '*',
    clgroup: '*',
    deL_STATUS: false,
    checkListQuestionPostDto: [
      {
        question: '',
        type: '', // Qapalı Açıq
        varianT_CHOICE_COUNT: 0, // açıqdırsa 0 qapalıdırsa neçə variant seçə bilərsə
        answeR_TEXT_TYPE: '', // reqemnen yoxsa string
        imagE_STATUS: true, // cavabda sual ola biler ya yox
        imagE_COUNT: 0, // nece sekil ola biler (yuxati falsedirsa 0)
        cL_ID: 0, // checklistin idsi  - 0
        checkListQuestionVariantPostDtos: [
          {
            variant: '', // 
            questioN_ID: 0 // yene 0
          }
        ],
        checkListQuestionImagePostDtos: [
          {
            filename: '', // postda qalir
            filepath: '', // postda qalir
            base64: '', // postda qalir
            questioN_ID: 0 // postda 0
          }
        ]
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, value) => {
    // Convert the date to UTC before setting it in formData
    const utcDate = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)) : null;
  
    setFormData({
      ...formData,
      [name]: utcDate
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleQuestionChange = (index, event) => {
    const { name, value, checked, type } = event.target;
    const updatedQuestions = [...formData.checkListQuestionPostDto];
  
    if (type === 'checkbox') {
      updatedQuestions[index][name] = checked;
    } else {
      updatedQuestions[index][name] = value;
    }
  
    setFormData({
      ...formData,
      checkListQuestionPostDto: updatedQuestions
    });
  };
  

  const handleVariantChange = (qIndex, vIndex, e) => {
    const { name, value } = e.target;
    const questions = [...formData.checkListQuestionPostDto];
    questions[qIndex].checkListQuestionVariantPostDtos[vIndex][name] = value;
    setFormData({
      ...formData,
      checkListQuestionPostDto: questions
    });
  };

  const handleImageChange = (qIndex, iIndex, e) => {
    const { name, value } = e.target;
    const questions = [...formData.checkListQuestionPostDto];
    questions[qIndex].checkListQuestionImagePostDtos[iIndex][name] = value;
    setFormData({
      ...formData,
      checkListQuestionPostDto: questions
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      checkListQuestionPostDto: [
        ...formData.checkListQuestionPostDto,
        {
          question: '',
          type: '',
          varianT_CHOICE_COUNT: 0,
          answeR_TEXT_TYPE: '',
          imagE_STATUS: true,
          imagE_COUNT: 0,
          cL_ID: 0,
          checkListQuestionVariantPostDtos: [{ variant: '', questioN_ID: 0 }],
          checkListQuestionImagePostDtos: [{ filename: '', filepath: '', base64: '', questioN_ID: 0 }]
        }
      ]
    });
  };

  const addVariant = (qIndex) => {
    const questions = [...formData.checkListQuestionPostDto];
    questions[qIndex].checkListQuestionVariantPostDtos.push({ variant: '', questioN_ID: 0 });
    setFormData({
      ...formData,
      checkListQuestionPostDto: questions
    });
  };

  const removeVariant = (qIndex, vIndex) => {
    const questions = [...formData.checkListQuestionPostDto];
    questions[qIndex].checkListQuestionVariantPostDtos.splice(vIndex, 1);
    setFormData({
      ...formData,
      checkListQuestionPostDto: questions
    });
  };  
  

  const removeQuestion = (index) => {
    const questions = [...formData.checkListQuestionPostDto];
    questions.splice(index, 1);
    setFormData({
      ...formData,
      checkListQuestionPostDto: questions
    });
  };

  const handleFileUpload = (qIndex, iIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1] || '';
        setFormData((prevFormData) => {
          const updatedImagePostDtos = [...prevFormData.checkListQuestionPostDto[qIndex].checkListQuestionImagePostDtos];
          updatedImagePostDtos[iIndex] = {
            ...updatedImagePostDtos[iIndex],
            filename: file.name,
            base64: base64String,
            // Optionally store filepath if needed
            filepath: file.name  // You can adjust filepath as per your requirement
          };
          return {
            ...prevFormData,
            checkListQuestionPostDto: prevFormData.checkListQuestionPostDto.map((question, idx) =>
              idx === qIndex ? { ...question, checkListQuestionImagePostDtos: updatedImagePostDtos } : question
            )
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addFile = (qIndex) => {
    setFormData((prevFormData) => {
      const updatedImagePostDtos = [...prevFormData.checkListQuestionPostDto[qIndex].checkListQuestionImagePostDtos];
      updatedImagePostDtos.push({
        filename: '',
        filepath: '',
        base64: '',
        questioN_ID: 0
      });
      return {
        ...prevFormData,
        checkListQuestionPostDto: prevFormData.checkListQuestionPostDto.map((question, idx) =>
          idx === qIndex ? { ...question, checkListQuestionImagePostDtos: updatedImagePostDtos } : question
        )
      };
    });
  };
  
  const removeFile = (qIndex, iIndex) => {
    setFormData((prevFormData) => {
      const updatedImagePostDtos = [...prevFormData.checkListQuestionPostDto[qIndex].checkListQuestionImagePostDtos];
      updatedImagePostDtos.splice(iIndex, 1);
      return {
        ...prevFormData,
        checkListQuestionPostDto: prevFormData.checkListQuestionPostDto.map((question, idx) =>
          idx === qIndex ? { ...question, checkListQuestionImagePostDtos: updatedImagePostDtos } : question
        )
      };
    });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const result = await POST_NEW_CHECKLIST(formData);
      console.log('Form Data:', formData);
      console.log('New checklist created:', result);
    } catch (error) {
      console.error('Error creating checklist:', error.message);
    }
  };

  return (
    <div className="p-fluid">
      <h2>Add New Checklist</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="desC_">Açıqlama</label>
            <InputText id="desC_" name="desC_" value={formData.desC_} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="specode">Özəl kod</label>
            <InputText id="specode" name="specode" value={formData.specode} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="begiN_DATE">Başlama vaxtı</label>
            <Calendar id="begiN_DATE" name="begiN_DATE" value={formData.begiN_DATE} onChange={(e) => handleDateChange('begiN_DATE', e.value)} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="enD_DATE">Bitmı vaxtı</label>
            <Calendar id="enD_DATE" name="enD_DATE" value={formData.enD_DATE} onChange={(e) => handleDateChange('enD_DATE', e.value)} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="slS_CODE">Təmsilçi kodu</label>
            <InputText id="slS_CODE" name="slS_CODE" value={formData.slS_CODE} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clienT_CODE">Müştəri kodu</label>
            <InputText id="clienT_CODE" name="clienT_CODE" value={formData.clienT_CODE} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clspecode">Müştəri özəl kod</label>
            <InputText id="clspecode" name="clspecode" value={formData.clspecode} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clspecodE2">Müştəri özəl kod2</label>
            <InputText id="clspecodE2" name="clspecodE2" value={formData.clspecodE2} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clspecodE3">Müştəri özəl kod3</label>
            <InputText id="clspecodE3" name="clspecodE3" value={formData.clspecodE3} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clspecodE4">Müştəri özəl kod4</label>
            <InputText id="clspecodE4" name="clspecodE4" value={formData.clspecodE4} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="clspecodE5">Müştəri özəl kod5</label>
            <InputText id="clspecodE5" name="clspecodE5" value={formData.clspecodE5} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '1 1 20%' }}>
            <label htmlFor="cltype">Müştəri tipi</label>
            <InputText id="cltype" name="cltype" value={formData.cltype} onChange={handleInputChange} required />
          </div>
          <div style={{ margin: '0.5rem', flex: '0 1 23.6%' }}>
            <label htmlFor="clgroup">Müştəri qrupu</label>
            <InputText id="clgroup" name="clgroup" value={formData.clgroup} onChange={handleInputChange} required />
          </div>
        </div>

        <hr />

        {formData.checkListQuestionPostDto.map((question, qIndex) => (
  <div key={qIndex} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
    <h3>Sual {qIndex + 1}</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div style={{ margin: '0.5rem', flex: '1 1 100%' }}>
        <label htmlFor={`question-${qIndex}`}>Sual</label>
        <InputTextarea
          id={`question-${qIndex}`}
          name="question"
          value={question.question}
          onChange={(e) => handleQuestionChange(qIndex, e)}
          rows={5}
          required
        />
      </div>
      <div style={{ margin: '0.5rem', flex: '1 1 15%' }}>
        <label htmlFor={`type-${qIndex}`}>Sual tipi</label>
        <Dropdown
          id={`type-${qIndex}`}
          name="type"
          value={question.type}
          options={[{ label: 'Açıq', value: 'Açıq' }, { label: 'Qapalı', value: 'Qapalı' }]}
          onChange={(e) => handleQuestionChange(qIndex, e)}
          required
        />
      </div>
      <div style={{ margin: '0.5rem', flex: '1 1 15%' }}>
        <label htmlFor={`varianT_CHOICE_COUNT-${qIndex}`}>Variant seçim sayı</label>
        <Dropdown
          id={`varianT_CHOICE_COUNT-${qIndex}`}
          name="varianT_CHOICE_COUNT"
          value={question.varianT_CHOICE_COUNT}
          options={Array.from({ length: question.checkListQuestionVariantPostDtos.length }, (_, i) => ({ label: i + 1, value: i + 1 }))}
          onChange={(e) => handleQuestionChange(qIndex, e)}
          disabled={question.type === 'Açıq'} // Disable if type is 'Açıq'
        />
      </div>
      <div style={{ margin: '0.5rem', flex: '1 1 15%' }}>
        <label htmlFor={`answeR_TEXT_TYPE-${qIndex}`}>Cavab tipi</label>
        <Dropdown
          id={`answeR_TEXT_TYPE-${qIndex}`}
          name="answeR_TEXT_TYPE"
          value={question.answeR_TEXT_TYPE}
          options={[{ label: 'Yazı', value: 'String' }, { label: 'Rəqəm', value: 'Integer' }]}
          onChange={(e) => handleQuestionChange(qIndex, e)}
          required
        />
      </div>
      <div style={{ margin: '0.5rem', flex: '1 1 15%' }}>
        <label htmlFor={`imagE_STATUS-${qIndex}`}>Şəkil statusu</label>
        <Dropdown
          id={`imagE_STATUS-${qIndex}`}
          name="imagE_STATUS"
          value={question.imagE_STATUS ? 'true' : 'false'}
          options={[
            { label: 'Bəli', value: 'true' },
            { label: 'Xeyr', value: 'false' }
          ]}
          onChange={(e) => handleQuestionChange(qIndex, {
            target: {
              name: 'imagE_STATUS',
              value: e.value === 'true' // Convert 'true'/'false' back to boolean
            }
          })}
          placeholder="Select Image Status"
          optionLabel="label"
          required
        />
      </div>
      <div style={{ margin: '0.5rem', flex: '0 1 15%' }}>
        <label htmlFor={`imagE_COUNT-${qIndex}`}>Maksimum şəkil sayı</label>
        <InputText
          id={`imagE_COUNT-${qIndex}`}
          name="imagE_COUNT"
          value={question.imagE_COUNT}
          onChange={(e) => handleQuestionChange(qIndex, e)}
          required
        />
      </div>
    </div>
      <hr></hr>
    {question.type === 'Qapalı' && (
      <>
        {question.checkListQuestionVariantPostDtos.map((variant, vIndex) => (
          <div key={vIndex} style={{ margin: '0.5rem', display: 'flex', alignItems: 'center' }}>
        <label htmlFor={`variant-${qIndex}-${vIndex}`} style={{ marginRight: '0.5rem' }}>Variant {vIndex + 1}</label>
        <InputText
          id={`variant-${qIndex}-${vIndex}`}
          name="variant"
          value={variant.variant}
          onChange={(e) => handleVariantChange(qIndex, vIndex, e)}
          required
          style={{ flex: '1 1 auto', marginRight: '0.5rem' }}
        />
        <i className="pi pi-trash" style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeVariant(qIndex, vIndex)}></i>
      </div>
        ))}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button type="button" label="Add Variant" onClick={() => addVariant(qIndex)} style={{ width: 'auto' }} />
            </div>
      </>
    )}

      {question.checkListQuestionImagePostDtos.map((image, iIndex) => (
        <div key={iIndex} style={{ margin: '0.5rem', flex: '1 1 20%' }}>
          <label htmlFor={`fileUpload-${qIndex}-${iIndex}`}>Şəkil yüklə {iIndex + 1}</label>
          <input
            type="file"
            id={`fileUpload-${qIndex}-${iIndex}`}
            name={`fileUpload-${qIndex}-${iIndex}`}
            onChange={(e) => handleFileUpload(qIndex, iIndex, e)}
          />
          {image.filename && (
            <div>
              <strong>Şəkil adı:</strong> {image.filename}
            </div>
          )}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <Button type="button" label="Remove File" className="p-button-danger" onClick={() => removeFile(qIndex, iIndex)} style={{ width: 'auto' }}/>
            </div>
        </div>
      ))}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button type="button" label="Add File" onClick={() => addFile(qIndex)} style={{ width: 'auto' }}/>
            </div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <Button type="button" label="Remove Question" severity="danger"  onClick={() => removeQuestion(qIndex)} style={{ width: 'auto' }} />
            </div>
  </div>
))}


        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button type="button" label="Add Question" onClick={addQuestion}  style={{ width: 'auto' }}/>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <Button type="submit" label="Submit" style={{ width: 'auto' }}/>
        </div>
      </form>
    </div>
  );
};

export default AddCheckList;
