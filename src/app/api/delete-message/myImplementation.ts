import { User, getServerSession } from "next-auth";
import UserModel from "@/model/User";
import {NextRequest, NextResponse} from 'next/server'
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {
   await dbConnect();
   try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if(!session || !user){
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }

  
    const {messageId} = await req.json(); 

    await UserModel.findByIdAndUpdate(user._id, {
        $pull: {
            messages: {
                _id: messageId
            }

        }
    })

    return NextResponse.json({
        success: true,
        message: "Message deleted successfully"
    }, {
        status: 200
    })
    
   } catch (error) {
    return NextResponse.json({
        success: false,
        message: "Something went wrong while deleting the message"
    }, {
        status: 500
    })
   }

}