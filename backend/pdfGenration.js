const fs = require('fs');
const csv = require('csv-parser');
const { PDFDocument, rgb , StandardFonts } = require('pdf-lib');
const archiver = require('archiver');


async function pdfGenrator({ params, certificateFile }, dataFile) {
  return new Promise((resolve, reject) => {
    const results = [];
    let outputFile = `./tmp/${certificateFile.fileName}_Certificates.zip`;

    fs.createReadStream(dataFile)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log(results);

        let certList = [];
        try {
          for (let i = 0; i < results.length; i++) {
            let p = results[i];
            let cert = await editPDF(params, certificateFile.path, p, i);
            certList.push(cert);
          }

          await zipPDFs(outputFile, certList);
          doCleanup(certList);

          // Resolve the promise with the output file path
          resolve(outputFile);
        } catch (error) {
          // Reject the promise if an error occurs
          reject(error);
        }
      })
      .on('error', (error) => {
        // Reject the promise if an error occurs during stream processing
        reject(error);
      });
  });
}

async function doCleanup(certList ){
    for (const file of certList) {
        fs.unlinkSync(file);
        console.log(`Deleted file: ${file}`);
      }
}

async function editPDF(params, certificateFile, data , i) {
    try {
      const existingPdfBytes = fs.readFileSync(certificateFile);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
     let fileName = Date.now();
      // Add a new page
      const page = pdfDoc.getPage(0);
  
      // Set the text paramseters
     params.map(async ({x,y, name, fontSize, fontFamily})=>{
        const text = data[name];
        fileName = `${fileName}_${text}`;
        // const x = 50; // X coordinate
       //  const y = 500; // Y coordinate
       //  const fontSize = 24;
       const font = await pdfDoc.embedFont(StandardFonts[fontFamily]);
         // Draw the text on the page
         page.drawText(text, {
           x,
           y,
           size: fontSize,
           font: font,
           color: rgb(0, 0, 0), // black color
         });
     });

  
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      fileName = `tmp/${fileName}.pdf`;
      fs.writeFileSync(fileName, modifiedPdfBytes);
      console.log('PDF edited successfully!');
      return fileName;
       
    } catch (error) {
      console.error('Error editing PDF:', error);
    }
  }


  async function zipPDFs(outputFileName, files) {
    const archive = archiver('zip', { zlib: { level: 9 } });
  
    const output = fs.createWriteStream(outputFileName);
    archive.pipe(output);
  
    for (const file of files) {
      archive.file(file, { name: file.split('/').pop() });
    }
  
    await archive.finalize();
    console.log('PDFs zipped successfully!');
  }
//   let certfile = {fileName:"TechFest" ,path:"uploads/1711626197391.pdf"}

//   let params =
//   [
//     {
//       name: 'name',
//       x: 388.06168469338166,
//       y: 270.07377196296153,
//       offsetX: 389,
//       offsetY: 325,
//       fontFamily: 'Courier',
//       fontSize: 15,
//       fontStyle: [ 'bold' ]
//     },
//     {
//       name: 'part',
//       x: 399.0407964877478,
//       y: 244.1435020159197,
//       offsetX: 399,
//       offsetY: 352,
//       fontFamily: 'Courier',
//       fontSize: 15,
//       fontStyle: [ 'bold' ]
//     }
//   ];

// let dataFile = './uploads/1711910969038.csv'

// pdfGenrator({params , certificateFile:certfile } , dataFile);


module.exports = {pdfGenrator}