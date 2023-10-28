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

// const port = 3000;


app.use('/api/v1/auth', user);
app.use('/api/v1/community', community);
app.use('/api/v1/role', role);
app.use('/api/v1/member', member);



app.get('/', (req, res) => {
    // Your code to fetch users from a database or any other source
    // Send the response as JSON
    res.json({add:"users"});
  });


app.use(errorHandler)

app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});



