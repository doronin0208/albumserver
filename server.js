const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
require('./db');

// Import APIs
const users = require('./routes/api/users');
const contacts = require('./routes/api/contacts');
const albums = require('./routes/api/albums');
const likes = require('./routes/api/likes');
const photos = require('./routes/api/photos');
const visits = require('./routes/api/visits');
const comments = require('./routes/api/comments');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://192.168.114.15:8100',
    'http://192.168.114.15:8200',
    'http://192.168.114.15:8101',
  ];
  
  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }
  
  // Enable preflight requests for all routes
app.options('*', cors(corsOptions));

// app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
    res.header("Access-Control-Allow-Credentials", false);
    res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
    next(); // Important
})

// Use APIs (combination)
app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});
app.use('/api/users', cors(corsOptions), users);
app.use('/api/contacts', cors(corsOptions), contacts);
app.use('/api/albums', cors(corsOptions), albums);
app.use('/api/likes', cors(corsOptions), likes);
app.use('/api/photos', cors(corsOptions), photos);
app.use('/api/visits', cors(corsOptions), visits);
app.use('/api/comments', cors(corsOptions), comments);

app.get('/times', (req, res) => res.send(showTimes()));

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});