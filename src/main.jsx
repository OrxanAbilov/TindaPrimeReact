import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux'
import store from './app/store.js'
import { BrowserRouter} from 'react-router-dom';





ReactDOM.createRoot(document.getElementById('root')).render(


  <BrowserRouter>
  <React.StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
      <App />
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
  </BrowserRouter>,
)
