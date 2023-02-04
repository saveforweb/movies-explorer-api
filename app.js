const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const limiter = require('./utils/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errors');

const router = require('./routes/index');

const { PORT = 3000, NODE_ENV, DATA_BASE_URL } = process.env;
const app = express();

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

const dataBaseUrl = NODE_ENV === 'production' ? DATA_BASE_URL : 'mongodb://localhost:27017/bitfilmsdb';

mongoose.connect(dataBaseUrl, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to MongoDB');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
