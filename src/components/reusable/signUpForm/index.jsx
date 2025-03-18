import { useState } from "react";
import { useAuth } from "../../../stores/useAuthStore";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useSettingsStore } from "../../../stores";

export function SignUpForm() {
  const { signUp, isLoading, error } = useAuth();
  const [validationError, setValidationError] = useState(null);
  const { theme } = useSettingsStore();
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      const { needsEmailConfirmation } = await signUp({
        email: signupData.email,
        password: signupData.password,
        username: signupData.username,
      });

      if (needsEmailConfirmation) {
        navigate("/", {
          state: { email: signupData.email },
          replace: true,
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.message || "Sign up failed");
    }
  };
  return (
    <>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className={theme === "dark" ? "text-gray-200" : ""}>Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={signupData.email}
            onChange={handleSignupChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className={theme === "dark" ? "text-gray-200" : ""}>Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Michael Scott"
            required
            value={signupData.username}
            onChange={handleSignupChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className={theme === "dark" ? "text-gray-200" : ""}>Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={signupData.password}
            onChange={handleSignupChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className={theme === "dark" ? "text-gray-200" : ""}>Confirm Password</Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        {(error || validationError) && (
          <Alert
            variant="destructive"
            className={theme === "dark" ? "bg-red-900/20 text-red-400 border-red-800" : "bg-red-50 text-red-600 border-red-200"}
          >
            <AlertDescription>
              {validationError || error.message}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full cursor-pointer bg-green-400 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </>
  );
}
