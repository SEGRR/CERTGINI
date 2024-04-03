import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


export default function BasicSpeedDial({openModal, copyLink , setOpenModal , saveTemplate}) {
  const actions = [
    { icon: <ArrowOutwardIcon/>, name: 'Export' , id:1 , onClick: setOpenModal },
    { icon: <SaveIcon />, name: 'Save' ,id:2  , onClick: saveTemplate},
    { icon: <PrintIcon />, name: 'Print', id:3 },
    { icon: <ShareIcon />, name: 'Share', id:4 , onClick : setOpenModal},
  ];
  
  return (
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=>{action.onClick(action.id)}}
          />
        ))}
      </SpeedDial>
  );
}
