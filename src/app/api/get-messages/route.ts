import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export const GET = async (request: NextRequest) => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not authorized"
        }, {
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const currentUser = await UserModel.findById(userId);
      


        if (!currentUser) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            })
        }
        const messages = currentUser?.messages

        if (messages.length === 0) {
            return NextResponse.json({
                success: true,
                message: "User Inbox is empty"
            },
                {
                    status: 200
                })
        }
    

        return NextResponse.json({
            success: true,
            messages: messages

        }, {
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error fetching user messages"
        }, {
            status: 500
        })
    }
}