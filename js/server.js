//todo mongo

let express = require('express');
let mongodb = require('mongodb');
let app = express();
let db;
let sanitizeHTML = require('sanitize-html');
app.use(express.static('js'));
let connectionString =
  'mongodb+srv://todoAppUser:mongo1@cluster0-wphw9.mongodb.net/TodoApp?retryWrites=true&w=majority';
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    db = client.db();
    app.listen(3000);
  }
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passwordProtected);

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm= "simple todo app"');
  console.log(req.headers.authorization);
  if (req.headers.authorization == 'Basic dG9kbzptb25nbw==') {
    next();
  } else {
    res.status(401).send('Authentication Required');
  }
}
app.get('/', function (req, res) {
  db.collection('items')
    .find()
    .toArray(function (err, items) {
      res.send(
        `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-5 text-center py-1">Create, Read, Update, Delete</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method = "POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add To List</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
     
    </ul>
    
  </div>
  <script>
  const items = ${JSON.stringify(items)}
  console.log(items)
  </script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="browser.js">
</script>
</body>

</html>
      
      `
      );
    });
});

app.post('/create-item', (req, res) => {
  const safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  db.collection('items').insertOne({ text: safeText }, (err, info) => {
    res.json(info.ops[0]);
  });
});
app.post('/update-item', (req, res) => {
  const safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  db.collection('items').findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: safeText } },
    () => {
      res.send('Success');
    }
  );
});

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.text } },
    () => {
      res.send('Success');
    }
  );
});
