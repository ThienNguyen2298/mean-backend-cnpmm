var express = require('express');
var router = express.Router();
const UserTypeController = require('../controllers/usertypes');

router.get('/', UserTypeController.usertypes_get_all);
router.post('/', UserTypeController.usertypes_create);
router.put('/', UserTypeController.usertypes_update);
router.delete('/:usertypeId', UserTypeController.usertypes_delete);

//export usertype route
module.exports = router;
