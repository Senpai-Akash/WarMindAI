import React, { useState, useEffect } from 'react';
import './index.css';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  AlertTriangle, Crosshair, ShieldAlert, Cpu, Activity, Eye, Info, Database 
} from 'lucide-react';

// Replace the old mock hook in your React App.jsx with this:
const useAIInferenceStream = () => {
  const [data, setData] = useState({
    threatScore: 0, threatLevel: 'LOW', confidence: 100, fps: 0,
    detections: [], behavior: { loitering: false, grouping: false, anomalyScore: 0 }, xaiFactors: []
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/live');
    
    ws.onmessage = (event) => {
      const liveData = JSON.parse(event.data);
      setData(liveData);
    };

    return () => ws.close();
  }, []);

  return data;
};

// --- COMPONENTS ---

const Panel = ({ title, children, critical = false, icon: Icon }) => (
  <div className={`bg-tactical-panel border-2 p-4 flex flex-col ${critical ? 'border-tactical-red animate-pulse' : 'border-tactical-border'}`}>
    <div className={`flex items-center gap-2 mb-4 border-b pb-2 ${critical ? 'border-tactical-red text-tactical-red' : 'border-tactical-border text-tactical-green'}`}>
      {Icon && <Icon size={18} />}
      <h2 className="font-mono text-sm tracking-widest uppercase">{title}</h2>
    </div>
    <div className="flex-1 text-white font-mono text-sm">
      {children}
    </div>
  </div>
);

const ProgressBar = ({ label, value, max = 1, colorClass = "bg-tactical-green" }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{(percentage).toFixed(1)}%</span>
      </div>
      <div className="w-full bg-tactical-border h-2 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.max(0, percentage)}%` }} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('surveillance');
  const [isXaiOpen, setIsXaiOpen] = useState(false);
  const aiData = useAIInferenceStream();
  const isCritical = aiData.threatLevel === 'CRITICAL';

  // Mock Analytics Data
  const trendData = [
    { time: '0000', threats: 2 }, { time: '0400', threats: 1 }, { time: '0800', threats: 5 },
    { time: '1200', threats: 12 }, { time: '1600', threats: 4 }, { time: '2000', threats: 8 }
  ];

  return (
    <div className="min-h-screen bg-tactical-bg text-gray-300 font-sans flex flex-col selection:bg-tactical-green selection:text-black">
      
      {/* HEADER */}
      <header className="border-b-2 border-tactical-border p-4 flex justify-between items-center bg-black z-10">
        <div className="flex items-center gap-3">
          <ShieldAlert className={isCritical ? "text-tactical-red" : "text-tactical-green"} />
          <h1 className="text-xl font-mono tracking-widest text-white uppercase">
            Aegis AI <span className="text-tactical-border">||</span> Intrusion Det. Sys.
          </h1>
        </div>
        <div className="flex gap-6 font-mono text-sm items-center">
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-tactical-green animate-pulse"></span>
            <span>NODE: BENGALURU_SEC_1</span>
          </div>
          <div className="text-tactical-green border border-tactical-green px-2 py-1">
            FPS: {aiData.fps} | LATENCY: 12ms
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <nav className="w-64 border-r-2 border-tactical-border bg-black flex flex-col p-4 gap-2 font-mono text-sm">
          {[
            { id: 'surveillance', icon: Eye, label: 'Live Inference' },
            { id: 'alerts', icon: AlertTriangle, label: 'Threat Alerts' },
            { id: 'analytics', icon: Activity, label: 'AI Analytics' },
            { id: 'monitoring', icon: Cpu, label: 'Model Metrics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3 text-left transition-colors border ${
                activeTab === tab.id 
                  ? 'bg-tactical-border/50 text-tactical-green border-tactical-green' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-tactical-border'
              }`}
            >
              <tab.icon size={16} />
              {tab.label.toUpperCase()}
            </button>
          ))}
          
          <div className="mt-auto">
             <button 
              onClick={() => setIsXaiOpen(!isXaiOpen)}
              className="w-full flex items-center justify-center gap-2 p-3 border-2 border-purple-500/50 text-purple-400 hover:bg-purple-900/20 transition-all uppercase"
            >
              <Info size={16} /> XAI Engine {isXaiOpen ? 'ON' : 'OFF'}
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          
          {/* TAB 1: SURVEILLANCE DASHBOARD */}
          {activeTab === 'surveillance' && (
            <div className="grid grid-cols-3 gap-6 h-full">
              
              {/* LEFT COLUMN: Video Feed & Model Info */}
              <div className="col-span-2 flex flex-col gap-6">
                <div className={`relative flex-1 border-2 bg-black overflow-hidden flex items-center justify-center ${isCritical ? 'border-tactical-red shadow-[0_0_30px_rgba(255,0,60,0.3)]' : 'border-tactical-border'}`}>
                  {/* Simulated Camera Feed Background */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                  <span className="text-tactical-border text-2xl font-mono tracking-widest absolute">NO VIDEO SIGNAL // SIMULATION OVERLAY ACTIVE</span>
                  
                  {/* Simulated Bounding Boxes */}
                  {aiData.detections.map((det, i) => (
                    <div key={i} className={`absolute border-2 ${isCritical ? 'border-tactical-red' : 'border-tactical-green'}`} style={{ left: det.x, top: det.y, width: det.w, height: det.h }}>
                      <div className={`absolute -top-6 left-[-2px] px-1 text-xs font-mono text-black whitespace-nowrap ${isCritical ? 'bg-tactical-red' : 'bg-tactical-green'}`}>
                        {det.label} [{(det.conf).toFixed(1)}%]
                      </div>
                    </div>
                  ))}
                  
                  {/* HUD Overlay */}
                  <div className="absolute top-4 left-4 text-xs font-mono text-tactical-green">
                    CAM_03_SECTOR_7 <br/>
                    MODEL: YOLOv8n_Defense_v3.2
                  </div>
                </div>

                {/* Behavior Analysis Panel */}
                <Panel title="AI Behavior Analysis" icon={Crosshair}>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black p-3 border border-tactical-border">
                      <div className="text-xs text-gray-500 mb-1">Loitering</div>
                      <div className={aiData.behavior.loitering ? "text-tactical-red" : "text-tactical-green"}>
                        {aiData.behavior.loitering ? "DETECTED" : "NORMAL"}
                      </div>
                    </div>
                    <div className="bg-black p-3 border border-tactical-border">
                      <div className="text-xs text-gray-500 mb-1">Group Formation</div>
                      <div className={aiData.behavior.grouping ? "text-tactical-red" : "text-tactical-green"}>
                        {aiData.behavior.grouping ? "ANOMALY" : "NORMAL"}
                      </div>
                    </div>
                    <div className="bg-black p-3 border border-tactical-border">
                      <div className="text-xs text-gray-500 mb-1">Behavior Anomaly Score</div>
                      <div className="text-white">{(aiData.behavior.anomalyScore * 100).toFixed(1)} / 100</div>
                    </div>
                  </div>
                </Panel>
              </div>

              {/* RIGHT COLUMN: Threat Intel & XAI */}
              <div className="flex flex-col gap-6">
                
                {/* Threat Score Panel */}
                <Panel title="Real-Time Threat Intelligence" critical={isCritical} icon={ShieldAlert}>
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-mono mb-2 ${isCritical ? 'text-tactical-red' : 'text-tactical-green'}`}>
                      {aiData.threatScore.toFixed(2)}
                    </div>
                    <div className={`text-sm tracking-widest px-3 py-1 inline-block ${isCritical ? 'bg-tactical-red text-black' : 'bg-tactical-green text-black'}`}>
                      THREAT LEVEL: {aiData.threatLevel}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2 uppercase border-b border-tactical-border pb-1">AI Confidence Matrix</div>
                    <ProgressBar label="Overall Model Confidence" value={aiData.confidence} max={100} colorClass={isCritical ? 'bg-tactical-red' : 'bg-tactical-green'} />
                  </div>

                  {/* Explainable AI Breakout */}
                  <div className="mt-6 border border-purple-900/50 bg-purple-900/10 p-3">
                     <div className="text-xs text-purple-400 mb-3 flex items-center gap-2">
                       <Info size={14}/> XAI Factor Breakdown
                     </div>
                     {aiData.xaiFactors.map((factor, i) => (
                        <div key={i} className="flex justify-between text-xs mb-2 font-mono">
                          <span className="text-gray-400">{factor.factor}</span>
                          <span className={factor.weight > 0 ? "text-tactical-red" : "text-tactical-green"}>
                            {factor.weight > 0 ? '+' : ''}{factor.weight}
                          </span>
                        </div>
                     ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {/* TAB 2: AI ALERTS SYSTEM */}
          {activeTab === 'alerts' && (
             <div className="flex flex-col gap-4">
               <h2 className="text-xl font-mono text-tactical-green border-b border-tactical-border pb-2">AI Incident Log</h2>
               <div className="border border-tactical-red bg-tactical-red/10 p-4 font-mono">
                 <div className="flex justify-between items-start mb-2">
                   <span className="bg-tactical-red text-black px-2 py-1 text-xs font-bold">CRITICAL RISK // T-SCORE: 0.94</span>
                   <span className="text-xs text-gray-500">14:02:44 IST</span>
                 </div>
                 <p className="text-gray-300 text-sm mb-3">
                   <strong className="text-white">AI Reasoning Summary:</strong> AI detected an armed individual crossing restricted Zone 3 with 92% confidence. Threat classified as CRITICAL due to weapon presence (+0.45) and restricted zone breach (+0.35). Behavior analysis indicates tactical loitering.
                 </p>
                 <div className="flex gap-4 text-xs text-gray-500">
                    <span>Model: YOLOv8-Custom</span>
                    <span>Inf. Latency: 14ms</span>
                 </div>
               </div>
               <div className="border border-tactical-border bg-black p-4 font-mono opacity-60">
                 <div className="flex justify-between items-start mb-2">
                   <span className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold">MEDIUM RISK // T-SCORE: 0.45</span>
                   <span className="text-xs text-gray-500">11:14:02 IST</span>
                 </div>
                 <p className="text-gray-300 text-sm">
                   <strong className="text-white">AI Reasoning Summary:</strong> Unidentified civilian vehicle approaching secondary perimeter. Pattern recognized as lost civilian (78% confidence). Proceeding to monitor.
                 </p>
               </div>
             </div>
          )}

          {/* TAB 3 & 4 (Combined for brevity): ANALYTICS & MONITORING */}
          {(activeTab === 'analytics' || activeTab === 'monitoring') && (
            <div className="grid grid-cols-2 gap-6">
              <Panel title="Threat Frequency Trend" icon={Activity}>
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer>
                    <LineChart data={trendData}>
                      <XAxis dataKey="time" stroke="#333" tick={{fill: '#666', fontSize: 12}} />
                      <YAxis stroke="#333" tick={{fill: '#666', fontSize: 12}} />
                      <RechartsTooltip contentStyle={{backgroundColor: '#000', borderColor: '#333'}} />
                      <Line type="stepAfter" dataKey="threats" stroke="#00ff41" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Model Health & Metrics" icon={Database}>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b border-tactical-border pb-1">
                    <span className="text-gray-500">Deployment Version</span>
                    <span className="text-white">v3.2.1-edge</span>
                  </li>
                  <li className="flex justify-between border-b border-tactical-border pb-1">
                    <span className="text-gray-500">Last Retrained</span>
                    <span className="text-white">2026-02-18</span>
                  </li>
                  <li className="flex justify-between border-b border-tactical-border pb-1">
                    <span className="text-gray-500">mAP (Validation)</span>
                    <span className="text-tactical-green">94.2%</span>
                  </li>
                  <li className="flex justify-between border-b border-tactical-border pb-1">
                    <span className="text-gray-500">False Positive Rate</span>
                    <span className="text-white">0.02%</span>
                  </li>
                  <li className="flex justify-between border-b border-tactical-border pb-1">
                    <span className="text-gray-500">Edge Optimization</span>
                    <span className="text-tactical-green">TensorRT INT8 ACTIVE</span>
                  </li>
                </ul>
              </Panel>
            </div>
          )}

          {/* XAI OVERLAY PANEL (The "Hackathon Winner" Feature) */}
          {isXaiOpen && (
            <div className="absolute top-0 right-0 w-1/3 h-full bg-black/95 border-l-2 border-purple-500 shadow-2xl p-6 overflow-y-auto backdrop-blur-sm transition-all z-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-purple-400 font-mono tracking-widest text-lg uppercase flex items-center gap-2">
                  <BrainCircuitIcon /> Decision Explanation Engine
                </h3>
                <button onClick={() => setIsXaiOpen(false)} className="text-gray-500 hover:text-white border border-gray-500 px-2 text-sm">CLOSE</button>
              </div>
              
              <div className="space-y-6 font-mono text-sm text-gray-300">
                <p>
                  <strong>Current Status:</strong> The engine translates opaque tensor outputs into human-readable logical deductions.
                </p>
                
                <div className="border border-purple-500/30 p-4 bg-purple-900/10">
                  <h4 className="text-purple-400 mb-2 border-b border-purple-500/30 pb-1">Class Probability Distribution</h4>
                  <ProgressBar label="Human_Armed" value={92} max={100} colorClass="bg-purple-500" />
                  <ProgressBar label="Human_Civilian" value={6} max={100} colorClass="bg-gray-600" />
                  <ProgressBar label="Wildlife" value={2} max={100} colorClass="bg-gray-600" />
                </div>

                <div className="border border-purple-500/30 p-4 bg-purple-900/10 relative">
                  <h4 className="text-purple-400 mb-2 border-b border-purple-500/30 pb-1">Simulated Heatmap Activation</h4>
                  {/* Mock Heatmap visualization box */}
                  <div className="h-32 bg-gray-900 relative mt-2 overflow-hidden border border-gray-700 flex items-center justify-center">
                    <div className="absolute w-16 h-16 bg-red-500/40 rounded-full blur-xl top-4 left-1/4"></div>
                    <div className="absolute w-24 h-24 bg-yellow-500/30 rounded-full blur-xl bottom-2 right-1/4"></div>
                    <span className="text-gray-600 text-xs z-10">Attention Layer 4 Visualization</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">High activation detected around metallic geometries (weapon contour proxy).</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Simple fallback icon component
function BrainCircuitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M19 18v-4" />
    </svg>
  );
}