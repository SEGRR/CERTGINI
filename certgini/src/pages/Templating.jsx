import React, { useEffect, useState } from 'react'
import AppDrawer from '../components/AppDrawer'
import {useParams } from 'react-router-dom'
import { getTemplateFile } from '../assets/api';
export default function Templating() {


     const {id}  =  useParams();
     const [file , setFile] = useState(null);
     useEffect(() => {
      
      (async()=>{

       let res = await getTemplateFile(id);
       if(res.status == 200)
            setFile(res.data);
        else{
          alert("Cannot Retrive File");
        }
      })();

     }, [])
     
  return (
     <>
      <AppDrawer file={file} setFile={setFile} />
     </>
  )
}
