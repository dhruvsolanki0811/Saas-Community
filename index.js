const express = require('express');
const bodyParser = require('body-parser')
const dotenv= require('dotenv')
var conn = require('./config/db')
dotenv.config({path:'./config/config.env'})
const errorHandler = require('./error')


const user=require('./routes/user')



const port = process.env.PORT || 3000 

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

conn();

// const port = 3000;


app.use('/api/v1/auth', user);



app.get('/', (req, res) => {
    // Your code to fetch users from a database or any other source
    // Send the response as JSON
    res.json({add:"users"});
  });


app.use(errorHandler)

app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});



