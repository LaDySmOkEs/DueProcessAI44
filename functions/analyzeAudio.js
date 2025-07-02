import { createClient } from 'npm:@base44/sdk@0.1.0';
import OpenAI from 'npm:openai';

const base44 = createClient({ appId: Deno.env.get('BASE44_APP_ID') });

const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_AUDIO_API_KEY"),
});

// Helper to fetch file as blob
async function fetchFileAsBlob(fileUrl) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    return response.blob();
}

Deno.serve(async (req) => {
    const { file_url, file_name, case_context, user_notes } = await req.json();

    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response('Unauthorized', { status: 401 });
        base44.auth.setToken(authHeader.split(' ')[1]);
        const user = await base44.auth.me();
        if (!user) return new Response('User not found', { status: 404 });

        const fileBlob = await fetchFileAsBlob(file_url);
        const fileForUpload = new File([fileBlob], file_name || 'audio.m4a', { type: fileBlob.type });

        // Step 1: Transcribe with Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: fileForUpload,
            model: "whisper-1",
            response_format: "verbose_json"
        });

        const fullTranscriptText = transcription.text;
        const transcriptDuration = transcription.duration;

        // Step 2: Analyze transcript with GPT-4
        const analysisPrompt = `
        You are a constitutional law expert and civil rights attorney. Analyze the following audio transcript for due process violations, police misconduct, and potential legal issues.

        Case Context: ${case_context}
        User Notes: ${user_notes}
        Full Transcript:
        ---
        ${fullTranscriptText}
        ---

        Provide a concise but comprehensive analysis covering:
        - Summary of key events and statements.
        - Identification of any potential constitutional violations (e.g., 4th, 5th, 6th Amendment issues, illegal search, coerced statements).
        - Assessment of police procedure and conduct.
        - Recommendations for next steps.
        `;

        const analysisResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: analysisPrompt }]
        });
        
        const analysisResult = analysisResponse.choices[0].message.content;

        return new Response(JSON.stringify({
            success: true,
            transcript: {
                full_text: fullTranscriptText,
                duration: transcriptDuration,
                segments: transcription.segments
            },
            analysis: {
                summary: analysisResult,
                processing_method: "Whisper-1 + GPT-4 Turbo"
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Audio Analysis Error:', error);
        
        let errorMessage = "An unexpected error occurred during audio processing.";
        let fallbackAnalysis = null;
        
        // Check for specific OpenAI quota error
        if (error.response && error.response.status === 429) {
            errorMessage = "OpenAI quota exceeded. Could not transcribe audio.";
            fallbackAnalysis = {
                message: "Audio file has been saved, but transcription and analysis failed because your OpenAI account has reached its spending limit.",
                recommendations: "Please check your OpenAI billing and account settings to resolve this issue."
            };
        } else if (error.message) {
            errorMessage = error.message;
        }

        return new Response(JSON.stringify({
            success: false,
            error: errorMessage,
            fallback_analysis: fallbackAnalysis
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
functions/createCheckoutSession.js
import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@^14';

const base44 = createClient({ appId: Deno.env.get('BASE44_APP_ID') });
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const { priceId } = await req.json();
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response('Unauthorized', { status: 401 });

        base44.auth.setToken(authHeader.split(' ')[1]);
        const user = await base44.auth.me();
        if (!user) return new Response('User not found', { status: 404 });

        let stripeCustomerId = user.stripe_customer_id;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.full_name,
                metadata: { base44_user_id: user.id },
            });
            stripeCustomerId = customer.id;
            await base44.entities.User.update(user.id, { stripe_customer_id: stripeCustomerId });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: stripeCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${req.headers.get('origin')}/Billing?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/Billing`,
            metadata: { base44_user_id: user.id }
        });

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
functions/createStripePortalSession.js
import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@^14';

const base44 = createClient({ appId: Deno.env.get('BASE44_APP_ID') });
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response('Unauthorized', { status: 401 });

        base44.auth.setToken(authHeader.split(' ')[1]);
        const user = await base44.auth.me();
        if (!user || !user.stripe_customer_id) {
            return new Response('User or Stripe customer not found', { status: 404 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripe_customer_id,
            return_url: `${req.headers.get('origin')}/Billing`,
        });

        return new Response(JSON.stringify({ url: portalSession.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Stripe Portal Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
functions/stripeWebhook.js
import { createClient } from 'npm:@base44/sdk@0.1.0';
import Stripe from 'npm:stripe@^14';

const base44 = createClient({ appId: Deno.env.get('BASE44_APP_ID') });
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    try {
        const event = await stripe.webhooks.constructEvent(body, signature, webhookSecret);
        const session = event.data.object;
        const userId = session.metadata?.base44_user_id;

        if (!userId) {
            console.error("Webhook received without base44_user_id in metadata");
            return new Response('User ID missing', { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            await base44.entities.User.update(userId, {
                stripe_customer_id: session.customer,
                stripe_subscription_id: subscription.id,
                subscription_status: subscription.status,
                subscription_tier: subscription.items.data[0].price.lookup_key,
                last_usage_reset: new Date().toISOString(),
                ai_usage_count: 0
            });
        }

        if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            await base44.entities.User.update(userId, {
                subscription_status: subscription.status,
                subscription_tier: subscription.items.data.length > 0 ? subscription.items.data[0].price.lookup_key : 'free'
            });
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 });

    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
});
