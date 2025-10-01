import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, positionId, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are an AI assistant helping with job application reviews. You have access to the following context:

Position ID: ${positionId || 'Not provided'}
Context: ${context || 'No additional context'}

You should help with:
- Analyzing applicant qualifications
- Comparing candidates
- Suggesting interview questions
- Providing insights on application quality
- Helping with decision-making

Keep responses concise, helpful, and professional. Focus on actionable insights.`;

    const prompt = `${systemPrompt}\n\nUser question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
