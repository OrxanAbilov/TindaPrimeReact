import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { POST_NEW_DOCUMENTS } from "../../features/esd/income/services/api";
import { useToast } from "../../context/ToastContext";


export default function NewDoc() {
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false)
  const {showToast} = useToast()

  const cur = ["AZN","USD","EUR"
 
  ];

  const defaultValues = {
    description: "",
    curr: "",
    amount: "",
    reason: "",
    docId: 0,
    docDate: "",
    docTypeId: 1,
    docNo: "0",
    id: 0,
  };
  const form = useForm({ defaultValues });
  const errors = form.formState.errors;

  const onSubmit = async (data) => {

   try {
    setIsLoading(true)
   const res = await  POST_NEW_DOCUMENTS(data)
   if(res){

     showToast("success","Uğurlu əməliyyat!","Sənəd yaradıldı!",3000)
   }

   navigate(-1)

    
   } catch (error) {
    console.log(error)
    showToast("error","Xəta",error.response.data.exception[0])

   }finally{
    setIsLoading(false)
   }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  return (
    <Wrapper>
      <HeaderWrapper>
        <Title>Yeni sənəd </Title>
        <Button
          onClick={() => navigate(-1)}
          label="Geri qayıt"
          icon="pi pi-angle-left"
          text
          style={{ width: "130px" }}
        />
      </HeaderWrapper>

      <Form>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-column gap-2"
        >
          <Controller
            name="reason"
            control={form.control}
            rules={{ required: "Məcburidir" }}
            render={({ field, fieldState }) => (
              <>
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={4}
                  placeholder="Səbəb"
                  cols={30}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            rules={{ required: "Məcburidir" }}
            render={({ field, fieldState }) => (
              <>
                <InputTextarea
                  id={field.name}
                  {...field}
                  rows={4}
                  cols={30}
                  placeholder="Açıqlama"
                  className={classNames({ "p-invalid": fieldState.error })}
                />
                {getFormErrorMessage(field.name)}
              </>
            )}
          />

          <InputGroup>
            <Controller
              name="curr"
              control={form.control}
              rules={{ required: "Məcburidir" }}
              render={({ field, fieldState }) => (
                <InputItem>
                  <Dropdown
                    showClear
                    id={field.name}
                    value={field.value}
                    placeholder="Məzənnə seçin"
                    options={cur}
                    style={{ width: "300px" }}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({ "p-invalid": fieldState.error })}
                  />

                  {getFormErrorMessage("curr")}
                </InputItem>
              )}
            />

            <Controller
              name="amount"
              control={form.control}
              rules={{
                required: "Məcburidir",
              }}
              render={({ field, fieldState }) => (
                <InputItem>
                  <InputNumber
                    showButtons
                    buttonLayout="horizontal"
                    step={0.25}
                    decrementButtonClassName="p-button-danger"
                    incrementButtonClassName="p-button-success"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                    minFractionDigits={2}
                    maxFractionDigits={5}
                    placeholder="Məbləğ"
                    id={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onValueChange={(e) => field.onChange(e)}
                    useGrouping={false}
                    style={{ width: "300px" }}
                    inputClassName={classNames({
                      "p-invalid": fieldState.error,
                    })}
                  />
                  {getFormErrorMessage("amount")}
                </InputItem>
              )}
            />

            <Controller
              name="docDate"
              control={form.control}
              rules={{ required: "Məcburidir" }}
              render={({ field, fieldState }) => (
                <InputItem>
                  <Calendar
                    showButtonBar
                    showIcon
                    style={{ width: "300px" }}
                    placeholder="Tarix"
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    dateFormat="dd/mm/yy"
                    className={classNames({ "p-invalid": fieldState.error })}
                  />
                  {getFormErrorMessage(field.name)}
                </InputItem>
              )}
            />
          </InputGroup>

          <ButtonWrapper>
            <Button label="Yadda saxla" type="submit" icon="pi pi-check" loading={isLoading} />
          </ButtonWrapper>
        </form>
      </Form>
    </Wrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const InputGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;
const InputItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Form = styled.div`
  width: 100%;
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3``;
