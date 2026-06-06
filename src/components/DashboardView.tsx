import React from 'react';
import { 
  Users, 
  Activity, 
  Thermometer, 
  Wind, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Chicken, Telemetry, Alert } from '../types';
import FarmSimulator from './FarmSimulator';
import FlockAICopilot from './FlockAICopilot';

interface DashboardViewProps {
  chickens: Chicken[];
  setChickens: React.Dispatch<React.SetStateAction<Chicken[]>>;
  telemetry: Telemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<Telemetry>>;
  alerts: Alert[];
  triggerAlert: (category: 'health' | 'environment', message: string, severity: 'critical' | 'warning') => void;
  selectedChicken: Chicken | null;
  setSelectedChicken: (chicken: Chicken | null) => void;
}

export default function DashboardView({
  chickens,
  setChickens,
  telemetry,
  setTelemetry,
  alerts,
  triggerAlert,
  selectedChicken,
  setSelectedChicken
}: DashboardViewProps) {
  // Real-time sensor graph data
  const graphData = [
    { hour: '00:00', activity: 48, temp: 26.1, ammonia: 11 },
    { hour: '04:00', activity: 38, temp: 25.4, ammonia: 12 },
    { hour: '08:00', activity: 72, temp: 27.8, ammonia: 10 },
    { hour: '12:00', activity: telemetry.avgMovementIndex || 68, temp: telemetry.temperature, ammonia: telemetry.ammoniaLevel },
    { hour: '16:00', activity: 65, temp: 29.2, ammonia: 13 },
    { hour: '20:00', activity: 50, temp: 27.5, ammonia: 11 },
  ];

  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* 4 Telemetry Stats cards */}
      <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Chickens */}
        <div id="card-total-chickens" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="space-y-1.5 z-10">
            <span className="text-xs text-slate-400 font-sans">จำนวนไก่วิเคราะห์สะสม (AI Scan)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100 font-mono">{chickens.length}</span>
              <span className="text-xs text-emerald-400 font-mono">ตัวในฝูง</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              ทำงานประสานงาน {telemetry.activeCount} ปกติ, {telemetry.inactiveCount} อิดโรย
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 z-10 shadow-sm shadow-emerald-550/10">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Movement Activity Index */}
        <div id="card-activity-index" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="space-y-1.5 z-10">
            <span className="text-xs text-slate-400 font-sans">ดัชนีระดับกิจกรรมการเดิน</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100 font-mono">{telemetry.avgMovementIndex}%</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-550/20 shadow-sm">
                {telemetry.avgMovementIndex > 65 ? 'กระฉับกระเฉง' : telemetry.avgMovementIndex > 40 ? 'ปานกลาง' : 'ควรเฝ้าระวัง'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">คำนวณผ่านทิศทางและการเคลื่อนที่ของไก่</p>
          </div>
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 z-10">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Temperature */}
        <div id="card-temperature" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="space-y-1.5 z-10">
            <span className="text-xs text-slate-400 font-sans">อุณหภูมิโรงเรือน (IoT Node)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100 font-mono">{telemetry.temperature}°C</span>
              <span className="text-xs text-slate-400 font-mono">RH: {telemetry.humidity}%</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              ควบคุมพัดลมอัตโนมัติ: <span className="text-emerald-400 font-semibold font-mono">AUTO</span>
            </p>
          </div>
          <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 z-10">
            <Thermometer className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Ammonia level */}
        <div id="card-ammonia" className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/10 transition-colors"></div>
          <div className="space-y-1.5 z-10">
            <span className="text-xs text-slate-400 font-sans">แก๊สแอมโมเนียจากแกลบ (NH3)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100 font-mono">{telemetry.ammoniaLevel}</span>
              <span className="text-xs text-slate-400 font-mono">ppm</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${telemetry.ammoniaLevel > 18 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {telemetry.ammoniaLevel > 18 ? 'อันตราย' : 'ปลอดภัย'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">ระบบควบคุมกลิ่นและสารเติมแก๊สเปิดงาน</p>
          </div>
          <div className="p-3.5 bg-sky-500/10 text-sky-450 rounded-2xl border border-sky-500/20 z-10">
            <Wind className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Active alert flag banner */}
      {activeAlerts > 0 && (
        <div id="active-alert-banner" className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-400">พบการแจ้งเตือนความผิดปกติในโรงเรือนที่ยังไม่ได้รับการแก้ไข!</p>
              <p className="text-[10.5px] text-slate-400">ตรวจพบลักษณะกิจกรรมและอุณหภูมิผิดปกติย่อยๆ แนะนำให้เลื่อนดูข้อมูลเพิ่มเติมในแถบแจ้งเตือนด้านข้าง</p>
            </div>
          </div>
        </div>
      )}

      {/* Camera Simulator and Inspector panels */}
      <div id="farm-simulator-panel">
        <FarmSimulator 
          chickens={chickens}
          setChickens={setChickens}
          telemetry={telemetry}
          setTelemetry={setTelemetry}
          triggerAlert={triggerAlert}
          selectedChicken={selectedChicken}
          setSelectedChicken={setSelectedChicken}
        />
      </div>

      {/* AI Copilot & Real-time Recharts Graphs Section */}
      <div id="analytics-copilot-panel" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recharts Area trend chart */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-sans">ความเคลื่อนไหวย้อนหลัง 24 ชม.</h3>
                <p className="text-xs text-slate-500 font-sans">ดัชนีกิจกรรม (Activity) เทียบอุณหภูมิสิ่งแวดล้อม</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Live Sensor Feedback</span>
          </div>

          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  labelClassName="text-slate-400 font-mono"
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area 
                  name="ดัชนีกิจกรรม (Activity %)" 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorActivity)" 
                  strokeWidth={2}
                />
                <Area 
                  name="อุณหภูมิโรงเรือน (°C)" 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#f59e0b" 
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-500 font-sans pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span>ดัชนีกิจกรรมไก่ (Activity)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span>อุณหภูมิสิ่งแวดล้อม (°C)</span>
            </div>
          </div>
        </div>

        {/* AI Copilot chat tool */}
        <FlockAICopilot 
          telemetry={telemetry} 
          alerts={alerts} 
          chickensCount={chickens.length} 
        />
      </div>

    </div>
  );
}
