const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const errorHandler = require("../utils/error");


exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can update only your account"));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


exports.deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error);
    }
}


exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isDeleted: false });
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(error);
    }
}