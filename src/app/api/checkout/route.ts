import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
});

export async function POST(request: Request) {
    try {
        const { courseId, courseTitle, price, userId, userEmail, origin } = await request.json();

        if (!courseId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a PaymentIntent instead of a Session
        // 1. Find or create customer
        // Note: For MVP we might skip customer searching to avoid complexity, but it's good practice.
        // Let's just create an intent. Guest customers are fine for PaymentIntents.

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price * 100),
            currency: 'brl',
            payment_method_types: ['card', 'pix'],
            metadata: {
                userId: userId,
                courseId: courseId.toString(),
                userEmail: userEmail,
            },
            description: `Course: ${courseTitle}`,
            // receipt_email: userEmail, // Optional
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
