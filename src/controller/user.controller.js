const User = require('../model/user.model');
const Chat = require('../model/chat.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const validateMongodbId = require("../utils/validateMongodbId");
const dotenv = require("dotenv");
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

dotenv.config({
    path: './.env'
});


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const options = {
    httpOnly: true,
    secure: false        // process.env.NODE_ENV === "production"
}


// register user
const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if ([name, email, password].some(field =>
        field?.trim() === "" || field?.trim() === undefined
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const alreadyUser = await User.findOne({ email })
    if (alreadyUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // new user
    const newUser = await User.create({
        name,
        email,
        password
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, newUser, "User registered successfully")
        )
});

// login user
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (
        [email, password].some((field) => field?.trim() === "" || field?.trim() === undefined)
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    if (!(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: user, accessToken, refreshToken }, "User logged in successfully")
        )
})

// get all the users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Users fetched successfully")
        )
});

// get user by id
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;    // user id
    validateMongodbId(id);

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "user fetched successfully")
        )
});

// search 
const searchUser = asyncHandler(async (req, res) => {
    const inputText = req.query.inputText;

    const isEmail = (email) => {
        // Regular expression to match a valid email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Test the email against the pattern
        return emailPattern.test(email);
    }

    let user;
    if (isEmail(inputText)) {
        // it will return only one user
        user = await User.findOne({ email: inputText });

        function ensureArray(variable) {
            return Array.isArray(variable) ? variable : [variable];
        }

        user = ensureArray(user);
    } else {
        // it can return multiple users
        user = await Chat.aggregate([
            {
                $match: {
                    participants: {
                        $in: [req.user._id]
                    },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                }
            },
            {
                $unwind: "$participants",
            },
            {
                $match: {
                    "participants.name": inputText
                }
            }
        ])
    }

    console.log(user);
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User fetched successfully")
        )
});

// update user profile picture
const updateUserProfileImage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const LocalPhotoPath = req.file?.path;
    
    const photo = await uploadOnCloudinary(LocalPhotoPath);
    if (!photo) {
        console.log(photo)
        throw new ApiError(500, "Failed to upload photo to cloudinary");
    }

    if (req.user?.profileImage) {
        await deleteFromCloudinary(req.user.profileImage);
    }

    const updateProfilePhoto = await User.findByIdAndUpdate(userId,
        {
            $set: {
                profileImage: photo.secure_url,
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: updateProfilePhoto }, "Profile photo updated successfully")
        )
})


module.exports = {
    userRegister,
    userLogin,
    getAllUsers,
    getUser,
    searchUser,
    updateUserProfileImage
};

