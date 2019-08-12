const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const devId = req.params.devId;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev || !loggedDev)
      return res.status(400).json({ error: "Dev not Found" });

    if (!loggedDev.dislikes.includes(targetDev._id)) {
      loggedDev.dislikes.push(targetDev._id);
    }

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
