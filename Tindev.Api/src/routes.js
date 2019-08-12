const routes = require("express").Router();
const DevController = require("./controllers/DevController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.post("/devs/getById", DevController.findById);
routes.post("/devs/:devId/like", LikeController.store);
routes.post("/devs/:devId/dislike", DislikeController.store);

module.exports = routes;
