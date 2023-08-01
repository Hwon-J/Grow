import './App.css';

import background from './assets/BackgroundPicture.gif';
import flowercharacter from './assets/flowercharacter.png';
import lettucecharacter from './assets/lettucecharacter.png';
// import potcharacter from './assets/potcharacter.png';
import logo from './assets/logo.png';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';
import WebSocketComponent from './Websocket';
import { useEffect } from 'react';