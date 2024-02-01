const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv= require('dotenv').config();


const app = express();
const PORT =  process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// // Routes
const authRoute = require("./routes/authRoutes")
const taskRoute = require("./routes/taskRoutes")

// Connect to MongoDB
mongoose.connect("mongodb+srv://mahikagarg23:TpTyPJiuKu23h0KJ@cluster0.qtsb9h6.mongodb.net/?retryWrites=true&w=majority")
.then(()=> console.log("Database connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

//add port and connect to server
app.listen(PORT,() => console.log("server connected"));