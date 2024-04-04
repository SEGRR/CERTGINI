import { react, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputFileUpload from './InputFileUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import DownloadingModal from './DownloadingModal';
import { makeExportRequest } from '../assets/api';
import { useParams } from 'react-router-dom';
export default function ExportModal({ param, open, handleExport, setOpen }) {
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const {id} = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const [exportMethod, setexportMethod] = useState('');
  
  const [file, setFile] = useState(null);

  async function handleFileUpload(e) {
    const cert = e.target.files[0];
    setFile(cert);


  }

  async function handleExport(file, exportMethod) {
    let data = new FormData;
    data.append('nameList', file);
    data.append('export', exportMethod);
    data.append('param', JSON.stringify(param));
    setOpenDownloadModal(true);
    let response = await makeExportRequest(data ,id);
      console.log(typeof response.data)
    try {
      const url = window.URL.createObjectURL(response.data);
      console.log(response.headers);

    // const contentDisposition = response.headers['Content-Disposition'];
    //  const filename = contentDisposition.split(';')[1].split('=')[1].trim().replace(/"/g, '');
       const filename = `${Date.now()}_Certificates`;
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;

      // Set the download attribute and filename
      link.setAttribute('download',filename ); // Change 'filename.zip' to the desired filename

      // Append the link to the document body and click it programmatically
      document.body.appendChild(link);
      link.click();

      // Clean up by revoking the blob URL
      window.URL.revokeObjectURL(url);
       setOpenDownloadModal(false);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
    
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>Export Certificates</DialogTitle>
      <DialogContent>
        <div>


          <h2>Upload Name List </h2>
          <p>Be sure the column namesin csv file matches with parameter names,else it won't work </p>
          <InputFileUpload accept=".csv" handleFileUpload={handleFileUpload} />

          {file != null && <p> {file.name} ({formatBytes(file.size)})</p>}
          <br />
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-select-small-label">Export Method</InputLabel>
            <Select
              style={{ marginTop: '10px' }}
              labelId="demo-select-small-label"
              value={exportMethod}
              id="demo-select-small"
              label="Export Method"
              onChange={(event) => { setexportMethod(event.target.value); }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'zip'}>Zip File</MenuItem>
              <MenuItem value={'email'}>Send Via Email</MenuItem>

            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleExport(file, exportMethod)} >Submit</Button>

      </DialogActions>
      {openDownloadModal &&
        <DownloadingModal open={openDownloadModal} setOpen={setOpenDownloadModal} />
      }
    </Dialog>
  )
}
