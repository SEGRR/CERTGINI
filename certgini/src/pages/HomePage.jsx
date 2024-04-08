import React, { useState , useRef } from 'react'
import './homepage.css'
import InputFileUpload from '../components/InputFileUpload'
import TimeLine from '../components/TimeLine'
import demofile from '../assets/demo_file.pdf'
import Canvas from '../Canvas'
import EditIcon from '@mui/icons-material/Edit';
 import {useNavigate} from 'react-router-dom';
import { Box, Button, colors } from '@mui/material'
import { uploadFile } from '../assets/api'
export default function HomePage() {
  console.log(demofile)
  const [file , setFile] = useState(null);
  const canvasRef = useRef(null);
  const [fileError , setFileError] = useState('');
  const navigate = useNavigate();
  // const history = useHistory();
 
 async function handleFileUpload(e){
      const cert = e.target.files[0];
      if(cert.type.split('/')[1] != 'pdf'){
          setFileError('Please upload a .pdf file');
          return;
      }
      else if(cert.size > 1000000){
        setFileError('Please upload file size under 10MB');
        return;
      }
       setFile(cert);
       setFileError('');

       
   }

 async function handleEdit(){
    if(file == null) return 

    let res = await uploadFile(file);
    if(res.status == 200){

      let {id} = res.data;
      navigate(`/temp/${id}`);
    }else{
        alert('Error uploading file, Try again later');
    }

    
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

async function  takeDemo(){
  try {
    const response = await fetch(demofile);
    if (!response.ok) {
        throw new Error('Failed to fetch file');
    }
    const blob = await response.blob();
    setFile(blob);
    
    setFileError('');
} catch (error) {
    console.error('Error fetching file:', error);
    setFileError(error.message);
}
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
       <Box>
       <InputFileUpload accept='.pdf' handleFileUpload={handleFileUpload}/>
       <Button onClick={takeDemo} style={{marginLeft:'10px'}} variant="contained" size='large'>Take Demo </Button>
       </Box>
       <p style={{color:"red"}}>{fileError}</p>
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
