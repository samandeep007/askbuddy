import dbConnect from "@/lib/dbConnect";
import {NextRequest, NextResponse} from 'next/server';
import UserModel  from "@/model/User";
import bcrypt from 'bcrypt';

dbConnect();

export const POST = async(request: NextRequest) => {
    try {
        const reqBody = await request.json();
        const{username, email, password} = reqBody;

        const userExists = await UserModel.findOne({email: email, username: username})

        if(userExists){
            if(userExists.isVerified){
                return NextResponse.json({
                    status: 400,
                    success: false,
                    message: "User with these credentials already exist"
                })
            }
            else {
                await bcrypt.hash(password, 10).then(result => userExists.password = result);
                userExists.verifyCode = String(Math.floor(Math.random()*1000000 + 1))
                const savedUser = await userExists.save({validateBeforeSave: false});

                return NextResponse.json({
                    success: true,
                    status: 200,
                    data: savedUser,
                    message: "User updated successfully"
                })
            }
        }
        else {

            const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
            

            const newUser = new UserModel({
                username: username,
                email: email,
                password: encryptedPassword,
                verifyCode:Math.floor(Math.random()*1000000),
                verifyCodeExpiry: Date.now() + 3600000
            })

            const savedUser = await newUser.save()
            return NextResponse.json({
                success: true,
                status: 200,
                data: savedUser,
                message: "User signed-up successfully",
             

            })
        }

        
    } catch (error:any) {
        throw NextResponse.json({
            status: 400,
            success: false,
            message: error.message
        })
    }
}

