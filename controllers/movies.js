const Movie = require('../models/movie');
const errorsList = require('../errors/index');

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
        next(new errorsList.BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (movie === null) {
        next(new errorsList.NotFoundError('Фильм не найден.'));
      } else if (movie.owner.toString() === req.user._id) {
        movie.deleteOne()
          .then(() => {
            res.send({ data: movie });
          })
          .catch(next);
      } else {
        next(new errorsList.ForbiddenError('Это не ваш фильм!'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};
