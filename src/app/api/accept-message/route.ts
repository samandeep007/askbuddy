import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextAuth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from 'next/server'


export const POST = async (request: NextRequest) => {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            $set: {
                isAcceptingMessages: acceptMessages
            }
        }, { new: true })

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "User doesn't exist"
            }, {
                status: 404
            })
        }

        else {
            return NextResponse.json({
                success: true,
                message: "Update user status to accept messages successful"
            }, {
                status: 200
            })
        }

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return NextResponse.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, {
            status: 500
        })
    }
}


export const GET = async(request: NextRequest) => {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Not authorized"
        }, {
            status: 401
        })
    }

    const userId = user._id;
    try{
        const currentUser = await UserModel.findById(userId);
        if(!currentUser){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        else {
            return NextResponse.json({
                success: true,
                message: `User is ${currentUser.isAcceptingMessage ? "" : "not"} accepting messages`,
                isAcceptingMessages: currentUser.isAcceptingMessage
            }, {
                status: 200
            })
        }
    } catch(error){
        console.log("Something went wrong while fetching user message accepting status")
        return NextResponse.json({
            success: false,
            message: "Something went wrong while fetching user message accepting status"
        }, {
            status: 500
        })
    }

}