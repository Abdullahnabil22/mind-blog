import { useSettingsStore } from "../../../stores";
import { useAuth } from "../../../stores/useAuthStore";
import { Button } from "../../ui/button";
import { BiLogOut } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export function SignOut({ iconVersion = false }) {
  const { signOut } = useAuth();
  const { theme } = useSettingsStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {iconVersion ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`cursor-pointer rounded-full p-1.5 transition-all transform  focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  theme === "light"
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400"
                    : "bg-amber-100 hover:bg-[#000E07] text-[#000E07] hover:text-amber-100 focus:ring-gray-600"
                }`}
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <BiLogOut size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Button
          className=" cursor-pointer bg-green-500 hover:bg-green-800 text-amber-100"
          onClick={handleSignOut}
          variant={"destructive"}
        >
          Sign Out
        </Button>
      )}
    </>
  );
}
