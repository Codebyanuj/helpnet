import React from "react"
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css'

import SigninType from "./components/Signtype";
import Home from "./Home";
import SignUpForm from "./SignUpForm";
import Login from "./Login";
import WorkerSignin from "./WorkerSignup";
import Bookings from './components/Bookings'
import GridContainer from './components/GridContainer';
import WorkerList from './components/WorkerList';
import AboutUs from './components/AboutUS';
import Help from './components/Help';
import Workernav from './components/WorkerNavbar';

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Aboutus' element={<AboutUs />} />
          <Route path='/Help' element={<Help />} />
          <Route path='/Bookings' element={<Bookings />} />
          <Route path='/Workernav' element={<Workernav />} />
          <Route path='/Signupas' element={<SigninType />} />
          <Route path='/workerSignin' element={<WorkerSignin />} />
          <Route path='/signin' element={<SignUpForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Container' element={<GridContainer />} />
          <Route path='/workers/:category' element={<WorkerList />} />
        </Routes>
      </HashRouter>
  );
}

export default App;
