const User = require('../model/userModel');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.cookies.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const updatedProfile = req.body;
        console.log(updatedProfile);
        const options = {
            new: true
        };

        const result = await User.findByIdAndUpdate(req.cookies.userId, updatedProfile, options)

        return res.status(200).json({
            message: 'Profile edited successfully',
            user: result
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    editProfile
}