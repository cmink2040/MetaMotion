import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {Render, RenderingEntity} from "./Render.tsx";

const url = 'http://localhost:8000/';
const machineLearningUrl = url + 'machinelearning/';

const default_name = 'render_job';

const validateIPaddress = (func:any) => {
  let ip = '';
  try {
    (async () => {
      const response = await fetch(url+ 'graphics/ip');
      console.log(response);
      const data = await response.json();
      console.log(data);

      console.log(data);

    if (data  === '127.0.0.1') {
      func(true);
    }
    })();
    
  } catch (error) {
    console.error('Error retrieving IP address:', error);
}}

const App = () => {
  const [Approved, setApproved] = useState(false);
  validateIPaddress(setApproved);
  return (
      
      <div className='h-screen'>
        
        {(Approved) ? 
        <BrowserRouter>
          <Routes>

              <Route path="/" element={<Application/>} />
              <Route path="/machinelearning" element={<ML/>} />
              <Route path="/rendering" element={<Render/>} />
              <Route element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
        : 
        <div>Not Approved
          <h1> You are not allowed to use this. Please exit site immediately. </h1>
          </div>}
        
    </div>
  
);
  }
const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}
const ML = () => {
  return (
    <div>
      <h1>ML</h1>
    </div>
  );
}

const Application = () => {
  return (
    <div className='flex flex-col items-center'>
    <div className='w-auto px-2 grid align-center'>
      <div className='text-center text-2xl mt-16 mb-1'>
        Welcome to CMK and MZEN server API. 
        </div>
      <div className='text-center'> Please select an access an API: </div>
    </div>
    <div className='grid grid-cols-2 w-full px-8 gap-8 mt-32 text-white'>
      <Link className='col-span-1 bg-gray-700 py-32 grid justify-items-center  rounded-2xl
      hover:bg-gray-300 transition duration-300 hover:cursor-pointer' to="/machinelearning">
        MACHINE LEARNING: TENSORFLOW
        </Link>
        <Link className='col-span-1 bg-gray-700 py-32 grid justify-items-center rounded-2xl
        hover:bg-gray-300 transition duration-300 text-white hover:cursor-pointer'
        to="/rendering">
        RENDERING: BLENDER
        </Link>
    </div>
    </div>
  );
}


export default App
