import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] p-4 text-center bg-gradient-to-br from-green-50 to-green-200  -mt-15">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
          <p className="text-gray-600 mb-4">
            We've sent a verification link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your inbox and click the verification link to complete
            your registration. If you don't see the email, check your spam
            folder.
          </p>
          <Button
            onClick={() => (window.location.href = "https://mail.google.com")}
            className="w-full cursor-pointer bg-green-400 hover:bg-green-700 "
          >
            Open Email App
          </Button>
        </div>
      </div>
    </div>
  );
}
