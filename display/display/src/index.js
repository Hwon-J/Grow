import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';

// 현재 store에 시리얼번호가 등록됐는지에 관한 변수를 바꿔주기 위해 리듀서 설정
function serial_reducer(current_serial, action) {
  // 현재 시리얼번호 등록을 모른다면 false값으로 변수 설정
  if (current_serial === undefined) {
    return {
      serial_number : false,
      name : 'minguk'
    }
  }
  // action type으로 Success가 들어왔을 때 current_serial의 serial_number을 true로 변경
  if (action.type === 'SUCCESS') {

    const new_serial = {...current_serial}
    new_serial.serial_number = true
    console.log(new_serial)
    new_serial.name = "민국"
    return new_serial
  }
  
  console.log('serial', current_serial)
}
// 만들어준 리듀서를 기반으로 store 생성
const store = createStore(serial_reducer)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
