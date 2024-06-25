import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

/*
IF existingUserByEmail EXISTS THEN
   IF existingUserByEmail.isVerified IS TRUE THEN
        RETURN 400, { success: false, message: 'User already exist with this email' }
    ELSE
        SET existingUserByEmail.password TO hashedPassword
        SET existingUserByEmail.verifyCode TO verifyCode
        SET existingUserByEmail.verifyCodeExpiry TO new Date(Date.now() + 3600000)
        CALL existingUserByEmail.save({ validateBeforeSave: false })
ELSE
    SET hashedPassword TO bcrypt.hash(password, 10)
    SET expiryDate TO new Date()
    CALL expiryDate.setHours(expiryDate.getHours() + 1)
    CREATE newUser WITH {
        username: username,
        email: email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate
    }
    CALL newUser.save()
END IF  
 */

export const POST = async (request: Request) => {
    await dbConnect();

    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        const userExists = await UserModel.findOne({
            email: email,
            username: username,
        });

        if (userExists) {
            if (userExists.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User with these credentials already exist",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                await bcrypt
                    .hash(password, 10)
                    .then((result) => (userExists.password = result));
                userExists.verifyCode = String(Math.floor(Math.random() * 1000000 + 1));
                const savedUser = await userExists.save({ validateBeforeSave: false });

                return Response.json(
                    {
                        success: true,
                        data: savedUser,
                        message: "User updated successfully",
                    },
                    {
                        status: 200,
                    }
                );
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({
                username: username,
                email: email,
                password: encryptedPassword,
                verifyCode: Math.floor(Math.random() * 1000000),
                verifyCodeExpiry: Date.now() + 3600000,
            });

            const savedUser = await newUser.save();
            return Response.json(
                {
                    success: true,
                    data: savedUser,
                    message: "User signed-up successfully",
                },
                {
                    status: 200,
                }
            );
        }
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
