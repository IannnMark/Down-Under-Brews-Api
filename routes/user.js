const express = require("express");
const { updateUser, deleteUser, allUsers, eraseUser, archivedUser, restoreUser } = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../utils/verifyUser");

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/admin/users", verifyToken, authorizeRoles("admin"), allUsers);
router.get("/admin/delete/:id", verifyToken, authorizeRoles("admin"), eraseUser);
router.delete("/admin/user/archived/:id", verifyToken, authorizeRoles("admin"), archivedUser);
router.put("/admin/user/restore-user/:id", verifyToken, authorizeRoles("admin"), restoreUser);


module.exports = router;