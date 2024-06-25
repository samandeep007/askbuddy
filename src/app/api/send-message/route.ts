import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {NextRequest, NextResponse} from 'next/server';
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/User";



export const POST = async(request: NextRequest) => {
    await dbConnect();

    try {
        const {username, content} = await request.json();
        const result = messageSchema.safeParse({content: content});
        if(!result.success){
            return NextResponse.json({
                success: false,
                message: result?.error.issues[0].message
            },
            {
                status: 401
            }
        )
        }

        const user = await UserModel.findOne({username: username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const message = {content: content, createdAt: new Date()}
        user.messages.push( message as Message);
        await user.save({validateBeforeSave: false})

        return NextResponse.json({
            success: true,
            message: "Message sent successfully!"
        }, {
            status: 200
        })

    } catch (error) {
        console.log("Something went wrong while sending the message");
        return NextResponse.json({
            success: false,
            message: "Something went wrong while sending the message",
        }, {
            status: 500
        })
    }
}
