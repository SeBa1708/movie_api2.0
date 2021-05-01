const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
	Title: {type: String, required: true},
	Description: {type: String, required: true},
	Genre: {
		Name: String,
		Description: String
	},
	Director: {
		Name: String,
		Bio: String
	}
});

let userSchema = mongoose.Schema({
	Username: {type: String, required: true},
	Password: {type: String, required: true},
	Email: {type: String, required:true},
	Birthday: Date,
	FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref:'Movie'}] // We use the singular “Movie” because that is the name of the model which links the movieSchema to its database collection 
});

// // the titles Movie and User will create collections called “db.movies” and “db.users”
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);



module.exports.Movie = Movie;
module.exports.User = User;