const express=require('express');
const app=express();
const dotenv = require('dotenv');
//import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//connect to Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017',()=> console.log('Conected to Db'));

//for sending post request
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000,()=> console.log(`Server is listen to port 3000.`));