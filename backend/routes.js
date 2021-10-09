const { Router } = require('express');
const routes = Router();

const Ctrl = require('./src/Algorithms/algorithms');

routes.post('/astar', Ctrl.AStar);
routes.post('/astarjump', Ctrl.AStar_Jump);
routes.post('/hillclimbing', Ctrl.hillClimbing);

module.exports = routes;