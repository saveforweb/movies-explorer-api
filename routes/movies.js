const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexList = require('../utils/regexList');

const {
  getUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getUserMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regexList.urlRegex).required(),
    trailerLink: Joi.string().regex(regexList.urlRegex).required(),
    thumbnail: Joi.string().regex(regexList.urlRegex).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }).required(),
}), deleteMovie);

module.exports = router;
