import {react , useState, useEffect , Fragment} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ProgressBar from './ProgressBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { makeExportRequest } from '../assets/api';
import Spinner from '../components/Spinner'
export default function DownloadingModal({open , setOpen}) {
    const [progress, setProgress] = useState(0);
    const {id} = useParams();
    const handleOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };

      const style = {
        display:'flex',
        flexDirection:'column',
        gap:'2px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };


      const handleDownloadFile = async () => {
       
      };

      // useEffect(() => {
      //   const eventSource = new EventSource('http://localhost:8181/export/sse');
    
      //   eventSource.onmessage = (event) => {
      //     const data = JSON.parse(event.data);
      //     setProgress(data.progress);
      //     console.log(data.progress);
      //     handleDownloadFile();
      //   };
    
      //   eventSource.onend = () => {
      //     console.log('PDF generation complete');
      //     eventSource.close();

      //   };
      //   eventSource.onerror = ()=> {
      //     console.log('server closed connection');
      //     eventSource.close();
      //   }
      //   return () => {
      //     eventSource.close(); // Close the EventSource connection when component unmounts
      //   };
      // },[]);
    
      return (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...style, width: 'fit-content'}}>
              <h2 id="child-modal-title">Generating Certificates</h2>
              <p>This Won't take long</p>
               <Spinner />
              <Button onClick={handleClose}>Cancel</Button>
            </Box>
          </Modal>
        
      );
    }