import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Video, 
  User, 
  Plus, 
  Check, 
  Trash2, 
  Wifi, 
  WifiOff, 
  BellRing,
  Volume2,
  VolumeX,
  Smartphone,
  Save
} from 'lucide-react';
import { SystemSettings, CameraDevice } from '../types';

interface SettingViewProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  cameras: CameraDevice[];
  setCameras: React.Dispatch<React.SetStateAction<CameraDevice[]>>;
}

export default function SettingView({ settings, setSettings, cameras, setCameras }: SettingViewProps) {
  // Local state for user account profile inputs
  const [profile, setProfile] = useState({
    name: 'สัตวบาล สมหมาย เลิศวิลาศ',
    role: 'ผู้จัดการฟาร์มหลัก / Head Farm Director',
    farmCode: 'POULTRY-NODE-7819',
    lineToken: 'line_notify_token_chicken_92a83f'
  });

  // Local state for adding cameras
  const [newCamName, setNewCamName] = useState('');
  const [newCamLocation, setNewCamLocation] = useState('เล้าขุนภาคตะวันออก');
  const [newCamIp, setNewCamIp] = useState('192.168.1.155');

  // Interactive device addition
  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName.trim()) return;

    const newCam: CameraDevice = {
      id: `CAM-${Date.now()}`,
      name: newCamName,
      location: newCamLocation,
      ipAddress: newCamIp,
      status: 'online',
      resolution: '1080p FHD'
    };

    setCameras(prev => [...prev, newCam]);
    setNewCamName('');
  };

  const deleteCamera = (id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
  };

  const toggleCameraStatus = (id: string) => {
    setCameras(prev => 
      prev.map(c => c.id === id ? { ...c, status: c.status === 'online' ? 'offline' as const : 'online' as const } : c)
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('บันทึกการปรับเปลี่ยนบัญชีผู้ใช้และสิทธิ์การเป็นเจ้าของฟาร์มสำเร็จ!');
  };

  return (
    <div id="settings-view" className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Farm Threshold and alarm limits */}
        <div className="space-y-6">
          
          <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">ตั้งค่าเกณฑ์การแจ้งเตือนพฤติกรรม (Coop Condition Thresholds)</h3>
                <p className="text-[11px] text-slate-500">ปรับเปลี่ยนช่วงตัวเลขเซ็นเซอร์ เพื่อทริกเกอร์เตือนภัยอัตโนมัติภายในแอปพลิเคชัน</p>
              </div>
            </div>

            <div className="space-y-5 py-2">
              
              {/* Temperature max */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-350">อุณหภูมิวิกฤตสูงสุด (Max Temp Warning)</span>
                  <span className="font-mono text-emerald-400 font-bold">{settings.tempMax}°C</span>
                </div>
                <input 
                  id="slider-temp-max"
                  type="range" 
                  min="28" 
                  max="38" 
                  step="0.5"
                  value={settings.tempMax}
                  onChange={(e) => setSettings(prev => ({ ...prev, tempMax: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              {/* Temperature min */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-350">อุณหภูมิวิกฤตต่ำสุด (Min Temp Warning)</span>
                  <span className="font-mono text-blue-400 font-bold">{settings.tempMin}°C</span>
                </div>
                <input 
                  id="slider-temp-min"
                  type="range" 
                  min="15" 
                  max="25" 
                  step="0.5"
                  value={settings.tempMin}
                  onChange={(e) => setSettings(prev => ({ ...prev, tempMin: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              {/* Humidity max */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-350">ขีดจำกัดความชื้นสภาพเรือนสูงสุด (Max Humidity)</span>
                  <span className="font-mono text-slate-200 font-bold">{settings.humidityMax}% RH</span>
                </div>
                <input 
                  id="slider-humidity-max"
                  type="range" 
                  min="65" 
                  max="90" 
                  value={settings.humidityMax}
                  onChange={(e) => setSettings(prev => ({ ...prev, humidityMax: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              {/* Ammonia Limit max */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-350">เกณฑ์คราบก๊าซแอมโมเนียอันตรายสะสม (Ammonia NH3 Max Limit)</span>
                  <span className="font-mono text-rose-455 font-bold text-rose-400">{settings.ammoniaMax} ppm</span>
                </div>
                <input 
                  id="slider-ammonia-max"
                  type="range" 
                  min="10" 
                  max="30" 
                  value={settings.ammoniaMax}
                  onChange={(e) => setSettings(prev => ({ ...prev, ammoniaMax: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

              {/* Activity Trigger limit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-350">ดัชนีกิจกรรมต่ำสุด เพื่อประเมินไก่ป่วย (Min Activity Threshold)</span>
                  <span className="font-mono text-amber-400 font-bold">{settings.activityThreshold}%</span>
                </div>
                <input 
                  id="slider-activity-threshold"
                  type="range" 
                  min="20" 
                  max="50" 
                  value={settings.activityThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, activityThreshold: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                />
              </div>

            </div>

            <div className="pt-2 flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">เปิดเสียงเตือนภัยหวอไซเรนในเว็บ</span>
              </div>
              <button 
                onClick={() => setSettings(prev => ({ ...prev, audioAlert: !prev.audioAlert }))}
                className="text-slate-300 hover:text-emerald-400 font-mono transition cursor-pointer"
              >
                {settings.audioAlert ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-650" />}
              </button>
            </div>
          </div>

          {/* User Account profiles */}
          <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">จัดการข้อมูลและบัญชีสมาชิก (Account Profile)</h3>
                <p className="text-[11px] text-slate-500">จัดการสิทธิ์ ความเป็นเจ้าของเครื่อง และแจ้งเตือน Line API Token</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400">ชื่อ-นามสกุล สัตวแพทย์/สัตวบาล</label>
                  <input 
                    id="input-user-name"
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">บทบาทความโปรไฟล์ในฟาร์ม</label>
                  <input 
                    id="input-user-role"
                    type="text" 
                    value={profile.role}
                    onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">รหัสสังกัดอาคารฟาร์มเจ้าของลิขสิทธิ์ (Farm Area ID)</label>
                <input 
                  id="input-user-farmcode"
                  type="text" 
                  value={profile.farmCode}
                  readOnly
                  className="w-full bg-slate-950/60 text-slate-500 p-2.5 rounded-lg border border-slate-850 font-mono cursor-not-allowed text-[10.5px]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400">Line Notify API Token เพื่อส่งเข้ามือถือ</label>
                  <span className="text-[10px] text-emerald-400 font-mono">ส่งสำเร็จ 12 เหตุการณ์ล่าสุด</span>
                </div>
                <input 
                  id="input-user-linetoken"
                  type="password" 
                  value={profile.lineToken}
                  onChange={(e) => setProfile(prev => ({ ...prev, lineToken: e.target.value }))}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-lg border border-slate-800 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <button
                id="btn-save-profile"
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกตั้งบัญชีสัตวบาล</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right column: IoT and Cam nodes device manager */}
        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Video className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-sans">ทะเบียนกล้องและกล่องควบคุมระบบ IoT (Hardware Nodes)</h3>
              <p className="text-[11px] text-slate-500">จัดการอุปกรณ์สแกนภาพ AI แบบเรียลไทม์ และจำลองสถานะทดสอบ Offline/Online</p>
            </div>
          </div>

          {/* Connected list */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {cameras.map((cam) => (
              <div 
                id={`cam-device-row-${cam.id}`}
                key={cam.id}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cam.status === 'online' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-455 text-rose-450'}`}>
                    <Video className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{cam.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Location: {cam.location} • IP: {cam.ipAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status clicker to simulate node dropouts */}
                  <button
                    id={`btn-toggle-status-${cam.id}`}
                    onClick={() => toggleCameraStatus(cam.id)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                      cam.status === 'online'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-900/40'
                        : 'bg-rose-950 text-rose-400 border border-rose-900/30 hover:bg-rose-900/40'
                    }`}
                    title="คลิกสลับสถานะเพื่อจำลองความเสียหายฮาร์ดแวร์"
                  >
                    {cam.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>{cam.status.toUpperCase()}</span>
                  </button>

                  <button
                    id={`btn-remove-cam-${cam.id}`}
                    onClick={() => deleteCamera(cam.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-slate-900 rounded cursor-pointer"
                    title="ลบกล้องออก"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form to add a new camera */}
          <form onSubmit={handleAddCamera} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5 text-xs">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              ติดตั้งคอร์ฟาร์มกล้องใหม่ (Add Camera Node)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10.5px]">ชื่อกล้อง (Camera Name)</label>
                <input 
                  id="input-cam-name"
                  type="text" 
                  placeholder="เช่น กล้องบ่อแช่ Node #4"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 p-2 rounded border border-slate-800/80 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-[10.5px]">สถานที่ติดตั้ง</label>
                <input 
                  id="input-cam-location"
                  type="text" 
                  value={newCamLocation}
                  onChange={(e) => setNewCamLocation(e.target.value)}
                  className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-800/80 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10.5px]">ที่อยู่ IP ลิงค์สัญญาน (LAN-IP Location)</label>
              <input 
                id="input-cam-ip"
                type="text" 
                value={newCamIp}
                onChange={(e) => setNewCamIp(e.target.value)}
                className="w-full bg-slate-900 text-slate-300 p-2 rounded border border-slate-800/80 font-mono focus:outline-none text-[11px]"
              />
            </div>

            <button
              id="btn-submit-camera"
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-semibold cursor-pointer text-xs"
            >
              ลงทะเบียนกล้องเข้าฐานข้อมูล
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
