const User = require('../models/userModel')

const userControllers = {
    // Register Page
    renderRegister: (req, res) => {
        res.send('Register Page')
    }
}

module.exports = userControllers