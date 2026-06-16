import { NavLink } from "react-router-dom";
import {
  UserPlus,
  Pill,
  Brain,
  Dumbbell,
  Shield,
  GraduationCap,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { path: "/admission", label: "人员收治", icon: UserPlus },
  { path: "/detoxification", label: "生理脱毒", icon: Pill },
  { path: "/psychological", label: "心理矫治", icon: Brain },
  { path: "/rehabilitation", label: "康复训练", icon: Dumbbell },
  { path: "/management", label: "所内管理", icon: Shield },
  { path: "/education", label: "教育帮扶", icon: GraduationCap },
  { path: "/release", label: "解除回归", icon: LogOut },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-police-900 text-white min-h-screen flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-police-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-police-300" />
          <div>
            <h1 className="text-base font-semibold tracking-wide">戒毒所管理系统</h1>
            <p className="text-xs text-police-400">强制隔离戒毒</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-item-active" : "sidebar-item"
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-police-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-police-700 flex items-center justify-center">
            <span className="text-sm font-medium">警</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">王警官</p>
            <p className="text-xs text-police-400 truncate">管教民警</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
