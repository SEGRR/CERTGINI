import React, { useEffect, useState } from 'react'
import AppDrawer from '../components/AppDrawer'
import {useParams } from 'react-router-dom'
import Canvas from '../Canvas'
import axios from 'axios';
export default function Templating() {


     const {id}  =  useParams();
     const [file , setFile] = useState(null);
     useEffect(() => {
      
      (async()=>{

        const res = await axios.get(`http://localhost:8181/template/${id}/file` , {responseType:'blob'});
          console.log(res.data);
          setFile(res.data);
      })();

     }, [])
     
  return (
     <>
      <AppDrawer file={file} setFile={setFile} />
     </>
  )
}
