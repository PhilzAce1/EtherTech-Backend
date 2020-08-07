const router = require('express').Router();
const Marketer = require('../models/Marketer');

router.get('/', (req, res) => {
  res.send('working');
});

router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    // check if user exist
    const userExist = await marketer.findOne({
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
    console.log(e);
  }
});
router.post('/login', async (req, res) => {
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
    return res.status(400).json({ success: false, payload: 'wrong password' });

  const token = user.generateAuthToken();
  // send token
  res.header('x-auth-token', token).status(200).json({
    success: true,
    payload: {
      token,
      user,
    },
  });
});

module.exports = router;
