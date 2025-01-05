const express = require("express");
const upload = require("../utils/multer");
const { createProduct, deleteProduct, updateProduct, getAdminProducts, getSingleProduct, getProducts, archivedProduct, restoreProduct, getAdminArchivedProducts } = require("../controllers/productController.js");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser.js");
const router = express.Router();

router.post("/admin/product/new", upload.array("imageUrls"), verifyToken, authorizeRoles("admin"), createProduct);
router.delete("/admin/product/delete/:id", verifyToken, authorizeRoles("admin"), deleteProduct)
router.put("/admin/product/update/:id", upload.array("imageUrls"), verifyToken, authorizeRoles("admin"), updateProduct);
router.get("/admin/products", verifyToken, authorizeRoles("admin"), getAdminProducts);
router.get("/product/:id", getSingleProduct);
router.get("/get/products", getProducts);
router.delete("/admin/product/archived-product/:id", verifyToken, authorizeRoles("admin"), archivedProduct);
router.put("/admin/product/restore-product/:id", verifyToken, authorizeRoles("admin"), restoreProduct);
router.get("/admin/archived-products", verifyToken, authorizeRoles("admin"), getAdminArchivedProducts);

module.exports = router;