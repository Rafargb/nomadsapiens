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

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'pix'],
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: courseTitle,
                            images: ['https://nomadsapiens.com/logo.png'],
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            ui_mode: 'embedded', // Embedded Checkout
            return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                userId: userId,
                courseId: courseId.toString(),
            },
        } as any);

        return NextResponse.json({ clientSecret: session.client_secret });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
