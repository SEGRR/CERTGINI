import express from 'express'
import cors from 'cors'
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
import pdfGenrator from './pdfGenration';
import { dbConnect } from './config/databaseConn';


const PORT = process.env.PORT || 8000;
const app = express();
const Template = require("./model/certificate");



// Connect to db
dbConnect();

app.use(cors(
    {
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const localStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with current timestamp + original extension
  },
});

// const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({ storage: localStore });

app.get('/' , (req ,res)=>{
    res.send('API working fine');
})

app.get("/template/:id/file", async (req, res) => {
  let { id } = req.params;
  try {
    let template = await Template.findById(id);
    if (!template) {
      res.status(404).send("File not found");
      return;
    }
    let file = template.certificateFile.path;
    res.sendFile(file);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get("/template/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let template = await Template.findById(id);
    if (!template) {
      res.status(404).send("File not found");
    }

    res.json(template);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  let { filename, mimetype } = req.file;

  try {
    const template = new Template({
      certificateFile: {
        filename,
        contentType: mimetype,
        path: path.join(__dirname, "uploads", filename),
      },
    });
    let temp = await template.save();
    res.json({ id: temp._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/export", async (req, res) => {
  try {
    let params = JSON.parse(req.body.param);
    let template = await updateTemplate(params);
    res.json("done");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/export/:id", upload.single("nameList"), async (req, res) => {
  let { id } = req.params;

  let template = await Template.findById(id);
  let nameListFilePath = req.file.path;
  try {
    let outputFile = await pdfGenrator(template, nameListFilePath);
    console.log(outputFile);
    // Set appropriate headers for streaming response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${outputFile.split("/").pop()}"`
    );
    res.setHeader("filename", path.basename(outputFile));
    const fileStream = fs
      .createReadStream(outputFile)
      .on("error", (err) => console.log(err));
    // Stream the file data to the response
    fileStream.pipe(res).on("end", () => console.log("sent file"));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/template/:id/save", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(req.body, id);
    await updateTemplate(req.body, id);
    res.json({ done: "Progress Saved" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

async function updateTemplate(data, id) {
  let params = data;
  const doc = await Template.findByIdAndUpdate(
    id,
    { params: params, updatedOn: Date.now() },
    { new: true }
  );
  console.log("updated template", doc.params);
  return doc;
}

app.listen(PORT,()=>{
  console.log( `app listining on http://localhost:${PORT}`);
  console.log(`Server Stats on http://localhost:${PORT}/status`);
});


module.exports = app;
