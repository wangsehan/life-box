import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Clock, Sun, BookOpen, Coffee, ArrowRight, Sparkles, AlertCircle, RotateCcw, Plus, X, Smile, Camera, MapPin, ChevronDown, Trash2, List, Baby, User } from 'lucide-react';

// --- 数据常量定义 ---

// 分年龄段的精选互动建议库 (每个阶段 12 条)
const AGE_BASED_ACTIONS = {
  toddler: [ // 0-3岁：感官与依恋
    "在洗澡时玩吹泡泡比赛",
    "用手电筒在天花板上玩影子游戏",
    "把纸箱做成一个秘密城堡",
    "一起躺在草地上看云朵形状",
    "玩'躲猫猫'，假装找不到他",
    "让他帮你'洗'一个塑料碗",
    "一起在镜子前做搞怪鬼脸",
    "把米饭捏成小动物的形状",
    "下雨天穿雨靴去踩水坑",
    "用手指颜料在纸上乱涂乱画",
    "把他像卷饼一样卷在被子里",
    "给最喜欢的毛绒玩具开'茶话会'"
  ],
  preschool: [ // 3-6岁：探索与想象
    "一起画一张'未来的藏宝图'",
    "去超市只买一种颜色的零食",
    "早起10分钟，去楼下观察虫子",
    "把客厅的垫子搭成'岩浆'挑战",
    "一起种一颗容易发芽的豆子",
    "用废旧袜子做一个手偶",
    "在睡前编一个他是主角的故事",
    "让他帮你按电梯按钮",
    "一起做一顿'乱七八糟'的三明治",
    "在公园里寻找三种不同的叶子",
    "玩'木头人'游戏",
    "把家里关灯，用荧光棒开舞会"
  ],
  school: [ // 6-12岁：合作与技能
    "今晚一起看一部经典的动画电影",
    "教他做一个简单的科学实验(如火山爆发)",
    "一起玩一款他喜欢的电子游戏",
    "去图书馆让他挑书给你看",
    "在周末尝试做一道从未吃过的菜",
    "一起拼一个超过500块的乐高",
    "去户外放一次风筝",
    "写一封信给'未来的自己'",
    "骑自行车去探索一条新路线",
    "玩桌游，并且不故意让他赢",
    "一起整理旧玩具并捐赠一部分",
    "在后院或阳台来一次'露营'"
  ],
  teen: [ // 13-18岁：尊重与连接
    "请他教你使用一个新流行APP",
    "在这个周末带他去喝杯咖啡/奶茶",
    "一起听他歌单里的一首歌",
    "在这个月允许他熬夜一次看比赛",
    "让他决定今晚全家吃什么",
    "聊聊你年轻时做过的糗事",
    "一起去看一场深夜场的电影",
    "只倾听不评价地聊10分钟天",
    "给他发一条'无论如何我都爱你'的信息",
    "陪他去买一件他很想要的衣服",
    "支持他尝试一个新的爱好",
    "一起计划一次毕业旅行"
  ]
};

// --- 子组件 ---

const BirthDateSelector = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i); // 扩大年份范围
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [y, m, d] = value ? value.split('-') : ['', '', ''];

  const handleChange = (type, val) => {
    let newY = y || currentYear;
    let newM = m || '01';
    let newD = d || '01';

    if (type === 'year') newY = val;
    if (type === 'month') newM = val.toString().padStart(2, '0');
    if (type === 'day') newD = val.toString().padStart(2, '0');

    onChange(`${newY}-${newM}-${newD}`);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="relative">
        <select 
          value={y} 
          onChange={(e) => handleChange('year', e.target.value)}
          className="w-full p-4 bg-white rounded-xl border border-orange-200 appearance-none outline-none focus:border-orange-500 font-bold text-slate-700"
        >
          <option value="" disabled>年</option>
          {years.map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select 
          value={parseInt(m).toString()} 
          onChange={(e) => handleChange('month', e.target.value)}
          className="w-full p-4 bg-white rounded-xl border border-orange-200 appearance-none outline-none focus:border-orange-500 font-bold text-slate-700"
        >
          <option value="" disabled>月</option>
          {months.map(month => (
            <option key={month} value={month}>{month}月</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select 
          value={parseInt(d).toString()}
          onChange={(e) => handleChange('day', e.target.value)}
          className="w-full p-4 bg-white rounded-xl border border-orange-200 appearance-none outline-none focus:border-orange-500 font-bold text-slate-700"
        >
          <option value="" disabled>日</option>
          {days.map(day => (
            <option key={day} value={day}>{day}日</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
};

const SetupView = ({ childName, setChildName, birthDate, setBirthDate, handleStart }) => (
  <div className="flex flex-col h-full bg-orange-50 p-8 justify-center items-center text-center">
    <div className="bg-white p-4 rounded-3xl shadow-lg mb-8 animate-bounce">
      <Clock size={48} className="text-orange-500" />
    </div>
    <h1 className="text-3xl font-black text-slate-800 mb-2">时光小格</h1>
    <p className="text-slate-500 mb-10 max-w-xs">“在孩子去上大学之前，你大约只有 18 个夏天与他们朝夕相处。”</p>

    <div className="w-full max-w-xs space-y-6">
      <div className="text-left">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">孩子的昵称</label>
        <input 
          type="text" 
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="例如：小土豆"
          className="w-full p-4 rounded-xl border border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-lg text-slate-800 placeholder:font-normal"
        />
      </div>

      <div className="text-left">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">出生日期</label>
        <BirthDateSelector value={birthDate} onChange={setBirthDate} />
      </div>

      <button 
        onClick={handleStart}
        disabled={!childName || !birthDate}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8 flex items-center justify-center gap-2 active:scale-95"
      >
        开始倒计时 <ArrowRight size={18} />
      </button>
    </div>
  </div>
);

// 新增组件：体验卡片
const ExperienceCard = ({ icon, title, count, unit, colorClass, borderClass, textClass }) => (
  <div className={`${colorClass} ${borderClass} border p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden`}>
    <div className={`flex items-center gap-2 mb-1 ${textClass}`}>
      {icon}
      <span className="font-bold text-xs uppercase">{title}</span>
    </div>
    <div className="z-10">
      <p className="text-3xl font-black text-slate-800 leading-none">{count > 0 ? count : 0}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-1">{unit}</p>
    </div>
    {/* 装饰背景 */}
    <div className="absolute -bottom-4 -right-4 opacity-10 scale-150 text-slate-800">
      {icon}
    </div>
  </div>
);

const DashboardView = ({ stats, handleReset, memories, openMemoryModal, currentAction, refreshAction }) => (
  <div className="flex flex-col h-full bg-white relative">
    {/* 顶部统计区 */}
    <div className="px-6 pt-10 pb-6 bg-slate-50 rounded-b-[40px] shadow-sm z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm text-slate-400 font-bold uppercase tracking-widest">距离 18 岁</h2>
          <h1 className="text-3xl font-black text-slate-800 mt-1">
            还剩 <span className="text-orange-500">{stats.remainingSummers}</span> 个夏天
          </h1>
        </div>
        <button onClick={handleReset} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 active:scale-95 transition-transform">
          <RotateCcw size={16} />
        </button>
      </div>
      
      {/* 进度条 */}
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-slate-800 transition-all duration-1000 ease-out" 
          style={{ width: `${stats.percent}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
        <span>0 岁</span>
        <span>{stats.percent}% 已流逝</span>
        <span>18 岁</span>
      </div>
    </div>

    {/* 核心区：可滚动内容 */}
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      
      {/* 体验倒计时卡片组 (Grid Layout) */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Clock size={18} className="text-orange-500"/>
          正在消失的时光 (Expiring Moments)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ExperienceCard 
            icon={<Baby size={20} />} 
            title="抱抱/举高高" 
            count={stats.remainingPickUps} 
            unit="天 (假设到6岁)"
            colorClass="bg-pink-50"
            borderClass="border-pink-100"
            textClass="text-pink-600"
          />
          <ExperienceCard 
            icon={<BookOpen size={20} />} 
            title="睡前故事" 
            count={stats.remainingStories} 
            unit="次 (假设到9岁)"
            colorClass="bg-blue-50"
            borderClass="border-blue-100"
            textClass="text-blue-600"
          />
          <ExperienceCard 
            icon={<Sun size={20} />} 
            title="暑假旅行" 
            count={stats.remainingSummers} 
            unit="次 (直到18岁)"
            colorClass="bg-orange-50"
            borderClass="border-orange-100"
            textClass="text-orange-600"
          />
          <ExperienceCard 
            icon={<Coffee size={20} />} 
            title="周末赖床" 
            count={stats.remainingCuddles} 
            unit="次 (假设到10岁)"
            colorClass="bg-purple-50"
            borderClass="border-purple-100"
            textClass="text-purple-600"
          />
        </div>
      </div>

      {/* 人生格子 */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-orange-500"/>
            人生格子 (Life in Months)
          </h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold">
            点亮回忆 ✨
          </span>
        </div>
        
        <div className="grid grid-cols-12 gap-1.5 mx-auto max-w-[340px]">
          {Array.from({ length: 216 }).map((_, i) => {
            const isPassed = i < stats.monthsPassed;
            const isCurrent = i === stats.monthsPassed;
            
            // 获取当前格子的所有记忆
            const gridMemories = memories[i] || [];
            const hasMemory = gridMemories.length > 0;
            const latestMemory = hasMemory ? gridMemories[gridMemories.length - 1] : null;
            
            return (
              <button 
                key={i}
                onClick={() => openMemoryModal(i)}
                disabled={!isPassed && !isCurrent}
                className={`
                  aspect-square rounded-[3px] transition-all duration-300 relative flex items-center justify-center
                  ${hasMemory 
                    ? 'bg-indigo-100 ring-1 ring-indigo-200 scale-105 z-10' // Memory Grid
                    : isPassed 
                      ? 'bg-slate-800 hover:bg-slate-700' // Passed Grid
                      : isCurrent 
                        ? 'bg-orange-500 animate-pulse shadow-lg ring-2 ring-orange-200' // Current
                        : 'bg-slate-100 border border-slate-200' // Future
                  }
                `}
              >
                {/* 显示最新一条的 Emoji */}
                {hasMemory && <span className="text-[8px] leading-none">{latestMemory.emoji}</span>}
                
                {/* 如果有多条记忆，显示小红点 */}
                {gridMemories.length > 1 && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部功能：本周灵感 */}
      <div className="pb-8">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-orange-500"/>
          本周亲子灵感 ({stats.phaseName})
        </h3>
        
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} />
          </div>
          
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">MISSION OF THE WEEK</p>
          <p className="text-lg font-bold leading-relaxed mb-4 pr-4">
            “{currentAction}”
          </p>
          
          <button 
            onClick={refreshAction}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs py-2 px-4 rounded-lg font-bold transition-all flex items-center gap-2"
          >
            <RotateCcw size={12} />
            换一个点子
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- 主组件 ---

export default function TimeGrids() {
  const [childName, setChildName] = useState(() => localStorage.getItem('tg_child_name') || '');
  const [birthDate, setBirthDate] = useState(() => localStorage.getItem('tg_birth_date') || '');
  
  const [memories, setMemories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tg_memories')) || {};
      Object.keys(saved).forEach(key => {
        if (saved[key] && !Array.isArray(saved[key])) {
          saved[key] = [{ ...saved[key], id: Date.now() }];
        }
      });
      return saved;
    } catch {
      return {};
    }
  });

  const [view, setView] = useState(() => {
    const hasData = localStorage.getItem('tg_child_name') && localStorage.getItem('tg_birth_date');
    return hasData ? 'dashboard' : 'setup';
  });

  const [stats, setStats] = useState(null);
  const [activeGridIndex, setActiveGridIndex] = useState(null);
  const [memoryInput, setMemoryInput] = useState({ emoji: '🌟', text: '' });
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => { localStorage.setItem('tg_child_name', childName); }, [childName]);
  useEffect(() => { localStorage.setItem('tg_birth_date', birthDate); }, [birthDate]);
  useEffect(() => { localStorage.setItem('tg_memories', JSON.stringify(memories)); }, [memories]);

  useEffect(() => {
    if (birthDate && birthDate.split('-').length === 3) {
      calculateStats(birthDate);
    }
  }, [birthDate]);

  // 当统计数据更新时，初始化第一条建议
  useEffect(() => {
    if (stats) {
      generateNewAction(stats.agePhase);
    }
  }, [stats]); // Removed generateNewAction from deps to avoid loop, it's defined below but depends on nothing external

  const generateNewAction = (phase) => {
    const ideas = AGE_BASED_ACTIONS[phase] || AGE_BASED_ACTIONS['school'];
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    setCurrentAction(random);
  }

  const calculateStats = (dateStr) => {
    const start = new Date(dateStr);
    const now = new Date();
    
    if (isNaN(start.getTime())) return;

    const totalMonths = 18 * 12;
    
    let monthsPassed = (now.getFullYear() - start.getFullYear()) * 12;
    monthsPassed -= start.getMonth();
    monthsPassed += now.getMonth();
    
    if (monthsPassed < 0) monthsPassed = 0;
    if (monthsPassed > totalMonths) monthsPassed = totalMonths;

    const percent = Math.floor((monthsPassed / totalMonths) * 100);
    // 精确年龄计算
    let age = now.getFullYear() - start.getFullYear();
    if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
      age--;
    }
    
    // 确定年龄阶段
    let agePhase = 'school';
    let phaseName = '学龄期';
    if (age < 3) { agePhase = 'toddler'; phaseName = '依恋期'; }
    else if (age < 6) { agePhase = 'preschool'; phaseName = '探索期'; }
    else if (age >= 13) { agePhase = 'teen'; phaseName = '独立期'; }

    // 计算剩余天数/次数
    // 假设：抱抱直到6岁，睡前故事直到9岁，周末赖床直到10岁
    const daysInYear = 365;
    const weeksInYear = 52;

    const remainingPickUps = age < 6 ? (6 - age) * daysInYear : 0;
    const remainingStories = age < 9 ? (9 - age) * daysInYear : 0;
    const remainingCuddles = age < 10 ? (10 - age) * weeksInYear : 0;

    setStats({
      totalMonths,
      monthsPassed,
      percent,
      age,
      agePhase,
      phaseName,
      remainingSummers: 18 - age > 0 ? 18 - age : 0,
      remainingPickUps,
      remainingStories,
      remainingCuddles
    });
  };

  const handleStart = () => {
    if (childName && birthDate) setView('dashboard');
  };

  const handleReset = () => {
    if (window.confirm('确定要重置吗？这将清除所有记录的美好回忆，且无法恢复。')) {
      setChildName('');
      setBirthDate('');
      setMemories({});
      setView('setup');
      localStorage.removeItem('tg_child_name');
      localStorage.removeItem('tg_birth_date');
      localStorage.removeItem('tg_memories');
    }
  };

  const openMemoryModal = (index) => {
    if (index <= stats.monthsPassed) {
      setActiveGridIndex(index);
      setMemoryInput({ emoji: '🌟', text: '' }); 
    }
  };

  const addMemory = () => {
    if (memoryInput.text.trim()) {
      const newMemory = { ...memoryInput, id: Date.now() };
      const currentList = memories[activeGridIndex] || [];
      
      setMemories({
        ...memories,
        [activeGridIndex]: [...currentList, newMemory]
      });
      setMemoryInput({ emoji: '🌟', text: '' });
    }
  };

  const deleteMemory = (memoryId) => {
    const currentList = memories[activeGridIndex] || [];
    const newList = currentList.filter(m => m.id !== memoryId);
    
    if (newList.length === 0) {
      const newMemories = { ...memories };
      delete newMemories[activeGridIndex];
      setMemories(newMemories);
    } else {
      setMemories({
        ...memories,
        [activeGridIndex]: newList
      });
    }
  };

  const refreshAction = () => {
    if (stats) {
      generateNewAction(stats.agePhase);
    }
  };

  // 计算当前弹窗标题的月份
  const getGridDateLabel = (index) => {
    if (!birthDate) return "";
    const date = new Date(birthDate);
    date.setMonth(date.getMonth() + index);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <div className="max-w-md mx-auto h-screen overflow-hidden font-sans shadow-2xl relative bg-white">
      {view === 'setup' ? (
        <SetupView 
          childName={childName} 
          setChildName={setChildName} 
          birthDate={birthDate} 
          setBirthDate={setBirthDate} 
          handleStart={handleStart} 
        />
      ) : (
        stats && (
          <DashboardView 
            stats={stats} 
            handleReset={handleReset} 
            memories={memories} 
            openMemoryModal={openMemoryModal}
            currentAction={currentAction}
            refreshAction={refreshAction}
          />
        )
      )}

      {/* 弹窗：回忆列表管理 */}
      {activeGridIndex !== null && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">回忆胶囊</h3>
                <p className="text-xs text-slate-400 font-bold">{getGridDateLabel(activeGridIndex)}</p>
              </div>
              <button onClick={() => setActiveGridIndex(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            {/* 列表区域 */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-[100px] border-b border-slate-100 pb-4">
              {(!memories[activeGridIndex] || memories[activeGridIndex].length === 0) ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                  <List size={32} className="mb-2 opacity-50" />
                  <p className="text-xs">这个月还没有记录<br/>添加第一条回忆吧！</p>
                </div>
              ) : (
                memories[activeGridIndex].map((m) => (
                  <div key={m.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-sm text-slate-700 font-medium flex-1 truncate">{m.text}</span>
                    <button 
                      onClick={() => deleteMemory(m.id)}
                      className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* 添加区域 */}
            <div>
              <div className="flex gap-3 mb-3">
                <div className="flex-shrink-0">
                  <input 
                    type="text" 
                    value={memoryInput.emoji}
                    onChange={(e) => setMemoryInput({...memoryInput, emoji: e.target.value})}
                    className="w-12 h-12 text-center text-2xl bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-colors"
                    maxLength={2}
                    placeholder="🌟"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={memoryInput.text}
                    onChange={(e) => setMemoryInput({...memoryInput, text: e.target.value})}
                    placeholder="发生了什么美好瞬间..."
                    className="w-full h-12 px-4 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-colors text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addMemory()}
                  />
                </div>
              </div>

              <button 
                onClick={addMemory}
                disabled={!memoryInput.text.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                添加这条记忆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}