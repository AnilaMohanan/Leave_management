const User = require("../models/User");

const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, role } = req.body;

        const profileImage = req.file
            ? `/images/${req.file.filename}`
            : "";

        const user = await User.create({
            name,
            role,
            profileImage
        });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getUsers,
    createUser
};