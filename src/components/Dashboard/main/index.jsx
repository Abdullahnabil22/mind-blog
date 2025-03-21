import { FaBrain } from "react-icons/fa6";
import { useTheme } from "../../../hooks/useTheme";

export function Dashboard() {
  const { isDark } = useTheme();
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="flex justify-center items-center mb-6">
          <FaBrain size={40} className="text-green-500 mr-3" />
          <p
            className={`text-lg md:text-3xl lg:text-4xl font-bold ${
              isDark ? "text-amber-100" : "text-black"
            }`}
          >
            Mind <span className="text-green-500">Blog</span>
          </p>
        </div>
        <p className="text-lg md:text-3xl lg:text-4xl font-bold text-green-500">
          Capture your notes and ideas 📝
        </p>
        <p className="text-lg md:text-3xl lg:text-4xl font-bold text-center p-2 mt-0.5 text-green-500">
          To get started, click on the sidebar and create a new note or folder.
        </p>
      </div>
    </>
  );
}

export default Dashboard;
