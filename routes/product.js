const express = require("express");
const upload = require("../utils/multer");
const { createProduct } = require("../controllers/productController.js");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser.js");
const router = express.Router();

router.post("/admin/product/new", upload.array("imageUrls"), verifyToken, authorizeRoles("admin"), createProduct);



module.exports = router;