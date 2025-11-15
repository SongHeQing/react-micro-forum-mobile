// src/main.tsx
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router'
import { Provider } from 'react-redux'
import store from './store'
import './main.scss';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router />
  </Provider>
)
