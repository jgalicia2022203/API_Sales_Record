import bcryptjs from "bcryptjs";
import User from "../users/user.model.js";
//ADMIN FUNCTIONS
export const createUser = async (req, res) => {
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
  const { user } = req.params;
  const { role } = req.body;
  try {
    user.role = role;
    await user.save();
    res.status(200).json({ msg: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { ...rest } = req.body;
  
  try {
    let updates = {};
    if (rest.username) updates.username = rest.username;
    if (rest.email) updates.email = rest.email;
    if (rest.password) {
      const hashedPassword = await bcrypt.hash(rest.password, 10);
      updates.password = hashedPassword;
    }
    if (rest.status) updates.status = rest.status;
    if (rest.fullName) updates.fullName = rest.fullName;
    if (rest.address) updates.address = rest.address;
    if (rest.phoneNumber) updates.phoneNumber = rest.phoneNumber;
    if (rest.dateOfBirth) updates.dateOfBirth = rest.dateOfBirth;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    res.status(200).json({ msg: "User info updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//CLIENT FUNCTIONS
