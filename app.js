const express = require("express");
const mongoose = require('mongoose');
const users = require("./routes/api/users");
const palettes = require("./routes/api/palettes");
// const bodyParser = require('body-parser');

const app = express();

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


//configure port 
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//import routes 
app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/users", users);   
app.use("/api/palettes", palettes);

//run server
app.listen(port, () => console.log(`Server is running on port ${port}`));