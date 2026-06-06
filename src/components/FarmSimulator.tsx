import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Activity, 
  Settings, 
  Plus, 
  Minus, 
  ShieldAlert, 
  HeartCrack, 
  Compass,
  Video, 
  ToggleLeft, 
  ToggleRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Chicken, ChickenState, Telemetry } from '../types';

interface FarmSimulatorProps {
  chickens: Chicken[];
  setChickens: React.Dispatch<React.SetStateAction<Chicken[]>>;
  telemetry: Telemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<Telemetry>>;
  triggerAlert: (category: 'health' | 'environment', message: string, severity: 'critical' | 'warning') => void;
  selectedChicken: Chicken | null;
  setSelectedChicken: (chicken: Chicken | null) => void;
}

export default function FarmSimulator({
  chickens,
  setChickens,
  telemetry,
  setTelemetry,
  triggerAlert,
  selectedChicken,
  setSelectedChicken
}: FarmSimulatorProps) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Main loop to update chicken simulation positions
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setChickens((prevChickens) => {
        let totalSpeedSum = 0;
        let activeCount = 0;

        const updated = prevChickens.map((chicken) => {
          let { x, y, targetX, targetY, speed, state, energy, weightKg } = chicken;

          // State-specific behavior
          if (state === 'sleeping') {
            // Very slow or no movement, slow recovery of energy
            speed = 0.1;
            energy = Math.min(100, energy + 0.8);
            // Small chance of waking up
            if (Math.random() < 0.01) {
              state = 'normal';
            }
          } else if (state === 'ill') {
            // Barely moving
            speed = 0.15;
            energy = Math.max(0, energy - 0.2);
          } else if (state === 'panicked') {
            // Highly active, fast state, decreasing energy quickly
            speed = 3.5;
            energy = Math.max(10, energy - 1.2);
            // Drastic random targets
            if (Math.random() < 0.15) {
              targetX = Math.random() * 100;
              targetY = Math.random() * 100;
            }
            // Calming down chance
            if (Math.random() < 0.03) {
              state = 'normal';
            }
          } else if (state === 'eating') {
            // Slow tracking towards feeding zone (bottom of camera)
            speed = 0.5;
            energy = Math.min(100, energy + 0.5);
            // Low random deviations
            if (Math.random() < 0.05) {
              targetX = 15 + Math.random() * 70;
              targetY = 80 + Math.random() * 15; // feeder belt area
            }
            // Finish eating chance
            if (Math.random() < 0.02) {
              state = 'normal';
            }
          } else {
            // Standard state
            speed = 1.0;
            energy = Math.max(20, energy - 0.05);

            // Random state transition to sleep/eat
            if (Math.random() < 0.005) {
              state = Math.random() < 0.4 ? 'eating' : 'sleeping';
              if (state === 'eating') {
                targetX = Math.random() * 100;
                targetY = 82; // feed zone
              }
            }
          }

          // Move chicken closer to Target coordinates
          const dx = targetX - x;
          const dy = targetY - y;
          const dist = Math.hypot(dx, dy);

          if (dist > 1.5) {
            x += (dx / dist) * speed * 0.8;
            y += (dy / dist) * speed * 0.8;
          } else {
            // Choose new random target inside the fence
            targetX = 5 + Math.random() * 90;
            targetY = 15 + Math.random() * 75;
          }

          // Keep within container bounds
          x = Math.max(2, Math.min(98, x));
          y = Math.max(12, Math.min(95, y));

          const calculatedSpeed = state === 'sleeping' ? 0.05 : state === 'ill' ? 0.1 : speed;
          totalSpeedSum += calculatedSpeed;
          if (state !== 'sleeping' && state !== 'ill') {
            activeCount++;
          }

          return {
            ...chicken,
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
            targetX,
            targetY,
            state,
            energy: parseFloat(energy.toFixed(1)),
          };
        });

        // Calculate Average movement index
        const avgSpeed = prevChickens.length > 0 ? (totalSpeedSum / prevChickens.length) : 0;
        const movementIndex = Math.min(100, Math.round(avgSpeed * 50)); 
        const inactiveCount = prevChickens.length - activeCount;

        setTelemetry((prev) => ({
          ...prev,
          totalChickens: prevChickens.length,
          activeCount,
          inactiveCount,
          avgMovementIndex: movementIndex,
        }));

        return updated;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLive, setChickens, setTelemetry]);

  // Handle addition of more chickens
  const addChicken = () => {
    if (chickens.length >= 80) return;
    const initialNames = ['สมศรี', 'มีชัย', 'ใจดี', 'ทองคำ', 'แจ่มใส', 'ถุงทอง', 'กะทิ', 'พริกแกง', 'เปียกปูน', 'ข้าวปุ้น', 'พารวย', 'กาดำ'];
    const name = `${initialNames[Math.floor(Math.random() * initialNames.length)]} #${chickens.length + 1}`;
    
    setChickens((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 70,
        targetX: Math.random() * 100,
        targetY: Math.random() * 100,
        speed: 0.8 + Math.random() * 0.5,
        state: 'normal',
        energy: 85 + Math.random() * 15,
        size: 14 + Math.random() * 6,
        color: Math.random() > 0.8 ? '#fcd34d' : '#f5f5f5', // Yellowish vs classic white
        name,
        ageDays: Math.floor(25 + Math.random() * 15),
        weightKg: parseFloat((1.8 + Math.random() * 0.8).toFixed(2)),
      }
    ]);
  };

  const removeChicken = () => {
    if (chickens.length <= 1) return;
    setChickens((prev) => prev.slice(0, prev.length - 1));
    if (selectedChicken && chickens[chickens.length - 1].id === selectedChicken.id) {
      setSelectedChicken(null);
    }
  };

  // Simulation: Trigger Chicken Panic
  const triggerPanicSimulation = () => {
    setChickens((prev) => 
      prev.map((c) => ({
        ...c,
        state: 'panicked',
        targetX: Math.random() * 100,
        targetY: Math.random() * 100,
      }))
    );
    triggerAlert(
      'health',
      'ตรวจพบระดับฝูงไก่ตื่นตระหนกผิดปกติ (Panic Event) - คาดว่าเกิดจากเสียงบีบอัดอากาศหรือสัตว์แปลกปลอมในฟาร์ม',
      'critical'
    );
  };

  // Simulation: Sick Chickens Action
  const triggerIllnessSimulation = () => {
    let affected = 0;
    setChickens((prev) => 
      prev.map((c, i) => {
        if (i % 4 === 0) { // Infect 25% of the chickens
          affected++;
          return {
            ...c,
            state: 'ill',
            energy: 15,
          };
        }
        return c;
      })
    );
    triggerAlert(
      'health',
      `ตรวจพบพฤติกรรมไก่ขยับตัวน้อยกว่า 15% คาดว่าป่วยอิดโรยและเครียดสะสมจำนวน ${affected} ตัว`,
      'warning'
    );
  };

  return (
    <div id="simulator-container" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Visual Sandbox camera screen */}
      <div className="xl:col-span-2 bg-[#020617] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-[520px]">
        {/* Camera stream header info */}
        <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-800/60 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-100 font-sans">
              กล้องหลัก IP-Cam Node #01 - ด้านบนตัวตึกเลี้ยง A
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 bg-[#020617] px-2 py-0.5 rounded border border-slate-800">
              FPS: 15 (AI Realtime Processing)
            </span>
            <button 
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 cursor-pointer bg-[#020617] hover:bg-[#0f172a] px-2 py-1 rounded border border-slate-800 transition"
              title="สลับการดู Bounding boxes"
            >
              {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showBoundingBoxes ? 'ซ่อนกรอบ AI' : 'แสดงกรอบ AI'}</span>
            </button>
          </div>
        </div>

        {/* Feeding Belt/Feeder line label */}
        <div className="absolute bottom-12 left-0 right-0 h-10 bg-emerald-950/20 border-t border-b border-emerald-900/10 flex items-center justify-center font-mono text-[10px] text-emerald-400/50 pointer-events-none z-10">
          === รางให้อาหารอัตโนมัติ (FEEDING WATER & GRAINS CONVEYOR BELT) ===
        </div>

        {/* Fence Camera Arena Simulation */}
        <div 
          ref={containerRef}
          className="relative flex-1 bg-auto overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#020617] select-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {/* Visual Feeder & Waterers markers */}
          <div className="absolute top-4 left-6 bg-[#020617]/80 px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-500 z-10 backdrop-blur-sm">
            ระบบระบายอากาศ: พัดลมออน
          </div>
          <div className="absolute top-4 right-6 bg-[#020617]/80 px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-emerald-500 z-10 backdrop-blur-sm">
            อุณหภูมิกระเปาะแห้ง: {telemetry.temperature}°C
          </div>

          {/* Chicken Nodes */}
          {chickens.map((chicken) => {
            const isChickenSelected = selectedChicken?.id === chicken.id;
            
            // Determine state colors
            let stateBadgeColor = 'border-emerald-500 text-emerald-400';
            let haloGlow = 'rgba(16, 185, 129, 0.15)';
            let emoji = '🐤';

            if (chicken.state === 'ill') {
              stateBadgeColor = 'border-amber-500 text-amber-500';
              haloGlow = 'rgba(245, 158, 11, 0.35)';
              emoji = '🤒';
            } else if (chicken.state === 'panicked') {
              stateBadgeColor = 'border-rose-500 text-rose-500 animate-bounce';
              haloGlow = 'rgba(239, 68, 68, 0.4)';
              emoji = '💥';
            } else if (chicken.state === 'eating') {
              stateBadgeColor = 'border-blue-500 text-blue-400';
              haloGlow = 'rgba(59, 130, 246, 0.2)';
              emoji = '🌾';
            } else if (chicken.state === 'sleeping') {
              stateBadgeColor = 'border-sky-700 text-sky-400';
              haloGlow = 'rgba(125, 211, 252, 0.1)';
              emoji = '💤';
            }

            return (
              <div
                id={`sim-chicken-${chicken.id}`}
                key={chicken.id}
                style={{
                  left: `${chicken.x}%`,
                  top: `${chicken.y}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 120ms linear, top 120ms linear',
                  boxShadow: isChickenSelected ? `0 0 15px ${haloGlow}` : `0 0 4px ${haloGlow}`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChicken(chicken);
                }}
                className={`absolute p-1 flex flex-col items-center cursor-pointer transition-all ${
                  isChickenSelected ? 'ring-2 ring-emerald-400 scale-125 z-30' : 'hover:scale-110 z-20'
                }`}
              >
                {/* AI Bounding Box Frame */}
                {showBoundingBoxes && (
                  <div className={`absolute -inset-1 border border-dashed rounded-lg transition-colors ${
                    isChickenSelected ? 'border-amber-400 border-2' : chicken.state === 'ill' ? 'border-amber-500 animate-pulse' : chicken.state === 'panicked' ? 'border-rose-500' : 'border-emerald-500/50'
                  }`}>
                    {/* Bounding Box Info Label */}
                    <span 
                      style={{ transform: 'translateY(-110%)' }}
                      className={`absolute top-0 left-0 text-[8px] font-mono whitespace-nowrap bg-slate-950 border px-1 rounded shadow-md ${
                        chicken.state === 'ill' ? 'text-amber-400 border-amber-600' : chicken.state === 'panicked' ? 'text-rose-400 border-rose-600' : 'text-emerald-400 border-emerald-700'
                      }`}
                    >
                      ID:{chicken.id} {chicken.state.toUpperCase()} [98%]
                    </span>
                  </div>
                )}

                {/* Animated Chicken Entity */}
                <div 
                  className="relative rounded-full flex items-center justify-center font-bold select-none text-base"
                  style={{ 
                    width: `${chicken.size}px`, 
                    height: `${chicken.size}px`,
                  }}
                >
                  {emoji}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Simulator control bar */}
        <div className="bg-[#0f172a] px-6 py-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                isLive ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/10' : 'bg-slate-800 hover:bg-slate-705 text-slate-350 border border-slate-700'
              }`}
            >
              {isLive ? '⏸ พักจำลองเวลา' : '▶ เล่นจำลองต่อ'}
            </button>
            <span className="text-xs text-slate-400 font-sans">
              กล้องติดตั้งพร้อมวิเคราะห์ระบบ: {chickens.length} ตัว
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={addChicken}
              disabled={chickens.length >= 80}
              className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-805 disabled:opacity-50 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มไข่/ไก่</span>
            </button>
            <button
              onClick={removeChicken}
              disabled={chickens.length <= 1}
              className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-805 disabled:opacity-50 cursor-pointer transition"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>คัดไก่ออก</span>
            </button>
            <button
              onClick={triggerPanicSimulation}
              className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 rounded-lg text-xs font-medium flex items-center gap-1 border border-rose-900/40 cursor-pointer transition"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
              <span>กระตุ้นไก่ตื่นตกใจ</span>
            </button>
            <button
              onClick={triggerIllnessSimulation}
              className="px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-amber-100 rounded-lg text-xs font-medium flex items-center gap-1 border border-amber-900/40 cursor-pointer transition"
            >
              <HeartCrack className="w-3.5 h-3.5" />
              <span>กระตุ้นไก่ป่วยล้า</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side tracker card to inspect chicken metadata on select */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[500px] relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition"></div>
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Bounding Box Inspector</h3>
              <p className="text-xs text-slate-500">คลิกที่ไก่เพื่อส่องข้อมูลตัววัดแบบเจาะลึก</p>
            </div>
          </div>

          {selectedChicken ? (
            <div className="py-6 space-y-4 font-sans">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-150">{selectedChicken.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">ID Tracker: {selectedChicken.id}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-mono font-medium ${
                  selectedChicken.state === 'normal' ? 'bg-emerald-950 text-emerald-400' :
                  selectedChicken.state === 'eating' ? 'bg-blue-950 text-blue-400' :
                  selectedChicken.state === 'sleeping' ? 'bg-sky-950/80 text-sky-400' :
                  selectedChicken.state === 'ill' ? 'bg-amber-950 text-amber-400 animate-pulse' :
                  'bg-rose-950 text-rose-450'
                }`}>
                  {selectedChicken.state.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/40">
                  <span className="text-slate-450">พิกัดในกล้อง (X, Y)</span>
                  <span className="font-mono text-slate-200">{selectedChicken.x}%, {selectedChicken.y}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/40">
                  <span className="text-slate-450">น้ำหนักไก่วิเคราะห์โดยสายตา AI</span>
                  <span className="font-semibold text-slate-200 font-mono">{selectedChicken.weightKg} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/40">
                  <span className="text-slate-450">อายุไก่ที่สแกน</span>
                  <span className="text-slate-200 font-mono">{selectedChicken.ageDays} วัน</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/40">
                  <span className="text-slate-450">ระดับพลังงานแคลอรี่ (Energy)</span>
                  <span className="text-slate-250 font-semibold font-mono">{selectedChicken.energy}%</span>
                </div>
              </div>

              <div className="pt-2 bg-slate-950 p-3.5 rounded-lg text-[11px] text-slate-400 space-y-1">
                <p className="text-emerald-400 font-mono font-semibold uppercase tracking-wider text-[9px]">
                  บันทึกการสังเกตพฤติกรรมย้อนหลัง (Movement Analytics)
                </p>
                {selectedChicken.state === 'ill' ? (
                  <p className="text-amber-400/90 leading-relaxed">
                    แจ้งเตือน: ความเร็วการเคลื่อนที่ติดขัดอย่างรุนแรง ตื่นตระหนกต่ำ ดัชนีกิจกรรมต่ำกว่ามาตรฐานร่วม 45 นาที แนะนำส่งเจ้าหน้าที่เข้าฉีดพ่นและแยกเลี้ยงทันที
                  </p>
                ) : selectedChicken.state === 'panicked' ? (
                  <p className="text-rose-400 leading-relaxed">
                    แจ้งเตือนฉุกเฉิน: ไก่มีอัตราการขยับและก้าวถอยหลังที่ตระหนก ความเครียดขึ้นสูง อาจถูกรบกวนจากภายนอก
                  </p>
                ) : selectedChicken.state === 'eating' ? (
                  <p className="leading-relaxed">
                    ปกติ: ตรวจสอบความถี่ในการกินอาหารเป็นปกติตามอัตราเฉลี่ยรอบวัน น้ำหนักเพิ่มสัดส่วนสมดุลดี
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    สมบูรณ์ดี: ตัวบ่งชี้ความเคลื่อนที่ อารมณ์ และการกระจายตัวร่วมกับฝูงปกติ ไม่มีข้อกังวล
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center flex-1 py-16 space-y-3">
              <Camera className="w-12 h-12 text-slate-700 animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">ไม่มีการเลือกไก่ตัวใด</p>
                <p className="text-[11px] text-slate-500 max-w-44 leading-normal">
                  ลองแตะจิ้มไก่ตัวสีขาวหรือไอคอนตัวแสดงพฤติกรรมในจอ เพื่อวิเคราะห์ข้อมูลตัวต่อตัว
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic simulator status indicator foot */}
        <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>AI Engine: TensorFlow.js IoT SDK</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            เชื่อมต่อกล้องออนไลน์
          </span>
        </div>
      </div>
    </div>
  );
}
