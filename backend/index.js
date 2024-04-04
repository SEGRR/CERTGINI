const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const { pdfGenrator } = require("./pdfGenration");
const {put } = require('@vercel/blob');
// const session = require('express-session');
const mongoose = require("mongoose");

const app = express();
const Template = require("./model/certificate");
// const BLOB_READ_WRITE_TOKEN="vercel_blob_rw_mfsBIYAtX5MHdzqJ_vdw813UqZ6zT26joMx8WhIOwOVYfpO"
app.use('/upload', express.static(path.join(process.cwd(), 'upload')));
app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));

const uri =
  "mongodb+srv://segrr:segrr2003@cluster0.9srbe2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

app.use(cors(
    {

        origin:["https://certgini.vercel.app"],
        methods: ["GET" , "POST"],
        credentials:true
    }

));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Initialize express-session middleware

// let mongoStore = new MongoStore({ mongooseConnection: mongoose.connection });
// app.use(cookieParser());
// app.use(session({
//     secret: 'yoyo',
//     resave: false,
//     saveUninitialized: false,
//     // store: MongoStore.create({ mongoUrl: uri }) , // Store sessions in MongoDB
//     store: new MemoryStore({
//         checkPeriod: 86400000 // prune expired entries every 24h
//       }),
//     cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session expiry time (in milliseconds)
//   }));

function arrayBufferToBlob(arrayBuffer, contentType) {
  const buffer = Buffer.from(arrayBuffer);
  return new Blob([buffer], { type: contentType });
}

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

app.listen(8181);


module.exports = app;
