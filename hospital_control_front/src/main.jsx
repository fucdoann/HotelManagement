import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthProvider.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./Context";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider>
        <MaterialTailwindControllerProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
          </LocalizationProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
