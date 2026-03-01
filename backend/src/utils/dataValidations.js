import validator from 'validator'
import bcrypt from "bcrypt";

export const validateSignupData = (data)=>{
    const { full_name, username, email, password } = data;
    if(!full_name || full_name.length === 0) throw new Error("Full name is required");
    if(!username || username.length === 0) throw new Error("Username name is required");
    if(!validator.isEmail(email)) throw new Error("Invalid email address");
    if(!validator.isStrongPassword(password)) throw new Error("Enter strong password");
    if(password.length > 20) throw new Error("Password in too large");
}

export const validatePassword = async (password, hashPassword)=>{
   const res =  await bcrypt.compare(password, hashPassword);
   return res;
}