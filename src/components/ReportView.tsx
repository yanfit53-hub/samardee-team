import { useState } from 'react';
import { 
  FilePieChart, 
  Download, 
  Sparkles, 
  Calendar,
  Layers,
  Activity,
  Award,
  CircleAlert,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function ReportView() {
  const [timeframe, setTimeframe] = useState<'daily'|'weekly'|'monthly'>('weekly');
  const [generatingAIReport, setGeneratingAIReport] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  // Statistics datasets
  const dailyData = [
    { name: '02:00', activity: 41, temp: 25.1, ammonia: 11 },
    { name: '06:00', activity: 65, temp: 26.5, ammonia: 9 },
    { name: '10:00', activity: 78, temp: 28.2, ammonia: 10 },
    { name: '14:00', activity: 82, temp: 30.1, ammonia: 13 },
    { name: '18:00', activity: 58, temp: 28.4, ammonia: 12 },
    { name: '22:00', activity: 32, temp: 26.0, ammonia: 11 },
  ];

  const weeklyData = [
    { name: 'จันทร์', activity: 72, temp: 27.2, ammonia: 11.2 },
    { name: 'อังคาร', activity: 68, temp: 27.8, ammonia: 12.0 },
    { name: 'พุธ', activity: 42, temp: 28.9, ammonia: 14.5 }, // low activity day
    { name: 'พฤหัสบดี', activity: 75, temp: 26.5, ammonia: 11.0 },
    { name: 'ศุกร์', activity: 79, temp: 27.1, ammonia: 9.8 },
    { name: 'เสาร์', activity: 70, temp: 27.4, ammonia: 10.5 },
    { name: 'อาทิตย์', activity: 65, temp: 28.0, ammonia: 11.8 },
  ];

  const monthlyData = [
    { name: 'สัปดาห์ที่ 1', activity: 74, temp: 26.8, ammonia: 10.2 },
    { name: 'สัปดาห์ที่ 2', activity: 71, temp: 27.5, ammonia: 11.4 },
    { name: 'สัปดาห์ที่ 3', activity: 62, temp: 28.2, ammonia: 12.8 },
    { name: 'สัปดาห์ที่ 4', activity: 77, temp: 26.1, ammonia: 9.5 },
  ];

  const activeData = timeframe === 'daily' ? dailyData : timeframe === 'weekly' ? weeklyData : monthlyData;

  const simulateAIReport = () => {
    setGeneratingAIReport(true);
    setGeneratedResult(null);
    setTimeout(() => {
      setGeneratingAIReport(false);
      setGeneratedResult(`บทวิเคราะห์รายงานสุขภาพสัตว์ปีกอัจฉริยะ (Smart Poultry AI Report)

จากการตรวจสอบย้อนหลังแบบอัตโนมัติ:
1. การระเบิดพฤติกรรมและความเคลื่อนไหว: ดัชนีกระฉับกระเฉงเฉลี่ยที่สูงถึง 71% อยู่ในเกณฑ์เหมาะสมมาก พบลดลงในช่วงสัปดาห์ที่ 3 (เฉลี่ย 62%) ร่วมกับสภาพอากาศภายนอกที่ร้อนอ้าวขึ้นกว่าปกติ
2. ความหนาแน่นของแก๊สแอมโมเนีย (NH3): ตรวจพบวิกฤตสั้นๆ ต่ำกว่า 15 ppm ตลอดทั้งสัปดาห์ แสดงถึงคุณภาพแกลบรองพื้นที่ยังแห้งสนิทและระบบดูดกลิ่นทำงานสมบูรณ์ดี
3. อัตราความคุ้มค่าของการเปลี่ยนอาหาร (Estimated FCR): เท่ากับ 1.48 ต่ำกว่าสัญญาระดับมาตรฐาน คาดว่าจะให้ผลผลิตเพิ่มน้ำหนักที่รวดเร็ว

ข้อแนะนำเร่งด่วน:
- ควรเพิ่มปริมาณระเบิดละอองฝอยรดความชื้น (Misting line) ในอัตราอุณหภูมิโรงเรือนเกิน 30.2 องศาเซลเซียสเพื่อช่วยลดความร้อนอ้าวสะสม`);
    }, 2000);
  };

  return (
    <div id="report-view" className="space-y-6">
      
      {/* Timeframe toggler with download stats header */}
      <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-1050 text-slate-1 py-1 flex items-center gap-2">
            <FilePieChart className="w-5 h-5 text-emerald-400" />
            รายงานสถิติย้อนหลังและข้อมูลการเจริญเติบโต
          </h2>
          <p className="text-xs text-slate-500 font-sans">คัดเลือกช่วงเวลาเพื่อดูความสอดคล้องกันระหว่างระบบ IoT และพฤติกรรมไก่ในโรงเรือน</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              timeframe === 'daily' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายวัน
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              timeframe === 'weekly' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายสัปดาห์
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              timeframe === 'monthly' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายเดือน
          </button>
        </div>
      </div>

      {/* Grid of aggregated KPIs related to poultry farm analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition"></div>
          <span className="text-[11px] text-slate-400 font-sans block z-10 relative">อัตราการตายย้อนหลังสะสม (Mortality Rate)</span>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="text-2xl font-bold text-slate-200 font-mono">0.14%</span>
            <span className="text-xs text-emerald-400 font-semibold">ต่ำกว่าวิกฤต</span>
          </div>
          <div className="text-[10px] text-slate-500 z-10 relative">มาตรฐานเฉลี่ยฟาร์มทั่วไป: 0.8%</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10b981]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10b981]/10 transition"></div>
          <span className="text-[11px] text-slate-400 font-sans block z-10 relative">อัตราการกิน/เปลี่ยนแกนอาหาร (FCR Estimator)</span>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="text-2xl font-bold text-slate-200 font-mono">1.48</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-550/20 shadow-sm">ดีมาก</span>
          </div>
          <div className="text-[10px] text-slate-500 z-10 relative">บ่งชี้สัดส่วนน้ำหนักเพิ่มขึ้นเมื่อเลี้ยงอาหาร</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10b981]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10b981]/10 transition"></div>
          <span className="text-[11px] text-slate-400 font-sans block z-10 relative">ดัชนีค่าน้ำหนักเฉลี่ยสุทธิ (Average Weight)</span>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="text-2xl font-bold text-slate-200 font-mono">2.14 kg</span>
            <span className="text-xs text-emerald-400 font-semibold font-mono font-sans">+0.12 kg wk/wk</span>
          </div>
          <div className="text-[10px] text-slate-500 z-10 relative">ติดตามสัดส่วนความหนาทางกล้อง IP Cam</div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10b981]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10b981]/10 transition"></div>
          <span className="text-[11px] text-slate-400 font-sans block z-10 relative">ประสิทธิภาพความจุระบบ (Overall System Utility)</span>
          <div className="flex items-baseline gap-2 z-10 relative">
            <span className="text-2xl font-bold text-slate-200 font-mono">99.8%</span>
            <span className="text-xs text-emerald-400 font-mono">เฝ้าระวังสัญญาณ</span>
          </div>
          <div className="text-[10px] text-slate-500 z-10 relative">รวมอุปกรณ์ฮาร์ดแวร์ IoT, กล้อง Node AI</div>
        </div>

      </div>

      {/* Recharts Detailed historical analysis graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Multi Line chart showing movement and sensors */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-100 font-sans">เปรียบเทียบปัจจัยโรงเรือนและการกระฉับกระเฉงของฝูงไก่</h3>
              <p className="text-xs text-slate-500">สังเกตแนวโน้มดัชนีกระตุ้นพฤติกรรมเทียบเคียงแอมโมเนียสะสม</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-[10.5px] font-mono text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{timeframe} View</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }}
                  labelClassName="text-slate-400 font-mono"
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
                <Line 
                  name="กิจกรรมฝูงไก่ (Activity Index %)" 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  name="ระดับแก๊ส (NH3 ppm)" 
                  type="monotone" 
                  dataKey="ammonia" 
                  stroke="#38bdf8" 
                  strokeWidth={1.5} 
                />
                <Line 
                  name="อุณหภูมิเฉลี่ย (°C)" 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#fbbf24" 
                  strokeWidth={1.5} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Generate Smart AI Audit report directly */}
        <div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-100">AI สรุปผลสรุปทางการเลี้ยง</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              คลิกปุ่มด้านล่างเพื่อใช้สมาธิตรวจสอบความเชี่ยวชาญ AI (Gemini Agent) ออกใบประเมินฟาร์ม ข้อกังวล และระบุจุดปรับปรุงจากข้อมูลประวัติการเลี้ยงและเซ็นเซอร์ทั้งหมดโดยอัตโนมัติ
            </p>

            {generatingAIReport ? (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center text-center py-16 space-y-3">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-xs font-mono text-emerald-400">ประมวลผลคราวด์นวัตกรรม AI...</p>
                <p className="text-[10px] text-slate-500">กรองประวัติติดตาม 30 วัน ร่วมกับพฤติกรรม Node A</p>
              </div>
            ) : generatedResult ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/20 text-xs font-sans text-slate-350 leading-relaxed space-y-3 max-h-[290px] overflow-y-auto">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  สรุปความเห็นของสัตวแพทย์ AI
                </h4>
                <div className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-300">
                  {generatedResult}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-xl p-10 text-center flex flex-col items-center justify-center py-20 space-y-2">
                <CircleAlert className="w-6 h-6 text-slate-700" />
                <p className="text-[11.5px] text-slate-550">รายงาน AI ออดิตฟาร์มยังไม่ถูกสร้าง</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={simulateAIReport}
              disabled={generatingAIReport}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generatedResult ? 'อัพเดทรายงานอัจฉริยะ' : 'รันรายงานอัจฉริยะโดย AI'}</span>
            </button>
            <button
              onClick={() => {
                alert("จำลองระบบ: นำข้อมูลส่งออกเป็นไฟล์สัมปทานเลี้ยง (.CSV) เรียบร้อยแล้ว!");
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดส่งประมวลผล (.CSV)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
