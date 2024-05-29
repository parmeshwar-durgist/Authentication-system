import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router()
import { User } from '../models/User.js'
import jwt, { decode } from 'jsonwebtoken'
import nodemailer from 'nodemailer'

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
        return res.json({ "message": "user already exists" })
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    })

    await newUser.save()
    return res.json({ status: true, "message": "record registered " })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({ "message": "user is not registered" })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        res.json({ "message": "password is incorrect" })
    }


    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '5m' })
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 })
    return res.json({ status: true, "message": "login successfully" })
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "user not registered" })

        }

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' })
        console.log(token)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'durgistparmeshwar@gmail.com',
                pass: 'hhdw qamn lssl rgol',
            }
        });

        var mailOptions = {
            from: 'durgistparmeshwar@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error) {
            if (error) {
                return res.json({ message: "error sending email" })
            } else {
                return res.json({ status: true, message: "email sent successfully" })
            }
        });

    } catch (error) {
        console.log(error);
    }
})


router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log(token);
    console.log(password);
    try {
        const decoded = await jwt.verify(token, process.env.KEY)
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({ _id: id }, { password: hashpassword })
        return res.json({ status: true, message: "update password" })
    } catch (error) {
        return res.json("Invalid token")
    }
})

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "no token" })
        }
        const decoded = await jwt.verify(token , process.env.KEY);
        next()
    } catch (error) {
        return res.json(error)
    }
}

router.get('/verify', verifyUser , async (req, res) => {
    return res.json({ status:true, message: "authorized" })
})


router.get('/logout', async (req, res) => {
    res.clearCookie('token')
    return res.json({ status:true})
})

export { router as UserRouter }