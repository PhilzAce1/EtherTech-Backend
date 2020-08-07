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
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const cus = await Customer.findById(userId).populate('referrer');
  console.log(cus);
  res.json(cus);
});
router.post('/newcustomer', async (req, res) => {
  try {
    const { name, refId, conf } = req.body;
    const referrer = await Marketer.findOne({ username: refId });
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

router.post('/updateverified', async (req, res) => {
  try {
    const { id, verified } = req.body;
    const cus = await Customer.findByIdAndUpdate(id, { verified });
    res.status(200).json({
      success: true,
      payload: cus,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
router.post('/updatestatus', async (req, res) => {
  const { id, status } = req.body;
  try {
    const cus = await Customer.findByIdAndUpdate(id, { status });
    res.status(200).json({
      success: true,
      payload: cus,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});
router.post('/updatepaid', async (req, res) => {
  const { id, paid } = req.body;
  try {
    const cus = Customer.findByIdAndUpdate(id, {
      paid,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});

module.exports = router;
