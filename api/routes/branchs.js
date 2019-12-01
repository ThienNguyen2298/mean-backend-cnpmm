const express = require('express');
const router = express.Router();
const BranchController = require('../controllers/branchs');

router.get('/', BranchController.branchs_get_all);

router.post('/', BranchController.branchs_create_branch);

router.get('/:branchId', BranchController.branchs_get_by_id);

module.exports = router;