const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductCategoriesController = require('../controllers/productcategories');


router.get("/", ProductCategoriesController.productcategories_get_all);

router.post("/", ProductCategoriesController.productcategories_create_productcategory);

router.get("/:productCategoryId", ProductCategoriesController.productcategories_get_productcategory);

router.patch("/:productCategoryId", checkAuth, ProductCategoriesController.productcategories_update_productcategory);

router.delete("/:productCategoryId", checkAuth, ProductCategoriesController.productcategories_delete);

module.exports = router;