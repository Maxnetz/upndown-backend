import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
    const { name, email, password, userName, dateOfBirth, gender } = req.body;
    if (!name || !email || !password || !userName) {
        throw new BadRequestError("please provide all values");
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new BadRequestError("Email already exists");
    }

    const userNameAlreadyExists = await User.findOne({ userName });
    if (userNameAlreadyExists) {
        throw new BadRequestError("Username already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        userName,
        dateOfBirth,
        gender,
    });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            userName: user.userName,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
        },
        token,
    });
};

const login = async (req, res) => {
    const { userName, password } = req.body;
    // console.log(req.body);
    if (!userName || !password) {
        throw new BadRequestError("Please provide all values");
    }
    const user = await User.findOne({ userName }).select("+password");
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials");
    }
    const token = user.createJWT();
    user.password = undefined;

    res.status(StatusCodes.OK).json({ user, token });
};

const updateUser = async (req, res) => {
    // console.log(req.user);
    const { email, name, userName, dateOfBirth, gender } = req.body;
    if (!email || !name) {
        throw new BadRequestError("Please provide all values");
    }
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;
    // user.dateOfBirth = dateOfBirth;
    // user.gender = gender;
    // Edited 20/12/22 for profile page

    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user, token });
};

export { register, login, updateUser };
