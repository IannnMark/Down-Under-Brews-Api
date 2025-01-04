const express = require("express");
const { updateUser, deleteUser } = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

module.exports = router;