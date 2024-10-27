import React from "react"
import { BrowserRouter, Routes, Route} from 'react-router-dom';
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
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/Aboutus' element={<AboutUs />}></Route>
          <Route path='/Help' element={<Help />}></Route>
          <Route path='/Bookings' element={<Bookings />}></Route>
          <Route path='/Workernav' element={<Workernav />}></Route>
          <Route path='/Signupas' element={<SigninType />}></Route>
          <Route path='/workerSignin' element={<WorkerSignin />}></Route>
          <Route path='/signin' element={<SignUpForm />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="Container" element={<GridContainer />} />
          <Route path="/workers/:category" element={<WorkerList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
