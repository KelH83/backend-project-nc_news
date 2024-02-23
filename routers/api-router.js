const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/topics.controllers');
const userRouter = require('./users-routers');
const topicsRouter = require('./topics-routers');
const articlesRouter = require('./articles-routers');


apiRouter.get('/api', getEndpoints);

apiRouter.use('/api/users', userRouter);

apiRouter.use('/api/topics',topicsRouter);

apiRouter.use('/api/articles',articlesRouter)

module.exports = apiRouter;