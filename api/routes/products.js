const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../../../frontend-angular/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `FunOfHeuristic_${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })

router.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file);
    if(file){
        res.status(200).json({
            filename: file.filename
        })
    }

  })

router.get("/", ProductsController.products_get_all);

router.post("/", ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.put("/:productId", ProductsController.products_update_product);

// router.delete("/:productId", checkAuth, ProductsController.products_delete);

router.delete("/:productId", ProductsController.products_delete);

module.exports = router;