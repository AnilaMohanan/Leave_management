const express = require("express");

const {
    getUsers,
    createUser
} = require("../controllers/userController");

const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getUsers);
router.post("/", upload.single("profileImage"), createUser);

module.exports = router;