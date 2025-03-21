import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { SignInForm } from "../reusable/signInForm";
import { SignUpForm } from "../reusable/signUpForm";
import { useTheme } from "../../hooks/useTheme";

export default function Login() {
  const navigate = useNavigate();
  const { google, gitHub } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("login");

  const handleGithub = async () => {
    try {
      await gitHub();
      navigate("/");
    } catch (err) {
      toast(err);
    }
  };

  const handleGoogle = async () => {
    try {
      await google();
      navigate("/");
    } catch (err) {
      toast(err);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 z-50 -mt-15 ${
        !isDark
          ? "bg-gradient-to-br from-green-50 to-green-200"
          : "bg-gradient-to-br from-gray-900 to-green-900"
      }`}
    >
      <div className="w-full max-w-md">
        <Card
          className={`border-none shadow-xl ${
            isDark ? "bg-gray-800 text-gray-100 mt-16 md:mt-0" : ""
          }`}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome To Mind <strong className="text-green-400">Blog</strong>
            </CardTitle>
            <CardDescription
              className={`text-center ${isDark ? "text-gray-300" : ""}`}
            >
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className={isDark ? "dark-tabs" : ""}
            >
              <TabsList
                className={`grid w-full grid-cols-2 mb-6 ${
                  isDark ? "bg-gray-700" : ""
                }`}
              >
                <TabsTrigger
                  value="login"
                  className={
                    isDark
                      ? "data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      : ""
                  }
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className={
                    isDark
                      ? "data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                      : ""
                  }
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <SignInForm />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span
                  className={`px-2 ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600 hover:text-green-500"
                    : ""
                }`}
                onClick={handleGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#05DF72"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                className={`flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600 hover:text-green-500"
                    : ""
                }`}
                onClick={handleGithub}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#05DF72"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
