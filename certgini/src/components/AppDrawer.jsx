import {React , useEffect, useState, useRef} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'
import Canvas from '../Canvas'
import { Button, CircularProgress } from '@mui/material';
import Paarameter from './Paarameter';
import AddIcon from '@mui/icons-material/Add';
import ExportModal from './ExportModal';
import { getTemplate, updateTemplate } from '../assets/api';
import { useParams } from 'react-router-dom';
import BasicSpeedDial from '../components/BasicSpeedDial'
import SimpleSnackbar from './SimpleSnackbar';
import CopyLink from './CopyLink';


const drawerWidth = 300;

export default function PermanentDrawerLeft({ file , setFile }) {
  const {id}  =  useParams();
  const [openModal , setOpenModal] = useState(null);
  const [TemplateName , setTemplateName] = useState('File Name');
  const [openSnackbar , setOpenSnackbar] = useState(false);
  const [snackbarMsg , setSnackbarMsg] = useState('');
  const canvasRef = useRef(null);


  const [param , setParam] = useState([{
    name:'',
    x: '',
    y: '',
    offsetX:'',
    offsetY:'',
    fontFamily: 'TimesRoman',
    fontSize: 12,
    fontStyle : ['bold']
}]);

useEffect(()=>{
  ( async ()=>{

      let res = await getTemplate(id);
      console.log('param' ,res.data);
      if(res.status === 200 ){
        if(res.data.params.length > 0)
          setParam(res.data.params);
        setTemplateName(res.data.certificateFile.filename);
      }
      else{
         alert(res.data.msg);
      }
  } )();
},[]);



const [positionOf , setPositionOf] = useState(null);

function drawOnCanvas(param){
   let {fontSize, name, fontStyle  , fontFamily,offsetX , offsetY} = param;
   console.log(param)
   let context = canvasRef.current.getContext('2d');
   let fontstyle = fontStyle.join(' ');
   context.font = `${fontstyle} ${fontSize}px ${fontFamily}`;
   context.fillStyle = 'black';
   context.textAlign = 'start';
   context.fillText(name, offsetX ,offsetY);
 }

async function saveTemplate(index){
    let res = await updateTemplate(param , id);
    if(res.status == 200)
    {
      setSnackbarMsg('Progress Saved');
      setOpenSnackbar(true);

    }  
    else
      {
        setSnackbarMsg('Error Occured while Saving');
        setOpenSnackbar(true);
      }
    
}

function getParam(){
  return param[positionOf];
}
const [remove , setRemove] = useState(null);


function handleName(e , index){
   let value = e.target.value;
   console.log(index)
    setParam((p)=>{
      return  p.map((a , i)=> {
           if(i == index){
            return {...a , name:value};
           }
           return a;
        })
         
    });
    console.log(param)
}
function handleFontFamily(e ,index){
  let value = e.target.value;
  setParam((p)=>{
    return p.map((a , i)=> {
         if(i == index){
          return {...a , fontFamily:value};
         }
         return a;
      })
  });
}
function handleFontSize(e ,index){
  let value = e.target.value;
  setParam((p)=>{
    return p.map((a , i)=> {
         if(i == index){
          return {...a , fontSize:value};
         }
         return a;
      })
  });
}
function handleFontStyle(format ,index){
  setParam((p)=>{
    return p.map((a , i)=> {
         if(i == index){
          return {...a , fontStyle:format};
         }
         return a;
      })
  });

}

  // useEffect(()=>{
  //   console.log('ran hook')
  //   if(positionOf != null)
  //  { writeText(param[positionOf]);
  //   setPositionOf(null);
  //  }
  // },[param]);

 function handlePosition(x,y , offsetX , offsetY){
   if(positionOf == null) return
   console.log(x ,y)
   console.log(positionOf);
   setParam((p)=>{
   return p.map((a , i)=> {
       if(i == positionOf){
        return {...a , x:x, y:y, offsetX:offsetX , offsetY:offsetY};
       }
       return a;
    });

  });

  setPositionOf(null);
}

function clearText({offsetX , offsetY , fontSize , name}){
  let context = canvasRef.current.getContext('2d');
    context.clearRect(offsetX , offsetY - fontSize + 3 , name.length * fontSize , fontSize + 3)
   

}

function removePosition(index){

  clearText(param[index]);

  setParam((p)=>{
  return p.map((a , i)=> {
      if(i == index){
       return {...a , x:'',y:''};
      }
      return a;
   });

 });
}

function handleOffsetPosition(x ,y){
  if(positionOf == null) return
  console.log(x ,y)
  console.log(positionOf);
  setParam((p)=>{
  return p.map((a , i)=> {
      if(i == positionOf){
       return {...a , offsetX:x,offsetY:y};
      }
      return a;
   });

 });
}

function addNewParam(){
  
   setParam((p)=>[...p , {
    name:'',
    x: '',
    y: '',
    offsetX:'',
    offsetY:'',
    fontFamily: 'TimesRoman',
    fontSize: 12,
    fontStyle : ['bold']
}]);
  
}

function handlePositioning(index){
   setPositionOf(positionOf == index ? null : index)
}


  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {TemplateName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        >
        <Toolbar />
        <Divider/>
        <>
        {
          param.map((p,index)=>
          <Paarameter  key={index} removePosition={removePosition} index={index} param={p} positionOf={positionOf} handlePositioning={handlePositioning} handleName={handleName} handleFontFamily={handleFontFamily} handleFontSize={handleFontSize} handleFontStyle={handleFontStyle}  />
          
          
          )
        }
        </>
        <Button onClick={addNewParam} style={{marginTop:"10px" , marginBottom:"10px"}} variant='contained'>
          <AddIcon/>
          Add New Parameter
        </Button>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
        <Toolbar />
       {file != null ? <Canvas drawParams={()=> param.map(drawOnCanvas)} canvasRef={canvasRef} remove={remove} setRemove={setRemove} file={file} getParam={getParam} positionOf={positionOf} handlePosition={handlePosition} /> :  <center><CircularProgress/></center> }
      </Box>
    </Box>
     <BasicSpeedDial openModal={openModal} setOpenModal={setOpenModal} saveTemplate={saveTemplate} />
    <ExportModal param={param}  open={openModal == 1} setOpen={setOpenModal} />
    <CopyLink open={openModal == 4} setOpen={setOpenModal} / >
    <SimpleSnackbar open={openSnackbar} setOpen={setOpenSnackbar} msg={snackbarMsg}/>
        </>
  );
}
