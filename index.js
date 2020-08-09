console.clear();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

// apply middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(require('compression')());
// connect database
mongoose
  .connect(
    'mongodb+srv://philzace:philzace1@cluster0-ojdiw.mongodb.net/Ethertech?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log('Database connected'))
  .catch((e) => console.error(e));

// app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ meg: 'I am working well' });
});
// apply routes
app.use('/api/customer', require('./routes/customer'));
app.use('/api/marketer', require('./routes/marketer'));

// error handling
app.use((req, res, next) => {
  const error = new Error('page not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  const info = {
    success: false,
    msg: error.message,
  };
  res.json(info);
  console.error(info);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (e) => {
  console.log(`Server started on ${PORT} 🔥🔥🔥`);
});
