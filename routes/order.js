const express = require("express");

const { newOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/order/new", newOrder);

module.exports = router;