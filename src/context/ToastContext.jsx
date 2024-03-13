import { Toast } from "primereact/toast";
import  { createContext, useContext, useRef } from "react";

const ToastContext = createContext(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToasProvider");
  }

  return context;
};

export const ToastProvider = ({ children }) => {
  const toastRef = useRef(null);
  const showToast = (severity, summary, detail, life) => {
    toastRef.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
};
