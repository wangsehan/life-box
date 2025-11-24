import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, ArrowRight, Sparkles, RotateCcw, Plus, X, 
  ChevronDown, Trash2, List, GraduationCap, PartyPopper, Home, 
  Palette, Globe, Image as ImageIcon, AlertTriangle, ArrowLeft, History,
  Users, UserPlus, Settings, Edit2, Download, Upload, HardDrive
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
    id: 'orange', name: '暖阳橙',
    colors: {
      bgSoft: 'bg-orange-50', bgGradient: 'from-orange-50 to-orange-100', textMain: 'text-orange-600',
      textDark: 'text-orange-900', border: 'border-orange-200', primary: 'bg-orange-500',
      ring: 'ring-orange-200', icon: 'text-orange-500', gridCurrent: 'bg-orange-500',
      missionGradient: 'from-orange-400 to-orange-600', sidebarActive: 'bg-orange-100 text-orange-700'
    }
  },
  emerald: {
    id: 'emerald', name: '治愈绿',
    colors: {
      bgSoft: 'bg-emerald-50', bgGradient: 'from-emerald-50 to-emerald-100', textMain: 'text-emerald-600',
      textDark: 'text-emerald-900', border: 'border-emerald-200', primary: 'bg-emerald-500',
      ring: 'ring-emerald-200', icon: 'text-emerald-500', gridCurrent: 'bg-emerald-500',
      missionGradient: 'from-emerald-400 to-emerald-600', sidebarActive: 'bg-emerald-100 text-emerald-700'
    }
  },
  sky: {
    id: 'sky', name: '静谧蓝',
    colors: {
      bgSoft: 'bg-sky-50', bgGradient: 'from-sky-50 to-sky-100', textMain: 'text-sky-600',
      textDark: 'text-sky-900', border: 'border-sky-200', primary: 'bg-sky-500',
      ring: 'ring-sky-200', icon: 'text-sky-500', gridCurrent: 'bg-sky-500',
      missionGradient: 'from-sky-400 to-sky-600', sidebarActive: 'bg-sky-100 text-sky-700'
    }
  },
  rose: {
    id: 'rose', name: '樱花粉',
    colors: {
      bgSoft: 'bg-rose-50', bgGradient: 'from-rose-50 to-rose-100', textMain: 'text-rose-600',
      textDark: 'text-rose-900', border: 'border-rose-200', primary: 'bg-rose-500',
      ring: 'ring-rose-200', icon: 'text-rose-500', gridCurrent: 'bg-rose-500',
      missionGradient: 'from-rose-400 to-rose-600', sidebarActive: 'bg-rose-100 text-rose-700'
    }
  },
  violet: {
    id: 'violet', name: '梦幻紫',
    colors: {
      bgSoft: 'bg-violet-50', bgGradient: 'from-violet-50 to-violet-100', textMain: 'text-violet-600',
      textDark: 'text-violet-900', border: 'border-violet-200', primary: 'bg-violet-500',
      ring: 'ring-violet-200', icon: 'text-violet-500', gridCurrent: 'bg-violet-500',
      missionGradient: 'from-violet-400 to-violet-600', sidebarActive: 'bg-violet-100 text-violet-700'
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

// --- 图片压缩核心逻辑 ---
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // 限制最大宽度为 800px，平衡清晰度和体积
        const MAX_WIDTH = 800; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 压缩为 JPEG，质量 0.6 (通常能将 3MB 压到 50-100KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// --- 子组件 ---

const ThemeSelector = ({ currentTheme, setTheme }) => (
  <div className="flex gap-3 justify-center my-4 flex-wrap">
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
          {years.map(year => <option key={year} value={year}>{year}年</option>)}
        </select>
      </div>
      <div className="relative">
        <select 
          value={parseInt(m).toString()} 
          onChange={(e) => handleChange('month', e.target.value)}
          className={`w-full p-4 bg-white rounded-xl border ${themeColors.border} appearance-none outline-none focus:border-current font-bold text-slate-700`}
        >
          <option value="" disabled>月</option>
          {months.map(month => <option key={month} value={month}>{month}月</option>)}
        </select>
      </div>
      <div className="relative">
        <select 
          value={parseInt(d).toString()}
          onChange={(e) => handleChange('day', e.target.value)}
          className={`w-full p-4 bg-white rounded-xl border ${themeColors.border} appearance-none outline-none focus:border-current font-bold text-slate-700`}
        >
          <option value="" disabled>日</option>
          {days.map(day => <option key={day} value={day}>{day}日</option>)}
        </select>
      </div>
    </div>
  );
};

// 侧边栏/顶部切换器
const ChildSwitcher = ({ childrenList, activeChildId, onSwitch, onAdd, theme }) => {
  return (
    <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {childrenList.map(child => {
            const isActive = child.id === activeChildId;
            const childTheme = THEMES[child.theme || 'orange'].colors;
            
            return (
                <button
                    key={child.id}
                    onClick={() => onSwitch(child.id)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap
                        ${isActive 
                            ? `${childTheme.sidebarActive} ${childTheme.border} ring-2 ring-offset-1 ${childTheme.ring}` 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}
                    `}
                >
                    <span className="text-xs font-bold">{child.name}</span>
                </button>
            )
        })}
        <button 
            onClick={onAdd}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors flex-shrink-0"
        >
            <UserPlus size={16} />
        </button>
      </div>
    </div>
  );
}

const SetupView = ({ isAddingNew, onSave, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.birthDate || '');
  const [themeId, setThemeId] = useState(initialData?.theme || 'orange');

  const safeThemeId = THEMES[themeId] ? themeId : 'orange';
  const theme = THEMES[safeThemeId].colors;

  return (
    <div className={`flex flex-col h-full ${theme.bgSoft} p-8 justify-center items-center text-center transition-colors duration-500`}>
      <div className="bg-white p-4 rounded-3xl shadow-lg mb-8 animate-bounce">
        <Users size={48} className={theme.icon} />
      </div>
      <h1 className="text-2xl font-black text-slate-800 mb-2">
        {isAddingNew ? '添加新成员' : '时光小格'}
      </h1>
      {!isAddingNew && <p className="text-slate-500 mb-6 max-w-xs text-sm">为每个孩子记录属于他们的18年时光</p>}

      <div className="w-full max-w-xs space-y-6 bg-white p-6 rounded-3xl shadow-sm">
        <div className="text-left">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">昵称</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：妹妹"
            className={`w-full p-3 rounded-xl border ${theme.border} focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current font-bold text-slate-800`}
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">出生日期</label>
          <BirthDateSelector value={date} onChange={setDate} themeColors={theme} />
        </div>

        <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">专属主题色</label>
            <ThemeSelector currentTheme={themeId} setTheme={setThemeId} />
        </div>

        <button 
          onClick={() => onSave({ name, birthDate: date, theme: themeId })}
          disabled={!name || !date}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-2 ${theme.primary}`}
        >
          {isAddingNew ? '确认添加' : '开启时光之旅'} <ArrowRight size={18} />
        </button>

        {isAddingNew && (
            <button onClick={onCancel} className="w-full py-2 text-slate-400 text-sm font-bold hover:text-slate-600">
                取消
            </button>
        )}
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

const TimelineView = ({ memories, birthDate, onBack, themeColors, childName }) => {
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
        <div>
            <h1 className={`text-xl font-black ${themeColors.textDark}`}>{childName}的轨迹</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {timelineEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
            <History size={48} className="mb-4 opacity-20" />
            <p className="text-sm">还没有记录任何回忆...</p>
          </div>
        ) : (
          <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative pl-6">
                <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white ${themeColors.primary} shadow-sm`}></div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-sm font-black ${themeColors.textMain}`}>{event.ageLabel}</span>
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

const DashboardView = ({ 
    stats, 
    handleDeleteChild, 
    handleEditChild, 
    memories, 
    openMemoryModal, 
    currentAction, 
    refreshAction, 
    childData, 
    onOpenTimeline,
    childrenList,
    onSwitchChild,
    onAddChild,
    onBackupData,
    onImportData
}) => {
  const theme = THEMES[childData.theme || 'orange'].colors;
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);

  const handleImportClick = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportData(file);
    }
    // 重置输入以便重复上传
    e.target.value = null;
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
        
        {/* 多子切换栏 */}
        <ChildSwitcher 
            childrenList={childrenList} 
            activeChildId={childData.id} 
            onSwitch={onSwitchChild}
            onAdd={onAddChild}
            theme={theme}
        />

        <div className="px-6 pt-6 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
                <span className={`text-xs font-bold tracking-widest uppercase opacity-60 ${theme.textDark}`}>Hello</span>
                <span className={`text-2xl font-black ${theme.textDark}`}>{childData.name}</span>
            </div>
            
            <div className="relative">
                 <button 
                    onClick={() => setShowMenu(!showMenu)} 
                    className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm text-slate-600 hover:text-slate-900 active:scale-95 transition-transform border border-white/50"
                  >
                    <Settings size={18} />
                 </button>
                 {showMenu && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 min-w-[140px] animate-in fade-in slide-in-from-top-2 flex flex-col gap-1">
                    <button onClick={handleEditChild} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 text-left w-full">
                        <Edit2 size={14} /> 编辑资料
                    </button>
                    <button onClick={onBackupData} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 text-left w-full">
                        <Download size={14} /> 备份数据
                    </button>
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 text-left w-full cursor-pointer">
                        <Upload size={14} /> 恢复数据
                        <input type="file" accept=".json" className="hidden" onChange={handleImportClick} />
                    </label>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button onClick={handleDeleteChild} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-xs font-bold text-red-500 text-left w-full">
                        <Trash2 size={14} /> 删除档案
                    </button>
                  </div>
                 )}
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
        
        {/* 体验倒计时卡片组 */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            <ExperienceCard 
              icon={<GraduationCap size={20} />} 
              title="距18岁生日" count={stats.daysUntilAdulthood} unit="天"
              colorClass="bg-rose-50" borderClass="border-rose-100" textClass="text-rose-600"
            />
            <ExperienceCard 
              icon={<PartyPopper size={20} />} 
              title="还可以一起跨年" count={stats.remainingSpringFestivals} unit="次"
              colorClass="bg-red-50" borderClass="border-red-100" textClass="text-red-600"
            />
            <ExperienceCard 
              icon={<GraduationCap size={20} />} 
              title="距离高考" count={stats.daysUntilGaokao} unit="天"
              colorClass="bg-blue-50" borderClass="border-blue-100" textClass="text-blue-600"
            />
            <ExperienceCard 
              icon={<Home size={20} />} 
              title="还可以共度周末" count={stats.remainingWeekends} unit="个"
              colorClass="bg-amber-50" borderClass="border-amber-100" textClass="text-amber-600"
            />
          </div>
        </div>

        {/* 人生格子 */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Calendar size={16} className={theme.icon}/>
              时光方格
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={onOpenTimeline}
                className={`text-[10px] ${theme.bgSoft} ${theme.textMain} px-3 py-1 rounded-full font-bold border ${theme.border} flex items-center gap-1 hover:opacity-80 transition-opacity`}
              >
                <List size={12} />
                轨迹
              </button>
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
               <span className="bg-white/30 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">Idea</span>
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

const TimeGridsMulti = () => {
  // 辅助函数
  const safeGetJSON = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch (e) { return defaultVal; }
  };

  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        window.alert("存储空间已满！请尝试删除一些旧的图片回忆，或使用“备份数据”功能将数据导出后清理缓存。");
      } else {
        console.error("Storage error:", e);
      }
    }
  };

  // --- State ---
  const [children, setChildren] = useState(() => safeGetJSON('tg_children', []));
  const [activeChildId, setActiveChildId] = useState(null);
  
  const [allMemories, setAllMemories] = useState(() => safeGetJSON('tg_all_memories', {}));

  const [view, setView] = useState('loading'); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeGridIndex, setActiveGridIndex] = useState(null);
  const [memoryInput, setMemoryInput] = useState({ emoji: '🌟', text: '', image: null });
  const [currentAction, setCurrentAction] = useState("");
  const [stats, setStats] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  // --- 初始化与迁移逻辑 ---
  useEffect(() => {
    const legacyName = localStorage.getItem('tg_child_name');
    const legacyDate = localStorage.getItem('tg_birth_date');
    const legacyTheme = localStorage.getItem('tg_theme');
    const legacyMemories = safeGetJSON('tg_memories', {});

    if (children.length === 0 && legacyName && legacyDate) {
        const newChildId = Date.now().toString();
        const newChild = {
            id: newChildId,
            name: legacyName,
            birthDate: legacyDate,
            theme: legacyTheme || 'orange'
        };
        
        const newMemories = {};
        Object.keys(legacyMemories).forEach(gridIdx => {
            newMemories[`${newChildId}_${gridIdx}`] = legacyMemories[gridIdx];
        });

        const newChildrenList = [newChild];
        setChildren(newChildrenList);
        setAllMemories(newMemories);
        setActiveChildId(newChildId);
        
        saveToStorage('tg_children', newChildrenList);
        saveToStorage('tg_all_memories', newMemories);
        setView('dashboard');
    } else if (children.length > 0) {
        if (!activeChildId) setActiveChildId(children[0].id);
        setView('dashboard');
    } else {
        setView('setup');
    }
  }, []);

  // --- Persistence with Error Handling ---
  useEffect(() => { 
      if (children.length > 0) saveToStorage('tg_children', children); 
  }, [children]);
  
  useEffect(() => { 
      if (Object.keys(allMemories).length > 0) saveToStorage('tg_all_memories', allMemories); 
  }, [allMemories]);

  // --- Stats Calculation ---
  useEffect(() => {
    if (activeChildId && children.length > 0) {
        const child = children.find(c => c.id === activeChildId);
        if (child) {
            calculateStats(child.birthDate);
        }
    }
  }, [activeChildId, children]);

  useEffect(() => {
    if (stats) {
      const ideas = AGE_BASED_ACTIONS[stats.agePhase] || AGE_BASED_ACTIONS['school'];
      const random = ideas[Math.floor(Math.random() * ideas.length)];
      setCurrentAction(random);
    }
  }, [stats?.agePhase]);

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

    const timeDiffAlive = Math.abs(now - start);
    const daysAlive = Math.ceil(timeDiffAlive / (1000 * 60 * 60 * 24));

    const gaokaoYear = start.getFullYear() + 18;
    const gaokaoDate = new Date(gaokaoYear, 5, 7); 
    const daysUntilGaokao = Math.ceil((gaokaoDate - now) / (1000 * 60 * 60 * 24));

    const end18 = new Date(start);
    end18.setFullYear(start.getFullYear() + 18);
    const daysUntilAdulthood = Math.ceil((end18 - now) / (1000 * 60 * 60 * 24));

    setStats({
      birthDateStr: dateStr,
      totalMonths, monthsPassed, percent, age, agePhase, phaseName, daysAlive,
      daysUntilAdulthood: Math.max(0, daysUntilAdulthood),
      remainingSpringFestivals: Math.max(0, 18 - age),
      remainingWeekends: Math.max(0, (18 - age) * 52),
      daysUntilGaokao: Math.max(0, daysUntilGaokao)
    });
  };

  // --- Backup & Restore ---
  const handleBackupData = () => {
    const data = {
      children,
      allMemories,
      backupDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timegrids_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.children && importedData.allMemories) {
          // FIX: 使用 window.confirm 替代直接使用 confirm
          if (window.confirm(`检测到备份文件。\n包含 ${importedData.children.length} 个孩子档案。\n点击“确定”将合并到现有数据中（不会覆盖现有档案）。`)) {
            
            const newChildren = [...children];
            const newAllMemories = { ...allMemories };
            const existingIds = new Set(children.map(c => c.id));
            const idMap = {}; // 记录旧ID到新ID的映射，用于处理冲突

            // 1. 处理孩子档案
            importedData.children.forEach((child) => {
              let finalId = child.id;
              
              // 如果 ID 冲突（当前数据中已存在），生成一个新的 ID
              if (existingIds.has(child.id)) {
                 // 生成规则：当前时间戳 + 3位随机数
                 finalId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
              }
              
              idMap[child.id] = finalId;
              
              // 将孩子添加到列表
              newChildren.push({ ...child, id: finalId });
              // 更新已存在ID集合，防止导入文件内部有重复
              existingIds.add(finalId);
            });

            // 2. 处理记忆数据
            Object.keys(importedData.allMemories).forEach(key => {
               // key 的格式通常是 "childId_gridIndex"
               const parts = key.split('_');
               // 容错处理：确保 key 格式正确
               if (parts.length >= 2) {
                   const oldChildId = parts[0];
                   // 剩下的部分重新组合（防止 gridIndex 本身包含下划线的情况，虽然当前逻辑没有）
                   const gridIndex = parts.slice(1).join('_');
                   
                   const newChildId = idMap[oldChildId];
                   
                   // 只有当这个记忆属于我们本次导入的孩子时才处理
                   if (newChildId) {
                      const newKey = `${newChildId}_${gridIndex}`;
                      newAllMemories[newKey] = importedData.allMemories[key];
                   }
               }
            });

            setChildren(newChildren);
            setAllMemories(newAllMemories);
            
            // 如果成功导入，自动切换视图到第一个导入的孩子
            if (importedData.children.length > 0) {
                 const firstOldId = importedData.children[0].id;
                 setActiveChildId(idMap[firstOldId]);
            }
            
            window.alert(`数据合并成功！已新增 ${importedData.children.length} 个档案。`);
          }
        } else {
          window.alert("无效的备份文件格式");
        }
      } catch (err) {
        console.error(err);
        window.alert("文件解析失败，请确保是有效的 JSON 备份文件");
      }
    };
    reader.readAsText(file);
  };

  // --- Actions ---

  const handleAddChild = (data) => {
    const newId = Date.now().toString();
    const newChild = { ...data, id: newId };
    const newChildren = [...children, newChild];
    setChildren(newChildren);
    setActiveChildId(newId);
    setView('dashboard');
  };

  const handleEditChildSave = (data) => {
      const updatedChildren = children.map(c => 
        c.id === activeChildId ? { ...c, ...data } : c
      );
      setChildren(updatedChildren);
      setView('dashboard');
  };

  const handleDeleteChild = () => {
      const newChildren = children.filter(c => c.id !== activeChildId);
      
      const newAllMemories = { ...allMemories };
      Object.keys(newAllMemories).forEach(key => {
          if (key.startsWith(`${activeChildId}_`)) {
              delete newAllMemories[key];
          }
      });
      setAllMemories(newAllMemories);

      if (newChildren.length > 0) {
          setChildren(newChildren);
          setActiveChildId(newChildren[0].id);
          setView('dashboard');
      } else {
          setChildren([]);
          setActiveChildId(null);
          setView('setup');
          localStorage.removeItem('tg_children');
      }
      setShowDeleteConfirm(false);
  };

  const getCurrentChildMemories = () => {
      if (!activeChildId) return {};
      const result = {};
      Object.keys(allMemories).forEach(key => {
          const [cId, gIdx] = key.split('_');
          if (cId === activeChildId) {
              result[gIdx] = allMemories[key];
          }
      });
      return result;
  };

  const addMemory = () => {
    if ((memoryInput.text.trim() || memoryInput.image) && activeGridIndex !== null) {
      const newMemory = { 
        ...memoryInput, 
        id: Date.now(),
        timestamp: new Date().toISOString() 
      };
      const key = `${activeChildId}_${activeGridIndex}`;
      const currentList = allMemories[key] || [];
      
      setAllMemories({
        ...allMemories,
        [key]: [...currentList, newMemory]
      });
      setMemoryInput({ emoji: '🌟', text: '', image: null });
    }
  };

  const deleteMemory = (memoryId) => {
    const key = `${activeChildId}_${activeGridIndex}`;
    const currentList = allMemories[key] || [];
    const newList = currentList.filter(m => m.id !== memoryId);
    
    const newAllMemories = { ...allMemories };
    if (newList.length === 0) {
      delete newAllMemories[key];
    } else {
      newAllMemories[key] = newList;
    }
    setAllMemories(newAllMemories);
  };

  // 修改后的图片上传逻辑，包含压缩
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCompressing(true);
      try {
        // 执行压缩
        const compressedDataUrl = await compressImage(file);
        setMemoryInput(prev => ({ ...prev, image: compressedDataUrl }));
      } catch (err) {
        window.alert("图片处理失败，请重试");
        console.error(err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const activeChild = children.find(c => c.id === activeChildId) || {};
  const activeTheme = THEMES[activeChild.theme || 'orange'].colors;

  // --- Render ---

  if (view === 'loading') return <div className="h-screen bg-white" />;

  return (
    <div className="max-w-md mx-auto h-screen overflow-hidden font-sans shadow-2xl relative bg-white">
      
      {view === 'setup' && (
        <SetupView 
          isAddingNew={false}
          onSave={handleAddChild}
        />
      )}

      {view === 'add_child' && (
        <SetupView 
          isAddingNew={true}
          onSave={handleAddChild}
          onCancel={() => setView('dashboard')}
        />
      )}

      {view === 'edit_child' && activeChild && (
          <SetupView
            isAddingNew={false} 
            initialData={activeChild}
            onSave={handleEditChildSave}
            onCancel={() => setView('dashboard')}
          />
      )}
      
      {view === 'dashboard' && stats && activeChild && (
        <DashboardView 
          childData={activeChild}
          stats={stats} 
          childrenList={children}
          handleDeleteChild={() => setShowDeleteConfirm(true)} 
          handleEditChild={() => setView('edit_child')}
          memories={getCurrentChildMemories()} 
          openMemoryModal={(idx) => {
              if (idx <= stats.monthsPassed) {
                  setActiveGridIndex(idx);
                  setMemoryInput({ emoji: '🌟', text: '', image: null }); 
              }
          }}
          currentAction={currentAction}
          refreshAction={() => {
              const ideas = AGE_BASED_ACTIONS[stats.agePhase] || AGE_BASED_ACTIONS['school'];
              setCurrentAction(ideas[Math.floor(Math.random() * ideas.length)]);
          }}
          onOpenTimeline={() => setView('timeline')}
          onSwitchChild={setActiveChildId}
          onAddChild={() => setView('add_child')}
          onBackupData={handleBackupData}
          onImportData={handleImportData}
        />
      )}

      {view === 'timeline' && activeChild && (
        <TimelineView 
          childName={activeChild.name}
          memories={getCurrentChildMemories()}
          birthDate={activeChild.birthDate}
          onBack={() => setView('dashboard')}
          themeColors={activeTheme}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4 mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">删除档案？</h3>
              <p className="text-xs text-slate-500 mb-6 text-center leading-relaxed">
                这将永久删除 <strong>{activeChild.name}</strong> 的所有数据和美好回忆，且<span className="font-bold text-red-500">无法恢复</span>。
              </p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowDeleteConfirm(false)}
                   className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleDeleteChild}
                   className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-200"
                 >
                   确认删除
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Memory Input Modal */}
      {activeGridIndex !== null && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">回忆胶囊</h3>
                <p className={`text-xs font-bold ${activeTheme.textMain}`}>
                  {calculateDateAtGrid(activeChild.birthDate, activeGridIndex)}
                </p>
              </div>
              <button onClick={() => setActiveGridIndex(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[100px] border-b border-slate-100 pb-4 px-1">
              {(() => {
                  const key = `${activeChildId}_${activeGridIndex}`;
                  const currentMems = allMemories[key] || [];
                  
                  if (currentMems.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                            <List size={32} className="mb-2 opacity-50" />
                            <p className="text-xs">这个月还没有记录<br/>添加第一条回忆吧！</p>
                        </div>
                      );
                  }
                  return currentMems.map((m) => (
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
                  ));
              })()}
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
                <input 
                    type="text" 
                    value={memoryInput.emoji}
                    onChange={(e) => setMemoryInput({...memoryInput, emoji: e.target.value})}
                    className={`w-10 h-10 text-center text-xl bg-white rounded-xl border-2 border-slate-100 focus:border-current outline-none transition-colors flex-shrink-0`}
                    maxLength={2}
                    placeholder="🌟"
                />
                <input 
                    type="text" 
                    value={memoryInput.text}
                    onChange={(e) => setMemoryInput({...memoryInput, text: e.target.value})}
                    placeholder="记录这一刻..."
                    className={`flex-1 h-10 px-4 bg-white rounded-xl border-2 border-slate-100 focus:border-current outline-none transition-colors text-sm`}
                    onKeyDown={(e) => e.key === 'Enter' && addMemory()}
                />
                
                <label className={`w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl cursor-pointer transition-colors flex-shrink-0 ${isCompressing ? 'opacity-50 cursor-wait' : ''}`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    disabled={isCompressing}
                  />
                  {isCompressing ? <div className="animate-spin w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full"></div> : <ImageIcon size={20} />}
                </label>
              </div>

              <button 
                onClick={addMemory}
                disabled={!memoryInput.text.trim() && !memoryInput.image}
                className={`w-full py-3 ${activeTheme.primary} disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 hover:opacity-90`}
              >
                <Plus size={18} />
                {isCompressing ? '图片处理中...' : '添加这条记忆'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeGridsMulti;