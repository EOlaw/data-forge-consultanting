const homeController = {
    homepage: (req, res) => {
        res.render('home/homepage')
    },
    about: (req, res) => {
        res.render('home/about')
    },
    services: (req, res) => {
        res.render('home/service')
    },
    portfolio: (req, res) => {
        res.render('home/portfolio')
    },
    team: (req, res) => {
        res.render('home/team')
    },
    contact: (req, res) => {
        res.render('home/contact')
    }
}

module.exports = homeController