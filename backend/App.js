require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
require("./db/conn");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/router");
const fileUploadRoutes = require('./routes/fileUpload');
// const mediaRouter = require("./routes/mediaUpload");
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(fileUploadRoutes);
// app.use(mediaRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/files', express.static(path.join(__dirname, 'files')));
app.use('/audios', express.static(path.join(__dirname, 'audios')));
// app.use('/transcriptions', express.static(path.join(__dirname, 'transcriptions')));



app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
