const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gsandha:gagangagan@cluster0.zhilydl.mongodb.net/stockmarket?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

module.exports={
  db
}