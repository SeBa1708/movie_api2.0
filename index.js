// Create server
const express = require('express'),
morgan = require('morgan');

const app = express();

// Adding Cross-Origin Resource Sharing (CORS) & Server-Side Validation

const cors = require('cors');
app.use(cors());

const { check, validationResult } = require('express-validator');

// Integrating mongoose with the Rest API 
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// his allows Mongoose to connect to that database so it can perform CRUD operations
mongoose.connect('mongodb://localhost:27017/MyFlixDatabase', {useNewUrlParser: true, useUnifiedTopology: true});

const bodyParser = require('body-parser');

//Middleware

app.use(bodyParser.json());

// It´s import to place it after the bodyParser middleware 
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.err(err.stack);
  res.status(500).send('Error!');
});


//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to MoviesInfo!')
});

app.get('/movies', passport.authenticate('jwt', { session: false }) ,(req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }) ,(req, res) => {
  Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.status(201).json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Genre}).then((genre) => {
    res.status(201).json(genre.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }) ,(req, res) => {
  Movies.findOne({'Director.Name': req.params.Name}).then((director) => {
    res.status(201).json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

// Post reques to create a new user

//POST request to create a new user using server-side validation
app.post('/users',
[
check('Username', 'Username is required').isLength({min:5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username}).then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword, // hashed password instead of normal password 
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {res.status(201).json(user)}).catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }) , (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Updating user data via put request (Server-side validation & hashing)
app.put('/users/:Username', passport.authenticate('jwt', {session: false}),
[
check('Username', 'Username is required').isLength({min:5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username},
{ $set: {
  Username: req.body.Username,
  Password: hashedPassword,
  Email: req.body.Email,
  Birthday: req.body.Birthday
  }
},
{ new : true},
(err, updatedUser) => {
  if(err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
    };
  });
});


app.post('/users/:Username/favourites/:MovieID', passport.authenticate('jwt', { session: false }) , (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},
{$push: {FavoriteMovies: req.params.MovieID}},
{new: true},
(err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
      };
    });
  });

app.delete('/users/:Username/favourites/:MovieID', passport.authenticate('jwt', { session: false }) , (req, res) => {
 Users.findOneAndUpdate({Username: req.params.Username},
 {$pull: {FavoriteMovies: req.params.MovieID}},
 {new: true},
 (err, updatedUser) => {
   if(err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   };
 });
});

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }) , (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username}).then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    };
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
})