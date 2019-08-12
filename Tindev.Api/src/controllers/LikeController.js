const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const devId = req.params.devId;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev || !loggedDev)
      return res.status(400).json({ error: "Dev not Found" });

    if (!loggedDev.likes.includes(targetDev._id)) {
      loggedDev.likes.push(targetDev._id);
      if (targetDev.likes.includes(loggedDev._id)) {
        let loggedSocket = req.connectedUsers[loggedDev._id];
        let targetSocket = req.connectedUsers[targetDev._id];

        if (loggedSocket) req.io.to(loggedSocket).emit("match", targetDev);
        if (targetSocket) req.io.to(targetSocket).emit("match", loggedDev);
      }
    }

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
