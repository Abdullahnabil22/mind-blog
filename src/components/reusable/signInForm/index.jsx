import { useState } from "react";
import { useAuth } from "../../../stores/useAuthStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useSettingsStore } from "../../../stores";

export function SignInForm() {
  const { signIn, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(loginData);
      toast.success("Login successful!", {
        style: {
          color: "#05DF72",
          fontWeight: "bold",
          border: "2px solid #05DF72",
        },
      });
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Login failed", {
        style: {
          color: "#FF0000",
          fontWeight: "bold",
          border: "2px solid #FF0000",
        },
      });
    }
  };
  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className={theme === "dark" ? "text-gray-200" : ""}>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={loginData.email}
            onChange={handleLoginChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={theme === "dark" ? "text-gray-200" : ""}>Password</Label>
            <a href="#" className="text-xs text-green-500 hover:text-green-400">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={loginData.password}
            onChange={handleLoginChange}
            className={theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400" : ""}
          />
        </div>

        {error && (
          <Alert
            variant="destructive"
            className={theme === "dark" ? "bg-red-900/20 text-red-400 border-red-800" : "bg-red-50 text-red-600 border-red-200"}
          >
            <AlertDescription>{error.message}</AlertDescription>
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </>
  );
}
