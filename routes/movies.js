const router = require('express').Router();
const { addMovieValidation, deleteMovieValidation } = require('../validation/index');

const {
  getUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getUserMovies);

router.post('/', addMovieValidation, createMovie);

router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
