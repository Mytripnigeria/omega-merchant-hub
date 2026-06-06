import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, Building2, Store, User, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string; icon: React.ElementType }[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {steps.map((step, index) => {
      const Icon = step.icon;
      const isCompleted = index < currentStep;
      const isCurrent = index === currentStep;
      
      return (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors",
              isCompleted && "bg-primary border-primary",
              isCurrent && "border-primary bg-primary/10",
              !isCompleted && !isCurrent && "border-muted-foreground/30"
            )}
          >
            {isCompleted ? (
              <Check className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Icon className={cn(
                "h-5 w-5",
                isCurrent ? "text-primary" : "text-muted-foreground/50"
              )} />
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-12 h-0.5 mx-2",
              index < currentStep ? "bg-primary" : "bg-muted-foreground/20"
            )} />
          )}
        </div>
      );
    })}
  </div>
);

const steps = [
  { label: "Account", icon: User },
  { label: "Business", icon: Building2 },
  { label: "Store", icon: Store },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Account data
  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  
  // Business data
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    country: "Nigeria",
    currency: "NGN",
  });
  
  // Store data
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeAddress: "",
    storeCity: "",
    storeState: "",
    storePhone: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // POST /auth/admin/register creates business + admin + first store in
      // one transaction and returns admin tokens. AuthContext sets the admin;
      // tokenStorage.setToken fires AUTH_CHANGED_EVENT so StoreContext refetches
      // and selects the new store. By the time we land on /dashboard the
      // store dropdown is populated.
      await register({
        fullName: accountData.fullName.trim(),
        email: accountData.email.trim(),
        password: accountData.password,
        phone: accountData.phone.trim() || undefined,
        businessName: businessData.businessName.trim(),
        businessType: businessData.businessType || undefined,
        businessDescription: businessData.description.trim() || undefined,
        country: businessData.country || undefined,
        currency: businessData.currency || undefined,
        storeName: storeData.storeName.trim(),
        storeAddress: storeData.storeAddress.trim(),
        storeCity: storeData.storeCity.trim() || undefined,
        storeState: storeData.storeState.trim() || undefined,
        storePhone: storeData.storePhone.trim() || undefined,
      });
      toast.success("Welcome to OMEGA — your account is ready.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't create your account",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return accountData.fullName && accountData.email && accountData.password;
      case 1:
        return businessData.businessName && businessData.businessType;
      case 2:
        return storeData.storeName && storeData.storeAddress;
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <span className="text-2xl font-bold text-background">Ω</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Step Content */}
        <div className="rounded-xl border border-border bg-card p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1">Start by setting up your personal details</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={accountData.fullName}
                  onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={accountData.password}
                  onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={accountData.phone}
                  onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                  placeholder="+234 801 234 5678"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Register your business</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us about your business</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessData.businessName}
                  onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  placeholder="Omega Restaurant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={businessData.businessType}
                  onValueChange={(value) => setBusinessData({ ...businessData, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe / Coffee Shop</SelectItem>
                    <SelectItem value="fast-food">Fast Food</SelectItem>
                    <SelectItem value="bar">Bar / Lounge</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="catering">Catering Service</SelectItem>
                    <SelectItem value="food-truck">Food Truck</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  placeholder="Brief description of your business..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={businessData.country}
                    onValueChange={(value) => setBusinessData({ ...businessData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={businessData.currency}
                    onValueChange={(value) => setBusinessData({ ...businessData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                      <SelectItem value="KES">KES (KSh)</SelectItem>
                      <SelectItem value="ZAR">ZAR (R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Add your first store</h2>
                <p className="text-sm text-muted-foreground mt-1">Where is your business located?</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeData.storeName}
                  onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  placeholder="Main Branch"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Street Address</Label>
                <Input
                  id="storeAddress"
                  value={storeData.storeAddress}
                  onChange={(e) => setStoreData({ ...storeData, storeAddress: e.target.value })}
                  placeholder="15 Admiralty Way"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeCity">City</Label>
                  <Input
                    id="storeCity"
                    value={storeData.storeCity}
                    onChange={(e) => setStoreData({ ...storeData, storeCity: e.target.value })}
                    placeholder="Lekki"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeState">State</Label>
                  <Input
                    id="storeState"
                    value={storeData.storeState}
                    onChange={(e) => setStoreData({ ...storeData, storeState: e.target.value })}
                    placeholder="Lagos"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone (optional)</Label>
                <Input
                  id="storePhone"
                  type="tel"
                  value={storeData.storePhone}
                  onChange={(e) => setStoreData({ ...storeData, storePhone: e.target.value })}
                  placeholder="+234 801 234 5678"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-border">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mt-4">
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: <span className="text-foreground font-medium">{steps[currentStep].label}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
