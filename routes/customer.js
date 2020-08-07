const Marketer = require('../models/Marketer');
const Customer = require('../models/Customer');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      success: true,
      payload: customers,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: e,
    });
  }
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
      const customer = await new Customer({
        name,
      });
      await customer.save();
      return res.status(200).json({
        success: true,
        msg: 'wrong ref',
      });
    }
    const customer = await new Customer({
      name,
      referrer: referrer._id,
    });
    await customer.save();
    return res.status(200).json({
      success: true,
      msg: 'done',
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: e,
    });
  }
});

router.post('/update', (req, res) => {});
module.exports = router;
