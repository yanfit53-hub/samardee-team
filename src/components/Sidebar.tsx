import { 
  LayoutDashboard, 
  BellRing, 
  FilePieChart, 
  Settings, 
  Activity, 
  Disc, 
  Wifi, 
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  activeAlerts: number;
  chickenHealthScore: number;
}

export default function Sidebar({ currentTab, setTab, activeAlerts, chickenHealthScore }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'หน้าแดชบอร์ด', icon: LayoutDashboard },
    { id: 'alerts', label: 'การแจ้งเตือน', icon: BellRing, badge: activeAlerts > 0 ? activeAlerts : undefined },
    { id: 'reports', label: 'รายงานวิเคราะห์', icon: FilePieChart },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  return (
    <div id="sidebar-container" className="w-80 bg-[#0f172a] border-r border-slate-800/80 text-slate-200 flex flex-col h-screen overflow-y-auto">
      {/* Title Header */}
      <div id="sidebar-header" className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight text-white flex items-center gap-2">
              Smart Poultry AI
            </h1>
            <p className="text-xs text-slate-400 font-mono">IoT Live Farm System</p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav id="sidebar-navigation" className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-4 border-emerald-500 border-y-0 border-r-0 rounded-r-xl rounded-l-none font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <div className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500 text-slate-950 rounded-full animate-bounce">
                  {item.badge}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Real-time Health Monitor Gauge */}
      <div id="sidebar-health-gauge" className="p-5 m-4 bg-[#020617] rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">ดัชนีสุขภาพไก่เฉลี่ย (Flock Health Index)</span>
          <span className="text-xs text-emerald-400 font-mono font-bold">{chickenHealthScore}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${chickenHealthScore}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              chickenHealthScore > 85 
                ? 'bg-emerald-500' 
                : chickenHealthScore > 65 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
            Live Analytics
          </span>
          <span>วิเคราะห์โดย AI</span>
        </div>
      </div>

      {/* Connected hardware status */}
      <div id="sidebar-hardware-status" className="p-5 border-t border-slate-800/60 text-xs text-slate-400 space-y-2.5 bg-slate-950/20">
        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">สถานะการเชื่อมต่อ ฮาร์ดแวร์ IoT</div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Disc className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
            <span>IP Camera - โรงเรือน 1</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 shadow-sm">ONLINE</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>เซ็นเซอร์แอมโมเนีย NH3</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 shadow-sm">ONLINE</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>เซ็นเซอร์อุณหภูมิ/ความชื้น</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 shadow-sm">ONLINE</span>
        </div>
      </div>
    </div>
  )
}
