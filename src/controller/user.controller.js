const UserModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
// const jwt = require('jsonwebtoken');
const uniqueString = require('unique-string');

const isValidatorEmail = (email) => {
    const filter = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
    return filter.test(email);
};

const isAlphabetAndNumber = (str) => {
    return /[a-zA-Z0-9]+/.test(str);
};

const isValidatorPassword = (str, res) => {
    const {password, confirmPassword} = str;
    if (!isAlphabetAndNumber(password) && !isAlphabetAndNumber(confirmPassword)) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Password không hợp lệ"
        });

        return false;
    }

    if (password !== confirmPassword) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Hai mật khẩu không giống nhau"
        });

        return false;
    }

    return true;
};

const createUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
        } = req.body

        if (!email || !password || !confirmPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Vui lòng điền đủ thông tin"
            });
        }

        if (!isValidatorEmail(email)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Email không hợp lệ"
            });
        }

        const checkedPassword = isValidatorPassword(req.body, res);
        if(checkedPassword === false){
            return;
        }

        const user = await UserModel.findOne({
            where: {email: email}
        });
        if (user !== null && user !== undefined) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Email đã được sử dụng"
            });
        }

        const tokenRegister = uniqueString();
        const saltRounds = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const userDb = new UserModel({
            firstname,
            lastname,
            email: email,
            passwordSalt: saltRounds,
            hashedPassword: hashedPassword,
        });

        await userDb.save();
        return res.status(HttpStatus.OK).json({
            message: "Đăng kí thành công. Vui lòng kiểm tra email để xác thực"
        });
    } catch (e) {
        console.log(e);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: JSON.stringify(e)
        });
    }
};

module.exports = {
    createUser
};