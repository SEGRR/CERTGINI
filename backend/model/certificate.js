const mongoose = require("mongoose");

// Define a schema
const certSchema = new mongoose.Schema({
  certificateFile: {
    type: {
      filename: String,
      contentType: String,
      path:String,
    },
    default: null,
  },
  params: {
    type: [
      {
        name:String,
        x: Number,
        y: Number,
        offsetX:Number,
        offsetY:Number,
        fontFamily: String,
        fontSize: Number,
        fontStyle: [],
      },
    ],
    default: [],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Template = mongoose.model("Template", certSchema);

module.exports = Template;
