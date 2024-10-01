import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import styled from 'styled-components';

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const VariantOption = styled.div.attrs(({ isSelected }) => ({
    style: {
        backgroundColor: isSelected ? '#e0f7fa' : '#ffffff',
        borderColor: isSelected ? '#00acc1' : '#dddddd'
    }
}))`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid;
  
  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#b2ebf2' : '#f1f1f1')};
  }

  & label {
    margin-left: 8px;
    color: ${({ isSelected }) => (isSelected ? '#00796b' : '#333')};
  }
`;

const ExportDialog = ({ visible, onHide, onExport, setExportVariant }) => {
    const [selectedVariant, setSelectedVariant] = useState('');

    const handleExport = () => {
        onExport();
        onHide();
    };

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setExportVariant(variant);
    };

    return (
        <Dialog
            header="Export Seçimləri"
            visible={visible}
            onHide={onHide}
            footer={
                <DialogFooter>
                    <Button label="Ləğv et" icon="pi pi-times" onClick={onHide} className="p-button-secondary" />
                    <Button label="Export" icon="pi pi-check" onClick={handleExport} />
                </DialogFooter>
            }
            style={{ width: '30vw' }}
        >
            <div>
                <VariantOption
                    isSelected={selectedVariant === 'variant1'}
                    onClick={() => handleVariantChange('variant1')}
                >
                    <RadioButton
                        inputId="variant1"
                        name="exportVariant"
                        value="variant1"
                        checked={selectedVariant === 'variant1'}
                        onChange={() => handleVariantChange('variant1')}
                    />
                    <label htmlFor="variant1">Verilmiş filtrə uyğun bütün data - Yalnız nəticələr</label>
                </VariantOption>
                <VariantOption
                    isSelected={selectedVariant === 'variant2'}
                    onClick={() => handleVariantChange('variant2')}
                >
                    <RadioButton
                        inputId="variant2"
                        name="exportVariant"
                        value="variant2"
                        checked={selectedVariant === 'variant2'}
                        onChange={() => handleVariantChange('variant2')}
                    />
                    <label htmlFor="variant2">Sadəcə ekranda görünən sayda - Yalnız nəticələr</label>
                </VariantOption>
                <VariantOption
                    isSelected={selectedVariant === 'variant3'}
                    onClick={() => handleVariantChange('variant3')}
                >
                    <RadioButton
                        inputId="variant3"
                        name="exportVariant"
                        value="variant3"
                        checked={selectedVariant === 'variant3'}
                        onChange={() => handleVariantChange('variant3')}
                    />
                    <label htmlFor="variant3">Verilmiş filtrə uyğun bütün data - Cavablarla birgə</label>
                </VariantOption>

                <VariantOption
                    isSelected={selectedVariant === 'variant4'}
                    onClick={() => handleVariantChange('variant4')}
                >
                    <RadioButton
                        inputId="variant4"
                        name="exportVariant"
                        value="variant4"
                        checked={selectedVariant === 'variant4'}
                        onChange={() => handleVariantChange('variant4')}
                    />
                    <label htmlFor="variant4">Sadəcə ekranda görünən sayda - Cavablarla birgə</label>
                </VariantOption>

            </div>
        </Dialog>
    );
};

export default ExportDialog;
