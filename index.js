//Import express and create the server
const express = require('express'),
		morgan = require('morgan'),
		bodyParser = require('body-parser');
const { parse } = require('uuid');

const app = express();

app.use(bodyParser.json());

let topMovies = [
	{
		title: 'Casino',
		description: 'They had everything and lost it because of abuse of power, intrigue and greed.',
		genre: 'Drama',
		director: {
			name: 'Martin Scorsese', 
			bio: 'born November 17, 1942) is an American film director, producer, screenwriter, and actor.'
		}
	},
	{
		title: 'Scarface',
		description: 'In 1980, Cuban refugee and ex-convict Tony Montana arrives in Miami, Florida, as part of the Mariel boatlift, where he is sent to a refugee camp with friends Manny Ray, Angel, and Chi Chi.',
		genre: 'Crime',
		director: {
			name: 'Brian de Palma', 
			bio: 'born September 11, 1940) is an American film director and screenwriter.'
		}
	},
	{
		title: 'Little Miss Sunshine',
		description: 'Little Miss Sunshine is a 2006 American tragicomedy[2][3][4][5][6][7] road film and the directorial debut of the husband-wife team of Jonathan Dayton and Valerie Faris.  ',
		genre: 'Tragiccomedy',
		director: {
			name: 'Jonathan Dayton', 
			bio: 'Jonathan Dayton (born July 7, 1957) and Valerie Faris (born October 20, 1958) are a team of American film and music video directors who received critical acclaim for their feature film directorial debut, Little Miss Sunshine (2006).'
		}
	},
	{
		title: 'Batman Begins',
		description: 'As a child in Gotham City, Bruce Wayne falls down a dry well and is attacked by a swarm of bats, developing a fear of them. ',
		genre: 'Fantasy',
		director: {
			name: 'Christopher Nolan', 
			bio: 'born 30 July 1970) is a British-American film director, producer, and screenwriter'
		}
	},
	{
		title: 'Wolf of Wallstreet',
		description: '',
		genre: 'Biography, Crime, Drama',
		director: {
			name: 'Martin Scorsese', 
			bio: 'born November 17, 1942) is an American film director, producer, screenwriter, and actor.'
		}
	},
	{
		title: 'Reservoir Dogs',
		description: 'Eight men eat breakfast at a Los Angeles diner before carrying out a diamond heist.',
		genre: 'Crime, Drama, Thriller',
		director: {
			name: 'Quentin Tarantino', 
			bio: 'born March 27, 1963)[2] is an American film director, screenwriter, producer, and actor.'
		}
	},
	{
		title: 'The usual suspects',
		description: 'Hardened criminal Dean Keaton lies badly wounded on a ship docked in San Pedro Bay. He is confronted by a mysterious figure whom he calls Keyser, who shoots him dead and sets fire to the ship.',
		genre: 'Crime, Mystery, Thriller',
		director: {
			name: 'Bryan Singer', 
			bio: 'Bryan Singer was born on September 17, 1965 in New York City, New York, USA as Bryan Jay Singer. '
		}
	},
	{
		title: 'Fight Club',
		description: 'A nameless first person narrator (Edward Norton) attends support groups in attempt to subdue his emotional state and relieve his insomniac state.',
		genre: 'Drama',
		director: {
			name: 'David Fincher', 
			bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California.'
		}
	},
	{
		title: 'Knives Out',
		description: 'A detective investigates the death of a patriarch of an eccentric, combative family.',
		genre: 'Comedy, Crime, Drama',
		director: {
			name: 'Rian Johnson', 
			bio: 'Rian Johnson was born in Maryland and at a young age his family moved to San Clemente, California, where he was raised. '
		}
	},
	{
		title: 'Trainspotting',
		description: 'Renton, deeply immersed in the Edinburgh drug scene, tries to clean up and get out, despite the allure of the drugs and influence of friends.',
		genre: 'Drama',
		director: {
			name: 'Danny Boyle', 
			bio: 'Danny Boyle was born on October 20, 1956 in Radcliffe, Greater Manchester, England as Daniel Francis Boyle'
		}
	}

];

// Using middleware 

//get the top 10 movies
app.get('/movies', (req, res) => {
	res.json(topMovies);
});

//get the starting request
app.get('/', (req, res) => {
	res.send('Welcome to myFlex movies!');
});

//Get the documentation
app.use(express.static('public'));
app.get('/documentation', (req, res) => {
	        res.sendFile('public/documentation.html', {root: __dirname});
});

//Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
	res.status(201).send('user has changed his name');	
});



//Return data (description, genre, director) about a single movie 
app.get('/movies/:title', (req, res) => {
	res.json(topMovies.find((movie) =>
		{return movie.title === req.params.title}));
});


// EndPoint 3 - Return data about a genre (description) by name/title (e.g., "Thriller")
app.get('/movies/genres/:genre', (req, res) => {
	res.json('Successful GET request returning a description of the genre');
  });

//Return data about a director (bio, birth year, death year) by name
app.get('/movies/:director/:name', (req, res) => {
	res.send('Successful GET request returning data information about the director');
  });

//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added
app.post('/movies/', (req, res) => {
	let newMovie = req.body;
	if (!newMovie.title) {
		const message = 'Missing movie title in the request body';
		res.status(400).send(message);
	} else {
		topMovies.push(newMovie);
		res.status(201).send(newMovie);
	}
});

//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed
app.delete('/movies/:title', (req, res) => {
	let movie = topMovies.find((movie) => {return movie.title === req.params.title});
	if (movie) {
		movies = topMovies.filter((obj) => {return obj.title !== req.params.title});
		res.status(201).send('Movie ' + req.params.title + ' was deleted.');
		
	}
});

//logs into the Terminal using morgan 
app.use(morgan('common'));

//Error-handling middleware 
app.use((err, req, res, next) => {
	        console.log(err.stack);
	        res.status(500).send('Sorry something went wrong');
});

//Listen for requests 
app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
