import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { apiResponse } from "../../utils/apiResponse.js";

const userRegister = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation : not empty
  // check if user already exist : username or email
  // check for images, check for avatar
  // upload them to cloudinary and again check for avatar
  // create user object - create entry in db
  // remove pwd and refresh token field from response
  // check for user creation
  // return response

  const { username, email, fullName, password } = req.body;
  // console.log(email);

  // CHECKING FOR EMPTY FIELDS
  // if(fullName === ""){
  //   throw new apiError(400,"Full name is required")
  // }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // CHECKING EMAIL
  const strEmail = String(email);
  if (!strEmail.includes("@")) {
    throw new apiError(400, "Please enter valid Email ID");
  }

  //CHECK IF USER EXIST OR NOT
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "User already exists");
  }

  // CHECKING FOR IMAGES AND AVATAR (AVATAR IS REQD)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  // UPLOADING FILES ON CLOUD (CHECK FOR AVATAR AGAIN)
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar.url,
    //chekcking for cover image
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully!"));
});

export { userRegister };
