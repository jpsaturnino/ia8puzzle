const { Router } = require('express');
const routes = Router();

const Ctrl = require('./src/Algorithms/algorithms');

routes.get('/astar', Ctrl.AStar);
routes.get('/hillclimbing', Ctrl.hillClimbing);