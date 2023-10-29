const express = require('express');
const bodyParser = require('body-parser')
const dotenv= require('dotenv')
var conn = require('./config/db')
dotenv.config({path:'./config/config.env'})
const errorHandler = require('./error')


const user=require('./routes/user')
const community=require('./routes/community')
const role=require('./routes/role')
const member=require('./routes/member')



const port = process.env.PORT || 3000 

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

conn();



app.use('/v1/auth', user);
app.use('/v1/community', community);
app.use('/v1/role', role);
app.use('/v1/member', member);






app.use(errorHandler)

app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});



