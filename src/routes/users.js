const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator')
const fs = require('fs')

let userValidation = [
    check('email').isEmail().withMessage('El campo debe ser un email valido'),
    check('password').isLength({min: 6, max: 12}).withMessage('El password debe tener entre 6 y 12 caracteres'),
]

router.get('/login', function (req, res) {
    res.render('login')
})

router.get('/register', function (req, res) {
    res.render('register')
})

router.post('/register', userValidation, function (req, res) {
    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('register', {
            errors: result.errors,
            data: req.body
        })
    }

    let users = fs.readFileSync('src/data/users.json', {encoding: 'utf-8'})
    users = JSON.parse(users)
    users.push(req.body)
    users = JSON.stringify(users)
    fs.writeFileSync('src/data/users.json', users)

    res.redirect(301, '/users/login')
})

router.post('/login', userValidation, function (req, res) {
    let result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('login', {
            errors: result.errors,
            data: req.body
        })
    }

    res.redirect(301, '/users/welcome')
})

router.get('/welcome', function (req, res) {
    res.end('bienvenido!')
})

module.exports = router
