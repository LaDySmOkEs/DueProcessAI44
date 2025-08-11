import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { createStripePortalSession } from "@/functions/createStripePortalSession";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useLocation } from 'react-router-dom';

export default function Billing() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portalLoading, setPortalLoading] = useState(false);
    const { toast } = useToast();
    const location = useLocation();

    useEffect(() => {
        // Load Stripe pricing table script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://js.stripe.com/v3/pricing-table.js';
        document.head.appendChild(script);

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const userData = await User.me();
                setUser(userData);
                
                // Check for success message from Stripe
                const query = new URLSearchParams(location.search);
                if (query.get("session_id")) {
                    toast({
                        title: "Subscription Successful!",
                        description: "Your plan has been updated. Welcome aboard!",
                    });
                }
            } catch (error) {
                console.error("Failed to load user:", error);
                setError("Failed to load user data. Please refresh the page.");
                toast({
                    title: "Error Loading User Data",
                    description: "Please refresh the page or try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();

        // Cleanup script on unmount
        return () => {
            const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]');
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, [location.search, toast]);

    const handleManageSubscription = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "User data not loaded. Please refresh the page.",
                variant: "destructive"
            });
            return;
        }

        setPortalLoading(true);
        try {
            const response = await createStripePortalSession();
            
            if (response && response.data && response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("No portal URL received from server");
            }
        } catch (error) {
            console.error("Portal session error:", error);
            toast({
                title: "Error",
                description: "Could not open subscription management. Please try again.",
                variant: "destructive",
            });
        } finally {
            setPortalLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-600">Loading billing information...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load Billing</h1>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">Please Log In</h1>
                        <p className="text-slate-600 mb-6">You need to be logged in to view billing information.</p>
                        <Button onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    const currentTier = user.subscription_tier || 'free';
    const hasActiveSubscription = user.stripe_customer_id && currentTier !== 'free';

    return (
        <div className="p-6 space-y-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900">Subscription & Billing</h1>
                    </div>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Choose the right plan to unlock powerful AI legal tools and defend your rights effectively.
                    </p>
                </div>

                {/* Current Plan Status */}
                <Card className="mb-8 border-0 shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Current Plan Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge variant="outline" className="mb-2">
                                    Current Plan: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                                </Badge>
                                <p className="text-sm text-slate-600">
                                    {currentTier === 'free' 
                                        ? 'You are currently on the free plan with 5 AI operations per month.'
                                        : 'You have an active subscription with full access to AI features.'
                                    }
                                </p>
                            </div>
                            {hasActiveSubscription && (
                                <Button 
                                    onClick={handleManageSubscription} 
                                    variant="outline"
                                    disabled={portalLoading}
                                >
                                    {portalLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                    )}
                                    Manage Subscription
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stripe Pricing Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
                        Available Plans
                    </h2>
                    <div 
                        dangerouslySetInnerHTML={{
                            __html: `
                                <stripe-pricing-table 
                                    pricing-table-id="prctbl_1RiCDDGKH727ZIVgR6aniFBx"
                                    publishable-key="pk_live_51RNRwLGKH727ZIVgXABk6h7uFr2Qde0YyCYk4t2KmdZCcGztBMqqWqhsig6a9lhfchnkOU0yqe7PgMO9PvIdMjfL005raRDVA5"
                                    customer-email="${user.email || ''}"
                                    client-reference-id="${user.id || ''}"
                                ></stripe-pricing-table>
                            `
                        }}
                    />
                </div>

                {/* Benefits Section */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                            Why Upgrade to Premium AI Features?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1">AI Document Analysis</h4>
                                <p className="text-slate-600">Instantly identify legal issues, inconsistencies, and violations in any document.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-5 h-5 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1">Legal Document Generation</h4>
                                <p className="text-slate-600">Generate court-ready motions, complaints, and legal correspondence with AI assistance.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-1">Strategic Case Analysis</h4>
                                <p className="text-slate-600">Get AI-powered insights on case strengths, risks, and recommended next steps.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
