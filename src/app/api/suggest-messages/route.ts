import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai"


const generativeModel = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {

    try {

        // Choose a model that's appropriate for your use case.
        const model = generativeModel.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'question 1||question2||question3'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Don't repeat the questions and don't ask skill questions";

        const result = await model.generateContentStream([prompt]);
        const myresponse = [];
       
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            myresponse.push(chunkText)
        }
    

        return NextResponse.json({messages: myresponse.join(" ").replaceAll('\n', "").replaceAll('\" ', "")})


    }

    catch (error) {
        return NextResponse.json({
            success: false,
            message: error
        }, {
            status: 500
        })
    }
}