import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, BookOpen, ArrowRight, Sparkles, RotateCcw, Plus, X, 
  ChevronDown, Trash2, List, GraduationCap, Plane, Utensils, Home, 
  Palette, Globe, Moon, Coffee, Cake, PartyPopper, Image as ImageIcon,
  AlertTriangle, ArrowLeft, History
} from 'lucide-react';

// --- 数据常量定义 ---

const AGE_BASED_ACTIONS = {
  toddler: [ 
    "在洗澡时玩吹泡泡比赛", "用手电筒在天花板上玩影子游戏", "把纸箱做成一个秘密城堡", "一起躺在草地上看云朵形状",
    "玩'躲猫猫'，假装找不到他", "让他帮你'洗'一个塑料碗", "一起在镜子前做搞怪鬼脸", "把米饭捏成小动物的形状",
    "下雨天穿雨靴去踩水坑", "用手指颜料在纸上乱涂乱画", "把他像卷饼一样卷在被子里", "给最喜欢的毛绒玩具开'茶话会'"
  ],
  preschool: [ 
    "一起画一张'未来的藏宝图'", "去超市只买一种颜色的零食", "早起10分钟，去楼下观察虫子", "把客厅的垫子搭成'岩浆'挑战",
    "一起种一颗容易发芽的豆子", "用废旧袜子做一个手偶", "在睡前编一个他是主角的故事", "让他帮你按电梯按钮",
    "一起做一顿'乱七八糟'的三明治", "在公园里寻找三种不同的叶子", "玩'木头人'游戏", "把家里关灯，用荧光棒开舞会"
  ],
  school: [ 
    "今晚一起看一部经典的动画电影", "教他做一个简单的科学实验", "一起玩一款他喜欢的电子游戏", "去图书馆让他挑书给你看",
    "在周末尝试做一道从未吃过的菜", "一起拼一个超过500块的乐高", "去户外放一次风筝", "写一封信给'未来的自己'",
    "骑自行车去探索一条新路线", "玩桌游，并且不故意让他赢", "一起整理旧玩具并捐赠一部分", "在后院或阳台来一次'露营'"
  ],
  teen: [ 
    "请他教你使用一个新流行APP", "在这个周末带他去喝杯咖啡/奶茶", "一起听他歌单里的一首歌", "在这个月允许他熬夜一次看比赛",
    "让他决定今晚全家吃什么", "聊聊你年轻时做过的糗事", "一起去看一场深夜场的电影", "只倾听不评价地聊10分钟天",
    "给他发一条'无论如何我都爱你'的信息", "陪他去买一件他很想要的衣服", "支持他尝试一个新的爱好", "一起计划一次毕业旅行"
  ]
};

// --- 主题系统 ---
const THEMES = {
  orange: {
    id: 'orange',
    name: '暖阳橙',
    colors: {
      bgSoft: 'bg-orange-50',
      bgGradient: 'from-orange-50 to-orange-100',
      textMain: 'text-orange-600',
      textDark: 'text-orange-900',
      border: 'border-orange-200',
      primary: 'bg-orange-500',
      ring: 'ring-orange-200',
      icon: 'text-orange-500',
      gridCurrent: 'bg-orange-500',
      missionGradient: 'from-orange-400 to-orange-600' 
    }
  },
  emerald: {
    id: 'emerald',
    name: '治愈绿',
    colors: {
      bgSoft: 'bg-emerald-50',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textMain: 'text-emerald-600',
      textDark: 'text-emerald-900',
      border: 'border-emerald-200',
      primary: 'bg-emerald-500',
      ring: 'ring-emerald-200',
      icon: 'text-emerald-500',
      gridCurrent: 'bg-emerald-500',
      missionGradient: 'from-emerald-400 to-emerald-600'
    }
  },
  sky: {
    id: 'sky',
    name: '静谧蓝',
    colors: {
      bgSoft: 'bg-sky-50',
      bgGradient: 'from-sky-50 to-sky-100',
      textMain: 'text-sky-600',
      textDark: 'text-sky-900',
      border: 'border-sky-200',
      primary: 'bg-sky-500',
      ring: 'ring-sky-200',
      icon: 'text-sky-500',
      gridCurrent: 'bg-sky-500',
      missionGradient: 'from-sky-400 to-sky-600'
    }
  },
  rose: {
    id: 'rose',
    name: '樱花粉',
    colors: {
      bgSoft: 'bg-rose-50',
      bgGradient: 'from-rose-50 to-rose-100',
      textMain: 'text-rose-600',
      textDark: 'text-rose-900',
      border: 'border-rose-200',
      primary: 'bg-rose-500',
      ring: 'ring-rose-200',
      icon: 'text-rose-500',
      gridCurrent: 'bg-rose-500',
      missionGradient: 'from-rose-400 to-rose-600'
    }
  }
};

// --- 工具函数 ---

const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const calculateAgeAtGrid = (birthDateStr, gridIndex) => {
  if (!birthDateStr) return "";
  const years = Math.floor(gridIndex / 12);
  const months = gridIndex % 12;
  if (years === 0) return `${months}个月`;
  if (months === 0) return `${years}岁`;
  return `${years}岁${months}个月`;
};

const calculateDateAtGrid = (birthDateStr, gridIndex) => {
  if (!birthDateStr) return "";
  const date = new Date(birthDateStr);
  date.setMonth(date.getMonth() + gridIndex);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

// --- 子组件 ---

const ThemeSelector = ({ currentTheme, setTheme }) => (
  <div className="flex gap-3 justify-center my-4">
    {Object.values(THEMES).map((theme) => (
      <button
        key={theme.id}
        onClick={() => setTheme(theme.id)}
        className={`
          w-8 h-8 rounded-full border-2 transition-all duration-300 cursor-pointer
          ${theme.colors.primary}
          ${currentTheme === theme.id ? 'scale-125 border-slate-600 shadow-md' : 'border-white opacity-70 hover:opacity-100 hover:scale-110'}
        `}
        title={theme.name}
        aria-label={`切换到${theme.name}`}
      />
    ))}
  </div>
);

const BirthDateSelector = ({ value, onChange, themeColors }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);
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
          className={`w-full p-4 bg-white rounded-xl border ${themeColors.border} appearance-none outline-none focus:border-current font-bold text-slate-700`}
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
          className={`w-full p-4 bg-white rounded-xl border ${themeColors.border} appearance-none outline-none focus:border-current font-bold text-slate-700`}
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
          className={`w-full p-4 bg-white rounded-xl border ${themeColors.border} appearance-none outline-none focus:border-current font-bold text-slate-700`}
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

const SetupView = ({ childName, setChildName, birthDate, setBirthDate, handleStart, currentThemeId, setTheme }) => {
  const safeThemeId = THEMES[currentThemeId] ? currentThemeId : 'orange';
  const theme = THEMES[safeThemeId].colors;

  return (
    <div className={`flex flex-col h-full ${theme.bgSoft} p-8 justify-center items-center text-center transition-colors duration-500`}>
      <div className="bg-white p-4 rounded-3xl shadow-lg mb-8 animate-bounce">
        <Clock size={48} className={theme.icon} />
      </div>
      <h1 className="text-3xl font-black text-slate-800 mb-2">时光小格</h1>
      <p className="text-slate-500 mb-6 max-w-xs">“在孩子去上大学之前，你大约只有 18 个夏天与他们朝夕相处。”</p>

      <div className="mb-8 p-3 bg-white/50 rounded-2xl backdrop-blur-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">选择主题风格</p>
        <ThemeSelector currentTheme={safeThemeId} setTheme={setTheme} />
      </div>

      <div className="w-full max-w-xs space-y-6">
        <div className="text-left">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">孩子的昵称</label>
          <input 
            type="text" 
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="例如：小土豆"
            className={`w-full p-4 rounded-xl border ${theme.border} focus:${theme.textMain} focus:ring-4 focus:ring-opacity-20 focus:ring-current outline-none transition-all font-bold text-lg text-slate-800 placeholder:font-normal`}
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">出生日期</label>
          <BirthDateSelector value={birthDate} onChange={setBirthDate} themeColors={theme} />
        </div>

        <button 
          onClick={handleStart}
          disabled={!childName || !birthDate}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8 flex items-center justify-center gap-2 active:scale-95 ${theme.primary}`}
        >
          开始倒计时 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ExperienceCard = ({ icon, title, count, unit, colorClass, borderClass, textClass, subtitle }) => (
  <div className={`${colorClass} ${borderClass} border p-4 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden transition-transform hover:scale-[1.02] shadow-sm`}>
    <div className={`flex items-center gap-2 mb-1 ${textClass}`}>
      {icon}
      <span className="font-bold text-xs uppercase tracking-wider">{title}</span>
    </div>
    <div className="z-10">
      <p className="text-2xl font-black text-slate-800 leading-none">{count > 0 ? count : 0}</p>
      <p className="text-[10px] text-slate-600 font-medium mt-1">{unit}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 opacity-10 scale-150 text-slate-800 rotate-12">
      {icon}
    </div>
  </div>
);

const TimelineView = ({ memories, birthDate, onBack, currentThemeId }) => {
  const safeThemeId = THEMES[currentThemeId] ? currentThemeId : 'orange';
  const theme = THEMES[safeThemeId].colors;

  const timelineEvents = Object.entries(memories).flatMap(([gridIndex, items]) => {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
      ...item,
      gridIndex: parseInt(gridIndex),
      dateLabel: calculateDateAtGrid(birthDate, parseInt(gridIndex)),
      ageLabel: calculateAgeAtGrid(birthDate, parseInt(gridIndex))
    }));
  }).sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="px-6 pt-8 pb-4 bg-white shadow-sm z-10 flex items-center gap-4 sticky top-0">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-xl font-black ${theme.textDark}`}>人生轨迹</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {timelineEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
            <History size={48} className="mb-4 opacity-20" />
            <p className="text-sm">还没有记录任何回忆...</p>
            <p className="text-xs mt-2 opacity-60">去点击格子，写下第一个瞬间吧！</p>
          </div>
        ) : (
          <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative pl-6">
                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white ${theme.primary} shadow-sm`}></div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-sm font-black ${theme.textMain}`}>{event.ageLabel}</span>
                  <span className="text-xs text-slate-400 font-medium">{event.dateLabel}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {event.image && (
                    <div className="mb-3 -mx-4 -mt-4">
                      <img src={event.image} alt="memory" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 pt-0.5">{event.emoji}</span>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{event.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardView = ({ stats, handleResetClick, memories, openMemoryModal, currentAction, refreshAction, currentThemeId, setTheme, onOpenTimeline }) => {
  const safeThemeId = THEMES[currentThemeId] ? currentThemeId : 'orange';
  const theme = THEMES[safeThemeId].colors;
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleThemeSelect = (id) => {
    setTheme(id);
    setShowThemeMenu(false);
  };

  const getGridDateLabel = (index) => {
    if (!stats.birthDateStr) return "";
    const date = new Date(stats.birthDateStr);
    date.setMonth(date.getMonth() + index);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 顶部 Super Header */}
      <div className="relative z-20">
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} rounded-b-[48px] shadow-lg -z-10 transition-colors duration-500 overflow-hidden`}>
           <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
             <Globe size={200} className={theme.textMain} />
           </div>
        </div>

        <div className="px-6 pt-12 pb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${theme.primary}`}></div>
              <span className={`text-xs font-bold tracking-widest uppercase ${theme.textMain}`}>Time Grids</span>
            </div>
            
            <div className="flex gap-2 items-center">
               <div className="relative">
                 <button 
                    onClick={() => setShowThemeMenu(!showThemeMenu)} 
                    className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm text-slate-600 hover:text-slate-900 active:scale-95 transition-transform border border-white/50"
                  >
                    <Palette size={16} />
                 </button>
                 {showThemeMenu && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 min-w-[160px] animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 text-center">切换主题</p>
                    <ThemeSelector currentTheme={safeThemeId} setTheme={handleThemeSelect} />
                  </div>
                 )}
               </div>

              <button 
                onClick={handleResetClick} 
                className="px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-full shadow-sm text-slate-500 hover:text-red-600 hover:bg-white/80 active:scale-95 transition-all border border-white/50 text-[10px] font-bold"
              >
                清除数据
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 opacity-70 ${theme.textDark}`}>
              已来到人间 / Days on Earth
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-slate-600">累计</span>
              <span className={`text-7xl font-serif font-black tracking-tighter leading-none ${theme.textMain} drop-shadow-sm`}>
                {stats.daysAlive}
              </span>
              <span className="text-2xl font-medium text-slate-600">天</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2 text-xs font-bold opacity-60 text-slate-600">
              <span>0 岁</span>
              <span>{stats.percent}% 已流逝</span>
              <span>18 岁</span>
            </div>
            <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm shadow-inner border border-white/20">
              <div 
                className={`h-full ${theme.primary} transition-all duration-1000 ease-out relative`} 
                style={{ width: `${stats.percent}%` }}
              >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心区 */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative z-10">
        
        {/* 体验倒计时卡片组 - 2x2 布局 - 已修复 */}
        <div className="mb-8">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
            <Clock size={16} className={theme.icon}/>
            正在消失的时光 (Cherish Moments)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* 1. 距18岁生日 */}
            <ExperienceCard 
              icon={<Cake size={20} />} 
              title="距18岁生日" 
              count={stats.daysUntilAdulthood} 
              unit="天"
              colorClass="bg-rose-50"
              borderClass="border-rose-100"
              textClass="text-rose-600"
              subtitle="成年倒计时"
            />
            {/* 2. 一起跨年 */}
            <ExperienceCard 
              icon={<PartyPopper size={20} />} 
              title="一起跨年" 
              count={stats.remainingSpringFestivals} 
              unit="次"
              colorClass="bg-red-50"
              borderClass="border-red-100"
              textClass="text-red-600"
              subtitle="还能共度多少个除夕"
            />
            {/* 3. 距离高考 */}
            <ExperienceCard 
              icon={<GraduationCap size={20} />} 
              title="距离高考" 
              count={stats.daysUntilGaokao} 
              unit="天"
              colorClass="bg-blue-50"
              borderClass="border-blue-100"
              textClass="text-blue-600"
              subtitle="距离6月7日"
            />
            {/* 4. 共度周末 */}
            <ExperienceCard 
              icon={<Home size={20} />} 
              title="共度周末" 
              count={stats.remainingWeekends} 
              unit="个"
              colorClass="bg-amber-50"
              borderClass="border-amber-100"
              textClass="text-amber-600"
              subtitle="还能共度多少个周末"
            />
          </div>
        </div>

        {/* 人生格子 */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Calendar size={16} className={theme.icon}/>
              人生格子 (Life in Months)
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onOpenTimeline}
                className={`text-[10px] ${theme.bgSoft} ${theme.textMain} px-3 py-1 rounded-full font-bold border ${theme.border} flex items-center gap-1 hover:opacity-80 transition-opacity`}
              >
                <List size={12} />
                人生轨迹
              </button>
              <span className={`text-[10px] ${theme.bgSoft} ${theme.textMain} px-2 py-1 rounded-full font-bold border ${theme.border}`}>
                点亮回忆 ✨
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-1.5 mx-auto max-w-[340px]">
            {Array.from({ length: 216 }).map((_, i) => {
              const isPassed = i < stats.monthsPassed;
              const isCurrent = i === stats.monthsPassed;
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
                      ? `bg-white ${theme.ring} ring-2 z-10 border-2 border-white shadow-sm` 
                      : isPassed 
                        ? 'bg-slate-800 hover:bg-slate-700' 
                        : isCurrent 
                          ? `${theme.gridCurrent} animate-pulse shadow-lg ${theme.ring} ring-4 ring-opacity-30 z-10 scale-110 rounded-sm` 
                          : 'bg-slate-100 border border-slate-200' 
                    }
                  `}
                >
                  {hasMemory && <span className="text-[8px] leading-none transform scale-110">{latestMemory.emoji}</span>}
                  {gridMemories.length > 1 && (
                    <div className={`absolute -top-1 -right-1 w-2 h-2 ${theme.gridCurrent} rounded-full border-2 border-white`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部功能 */}
        <div className="pb-8">
          <div className={`bg-gradient-to-br ${theme.missionGradient} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-6 opacity-20 transform group-hover:scale-110 transition-transform duration-700">
              <Sparkles size={100} />
            </div>
            
            <div className="flex items-center gap-2 mb-3">
               <span className="bg-white/30 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">Mission</span>
               <span className="text-white/90 text-xs font-bold">本周亲子灵感 ({stats.phaseName})</span>
            </div>
            
            <p className="text-xl font-bold leading-relaxed mb-6 pr-4 font-serif italic drop-shadow-sm">
              “{currentAction}”
            </p>
            
            <button 
              onClick={refreshAction}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20 shadow-sm"
            >
              <RotateCcw size={14} />
              换一个点子
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeGrids = () => {
  // 辅助函数
  const safeGetItem = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultVal;
    } catch (e) { return defaultVal; }
  };

  const safeGetJSON = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch (e) { return defaultVal; }
  };

  const [childName, setChildName] = useState(() => safeGetItem('tg_child_name', ''));
  const [birthDate, setBirthDate] = useState(() => safeGetItem('tg_birth_date', ''));
  
  const [currentThemeId, setTheme] = useState(() => {
    const saved = safeGetItem('tg_theme', 'orange');
    return THEMES[saved] ? saved : 'orange';
  });
  
  const [memories, setMemories] = useState(() => {
    const saved = safeGetJSON('tg_memories', {});
    Object.keys(saved).forEach(key => {
      if (saved[key] && !Array.isArray(saved[key])) {
        saved[key] = [{ ...saved[key], id: Date.now() }];
      }
    });
    return saved;
  });

  const [view, setView] = useState(() => {
    const hasData = safeGetItem('tg_child_name', '') && safeGetItem('tg_birth_date', '');
    return hasData ? 'dashboard' : 'setup';
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeGridIndex, setActiveGridIndex] = useState(null);
  const [memoryInput, setMemoryInput] = useState({ emoji: '🌟', text: '', image: null });
  const [currentAction, setCurrentAction] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => { try { localStorage.setItem('tg_child_name', childName); } catch {} }, [childName]);
  useEffect(() => { try { localStorage.setItem('tg_birth_date', birthDate); } catch {} }, [birthDate]);
  useEffect(() => { try { localStorage.setItem('tg_memories', JSON.stringify(memories)); } catch {} }, [memories]);
  useEffect(() => { try { localStorage.setItem('tg_theme', currentThemeId); } catch {} }, [currentThemeId]);

  useEffect(() => {
    if (birthDate && birthDate.split('-').length === 3) {
      calculateStats(birthDate);
    }
  }, [birthDate]);

  useEffect(() => {
    if (stats) {
      const ideas = AGE_BASED_ACTIONS[stats.agePhase] || AGE_BASED_ACTIONS['school'];
      const random = ideas[Math.floor(Math.random() * ideas.length)];
      setCurrentAction(random);
    }
  }, [stats]);

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
    let age = now.getFullYear() - start.getFullYear();
    if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
      age--;
    }
    
    let agePhase = 'school';
    let phaseName = '学龄期';
    if (age < 3) { agePhase = 'toddler'; phaseName = '依恋期'; }
    else if (age < 6) { agePhase = 'preschool'; phaseName = '探索期'; }
    else if (age >= 13) { agePhase = 'teen'; phaseName = '独立期'; }

    const weeksInYear = 52;
    const timeDiffAlive = Math.abs(now - start);
    const daysAlive = Math.ceil(timeDiffAlive / (1000 * 60 * 60 * 24));

    const end18 = new Date(start);
    end18.setFullYear(start.getFullYear() + 18);
    end18.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    const timeDiff = end18 - now;
    const daysUntilAdulthood = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const gaokaoYear = start.getFullYear() + 18;
    const gaokaoDate = new Date(gaokaoYear, 5, 7); 
    const gaokaoDiff = gaokaoDate - now;
    const daysUntilGaokao = Math.ceil(gaokaoDiff / (1000 * 60 * 60 * 24));

    const remainingSpringFestivals = 18 - age > 0 ? 18 - age : 0;
    const remainingWeekends = (18 - age) * weeksInYear > 0 ? (18 - age) * weeksInYear : 0;

    setStats({
      birthDateStr: dateStr,
      totalMonths,
      monthsPassed,
      percent,
      age,
      agePhase,
      phaseName,
      daysAlive,
      daysUntilAdulthood: daysUntilAdulthood > 0 ? daysUntilAdulthood : 0,
      remainingSpringFestivals,
      remainingWeekends,
      daysUntilGaokao: daysUntilGaokao > 0 ? daysUntilGaokao : 0,
      // 移除废弃属性，修复报错
      remainingSummers: 18 - age > 0 ? 18 - age : 0
    });
  };

  const handleStart = () => {
    if (childName && birthDate) setView('dashboard');
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmClearData = () => {
    setChildName('');
    setBirthDate('');
    setMemories({});
    setView('setup');
    setShowResetConfirm(false);
    try {
      localStorage.removeItem('tg_child_name');
      localStorage.removeItem('tg_birth_date');
      localStorage.removeItem('tg_memories');
    } catch {}
  };

  const openMemoryModal = (index) => {
    if (index <= stats.monthsPassed) {
      setActiveGridIndex(index);
      setMemoryInput({ emoji: '🌟', text: '', image: null }); 
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemoryInput(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addMemory = () => {
    if (memoryInput.text.trim() || memoryInput.image) {
      const newMemory = { 
        ...memoryInput, 
        id: Date.now(),
        timestamp: new Date().toISOString() 
      };
      const currentList = memories[activeGridIndex] || [];
      
      setMemories({
        ...memories,
        [activeGridIndex]: [...currentList, newMemory]
      });
      setMemoryInput({ emoji: '🌟', text: '', image: null });
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
      const ideas = AGE_BASED_ACTIONS[stats.agePhase] || AGE_BASED_ACTIONS['school'];
      const random = ideas[Math.floor(Math.random() * ideas.length)];
      setCurrentAction(random);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen overflow-hidden font-sans shadow-2xl relative bg-white">
      {view === 'setup' && (
        <SetupView 
          childName={childName} 
          setChildName={setChildName} 
          birthDate={birthDate} 
          setBirthDate={setBirthDate} 
          handleStart={handleStart}
          currentThemeId={currentThemeId}
          setTheme={setTheme}
        />
      )}
      
      {view === 'dashboard' && stats && (
        <DashboardView 
          stats={stats} 
          handleResetClick={handleResetClick} 
          memories={memories} 
          openMemoryModal={openMemoryModal}
          currentAction={currentAction}
          refreshAction={refreshAction}
          currentThemeId={currentThemeId}
          setTheme={setTheme}
          onOpenTimeline={() => setView('timeline')}
        />
      )}

      {view === 'timeline' && (
        <TimelineView 
          memories={memories}
          birthDate={birthDate}
          onBack={() => setView('dashboard')}
          currentThemeId={currentThemeId}
        />
      )}

      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4 mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">确定要清除数据吗？</h3>
              <p className="text-xs text-slate-500 mb-6 text-center leading-relaxed">
                这将永久删除孩子的名字、生日以及所有记录的美好回忆。此操作<span className="font-bold text-red-500">无法撤销</span>。
              </p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowResetConfirm(false)}
                   className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                 >
                   取消
                 </button>
                 <button 
                   onClick={confirmClearData}
                   className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-200"
                 >
                   确定清除
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeGridIndex !== null && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">回忆胶囊</h3>
                <p className={`text-xs font-bold ${THEMES[currentThemeId] ? THEMES[currentThemeId].colors.textMain : 'text-slate-500'}`}>
                  {calculateDateAtGrid(stats.birthDateStr, activeGridIndex)}
                </p>
              </div>
              <button onClick={() => setActiveGridIndex(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[100px] border-b border-slate-100 pb-4 px-1">
              {(!memories[activeGridIndex] || memories[activeGridIndex].length === 0) ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                  <List size={32} className="mb-2 opacity-50" />
                  <p className="text-xs">这个月还没有记录<br/>添加第一条回忆吧！</p>
                </div>
              ) : (
                memories[activeGridIndex].map((m) => (
                  <div key={m.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {formatTime(m.timestamp)}
                      </span>
                      <button 
                        onClick={() => deleteMemory(m.id)}
                        className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {m.image && (
                      <div className="mb-3 overflow-hidden rounded-xl border border-slate-100">
                        <img src={m.image} alt="memory" className="w-full h-32 object-cover" />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 leading-none pt-1">{m.emoji}</span>
                      <span className="text-sm text-slate-700 font-medium leading-relaxed break-words">{m.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-2">
              {memoryInput.image && (
                <div className="relative mb-3 inline-block">
                  <img src={memoryInput.image} alt="preview" className="h-20 w-auto rounded-xl border border-slate-200 shadow-sm object-cover" />
                  <button 
                    onClick={() => setMemoryInput({...memoryInput, image: null})} 
                    className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-slate-900 shadow-md"
                  >
                    <X size={12}/>
                  </button>
                </div>
              )}

              <div className="flex gap-2 mb-3 items-center">
                <div className="flex-shrink-0">
                  <input 
                    type="text" 
                    value={memoryInput.emoji}
                    onChange={(e) => setMemoryInput({...memoryInput, emoji: e.target.value})}
                    className={`w-10 h-10 text-center text-xl bg-white rounded-xl border-2 border-slate-100 focus:border-current outline-none transition-colors`}
                    maxLength={2}
                    placeholder="🌟"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={memoryInput.text}
                    onChange={(e) => setMemoryInput({...memoryInput, text: e.target.value})}
                    placeholder="记录这一刻..."
                    className={`w-full h-10 px-4 bg-white rounded-xl border-2 border-slate-100 focus:border-current outline-none transition-colors text-sm`}
                    onKeyDown={(e) => e.key === 'Enter' && addMemory()}
                  />
                </div>
                
                <label className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl cursor-pointer transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <ImageIcon size={20} />
                </label>
              </div>

              <button 
                onClick={addMemory}
                disabled={!memoryInput.text.trim() && !memoryInput.image}
                className={`w-full py-3 ${THEMES[currentThemeId] ? THEMES[currentThemeId].colors.primary : 'bg-slate-800'} disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 hover:opacity-90`}
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

export default TimeGrids;