import React, { useState , useRef } from 'react'
import './homepage.css'
import InputFileUpload from '../components/InputFileUpload'
import TimeLine from '../components/TimeLine'
import axios from 'axios'
import Canvas from '../Canvas'
import EditIcon from '@mui/icons-material/Edit';
 import {useNavigate} from 'react-router-dom';
import { Button } from '@mui/material'
export default function HomePage() {
  
  const [file , setFile] = useState(null);
  const canvasRef = useRef(null);

  const navigate = useNavigate();
  // const history = useHistory();
 
 async function handleFileUpload(e){
      const cert = e.target.files[0];
      console.log(cert)
    // const formdata = new FormData
    // formdata.append('file' , cert);

    // const res = await  axios.post('http://localhost:8181/upload' , formdata , {responseType:'blob'});
      //  console.log(typeof res.data);
       setFile(cert);

       
   }

 async function handleEdit(){
    if(file == null) return 

     const formdata = new FormData
    formdata.append('file' , file);
    const res = await  axios.post('http://localhost:8181/upload' , formdata);
    console.log(res.data);
    let {id} = res.data;

   navigate(`/temp/${id}`);
    
    // history.push(`/temp/${res.id}`)
 }

   function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

  return (
    <>
    <nav>
      <h1>CERT GINI</h1>
    </nav>
    <div className="container roboto-thin">
      <h1>Welcome to GertGINI</h1>
      <h3>Generate and send certificate in bulk</h3>
       <h4>Get Started!</h4>
       <InputFileUpload accept='.pdf' handleFileUpload={handleFileUpload}/>
       <p>Upload your certficate PDF file</p>
       <div className="dnd">

       </div>
    </div>
    <div className="container">
      <h3>How It works?</h3>
      <div className="steps">
        <TimeLine/>
      </div>
    </div>

      { file != null && 
    <div className="container">
      <Canvas canvasRef={canvasRef} file={file} />
      <p> {file.name} ({formatBytes(file.size)})</p>
      <Button
      size='large'
      onClick={handleEdit}
      style={{marginTop:'15px'}}
      variant="contained"
      startIcon={<EditIcon />}
    >
      Start Editing
    </Button>
    </div>
      }
    </>
  )
}
