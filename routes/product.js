const express = require("express");
const upload = require("../utils/multer");
const { createProduct, deleteProduct, updateProduct, getAdminProducts } = require("../controllers/productController.js");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser.js");
const router = express.Router();

router.post("/admin/product/new", upload.array("imageUrls"), verifyToken, authorizeRoles("admin"), createProduct);
router.delete("/admin/product/delete/:id", verifyToken, authorizeRoles("admin"), deleteProduct)
router.put("/admin/product/update/:id", verifyToken, authorizeRoles("admin"), updateProduct);
router.get("/admin/products", verifyToken, authorizeRoles("admin"), getAdminProducts);

module.exports = router;