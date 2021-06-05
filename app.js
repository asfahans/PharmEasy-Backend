const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

// Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database Connection is Ready!!');
  })
  .catch((err) => {
    console.log(err);
  });

// Development Server
// app.listen(3000, () => {
//   console.log('Server is running http://localhost:3000');
// });

// Production Server
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log('Server is running on' + port);
});
