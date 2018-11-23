const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');  //define homepage
const {addPicPage, addPic, deletePic, editPic, editPicPage} = require('./routes/pic.js'); //define other pages
const port = 3500;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'tigu.hk.tlu.ee',
    user: 'anneliserandmaa',
    password: '5cPQkKbO',
    database: 'anneliserandmaa'
});
// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
// configure middleware - software that acts as a bridge between an operating system or database and applications, especially on a network
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false })); //basically tells the system if either complex parsing (true) -can deal withnested objects- or simple algorithm (false)will be used
app.use(bodyParser.json()); // parse form data client, tells the system that you want json to be used
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.get('/', getHomePage);
app.get('/add', addPicPage);  
app.get('/edit/:id', editPicPage);
app.get('/delete/:id', deletePic);
app.post('/add', addPic);
app.post('/edit/:id', editPic);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});