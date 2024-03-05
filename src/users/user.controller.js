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
  const {user} = req.params;
  const {fullName, address, phoneNumber, dateOfBirth, ...rest} = req.body;
  
  try {
    
  } catch (error) {
    
  }

}


//CLIENT FUNCTIONS
