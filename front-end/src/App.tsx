import React from 'react'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const url = 'http://localhost:5000/api/v1/employees';
const default_name = 'render_job';

const validateIPaddress = (func:any) => {
  let ip = '';
  try {
    (async () => {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log(data);

      ip = data.ip;
      console.log(ip);
      console.log(ip + " is the ip");
    if (ip  === '184.170.163.20') {
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
      
      <div>
        
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
        <div>Not Approved</div>}
        
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
const Render = () => {
  const [renEntPause, setRenEntPause] = useState([]);
  const [renEntRunning, setRenEntRunning] = useState([]);
  const [renEntCompleted, setRenEntCompleted] = useState([]);
  const [openIndex, setOpenIndex] = useState(1);
  const [nameSpace, setNameSpace] = useState([]);

  //Assigns default names to jobs
  const updateIndex = () => {
    let latestIndex = 0;
    while(latestIndex<10000) {
      const name = default_name + latestIndex;
      for(let i = 0; i < nameSpace.length; i++) {
        if(nameSpace[i] === name) {
          latestIndex++;
          continue;
        }
        break;
      }
    }
    setOpenIndex(latestIndex);
    return latestIndex;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every second!');
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setRenEntPause(data[0]);
        setRenEntRunning(data[1]);
        setRenEntCompleted(data[2]);
        setNameSpace(data[3]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  },[]);
  const Create = () => { return (<div> Create </div>); }

  return (
    <div>
          <div className='grid w-full grid-cols-2 justify-items-center'>
            
            <h1 className='p-2 col-span-2 text-lg font-bold my-3'> Rendering API </h1>
              <h1 className='w-auto px-20 py-4  mx-4 bg-gray-800 text-white'> 
              Upload Files, Press Seetings, then Press Render </h1>
              <h1 className='w-auto px-20 py-4  mx-4 bg-gray-800 text-white'> 
              Contact cmink2040@gmail.com for support</h1>
            
          </div>

      <div className='grid grid-cols-3 mt-16 pt-8
      border-t-2 border-gray-400 w-full justify-items-center gap-4 px-4'>
        <div className='col-span-1 w-full px-2 justify-items-center bg-gray-300'>
          <h1 className='grid justify-items-center text-base font-bold mb-2 underline '> Upload rendering jobs here: </h1>
            {renEntPause.map((item:any) => (
              <RenderingEntity key={item.name} file={item.file} startFrame={item.startFrame} 
              endFrame={item.endFrame} xRes={item.xRes} yRes={item.yRes} oType={item.oType}
              renderingProgress={item.renderingProgress} status={item.status} name={item.name} />
            ))}
            <Create/>
        </div>
        <div className='col-span-1 w-full px-2 bg-gray-300'>
        <h1 className='grid justify-items-center text-base font-bold mb-2 underline '> Current Jobs in Progress </h1>
        {renEntRunning.map((item:any) => (
              <RenderingEntity key={item.name} file={item.file} startFrame={item.startFrame} 
              endFrame={item.endFrame} xRes={item.xRes} yRes={item.yRes} oType={item.oType}
              renderingProgress={item.renderingProgress} status={item.status} name={item.name} />
            ))}
  
        </div>
        <div className='col-span-1 w-full px-2 bg-gray-300'>
        <h1 className='grid justify-items-center text-base font-bold mb-2 underline '> Completed Jobs </h1>
        {renEntCompleted.map((item:any) => (
              <RenderingEntity key={item.name} file={item.file} startFrame={item.startFrame} 
              endFrame={item.endFrame} xRes={item.xRes} yRes={item.yRes} oType={item.oType}
              renderingProgress={item.renderingProgress} status={item.status} name={item.name} />
            ))}
       
        </div>
      </div>
    </div>
  );
}

const RenderingEntity = (props:any) => {
  // Name, File, StartFrame, EndFrame, Resolution

  //Variables
  const [file, setFile] = useState(props.file);
  const [name, setName] = useState(props.name);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(250);
  const [xRes, setXRes] = useState(1920);
  const [yRes, setYRes] = useState(1080);
  const [oType, setOType] = useState('PNG');

  const [renderStatus, setRendering] = useState("NOT_STARTED");
  const [renderingProgress, setRenderingProgress] = useState(0);

  //Functions
  const updateStatus = (props:any) => {
    setRendering(props.status);
    setRenderingProgress(props.progress);
    setFile(props.file);
    setName(props.name);
    setStartFrame(props.startFrame);
    setEndFrame(props.endFrame);
    setXRes(props.xRes);
    setYRes(props.yRes);
    setOType(props.oType);
  }
  const toDataBase = () => {
    const data = {
      name: name,
      file: file,
      startFrame: startFrame,
      endFrame: endFrame,
      xRes: xRes,
      yRes: yRes,
      oType: oType,
      status: renderStatus,
      progress: renderingProgress,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  const executeRender = () => {
    const data = {
      name: name,
      file: file,
      run: "True",
    };
    setRendering("IN_PROGRESS");
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }

  //Components
  const RenderButton = () => {
    return(
      <button onClick={executeRender}> Send </button>
    );
  }
  
  const EditMenu = () => {
    return(
      <div>
        <h1> Edit Menu </h1>
      </div>
    );
  }

  const ProgressBar = () => {
    return(
      <div>
        <h1> Progress Bar </h1>
      </div>
    );
  }

  return (
    <div className = 'bg-gray-200 text-center'>
      {name}
      <br/>
      <div className="flex">
        <EditMenu />
        <ProgressBar />
        <RenderButton />
      </div>
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
