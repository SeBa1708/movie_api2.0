//Integrating Mongoose with the REST API
const mongoose = require('mongoose');
const models = require('./models.js');
const movies = models.movie;
const users = models.user;
const directors = models.director;


//Import express and create the server
const express = require('express'),
	  morgan = require('morgan'),
	  bodyParser = require('body-parser');
const { parse } = require('uuid');
	  
const app = express();

app.use(bodyParser.json());

// This allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within your REST API

mongoose.connect('mongodb://localhost:27017/myFlixDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// 1. General requests

//1.1 Return the documentation html
app.use(express.static('public'));
app.get('/documentation', (req, res) => {
	        res.sendFile('public/documentation.html', {root: __dirname});
});

//1.2 get the starting request
app.get('/', (req, res) => {
	res.send('Welcome to myFlex movies!');
});


// 2. Movie related requests 

// 2.1 Return a list of ALL movies to the user 
app.get('/movies', (req, res) => {
	movies.find() // movies comes from the Database 
	.then((movies) => {

		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('error: ' + err);
	});
});


// 2.2 Return data (description, genre, director, image URL, whether its featured or not) about a single movie
app.get('/movies/:title', (req, res) => {
	movies.findOne({Title: req.params.title})
		.then((movie) => {
		res.json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});


// 2.3 Return data about a genre (description) by name/title (e.g., "Action")
app.get('/movies/genre/:name', (req, res) => {
	movies.findOne({'Genre.Name': req.params.name})
	.then((movie) => {
		res.json(movie.Genre);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' +err);
	});
});

// 2.4 Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:Name', (req, res) => {
	movies.findOne({'Director.Name': req.params.Name})
		.then((director) => {
			res.json(director.Director);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});


// 3. User-related requests 

// 3.1 Allow new users to register
app.post('/users', (req, res) => {
	users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists');
			} else {
				Users.create({
					Username:req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday
				}) 
				.then((user) => {res.status(201).json(user) })
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error: ' + error);
			 })
			}
		  })
		  .catch((error) => {
			  console.error(error);
			  res.status(500).send('Error: ' + error);
		   });  
	
});

// 3.2 delete a user by Username
app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username})
	.then((user) => {
		if(!user) {
			res.status(400).send(req.params.Username + ' was not found');
		} else {
			res.status(200).send(req.params.Username + ' was deleted.');
		}
	})
	.catch((err) => {
		console.error(err);
		res.status.status(500).send(' Error: ' + err);
	});
});

// 3.3 Get all users
app.get('/users', (req, res) => {
	Users.find()
	.then((users) => {
		res.status(201).json(users);
	})
	.catch((error) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// 3.4 Get a user by username
app.get('/users/:Username', (req, res) => {
	Users.findOne({Username:req.params.Username})
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// 3.5 Allow users to update their user info
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username},
		{$set:
			{ Username: req.body.Username,
			  Password: req.body.Password,
			  Email: req.body.Email,
			  Birthday: req.body.Birthday
			}
		},
		{ new: true},
		(err, updatedUser) => {
			if(err) {
				console.error(err);
		                res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		});
});

// 3.6 Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:movieID', (req, res) => {
	Users.findOneAndUpdate({Username: req.params.Username},
		{ $addToSet: { Favoritemovies: req.params.movieID} },
		{new: true},
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		});
});


//3.7 Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:movieID', (req, res) => {
	Users.findOneAndUpdate({Username: req.params.Username},
       		 { $pull: { FavoriteMovies: req.params.MovieID} },
                 {new: true},
                 (err, updatedUser) => {
                        if (err) {
	                        console.error(err);
	                        res.status(500).send('Error: ' + err);
			} else {res.json(updatedUser);
	                }
	        });
});


//logs into the Terminal
app.use(morgan('common'));

//Error-handling middleware
app.use((err, req, res, next) => {
	        console.log(err.stack);
	        res.status(500).send('Somthing broke!');
});

//Listen for requests 
app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});