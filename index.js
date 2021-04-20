//Import express and create the server
const express = require('express');
const morgan = require('morgan');
const app = express();

let topMovies = [
	{
		title: 'Casino'
	},
	{
		title: 'Scarface'
	},
	{
		title: 'Little Miss Sunshine'
	},
	{
		title: 'Batman'
	},
	{
		title: 'Wolf of Wallstreet'
	},
	{
		title: 'Reservoir Dogs'
	},
	{
		title: 'The usual suspects'
	},
	{
		title: 'Fight Club'
	},
	{
		title: 'Knives Out'
	},
	{
		title: 'Trainspotting'
	}

];

// Using middleware 

//get the top 10 movies
app.get('/movies', (req, res) => {
	res.json(topMovies.slice(0, 10));
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
