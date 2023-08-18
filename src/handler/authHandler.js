const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const registerUser = async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    try {
        const existingUserEmail = await User.findOne({
            email
        });
        const existingUserUsername = await User.findOne({
            username
        });

        if (existingUserEmail) {
            return res.status(409).json({
                error: 'This email already exists.'
            });
        }

        if (existingUserUsername) {
            return res.status(409).json({
                error: 'This username already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const userToSave = await newUser.save();

        res.cookie('_id', userToSave._id, {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true
        });
        res.cookie('username', userToSave.username, {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true
        });

        res.status(201).json({
            message: 'User registered successfully!',
            comment: userToSave
        });
    } catch (err) {
        res.status(500).json({
            error: 'An error occurred while registering the user.'
        });
    }
};

const loginUser = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials. Please try again.'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid credentials. Please try again.'
            });
        }

        res.cookie('userId', user._id, {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true
        });
        res.cookie('username', user.username, {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true
        });

        return res.status(200).json({
            message: 'Login successful',
            user: user
        });
    } catch (err) {
        res.status(500).json({
            error: 'An error occurred while logging in.'
        });
    }
};

const getSession = (req, res) => {
    const username = req.cookies.username;
    if (username) {
        res.send({
            loggedIn: true,
            user: username
        })
    } else {
        res.send({
            loggedIn: false
        })
    }
}

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error while logging out:', err);
            res.status(500).json({
                message: 'Logout failed'
            });
        } else {
            // Clear the user cookie
            res.clearCookie('userId');
            res.clearCookie('username');

            res.status(200).json({
                message: 'Logout successful'
            });
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getSession
};