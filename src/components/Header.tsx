import { Bell, Search, Settings, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onToggleSidebar?: () => void;
}

export default function Header({ title }: HeaderProps) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[now.getDay()];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-sm lg:hidden">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索戒毒人员..."
            className="pl-9 pr-4 py-2 w-64 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-police-500 focus:border-transparent"
          />
        </div>

        <div className="text-sm text-slate-600">
          <span>{dateStr}</span>
          <span className="mx-2 text-slate-300">|</span>
          <span>{weekday}</span>
        </div>

        <button className="relative p-2 hover:bg-slate-100 rounded-sm">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-warning-500 rounded-full"></span>
        </button>

        <button className="p-2 hover:bg-slate-100 rounded-sm">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
