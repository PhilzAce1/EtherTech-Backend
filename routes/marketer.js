const router = require('express').Router();
const Marketer = require('../models/Marketer');
const bcrypt = require('bcrypt');
const { Mongoose } = require('mongoose');
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  try {
    const marketers = await Marketer.find();
    res.status(200).json({
      success: true,
      payload: marketers,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: e,
    });
  }
});

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await Marketer.findOne({
      username: username,
    });
    const customers = await Customer.find({ referrer: user._id }).populate(
      'referrer'
    );
    res.json({
      success: true,
      customers,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      msg: e,
    });
  }
});
router.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const { email, username, password } = req.body;
    // check if user exist
    const userExist = await Marketer.findOne({
      $or: [{ email }, { username }],
    });
    if (userExist)
      return res.status(400).json({
        success: false,
        msg: 'Username or email already taken',
      });
    // create new User
    const newUser = await new Marketer({
      email,
      username,
      password,
    });
    await newUser.save();
    const token = newUser.generateAuthToken();
    res.header('x-auth-token', token).status(200).json({
      success: true,
      payload: { token, newUser },
    });
  } catch (e) {
    // console.log(e);
    res.status(400).json({
      success: false,
      message: e,
    });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Marketer.findOne({
      $or: [{ email }, { username: email }],
    });
    if (!user)
      return res.status(404).json({
        success: false,
        msg: 'user does not exits',
      });
    // confirm password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ success: false, payload: 'wrong password' });

    const token = user.generateAuthToken();
    // send token
    res.header('x-auth-token', token).status(200).json({
      success: true,
      payload: {
        token,
        user,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: e,
    });
  }
});

module.exports = router;
