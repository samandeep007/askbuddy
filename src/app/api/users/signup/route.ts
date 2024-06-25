import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request) => {
    await dbConnect();

    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email: email});

        const verifyCode = String(Math.floor(100000 + Math.random() * 900000))
        
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'User already exist with this email'
                }, {
                    status: 400
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
               existingUserByEmail.password = hashedPassword;
               existingUserByEmail.verifyCode = verifyCode;
               existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

               const savedUser = await existingUserByEmail.save({validateBeforeSave: false})
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);
    

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            const savedUser = await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify your email'
        }, {
            status: 200
        })

        
    } catch (error: any) {
        console.log();
        return Response.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 400,
            }
        );
    }
};
