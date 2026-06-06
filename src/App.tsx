import { useState, useEffect } from 'react';
import { 
  Chicken, 
  Telemetry, 
  Alert, 
  CameraDevice, 
  SystemSettings 
} from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AlertView from './components/AlertView';
import ReportView from './components/ReportView';
import SettingView from './components/SettingView';
import { Bot, BellRing, Wifi, MapPin } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<string>('dashboard');
  const [selectedChicken, setSelectedChicken] = useState<Chicken | null>(null);

  // Prepopulate 25 simulated chickens
  const [chickens, setChickens] = useState<Chicken[]>(() => {
    const initialNames = ['สมพร', 'สายชล', 'มีทรัพย์', 'จอมกวน', 'แจ่มว้าว', 'แกงอ่อม', 'กะทิ', 'พริกป่น', 'เกาลัด', 'สายบัว', 'พารวย', 'ศรีนวล', 'ถุงแป้ง', 'เฉาก๊วย', 'ขิงแกง', 'ข้าวตัง', 'ทองขาว', 'ข้าวเหนียว', 'ศรีดา', 'เจ้าสัว', 'มั่งมี', 'ส้มจี๊ด', 'มะลิ', 'ดอกโสน', 'ลูกเจี๊ยบพิเศษ'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const id = i + 1;
      const x = 10 + Math.random() * 80;
      const y = 20 + Math.random() * 70;
      return {
        id,
        x,
        y,
        targetX: Math.random() * 100,
        targetY: Math.random() * 100,
        speed: 0.8 + Math.random() * 0.4,
        state: 'normal' as const,
        energy: parseFloat((80 + Math.random() * 20).toFixed(1)),
        size: 14 + Math.random() * 6,
        color: Math.random() > 0.8 ? '#fcd34d' : '#f5f5f5',
        name: `${initialNames[i % initialNames.length]} #${id}`,
        ageDays: Math.floor(20 + Math.random() * 20),
        weightKg: parseFloat((1.5 + Math.random() * 1.1).toFixed(2))
      };
    });
  });

  // Prepopulate default telemetry parameters
  const [telemetry, setTelemetry] = useState<Telemetry>({
    totalChickens: 25,
    activeCount: 22,
    inactiveCount: 3,
    avgMovementIndex: 65,
    temperature: 28.5,
    humidity: 62,
    ammoniaLevel: 12,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Prepopulate default alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert-1',
      timestamp: '06/06/2026, 07:12:30 AM',
      category: 'environment',
      severity: 'warning',
      message: 'อุณหภูมิจุดวัดด้านใต้อาคารสูงแตะ 30.5°C แนะนำระบบระบายพัดลมไซโคลนเร่งระดับขึ้น',
      status: 'active',
      location: 'อาคารพัดลมใกล้วาล์ว A'
    },
    {
      id: 'alert-2',
      timestamp: '06/06/2026, 06:45:12 AM',
      category: 'health',
      severity: 'critical',
      message: 'ตรวจพบกลุ่มไก่หนาแน่นผิดปกติ (Crowding Level High) เคลื่อนตัวน้อย ณ จุดติดตั้งให้อาหาร 1',
      status: 'active',
      location: 'รางหัวจ่ายอาหาร Zone C-1'
    },
    {
      id: 'alert-3',
      timestamp: '06/06/2026, 05:30:10 AM',
      category: 'hardware',
      severity: 'normal',
      message: 'ปรับปรุงซอฟต์แวร์ Node AI Tracker และออโต้อัพเดตเฟรมแวร์ของกล้อง IP สำเร็จ',
      status: 'resolved',
      location: 'เซิร์ฟเวอร์ควบคุมฟาร์มหลัก'
    }
  ]);

  // Prepopulate camera devices
  const [cameras, setCameras] = useState<CameraDevice[]>([
    {
      id: 'CAM-01',
      name: 'กล้องเพดานโรงเรือน A (IP-Cam Roof)',
      location: 'อาคาร 1 ประตูทางเข้า',
      ipAddress: '192.168.1.101',
      status: 'online',
      resolution: '1080p FHD'
    },
    {
      id: 'CAM-02',
      name: 'กล้องติดตาม Zone C-1 Feeder',
      location: 'อาคาร 1 ท้ายรางน้ำดื่ม',
      ipAddress: '192.168.1.102',
      status: 'online',
      resolution: '1080p FHD'
    },
    {
      id: 'CAM-03',
      name: 'กล้องประเมินน้ำหนักตัวอัตโนมัติ (AI Weigher)',
      location: 'อาคาร 2 ทางชั่งน้ำหนัก',
      ipAddress: '192.168.1.103',
      status: 'online',
      resolution: '720p HD'
    }
  ]);

  // Default system settings
  const [settings, setSettings] = useState<SystemSettings>({
    tempMin: 20,
    tempMax: 32,
    humidityMin: 40,
    humidityMax: 80,
    ammoniaMax: 20,
    activityThreshold: 45,
    audioAlert: true,
    alertWebhook: 'https://api.line.me/webhook/notify'
  });

  // Small telemetry fluctuations over time to make the real-world feel highly realistic
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const tempChange = (Math.random() - 0.5) * 0.2;
        const newTemp = parseFloat((prev.temperature + tempChange).toFixed(1));
        
        const humidityChange = Math.round((Math.random() - 0.5) * 2);
        const newHumidity = Math.max(45, Math.min(85, prev.humidity + humidityChange));

        const ammoniaChange = (Math.random() - 0.5) * 0.5;
        const newAmmonia = Math.max(5, Math.min(25, Math.round(prev.ammoniaLevel + ammoniaChange)));

        return {
          ...prev,
          temperature: newTemp,
          humidity: newHumidity,
          ammoniaLevel: newAmmonia,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Monitor sensor limits and trigger automatic telemetry warnings
  useEffect(() => {
    if (telemetry.temperature > settings.tempMax) {
      triggerAlert(
        'environment',
        `ตรวจพบโรงเรือนมีอุณหภูมิอ้าวผิดปกติ (${telemetry.temperature}°C) สูงเกินค่าเกณฑ์ที่ตั้งค่า (${settings.tempMax}°C) แนะนำดูดลมด่วน`,
        'critical'
      );
    }
    if (telemetry.ammoniaLevel > settings.ammoniaMax) {
      triggerAlert(
        'environment',
        `ตรวจพบความหนาแน่นก๊าซแอมโมเนีย (${telemetry.ammoniaLevel} ppm) เกินเกณฑ์ปลอดภัย (${settings.ammoniaMax} ppm) ควรเติมแกลบแห้งลงพื้นที่`,
        'critical'
      );
    }
  }, [telemetry.temperature, telemetry.ammoniaLevel, settings.tempMax, settings.ammoniaMax]);

  // Method to easily append new alerts
  const triggerAlert = (category: 'health' | 'hardware' | 'environment', message: string, severity: 'critical' | 'warning' | 'normal') => {
    // Check if duplicate alert of same content exists in open active alerts to prevent spamming
    setAlerts((prev) => {
      const isDuplicate = prev.some(a => a.status === 'active' && a.message === message);
      if (isDuplicate) return prev;

      return [
        {
          id: `alert-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-US'),
          category,
          severity,
          message,
          status: 'active' as const,
          location: 'วิเคราะห์อัตโนมัติ (AI Model Node)'
        },
        ...prev
      ];
    });

    if (settings.audioAlert && severity === 'critical') {
      try {
        // Optional quick safety sound trigger or simple log
        console.log("CRITICAL SOUND SIREN TRIGGERED");
      } catch (err) {}
    }
  };

  // Compute average health value of all simulated chickens
  const calculateFlockHealthScore = () => {
    if (chickens.length === 0) return 100;
    let scoreMultiplier = 100;

    // Deduct points based on diseased or panicked chickens
    const sickChickens = chickens.filter(c => c.state === 'ill').length;
    const panickedChickens = chickens.filter(c => c.state === 'panicked').length;

    // Sick chicken deducts 5 points, Panicked deducts 2 points
    scoreMultiplier -= (sickChickens * 5);
    scoreMultiplier -= (panickedChickens * 2);

    // Also factor environment health (ammonia levels above 20)
    if (telemetry.ammoniaLevel > 18) {
      scoreMultiplier -= 10;
    }

    return Math.max(10, Math.min(100, scoreMultiplier));
  };

  const chickenHealthScore = calculateFlockHealthScore();
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div id="smart-poultry-app" className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* Navigation sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setTab={setTab} 
        activeAlerts={activeAlertsCount}
        chickenHealthScore={chickenHealthScore}
      />

      {/* Main Content Area Container */}
      <main id="app-main-content" className="flex-1 flex flex-col h-full bg-[#020617] overflow-y-auto">
        
        {/* Core Global Header bar */}
        <header id="app-global-header" className="px-8 py-5 border-b border-slate-800/80 bg-[#0f172a]/70 sticky top-0 flex items-center justify-between z-40 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>รหัสโรงเรือน A-East (Building #1) • สมุทรปราการ</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              ถอดรหัสพฤติกรรมสัตว์ปีกด้วย AI – แผงควบคุมตรวจจับฟาร์มอัจฉริยะ
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* UTC real-time indicator */}
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono font-semibold text-slate-550 text-slate-500 uppercase tracking-widest">
                ฟาร์มเมสเสจเซนติเนล
              </p>
              <p className="text-xs font-semibold text-slate-300 font-mono">
                {telemetry.lastUpdated} (REAL-TIME-UTC)
              </p>
            </div>

            {/* Micro alarm visual status */}
            <div className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full inline-block ${activeAlertsCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[11px] font-semibold text-slate-300 font-sans">
                {activeAlertsCount > 0 ? `พบสายแจ้งเตือนปักหมุด: ${activeAlertsCount}` : 'ความปลอดภัยระดับสูง'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Router Content selection */}
        <div id="tab-router-viewport" className="p-8 pb-16 flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView 
              chickens={chickens}
              setChickens={setChickens}
              telemetry={telemetry}
              setTelemetry={setTelemetry}
              alerts={alerts}
              triggerAlert={triggerAlert}
              selectedChicken={selectedChicken}
              setSelectedChicken={setSelectedChicken}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertView 
              alerts={alerts}
              setAlerts={setAlerts}
              triggerAlert={triggerAlert}
            />
          )}

          {currentTab === 'reports' && (
            <ReportView />
          )}

          {currentTab === 'settings' && (
            <SettingView 
              settings={settings}
              setSettings={setSettings}
              cameras={cameras}
              setCameras={setCameras}
            />
          )}
        </div>

      </main>

    </div>
  );
}
