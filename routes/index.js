const router = require('express').Router();
const errorsList = require('../errors/index');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { authValidation, regValidation } = require('../validation/index');

router.post('/signin', authValidation, login);
router.post('/signup', regValidation, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new errorsList.NotFoundError('Страница не найдена.'));
});

module.exports = router;
