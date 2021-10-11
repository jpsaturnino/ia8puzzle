const { Router } = require('express');
const routes = Router();

const Ctrl = require('./src/Algorithms/algorithms');

routes.post('/astar', Ctrl.AStar);
routes.post('/astarjump', Ctrl.AStar_Jump);
routes.post('/hillclimbing', Ctrl.hillClimbing);
routes.post('/bestfirst', Ctrl.best_first);
routes.post('/branchbound', Ctrl.branch_bound);

routes.get('/pathlen', Ctrl.pathLen);
routes.get('/pathlensolution', Ctrl.pathLenSolution);
routes.get('/executiontime', Ctrl.getExecutionTime);
routes.get('/treesolution/', Ctrl.treeSolution);


module.exports = routes;