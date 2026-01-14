import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-card p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">OMEGA OS</h1>
            <p className="text-xs text-muted-foreground">Merchant Dashboard</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Start managing your <br />
              <span className="text-gradient">business today</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Join thousands of businesses using OMEGA OS to streamline their operations.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-foreground">2,500+</p>
              <p className="text-sm text-muted-foreground">Active businesses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">₦50B+</p>
              <p className="text-sm text-muted-foreground">Transactions processed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          © 2026 OMEGA OS. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">OMEGA OS</h1>
              <p className="text-xs text-muted-foreground">Merchant Dashboard</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              1
            </div>
            <div className="h-0.5 flex-1 bg-border">
              <div className={`h-full bg-primary transition-all ${step === 2 ? "w-full" : "w-0"}`} />
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {step === 1 ? "Create your account" : "Business details"}
            </h2>
            <p className="text-muted-foreground">
              {step === 1 
                ? "Enter your personal information to get started" 
                : "Tell us about your business"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Adaeze"
                      className="h-12 bg-muted"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Okonkwo"
                      className="h-12 bg-muted"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@business.com"
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 bg-muted pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with numbers and symbols
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <Input
                    id="businessName"
                    placeholder="Toasty Kitchen"
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business type</Label>
                  <Input
                    id="businessType"
                    placeholder="Restaurant, Cafe, etc."
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business address</Label>
                  <Input
                    id="address"
                    placeholder="15 Admiralty Way, Lekki Phase 1"
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeName">First store/location name</Label>
                  <Input
                    id="storeName"
                    placeholder="e.g., Lekki Phase 1"
                    className="h-12 bg-muted"
                    required
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" className="mt-1" required />
                  <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="h-12 w-full gradient-primary text-primary-foreground hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : step === 1 ? (
                "Continue"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
