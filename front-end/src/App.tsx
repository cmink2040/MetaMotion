import React from 'react'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const refreshTime = 4000;
const url = 'http://192.168.4.49:8000/';
const graphicsUrl = url + 'graphics/render/blender';
const interactionUrl = url + 'graphics/render/interact';
const machineLearningUrl = url + 'machinelearning/';

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
const EditMenuN = (props:any) => {
  const handleSubmit = (e:any) => {
    e.preventDefault();
    (async () => {
      
      const formData = new FormData(e.target);
      if(props.preloaded) {
        formData.append('file',selectedFile);
      }
      console.log(formData);
      fetch(graphicsUrl, {
        method: 'POST',
        body: formData,
      })
      console.log("EXITING")
      exit(e);
    })();
   
    }

  const exit = (e:any) => {
    props.setEditMenu(false);
  }
 
  const [resX, setResX] = useState(1920);
  const [resY, setResY] = useState(1080);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(250);
  const [oType, setOType] = useState('PNG');
  const [name, setName] = useState('test');
  const [renderNow, setRenderNow] = useState("off");
  const [selectedFile, setSelectedFile] = useState(new File(["Dummy File Content"],"dummy.txt", { type:"text/plain" }));
  const db = props.db;
  const fs = props.fs;
  useEffect(() => {
    if(props.preloaded) {
      console.log(db.xres + " ERROR");
      setResX(db.xres);
      setResY(db.yres);
      setStartFrame(db.startFrame);
      setEndFrame(db.endFrame);
      setOType(db.otype);
      setName(db.title);
     // setRenderNow(db.renderNow);
      setSelectedFile(fs);      
    }
  }, []);
 
  const handleFileInput = (e:any) => {
    setSelectedFile(e.target.files[0]);
  }

  const handleResX = (e:any) => {
    setResX(e.target.value);
  };
  const handleResY = (e:any) => {
    setResY(e.target.value);
  };
  const handleStartFrame = (e:any) => {
    setStartFrame(e.target.value);
  };
  const handleEndFrame = (e:any) => {
    setEndFrame(e.target.value);
  };
  const handleOType = (e:any) => {
    setOType(e.target.value);
  };
  const handleName = (e:any) => {setName(e.target.value);};
  const handleRenderNow = (e:any) => {setRenderNow(e.target.value);};

  
  const cssTxt = 'border border-gray-300 px-4 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4';
  const lstTxt = 'border border-gray-300 px-2 py-1  w-16 mx-3 h-10\
   rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4';

  return(
    <form encType="multipart/form-data" method="POST" 
      onSubmit={handleSubmit} className='fixed inset-0 w-auto  h-auto mx-64 my-16 
      flex flex-col items-center justify-center bg-gray-200'>
        <button type="submit"
        className='w-5 h-5 bg-red-600 text-white rounded-full pb-1 hover:bg-red-300 transition'
        onClick={exit}/>
        <div className='font-bold mb-8 underline text-lg'> EDIT MENU </div>

        <h1> Rendering Job Name: </h1>
        <input type="text" name='title' className={cssTxt} value={name} onChange={handleName}/>

        <h1> Input File </h1>
        <p className='text-sm'>If a file is already there, resubmitting will replace the old file.</p>
        <input type="file" name="file"
         className={cssTxt} onChange={handleFileInput}/>

        <div className='flex flex-row items-center text-center justify-center align-center'>
              <div className='flex flex-col items-center justify-center'> 
                  <h1 className='mr-8'> Resolution</h1>
                  <div className='grid grid-cols-[5fr,1fr,5fr] mt-1 items-center content-center'>   
                    <input type="text" name="xres" className={lstTxt} value={resX} onChange={handleResX}/>
                    <div className=''> x </div>
                    <input type="text" name="yres" className={lstTxt} value={resY} onChange={handleResY}/>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center'> 
                  <h1 className='mr-8'> Frames </h1>
                  <div className='grid grid-cols-[5fr,1fr,5fr] mt-1 items-center content-center'>   
                    <input type="text" name="startframe" className={lstTxt} value={startFrame} onChange={handleStartFrame}/>
                    <div className='grid items-center align-center'> to </div>
                    <input type="text" name="endframe" className={lstTxt} value={endFrame} onChange={handleEndFrame}/>
                  </div>
                </div>
        </div>

        <h1> Output File Type</h1>
          <select name="otype" className="px-32 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md" 
          value={oType} onChange={handleOType}>
            <option>PNG</option>
            <option>JPG</option>
            <option>TIFF</option>
          </select>
        <div className='flex flex-row items-center text-center justify-center align-center mt-4'>
        <button type='submit' className='bg-blue-800 px-4 py-2 text-white rounded-2xl'> Submit </button>
        <input type="checkbox" name='rendernow' className="ml-8 form-checkbox" value={renderNow} onChange={handleRenderNow} />
        <h1 className='ml-2'> Render Immediately </h1>
        </div>

      </form>
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
  const [editMenu, setEditMenu] = useState(false);

  const [activeMenu, setActiveMenu] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [reload, setReload] = useState(false);

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
    return default_name+latestIndex;
  }
  const setEditMen = (data:any) => {
    setReload(false);
    setEditMenu(data);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every second!');
    fetch(graphicsUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        console.log(data[0])
        console.log(data[1])
        console.log(data[2])
        console.log(data[3])

        setRenEntPause(data[0]);
        setRenEntRunning(data[1]);
        setRenEntCompleted(data[2]);
        //setNameSpace(data[3]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }, refreshTime);
    return () => {
      clearInterval(interval);
    };
  },[]);
  
  const involkeEditorMenu = (data:any, file:any) => {
    setReload(true);
    setActiveMenu(data);
    setActiveFile(file);  
    setEditMenu(true);

    console.log(activeMenu);
  }

  return (
    <div>
      { (editMenu)? <EditMenuN setEditMenu={setEditMen} preloaded={reload} db={activeMenu} fs={activeFile} 
      setPreloaded={setReload}
      />: <div></div> }
          <div className='grid w-full grid-cols-2 justify-items-center'>
            
            <h1 className='p-2 col-span-2 text-lg font-bold my-3'> Rendering API </h1>
              <h1 className='w-auto px-20 py-4  mx-4 bg-gray-800 text-white'> 
              Upload Files, Choose Seetings, then Press Render </h1>
              <h1 className='w-auto px-20 py-4  mx-4 bg-gray-800 text-white'> 
              Contact cmink2040@gmail.com for support</h1>
            
          </div>

      <div className='grid grid-cols-3 mt-16 pt-8
      border-t-2 border-gray-400 w-full justify-items-center gap-4 px-4'>
        <div className='col-span-1 w-full px-2 justify-items-center 
        justify-content-center bg-gray-300'>
            <h1 className='grid justify-items-center text-base font-bold mb-2 underline '> Upload rendering jobs here: </h1>
           
            { (renEntPause.length > 0) ? renEntPause.map((item:any) => (
              <RenderingEntity involkeEditorMenu={involkeEditorMenu}
              key={item.name} file={item.file} startFrame={item.startFrame} 
              endFrame={item.endFrame} xRes={item.xRes} yRes={item.yRes} oType={item.oType}
              renderingProgress={item.renderingProgress} status={item.status} name={item.name} />
            )) : <div> No Jobs </div> }
            <div className='grid justify-items-center text-base font-bold mb-2 underline'>
            <button onClick={() => setEditMenu(true)} 
  className='justify-items-center items-center my-2 rounded-full w-16 h-16 text-white
  grid justify-items-center 
    hover:bg-gray-200 bg-gray-600'> + </button>
    </div>

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
  // PROPS: FETCH DATA FROM API
  //Variables
  const [file, setFile] = useState(props.file);
  const [name, setName] = useState(props.name);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(250);
  const [xRes, setXRes] = useState(1920);
  const [yRes, setYRes] = useState(1080);
  const [oType, setOType] = useState('PNG');

  const [renderStatus, setRendering] = useState("NOT_STARTED");
  const [renderingProgress, setRenderingProgress] = useState(0.0);

  //Functions


  const executeRender = () => {
    const data = {
      "title": name,
    };
    setRendering("IN_PROGRESS");
    fetch(interactionUrl, {
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
 const RetrieveRenders = () => {
    const onDown = () => {  
      (async () => {})();
      
    }

    return (
      <button onClick={onDown}> Download Data </button>
    );
  
 }
  //Components
  const RenderButton = () => {
    return(
      <button onClick={executeRender}
      className='bg-green-500 rounded-full m-4 h-6 w-6 text-white hover:bg-green-300'
      > |&gt; </button>
    );
  }
  
  const EditMenu = () => {
    const submitC = () => {
      const data = {
        'title': name,
        'xres': xRes,
        'yres': yRes,
        'startframe': startFrame,
        'endframe': endFrame,
        'otype': oType,
      }
      props.involkeEditorMenu(data, file);
    }
    return(
      <div>
        <button onClick={submitC} className='bg-blue-400 rounded-full m-4 h-6 w-6 '>  E   </button>
      </div>
    );
  }

  const ProgressBar = () => {

  

    return(
      <div>
        <progress value={renderingProgress} max="100" 
        className='relative w-full h-4 bg-gray-300 rounded'/>
        <p className='text-sm'> On frame: {startFrame-endFrame*renderingProgress+startFrame}</p>
      </div>
    );
  }
  const Delete = () => {
    const [deleteCount, setDeleteCount] = useState(0);
    const remove = () => {
      if(deleteCount < 3){
        setDeleteCount(deleteCount+1);
        return;}
      else {
        fetch(interactionUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            
            // Include any additional headers as required
          },
          body: JSON.stringify({
            "title": name,
          }),
        })
          .then(response => {
            if (response.ok) {
              // Handle successful response
              console.log('Post deleted successfully');
            } else {
              // Handle error response
              console.error('Error deleting post');
            }
          })
          .catch(error => {
            // Handle fetch error
            console.error('Fetch error:', error);
          });
        }
      }
      return(
        <button onClick={remove}
        className='h-6 w-6 bg-red-500 text-white rounded-full hover:bg-red-200'> X </button>
      );
      }
     
  return (
    <div className = 'bg-gray-200 text-center rounded-lg px-8 py-4'>
      {name}
      <div className='text-sm'>{file}</div>
      <br/>
      <div className="grid grid-cols-[1fr,4fr,1fr,1fr] items-center content-center justify-content-center">
        <EditMenu />
        <ProgressBar />
        <RenderButton />
        <Delete />
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
