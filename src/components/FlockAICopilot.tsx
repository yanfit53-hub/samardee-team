import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import { Message, Telemetry, Alert } from '../types';

interface FlockAICopilotProps {
  telemetry: Telemetry;
  alerts: Alert[];
  chickensCount: number;
}

export default function FlockAICopilot({ telemetry, alerts, chickensCount }: FlockAICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'สวัสดีครับ! ผมคือ **AI ผู้เชี่ยวชาญการเลี้ยงสัตว์และการจัดการฟาร์มไก่อัจฉริยะ** ยินดีต้อนรับสู่แดชบอร์ดติดตามฝูงไก่ของคุณ ผมพร้อมช่วยประเมินสถานะ วิเคราะห์พฤติกรรม และตรวจจับความผิดปกติจากข้อมูลเซ็นเซอร์ IoT และกล้องเรียลไทม์\n\n**หัวข้อที่ปรึกษาเลี้ยงไก่ได้เร่งด่วน:**\n* ดัชนีความเคลื่อนไหวลดลงบอกถึงความเครียดหรือโรค?\n* ตรวจเช็คค่าแอมโมเนีย {telemetry.ammoniaLevel} ppm ปัจจุบัน?\n* มีข้อเสนอแนะในการจัดการความร้อนอย่างไร?',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      // Craft the context for Gemini to make highly personalized recommendations
      const activeAlertsStr = alerts
        .filter(a => a.status === 'active')
        .map(a => `- [${a.severity.toUpperCase()}] ${a.message} ที่ ${a.location}`)
        .join('\n') || 'ไม่มีสัญญาณผิดปกติร้ายแรงในขณะนี้';

      const promptContext = `
[สภาวะฟาร์มและข้อมูลเซ็นเซอร์ IoT ณ ปัจจุบัน]:
- จำนวนไก่ทั้งหมดที่สแกนด้วยกล้อง IP Camera: ${chickensCount} ตัว
- จำนวนไก่กระฉับกระเฉงบิน/เดินปกติ: ${telemetry.activeCount} ตัว
- จำนวนไก่ที่ขยับตัวต่ำหรือนอนเฉื่อยชา: ${telemetry.inactiveCount} ตัว
- ดัชนีอัตราความเคลื่อนไหวฝูงไก่ (Average Movement index): ${telemetry.avgMovementIndex}%
- อุณหภูมิโรงเรือน: ${telemetry.temperature}°C (ปกติไม่ควรเกิน 32°C และต่ำกว่า 22°C)
- ความชื้นสัมพัทธ์ในอากาศ: ${telemetry.humidity}% RH
- ความหนาแน่นก๊าซแอมโมเนีย NH3: ${telemetry.ammoniaLevel} ppm (อันตรายหากเกิน 20 ppm)
- รายการการแจ้งเตือนจากระบบตรวจพบ:
${activeAlertsStr}

คำถามหรือประเด็นของเกษตรกรเจ้าของฟาร์ม:
"${textToSend}"

กรุณาใช้ความเชี่ยวชาญสัตวบาลทางเทคนิควิเคราะห์พฤติกรรมไก่ ตอบคำถามเป็นภาษาไทยอย่างเป็นมิตร สุภาพ มีระบบ และให้ข้อมูลที่สามารถนำไปปฏิบัติจริงในฟาร์มได้ทันที ใช้การจัดรูปแบบ Markdown (หัวข้อ, ขีดเส้นใต้, ตัวหนา) เพื่อให้อ่านจัดประเด็นง่ายขึ้น
`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptContext,
          systemInstruction: 'You are an AI Smart Farm Poultry Veterinarian expert. You speak Thai fluently. Analyze IoT readings and chicken movement speed. Provide actionable, precise veterinary advice in Markdown.'
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'ไม่สามารถรับข้อมูลวิเคราะห์จากระบบ AI ได้ในขณะนี้',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errMessage = err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกรุณาลองใหม่อีกครั้ง';
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `❌ ขออภัยด้วยครับ เกิดข้อผิดพลาดทางเทคนิค: ${errMessage}. กรุณาตรวจสอบว่าตั้งค่า API Key ครบถ้วนแล้วหรือไม่`,
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    { label: '📊 วิเคราะห์สุขภาพฝูงไก่ปัจจุบัน', prompt: 'โปรดสรุปข้อมูลและทำการวิเคราะห์สภาวะสุขภาพพฤติกรรมโดยรวมของฝูงไก่และสภาวะสิ่งแวดล้อมฟาร์ม และให้คะแนนสุขภาพทีมพร้อมคำแนะนำ' },
    { label: '🌡️ คำแนะนำคุมร้อนและความร้อนสะสม', prompt: 'อุณหภูมิตัวเรือนเวลานี้เหมาะกับอายุไก่หรือไม่? หากเกิดฮีทสโตรกหรือความร้อนสะสมควรแก้ไขเร่งด่วนอย่างไร?' },
    { label: '💨 ส่องอันตรายแก๊สแอมโมเนีย', prompt: 'ตรวจสอบสารแอมโมเนียและสภาพแวดล้อม แนะนำการกำจัดกลิ่นแกลบและระบายอากาศเพื่อให้ทางเดินประสาทตาไก่ปกติ' },
  ];

  return (
    <div id="ai-copilot-container" className="bg-[#0f172a] border border-slate-800/80 rounded-2xl shadow-xl flex flex-col h-[520px] relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
      {/* Copilot Header */}
      <div id="ai-copilot-header" className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#020617] rounded-t-2xl z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Smart Veterinarian AI
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              สัตวแพทย์ปัญญาประดิษฐ์ออนไลน์ 24 ชม
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-400 font-mono">Gemini-3.5-Flash</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#020617]/35 z-10"
      >
        {messages.map((m) => (
          <div 
            id={`chat-msg-${m.id}`}
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`p-2 rounded-xl flex-shrink-0 h-9 w-9 flex items-center justify-center ${
              m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl p-3.5 text-xs text-slate-200 leading-relaxed font-sans ${
              m.sender === 'user' 
                ? 'bg-emerald-600/25 border border-emerald-500/20 rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 rounded-tl-none ring-1 ring-slate-800/10'
            }`}>
              {/* Simple replacement of raw markdown styles to basic breaks & bolding for visuals */}
              <div className="whitespace-pre-wrap space-y-1">
                {m.text.split('\n').map((line, idx) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={idx} className="font-bold text-emerald-400 text-sm mt-2">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('* ')) {
                    return <li key={idx} className="ml-3 list-disc text-slate-300">{line.replace(/^\*\s*/, '')}</li>;
                  }
                  // Identify lists or headers
                  let formatted = line;
                  // Handle bold inline tags
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  if (line.includes('**')) {
                    const parts = [];
                    let lastIdx = 0;
                    let match;
                    while ((match = boldRegex.exec(line)) !== null) {
                      parts.push(line.substring(lastIdx, match.index));
                      parts.push(<strong key={match.index} className="text-emerald-450 font-bold">{match[1]}</strong>);
                      lastIdx = boldRegex.lastIndex;
                    }
                    parts.push(line.substring(lastIdx));
                    return <p key={idx} className="leading-relaxed">{parts}</p>;
                  }

                  return <p key={idx} className="leading-relaxed">{line}</p>;
                })}
              </div>
              <span className="text-[9px] text-slate-500 block text-right mt-1.5 font-mono">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="p-2 bg-slate-800 text-slate-200 rounded-xl h-9 w-9 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400 animate-bounce" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>AI สัตวแพทยอัจฉริยะกำลังอ่านพฤติกรรมไก่และประมวลผลคำแนะนำ...</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Action Suggestions */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
        {presetQuestions.map((q, i) => (
          <button
            id={`preset-question-${i}`}
            key={i}
            onClick={() => sendMessage(q.prompt)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-full text-[10px] font-sans border border-slate-800 cursor-pointer flex items-center gap-1 hover:text-emerald-400"
          >
            {i === 0 ? <Lightbulb className="w-3 h-3 text-yellow-400" /> : i === 1 ? <AlertTriangle className="w-3 h-3 text-rose-400" /> : <Bot className="w-3 h-3 text-blue-400" />}
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 rounded-b-2xl flex gap-2"
      >
        <input
          id="chat-user-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ถามสัตวแพทย์ AI (คู่มือโรค, ปัญหาระบบระบายอากาศ, อัตรากินอาหาร)..."
          className="flex-1 bg-slate-900 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50 font-sans"
        />
        <button
          id="chat-send-button"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white rounded-xl transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
