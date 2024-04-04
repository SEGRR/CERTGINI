import React, { useEffect, useRef, useState } from 'react'
import { Document, pdfjs } from 'react-pdf';

import './canvas.css'
export default function Canvas({canvasRef, remove , setRemove, file , handlePosition , positionOf, param , getParam}) {

  
  const [isClicked , setClick] = useState(false);
  // function initCanvas(){
  //     const canvas = document.getElementById('canvas');
  //     img = new Image;
  //     img.src = './assests/react.svg';
  //     canvas.height = window.innerHeight;
  //     canvas.width = window.innerWidth;
  //     const c = canvas.getContext('2d');
  //     img.onload = ()=> c.drawImage(img ,  0 ,0)
  //     console.log(c);
  // }

   const handleClick = (event)=>{
    if(positionOf == null) return;
    let rect = canvasRef.current.getBoundingClientRect();
    let canvas = canvasRef.current;
    let { offsetX, offsetY } = event.nativeEvent;
          let x = event.clientX - rect.left;
          let y = event.clientY - rect.top;
    const pdfX = x * (canvas.width / rect.width);
    const pdfY = canvas.height - (y * (canvas.height / rect.height));
    handlePosition(pdfX , pdfY , offsetX ,offsetY);
     let param = getParam();
     // cuz updating state is not instant thays why I make a copy to draw it on screen.
    param = {...param , x , y , offsetX , offsetY};
     drawOnCanvas(param);
     
  };


  function drawOnCanvas(param){
   // let param  = getParam();
    let {fontSize, name, fontStyle  , fontFamily,offsetX , offsetY} = param;
    console.log(param)
    let context = canvasRef.current.getContext('2d');
    let fontstyle = fontStyle.join(' ');
    context.font = `${fontstyle} ${fontSize}px ${fontFamily}`;
    context.fillStyle = 'black';
    context.textAlign = 'start';
    context.fillText(name, offsetX ,offsetY);
    // ctx.strokeRect(x, y, 100, fontSize);
  }

  useEffect(() => {
    const renderPDF = async () => {

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

      // const pdf = await fetch("http://localhost:8080/file").then((res) => res.blob());
      if (file == null) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set font properties
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        
        // Draw text
        ctx.fillText('LOADING....', 50, 50);
      }
      
        const url = URL.createObjectURL(file);
        const renderTask = pdfjsLib.getDocument(url).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext);
            canvas.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
          });
        });
      };
      
      renderPDF();
   
    
  }, [file]);

  

  return (
    <canvas ref={canvasRef} onClick={handleClick} id='canvas'></canvas>
  )
}
