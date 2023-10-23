const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors=require("cors")
// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const admin=require('./routes/admin');
// const courses = require('./routes/courses');
// const auth = require('./routes/auth');
// const users = require('./routes/users');
// const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
// app.use(cookieParser());


// File uploading
// app.use(fileupload());

// Sanitize data
// app.use(mongoSanitize());

// Set security headers
// app.use(helmet());

// Prevent XSS attacks
// app.use(xss());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100
// });
// app.use(limiter);

// Prevent http param pollution
// app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/auth', auth);
app.use('/admin', admin);
// app.use('/api/v1/courses', courses);
// app.use('/api/v1/auth', auth);
// app.use('/api/v1/users', users);
// app.use('/api/v1/reviews', reviews);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
  // console.log(`Error: ${err.message}`.red);
//   Close server & exit process
  // server.close(() => process.exit(1));
// });