import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export const GET = async (request: NextRequest) => {
    //TODO: use this in all other routes

    // if(request.method !== "GET"){
    //     return NextResponse.json({
    //         success: false,
    //         message: 'Method not allowed'
    //     },{
    //         status: 405
    //     })
    // }

    
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json({
                success: false,
                error: usernameErrors[0],
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            },{
                status: 400
            })
        }

        const {username} = result.data;
        const existingVerifiedUsername = await UserModel.findOne({username: username, isVerified: true});

        if(existingVerifiedUsername){
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }

        return NextResponse.json({
            success: true,
            message: "Username is available"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Error checking username", error)
        return NextResponse.json({
            success: false,
            messgae: "Something went wrong while checking username"
        }, {
            status: 500
        })
    }
}