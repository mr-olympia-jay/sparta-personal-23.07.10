// app.js

const express = require('express');
const app = express();
const port = 3000;

// cookie parser
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/usersRoute.js');
const postsRouter = require('./routes/postsRoute.js');
const commentsRouter = require('./routes/commentsRoute.js');
const likesRouter = require('./routes/likesRoute.js');

// Middleware ==================================================
app.use(express.json()); // req.body parser
app.use(cookieParser()); // cookie parser

// localhost:3000/api/
app.use('/api', [usersRouter]);
app.use('/api', [postsRouter]);
app.use('/api', [commentsRouter]);
app.use('/api', [likesRouter]);
// Middleware ==================================================

app.listen(port, () => {
  console.log(port, '=> server open!');
});
