import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { InputAdornment, Tooltip } from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};



export default function CopyLink({open , setOpen}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 

  return (
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Share Template to others
          </Typography>
          <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
          <OutlinedInput
            
            value={window.location.href}
            readOnly
            fullWidth
            type='text'
            endAdornment={
              <InputAdornment position="end">
                <Tooltip title="copy link">

                <IconButton
                  aria-label="copy link"
                  onClick={()=> navigator.clipboard.writeText(window.location.href)}
                  edge="end"
                  >
                    <ContentCopyIcon/>
                </IconButton>
                    </Tooltip>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        </Box>
      </Modal>
  );
}