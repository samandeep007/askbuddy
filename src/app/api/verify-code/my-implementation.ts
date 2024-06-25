import UserModel from "@/model/User";
import {NextRequest, NextResponse} from 'next/server';
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";
import {z} from 'zod';


export const POST = async(request: NextRequest) => {
    dbConnect();
    try {
        const {verifyCode} = await request.json();

        const VerificationCodeSchema = {
            code: verifyCode
        }
        const result = verifySchema.safeParse(VerificationCodeSchema);
        if(!result.success){
            return NextResponse.json({
                success: false,
                message: "Verification code must be six digits"
            },{
                status: 400
            })
        }

        const user = await UserModel.findOne({verifyCode: verifyCode, verifyCodeExpiry: {$gt: new Date() }});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }

        user.isVerified = true;
        user.verifyCode = "";
        
        await user.save({validateBeforeSave: false})

        return NextResponse.json({
            success: true,
            message: "User verified successfully"
        },{
            status: 200
        })
        
        
    } catch (error: any) {
        console.log("Something went wrong while verifying the email", error.message)
    }
}