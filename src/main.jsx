import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'primereact/resources/themes/saga-blue/theme.css';
import '/node_modules/primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux'
import store from './app/store.js'
import { BrowserRouter} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';





ReactDOM.createRoot(document.getElementById('root')).render(


  <BrowserRouter basename='/'>
  <React.StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
      <App />
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
  </BrowserRouter>,
)
