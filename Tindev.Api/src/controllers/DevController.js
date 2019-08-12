const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { user } = req.body;
    const userExists = await Dev.findOne({ user: user });

    if (userExists) return res.json({ success: true, data: userExists });

    try {
      const { name, avatar_url, bio } = (await axios.get(
        `https://api.github.com/users/${user}`
      )).data;

      const dev = await Dev.create({
        name,
        user,
        bio,
        avatar: avatar_url
      });

      return res.json({ success: true, data: dev });
    } catch (ex) {
      return res.json({ success: false, data: ex.message });
    }
  },
  async index(req, res) {
    const { user } = req.headers;
    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    return res.json(users);
  },
  async findById(req, res) {
    const { id } = req.body;
    return res.json(await Dev.findById(id));
  }
};
