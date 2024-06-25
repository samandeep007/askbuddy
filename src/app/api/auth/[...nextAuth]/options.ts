import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifer.email },
                            { username: credentials.identifer.username },
                        ],
                    });
                    if (!user) {
                        throw new Error("No user found with these credentials");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account and then try again");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (isPasswordValid) {
                        return user;
                    } else {
                        throw new Error("Incorrect Password");
                    }

                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {

        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()
            }
            return token
        },
        async session({ session, token }) {
            return session
        }      
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};
