const Movie = require('../models/movie');
const errorsList = require('../errors/index');
const {
  incorrectDataCreateMovieMessage,
  movieNotFoundMessage,
  notYourMovieMessage,
  incorrectDataDeleteMovieMessage,
} = require('../utils/constants');

module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((newMovie) => res.send({ data: newMovie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError(incorrectDataCreateMovieMessage));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ _id: req.params.movieId })
    .then((movie) => {
      if (movie === null) {
        next(new errorsList.NotFoundError(movieNotFoundMessage));
      } else if (movie.owner.toString() === req.user._id) {
        movie.deleteOne()
          .then(() => {
            res.send({ data: movie });
          })
          .catch(next);
      } else {
        next(new errorsList.ForbiddenError(notYourMovieMessage));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError(incorrectDataDeleteMovieMessage));
      } else {
        next(err);
      }
    });
};
