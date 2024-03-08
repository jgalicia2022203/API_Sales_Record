import bcryptjs from "bcryptjs";
import User from "../users/user.model.js";
//ADMIN FUNCTIONS
export const register = async (req, res) => {
  const { username, email, password, ...rest } = req.body;
  try {
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    Object.assign(newUser, rest);
    await newUser.save();
    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findById(id);
    user.role = role;
    await user.save();
    return res
      .status(200)
      .json({ msg: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  const { id: userId } = req.params;
  const { ...rest } = req.body;

  try {
    let updates = {};
    if (rest.username) updates.username = rest.username;
    if (rest.email) updates.email = rest.email;
    if (rest.password) {
      const hashedPassword = await bcryptjs.hash(rest.password, 10);
      updates.password = hashedPassword;
    }
    if (rest.status) updates.status = rest.status;
    if (rest.fullName) updates.fullName = rest.fullName;
    if (rest.address) updates.address = rest.address;
    if (rest.phoneNumber) updates.phoneNumber = rest.phoneNumber;
    if (rest.dateOfBirth) updates.dateOfBirth = rest.dateOfBirth;
    updates.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    return res
      .status(200)
      .json({ msg: "User info updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const listUsers = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const existingUser = await User.findById(userId);
    existingUser.status = false;
    await existingUser.save();
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//CLIENT FUNCTIONS

export const UpdateClientInfo = async (req, res) => {
  const userId = req.user.id;
  const { ...rest } = req.body;

  try {
    let updates = {};
    if (rest.fullName) updates.fullName = rest.fullName;
    if (rest.address) updates.address = rest.address;
    if (rest.phoneNumber) updates.phoneNumber = rest.phoneNumber;
    if (rest.dateOfBirth) updates.dateOfBirth = rest.dateOfBirth;
    updates.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    res
      .status(200)
      .json({ msg: "your info was updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.user.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: false },
      { new: true }
    );

    res.status(200).json({
      msg: "Your account was deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting your account:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
