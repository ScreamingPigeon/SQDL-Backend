//import TeacherRepository from "../repository/user-repository.js";
import { set } from "mongoose";
import UserRepository from "../repository/user-repository.js";

const userRepo = new UserRepository();

export const userSignup = async (req, res)=> {
    try {
        const response =await userRepo.create({
            email: req.body.email,
            name: req.body.name,
            enrollmentNumber: req.body.enrollment,
            rollNumber: req.body.rollNumber,          
            password: req.body.password,
            status: 'active',
            type: 'student' //all accounts are student if through signup page
        });
        return res.status(200).json({
            success: true,
            message:'Successfully created new user',
            data: response,
            err: {}
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong in controller",
            data: {},
            err: error
        })
    }
}

export const userLogin = async (req, res)=>{
    try {
        const user = await userRepo.findBy(req.body.email);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        else if(!user.comparePassword(req.body.password)){
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }

        const token = user.genJWT();
    
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: token,
            err: {}
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in auth layer',
            data: {},
            success: false,
            err: error
        })
    }
}




export const updateInfo = async(req, res) =>{
    try{
        //update user data
        const user = await userRepo.findByID(req.body._id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if(req.body.name!=null){
            user.name = req.body.name;
            // console.log(user.name);
        }
        if(req.body.email!=null){
            user.email = req.body.email;
            // console.log(user.email);
        }
        if(req.body.enrollmentNumber!=null){
            user.enrollmentNumber = req.body.enrollmentNumber;
            // console.log(user.enrollmentNumber);
        }
        if(req.body.rollNumber!=null){
            user.rollNumber = req.body.rollNumber;
            // console.log(user.rollNumber);
        }
        if(req.body.status!=null){
            user.status = req.body.status;
            // console.log(user.status);
        } if(req.body.type!=null){
            user.type = req.body.type;
            // console.log(user.type);
        }

        const updateUser = await user.save();
        console.log('updated')
        return res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updateUser,
            err: {}
        })

    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
}

export const get = async(req, res)=>{
    try {
        const {email} = req.query;

        const user = await userRepo.findBy(email);

        return res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: user,
            err:{}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
}
export const getByID = async(req, res)=>{
    try {
        const {_id} = req.body;
        const user = await userRepo.findByID(_id);

        return res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: user,
            err:{}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in querying user information',
            data: {},
            success: false,
            err: error
        })
    }
}

export const getAlluser = async (req, res)=>{

    try {
        console.log(req.query);
        const {offset, limit} = req.query;
        console.log(offset, limit);
        const users =await userRepo.getAll(parseInt(offset), parseInt(limit));
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
            err: {}
          });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in editing user information',
            data: {},
            success: false,
            err: error
        })
    }
   
}