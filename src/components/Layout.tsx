import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const pageTitleMap: Record<string, string> = {
  "/admission": "人员收治",
  "/detoxification": "生理脱毒",
  "/psychological": "心理矫治",
  "/rehabilitation": "康复训练",
  "/management": "所内管理",
  "/education": "教育帮扶",
  "/release": "解除回归",
};

export default function Layout() {
  const location = useLocation();
  const title = pageTitleMap[location.pathname] || "戒毒所管理系统";

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
