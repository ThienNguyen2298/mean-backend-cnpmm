const express = require('express');
const router = express.Router();
const BillController = require('../controllers/bill');


// router.get('/confirm-order', BillController.bill_confirm_order);
router.get('/confirm-order/:billId', BillController.bill_confirm_order);

router.post('/', BillController.bill_create);

router.get('/', BillController.bill_get);

router.post('/billdetail', BillController.billDetail_create);


module.exports = router;