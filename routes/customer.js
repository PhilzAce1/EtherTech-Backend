const Marketer = require('../models/Marketer');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('working');
});
router.post('/newcustomer', async (req, res) => {
  try {
    const { name, refId, conf } = req.body;
    const referrer = await Marketer.findOne({ username: name });
    if (!referrer && !conf)
      return res.status(404).json({
        success: false,
        msg: 'wrong ref',
      });
    if (!referrer && conf) {
      return res.status(404).json({
        success: true,
        msg: 'wrong ref',
      });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
