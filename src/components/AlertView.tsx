import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Search, 
  Trash2, 
  Plus, 
  Camera,
  Play,
  Check,
  Disc
} from 'lucide-react';
import { Alert, AlertSeverity, AlertCategory } from '../types';

interface AlertViewProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  triggerAlert: (category: AlertCategory, message: string, severity: AlertSeverity) => void;
}

export default function AlertView({ alerts, setAlerts, triggerAlert }: AlertViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSnapshotUrl, setActiveSnapshotUrl] = useState<string | null>(null);
  const [activeSnapshotText, setActiveSnapshotText] = useState<string>('');

  const resolveAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a)
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const resolveAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, status: 'resolved' as const })));
  };

  const filteredAlerts = alerts
    .filter(a => filterSeverity === 'all' || a.severity === filterSeverity)
    .filter(a => a.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 a.location.toLowerCase().includes(searchTerm.toLowerCase()))
    // Sort latest first
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Function to show visual mockup overlay of the camera event
  const showSnapshotOverlay = (alert: Alert) => {
    // Generate simulated canvas details or custom icons to represent the captured camera picture of that moment
    setActiveSnapshotText(alert.message);
    setActiveSnapshotUrl(`https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80`); // Chicken farm image fallback
  };

  return (
    <div id="alert-view" className="space-y-6">
      {/* Search and control Header */}
      <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-100 font-sans">บันทึกประวัติการแจ้งเตือนพฤติกรรม (Incident Log)</h2>
          <p className="text-xs text-slate-500 font-sans">แสดงรายการฉุกเฉินระดับวิกฤต หรือคำเตือนอัตโนมัติจากอัลกอริทึม IoT AI</p>
        </div>

        {/* Dynamic testing creator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerAlert('environment', 'ตรวจพบระดับแอมโมเนียในอากาศ (NH3) เกิน 22 ppm ส่งผลระคายเคืองต่อดวงตาไก่', 'critical')}
            className="px-2.5 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900 rounded-xl text-xs font-medium cursor-pointer"
          >
            + ลองยิงแก๊สรั่ว (Critical Test)
          </button>
          <button
            onClick={() => triggerAlert('hardware', 'สัญญาณอินเทอร์เน็ตหลุด / ไม่พบกล้อง Node #2 เป็นเวลามากกว่า 10 วินาที', 'warning')}
            className="px-2.5 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-900 rounded-xl text-xs font-medium cursor-pointer"
          >
            + ลองเครื่องหลุด (Warning Test)
          </button>
          <button
            onClick={resolveAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            แก้ไขทั้งหมด
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts listing columns */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-slate-905 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800/80 w-full sm:w-auto">
              {['all', 'critical', 'warning', 'normal'].map((sev) => (
                <button
                  id={`filter-${sev}`}
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium transition cursor-pointer capitalize ${
                    filterSeverity === sev 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sev === 'all' ? 'ทั้งหมด' : sev === 'critical' ? '🔴 วิกฤต (Critical)' : sev === 'warning' ? '🟠 เตือน (Warning)' : '🟢 ปกติ'}
                </button>
              ))}
            </div>

            {/* Live Search bar */}
            <div className="relative w-full sm:w-64">
              <input
                id="alert-search-input"
                type="text"
                placeholder="ค้นหากล่องเตือนหรือวิกฤต..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/50 font-sans"
              />
              <Search className="w-3.5 h-3.5 text-slate-550 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div
                  id={`alert-row-${alert.id}`}
                  key={alert.id}
                  className={`p-4 rounded-xl border transition flex items-start gap-4 ${
                    alert.status === 'resolved'
                      ? 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
                      : alert.severity === 'critical'
                      ? 'bg-rose-950/15 border-rose-900/60 text-slate-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-950/15 border-amber-900/60 text-slate-200'
                      : 'bg-emerald-950/15 border-emerald-900/65 text-slate-200'
                  }`}
                >
                  {/* Status lights */}
                  <div className="pt-1 flex-shrink-0">
                    <span className={`w-3 h-3 rounded-full inline-block ${
                      alert.status === 'resolved' 
                        ? 'bg-slate-650' 
                        : alert.severity === 'critical'
                        ? 'bg-rose-500 animate-pulse'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`} />
                  </div>

                  {/* Body textuals */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">
                        {alert.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-500">
                        {alert.timestamp}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {alert.location}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed font-sans">{alert.message}</p>
                  </div>

                  {/* Operational actions */}
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-snap-${alert.id}`}
                      onClick={() => showSnapshotOverlay(alert)}
                      className="p-1 px-2.5 bg-slate-800 hover:bg-slate-705 text-slate-300 hover:text-white rounded text-xs flex items-center gap-1.5 cursor-pointer"
                      title="ดูหลักฐานกล้องขัดข้อง"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>ขยายกล้อง</span>
                    </button>

                    {alert.status === 'active' && (
                      <button
                        id={`btn-resolve-${alert.id}`}
                        onClick={() => resolveAlert(alert.id)}
                        className="p-1 px-2.5 bg-emerald-660/15 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded text-xs flex items-center gap-1 border border-emerald-600/20 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>แก้ไขแล้ว</span>
                      </button>
                    )}

                    <button
                      id={`btn-delete-${alert.id}`}
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1 px-1.5 text-slate-500 hover:text-rose-450 hover:bg-slate-850 rounded cursor-pointer"
                      title="ลบบันทึกเหตุการณ์"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-16 text-center text-slate-500">
                <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2 animate-bounce" />
                <p className="text-xs font-semibold">ไม่มีการแจ้งเตือนความคืบหน้าตรงกับตัวคัดกรอง</p>
                <p className="text-[11px] text-slate-600">ระบบทำงานอย่างปกติ ปลอดวิกฤต หรือเหตุการณ์ทั้งหมดได้รับการแก้ไขแล้ว</p>
              </div>
            )}
          </div>

        </div>

        {/* Live Snapshots proof panel details */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">กล้องตรวจจับภาพเหตุการณ์ (Snapshot Review)</h3>
          </div>

          {activeSnapshotUrl ? (
            <div className="space-y-3 font-sans">
              <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                
                {/* Simulated Overlay boxes drawn onto snapshot mockup */}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-rose-500 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-650/40 uppercase">
                  🔴 Live Event Capture
                </div>

                <div className="absolute inset-10 border-2 border-dashed border-red-500 rounded flex flex-col justify-end p-2">
                  <span className="text-[9px] font-mono font-bold text-slate-950 bg-red-400 p-0.5 rounded leading-none w-max">
                    ANOMALY LOCATION NODE C
                  </span>
                </div>

                <img 
                  referrerPolicy="no-referrer"
                  src={activeSnapshotUrl} 
                  alt="Snapshot proof" 
                  className="w-full h-full object-cover opacity-75"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">รายละเอียดภาพสแกน</span>
                <p className="text-slate-300 leading-normal bg-slate-950 p-3 rounded-lg border border-slate-800">{activeSnapshotText}</p>
              </div>

              <button
                onClick={() => setActiveSnapshotUrl(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                เคลียร์การขยายภาพ
              </button>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <Disc className="w-10 h-10 mx-auto text-slate-700 animate-spin-slow mb-2" />
              <p className="text-xs font-medium">ไม่มีการเลือกหลักฐานภาพกล้อง</p>
              <p className="text-[11px] text-slate-600 max-w-56 mx-auto leading-normal">
                กดปุ่ม "ขยายกล้อง" บนรายการแจ้งเตือนเพื่อดูหลักฐานประกอบการตรวจจับและวิเคราะห์
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
