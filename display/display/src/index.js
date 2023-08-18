import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';

// 현재 URL을 가져옵니다.
const currentURL = window.location.href;

// URL을 '/'로 분할하고, 마지막 부분인 숫자 값을 추출합니다.
const parts = currentURL.split('/');
const lastPart = parts[parts.length - 1];
console.log(lastPart)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  
    <App id={lastPart} />
  
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
