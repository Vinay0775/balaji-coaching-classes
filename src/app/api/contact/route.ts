import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormMessage } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, course, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    const result = await sendContactFormMessage({
      name,
      email,
      phone,
      course,
      message,
    });

    if (result.success) {
      return NextResponse.json({ message: 'Message sent successfully' });
    } else {
      // Even if email fails, return success to user (graceful degradation)
      console.warn('[Contact API] Email send failed but returning success to user:', result.error);
      return NextResponse.json({ message: 'Message received successfully' });
    }
  } catch (error: any) {
    console.error('[Contact API] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
