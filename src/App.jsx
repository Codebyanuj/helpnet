import React from "react"
import './index.css'
//import sidebar from "./components/sidebar";



import SigninType from "./components/Profession";
import Home from "./Home";
import SignUpForm from "./SignUpForm";
import Login from "./Login";
import WorkerSignin from "./WorkerSignup";

import GridContainer from './components/GridContainer';
import WorkerList from './components/WorkerList';


import { BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
  


      <BrowserRouter>
        <Routes>
          <Route path='/Home' element={<Home />}></Route>
          <Route path='/SignType' element={<SigninType />}></Route>
          <Route path='/workerSignin' element={<WorkerSignin />}></Route>
          <Route path='/signup' element={<SignUpForm />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/" element={<GridContainer />} />
          <Route path="/workers/:category" element={<WorkerList />} />
        </Routes>
      </BrowserRouter>


   

    // {/* <div >
    // <Navbar />
    // <Hero1 />
    // <GridContainer />
    // <Footer1 />
    // </div> */}





  );
}

export default App;
