require('newrelic');
const dotenv = require('dotenv');
dotenv.config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');


/**
 * IMPORTING ROUTES
 */
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const signupRouter = require('./routes/signup');
const userRouter = require('./routes/user');

var app = express();

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// // ALLOW CORS
// var allowedOrigins = ['http://localhost:3000',
//   'https://www.evaluatz.com',
//   'https://evaluatz-page.herokuapp.com'];
// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin 
//     // (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not ' +
//         'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));





app.use(cors());

/**
 * Add routes
 */
app.use('/', indexRouter);
// app.use('/auth', authRouter);
app.use('/signup', signupRouter);
app.use('/user', userRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
  // res.render('error');
});

module.exports = app;
