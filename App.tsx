
import React, { useState, useEffect } from 'react';
import { PortfolioItem } from './types.ts';
import { INITIAL_PORTFOLIO } from './constants.ts';

const App: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({});
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const saved = localStorage.getItem('elly_portfolio_data');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(INITIAL_PORTFOLIO);
      }
    } else {
      setItems(INITIAL_PORTFOLIO);
      localStorage.setItem('elly_portfolio_data', JSON.stringify(INITIAL_PORTFOLIO));
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'portfolio', 'why-me', 'process', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdmin]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const saveToStorage = (newItems: PortfolioItem[]) => {
    setItems(newItems);
    localStorage.setItem('elly_portfolio_data', JSON.stringify(newItems));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      const newItems = items.filter(item => item.id !== id);
      saveToStorage(newItems);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setIsEditing(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) {
      alert('제목과 카테고리는 필수 입력 사항입니다.');
      return;
    }

    if (isEditing) {
      const newItems = items.map(item => item.id === isEditing ? { ...item, ...formData } as PortfolioItem : item);
      saveToStorage(newItems);
    } else {
      const newItem = {
        ...formData,
        id: Date.now().toString(),
      } as PortfolioItem;
      saveToStorage([...items, newItem]);
    }
    setIsEditing(null);
    setFormData({});
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1111') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-brand-100 selection:text-brand-900 bg-white">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm px-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full animate-zoom-in">
            <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Admin Login</h3>
            <p className="text-zinc-400 text-sm mb-8 font-medium">관리자 비밀번호를 입력하세요.</p>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input 
                autoFocus
                type="password" 
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                className={`w-full bg-zinc-50 p-5 rounded-2xl outline-none border-2 transition-all font-bold tracking-widest text-center ${loginError ? 'border-red-100 focus:ring-red-500' : 'border-transparent focus:ring-brand-500 focus:ring-2'}`}
                placeholder="••••"
              />
              {loginError && <p className="text-red-500 text-xs font-bold text-center">비밀번호가 일치하지 않습니다.</p>}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowLoginModal(false); setLoginError(false); }} className="flex-1 py-4 text-zinc-400 font-bold hover:text-zinc-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-100 transition-all">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin ? (
        <div className="min-h-screen pt-32 pb-20 bg-zinc-50 animate-fade-in">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-zinc-500 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">Portfolio Management System</p>
              </div>
              <button 
                onClick={() => setIsAdmin(false)} 
                className="px-8 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                Exit Dashboard
              </button>
            </div>

            <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100 mb-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
              <h2 className="text-2xl font-bold mb-10 text-zinc-900 flex items-center gap-4 relative z-10">
                <span className="w-1.5 h-8 bg-brand-600 rounded-full"></span>
                {isEditing ? '프로젝트 수정하기' : '새로운 프로젝트 등록'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Project Title</label>
                  <input type="text" placeholder="제목" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Category</label>
                  <input type="text" placeholder="분류" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900" />
                </div>
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Image Link</label>
                  <input type="text" placeholder="URL" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900" />
                </div>
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Short Description</label>
                  <input type="text" placeholder="카드 설명" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900" />
                </div>
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Project Overview</label>
                  <textarea placeholder="개요" value={formData.overview || ''} onChange={e => setFormData({...formData, overview: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900 min-h-[100px] resize-none" />
                </div>
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Design Strategy</label>
                  <textarea placeholder="전략" value={formData.approach || ''} onChange={e => setFormData({...formData, approach: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900 min-h-[100px] resize-none" />
                </div>
                <div className="space-y-3 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Final Result</label>
                  <textarea placeholder="성과" value={formData.result || ''} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 font-medium text-zinc-900 min-h-[100px] resize-none" />
                </div>
              </div>
              <div className="mt-12 flex gap-4 relative z-10">
                <button onClick={handleSave} className="px-12 py-5 bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all transform active:scale-95">
                  데이터 저장하기
                </button>
                {(isEditing || formData.title) && (
                  <button onClick={() => { setIsEditing(null); setFormData({}); }} className="px-12 py-5 border-2 border-zinc-200 text-zinc-500 rounded-2xl font-bold hover:bg-zinc-50 transition-colors">
                    입력 취소
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400 ml-2">Project Database</h3>
              {items.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-zinc-100">
                  <p className="text-zinc-300 font-bold uppercase tracking-widest">No Projects Found</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 overflow-hidden rounded-2xl bg-zinc-100">
                        <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-500 font-black uppercase tracking-widest px-2 py-1 bg-brand-50 rounded-lg">{item.category}</span>
                        <h3 className="font-bold text-zinc-900 mt-2 text-lg tracking-tight">{item.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-3 pr-4">
                      <button onClick={() => handleEdit(item)} className="px-5 py-2.5 bg-zinc-50 text-zinc-600 rounded-xl text-xs font-bold hover:bg-brand-50 hover:text-brand-600 transition-all">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-zinc-100">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              <a 
                href="#home" 
                onClick={(e) => scrollToSection(e, 'home')}
                className="text-2xl font-black tracking-tighter text-brand-600 transition-transform hover:scale-105"
              >
                Elly
              </a>
              <div className="hidden md:flex gap-10 text-sm font-semibold tracking-wide uppercase">
                {[
                  { id: 'portfolio', label: 'Portfolio' },
                  { id: 'why-me', label: 'Why Me' },
                  { id: 'process', label: 'Process' },
                  { id: 'contact', label: 'Contact' }
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={`${
                      activeSection === link.id ? 'text-brand-600 scale-110' : 'text-zinc-500'
                    } hover:text-brand-600 transition-all duration-300 relative group`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-brand-600 transition-transform duration-300 origin-left ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
                  </a>
                ))}
              </div>
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="text-xs font-black text-zinc-300 hover:text-brand-500 transition-colors uppercase tracking-[0.2em] border border-zinc-100 px-4 py-2 rounded-full hover:border-brand-200"
              >
                Admin
              </button>
            </div>
          </nav>
          <main>
            {/* HOME SECTION */}
            <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden relative">
              <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-50 rounded-full blur-[120px] opacity-40"></div>
              <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-50 rounded-full blur-[120px] opacity-40"></div>
              
              <div className="max-w-4xl animate-slide-in-from-bottom-10 relative z-10">
                <p className="text-sm font-black tracking-[0.4em] uppercase mb-8 text-brand-500">Design Portfolio</p>
                <h1 className="text-5xl md:text-8xl font-black leading-[1.05] mb-10 tracking-tighter text-zinc-900">
                  디자인으로 ‘보기 좋은 것’이 아니라<br />
                  <span className="text-brand-600 inline-block hover:scale-105 transition-transform cursor-default">‘결과가 나오는 것’</span>을 만듭니다.
                </h1>
                <p className="text-xl md:text-2xl text-zinc-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                  브랜드, 인쇄물, 웹·모바일까지<br />
                  실무 경험 기반의 고도화된 시각 언어를 제안합니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <a 
                    href="#portfolio" 
                    onClick={(e) => scrollToSection(e, 'portfolio')}
                    className="group px-14 py-6 bg-brand-600 text-white rounded-[2rem] font-black text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 hover:-translate-y-1 text-center"
                  >
                    포트폴리오 보기
                    <span className="inline-block ml-3 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => scrollToSection(e, 'contact')}
                    className="px-14 py-6 border-2 border-zinc-900 text-zinc-900 rounded-[2rem] font-black text-lg hover:bg-zinc-900 hover:text-white transition-all text-center"
                  >
                    프로젝트 문의하기
                  </a>
                </div>
                <div className="mt-24 flex flex-col items-center opacity-30 animate-pulse">
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] mb-4">Discovery More</span>
                  <div className="w-[1px] h-14 bg-zinc-900"></div>
                </div>
              </div>
            </section>

            {/* PORTFOLIO SECTION */}
            <section id="portfolio" className="py-40 px-6 bg-zinc-50">
              <div className="max-w-6xl mx-auto">
                <div className="mb-24 text-center">
                  <h2 className="text-5xl font-black mb-6 tracking-tight">Selected Works</h2>
                  <div className="w-20 h-2 bg-brand-600 mx-auto mb-8 rounded-full"></div>
                  <p className="text-zinc-500 text-lg font-medium">각 프로젝트는 단순한 결과물이 아닌 <span className="text-zinc-900 font-bold border-b-2 border-zinc-200">문제 해결 과정</span>을 담고 있습니다.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {items.map(item => (
                    <div key={item.id} className="group bg-white overflow-hidden rounded-[2.5rem] shadow-sm border border-zinc-100 hover:shadow-2xl hover:shadow-brand-100 transition-all duration-700 flex flex-col h-full hover:-translate-y-2">
                      <div className="aspect-[4/3] overflow-hidden bg-zinc-50 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500"></div>
                      </div>
                      <div className="p-10 flex flex-col flex-grow">
                        <span className="text-[11px] font-black text-brand-500 uppercase tracking-[0.2em] mb-4 block">{item.category}</span>
                        <h3 className="text-2xl font-bold mb-4 tracking-tight text-zinc-900">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium italic">"{item.description}"</p>
                        <div className="mt-auto pt-8 border-t border-zinc-100 flex flex-col gap-4">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Design Strategy</p>
                            <p className="text-xs text-zinc-600 leading-relaxed font-bold">{item.approach}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WHY ME SECTION */}
            <section id="why-me" className="py-40 px-6 bg-white overflow-hidden">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                <div className="relative">
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-50 rounded-full blur-[100px] opacity-60"></div>
                  <p className="text-sm font-black text-brand-600 mb-6 tracking-[0.3em] uppercase relative">Expertise Value</p>
                  <h2 className="text-6xl font-black mb-12 leading-[1.1] tracking-tighter relative text-zinc-900">좋은 디자인은<br />비즈니스를 돕습니다.</h2>
                  <div className="space-y-8 text-zinc-600 text-xl leading-relaxed font-medium relative">
                    <p>디자인은 예쁘기만 해서는 부족합니다. <span className="text-brand-600 font-bold border-b-2 border-brand-200">실제로 사용되고, 목적을 달성해야</span> 진짜 가치가 있습니다.</p>
                    <p>실무 경험을 바탕으로 클라이언트의 상황과 목표를 입체적으로 분석하여, 가장 효율적인 시각적 솔루션을 제안합니다.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                  {[
                    { title: "다양한 매체 경험", desc: "분야를 막론한 폭넓은 디자인 이해도", icon: "💎" },
                    { title: "환경 최적화 디자인", desc: "사용 환경별 매체 최적화 프로세스", icon: "⚙️" },
                    { title: "직관적인 소통", desc: "빠르고 정확한 피드백과 투명한 공정", icon: "⚡" },
                    { title: "결과 중심적 사고", desc: "심미성을 넘어선 전략적 시각화", icon: "📈" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-10 bg-zinc-50 border border-zinc-100 rounded-[3rem] hover:bg-brand-600 transition-all duration-500 group">
                      <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform">{item.icon}</div>
                      <h3 className="font-bold text-lg mb-3 text-zinc-900 group-hover:text-white transition-colors">{item.title}</h3>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed group-hover:text-brand-100 transition-colors">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PROCESS SECTION */}
            <section id="process" className="py-40 px-6 bg-zinc-900 text-white rounded-[5rem] mx-4 my-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[200px] opacity-10"></div>
              <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                  <div>
                    <h2 className="text-6xl font-black mb-6 tracking-tight">Work Process</h2>
                    <p className="text-brand-400 font-bold uppercase text-sm tracking-[0.4em]">Structured Workflow</p>
                  </div>
                  <p className="max-w-md text-zinc-400 text-lg font-medium leading-relaxed">
                    모든 과정은 실시간 피드백을 통해 투명하게 진행되며,<br />
                    클라이언트의 만족도를 최우선으로 합니다.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { step: "01", title: "상담 & 목표 정리", desc: "프로젝트 목적과 방향을 명확히 합니다." },
                    { step: "02", title: "컨셉 제안", desc: "디자인 방향과 구조를 제안합니다." },
                    { step: "03", title: "디자인 진행", desc: "피드백을 반영하며 완성도를 높입니다." },
                    { step: "04", title: "최종 납품", desc: "실제 사용 가능한 결과물을 전달합니다." }
                  ].map((item, idx) => (
                    <div key={idx} className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group overflow-hidden">
                      <div className="absolute -bottom-6 -right-4 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors italic tracking-tighter select-none">{item.step}</div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center font-black mb-8 text-sm transform -rotate-12 group-hover:rotate-0 transition-transform">{item.step}</div>
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="py-40 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-24">
                  <h2 className="text-6xl font-black mb-8 tracking-tighter text-zinc-900">함께 결과를 만들어 볼까요?</h2>
                  <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                    단순 디자인 문의부터 비즈니스 전략 상담까지,<br />
                    <span className="text-brand-600 font-bold underline decoration-brand-200 underline-offset-8">당신의 브랜드에 필요한 최적의 솔루션을 고민합니다.</span>
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-12 bg-zinc-50 rounded-[4rem] p-4 md:p-8 overflow-hidden shadow-sm border border-zinc-100">
                  <div className="lg:col-span-5 p-14 bg-brand-600 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black mb-10 tracking-tight">Direct Inquiry</h3>
                      <div className="space-y-10">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-200 mb-3">Available Time</p>
                          <p className="text-xl font-bold">Mon - Fri, 10:00 - 18:00</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-200 mb-3">Expected Reply</p>
                          <p className="text-xl font-bold">Within 24-48 Hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/20 relative z-10">
                      <div className="grid grid-cols-1 gap-5 text-xs font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-4"><span className="w-2 h-2 bg-brand-200 rounded-full shadow-[0_0_10px_rgba(196,181,253,0.8)]"></span> 계약 전 무료 상담 가능</span>
                        <span className="flex items-center gap-4"><span className="w-2 h-2 bg-brand-200 rounded-full shadow-[0_0_10px_rgba(196,181,253,0.8)]"></span> 프로젝트 일정 사전 안내</span>
                        <span className="flex items-center gap-4"><span className="w-2 h-2 bg-brand-200 rounded-full shadow-[0_0_10px_rgba(196,181,253,0.8)]"></span> NDA 기밀 유지 가능</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-12 bg-white rounded-[3rem] shadow-sm">
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Client Name</label>
                          <input type="text" className="w-full bg-zinc-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-zinc-900 placeholder:text-zinc-300" placeholder="성함 또는 기업명" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Contact Email</label>
                          <input type="email" className="w-full bg-zinc-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-zinc-900 placeholder:text-zinc-300" placeholder="연락처 정보" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-500 ml-1">Message</label>
                        <textarea rows={5} className="w-full bg-zinc-50 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium text-zinc-900 placeholder:text-zinc-300 resize-none" placeholder="궁금하신 내용이나 프로젝트 개요를 적어주세요."></textarea>
                      </div>
                      <button className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-brand-600 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-200 flex items-center justify-center gap-4 group">
                        상담 요청 보내기
                        <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="py-24 border-t border-zinc-100 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <a 
                href="#home" 
                onClick={(e) => scrollToSection(e, 'home')}
                className="inline-block mb-12 text-4xl font-black tracking-tighter text-brand-600 hover:scale-110 transition-transform"
              >
                Elly
              </a>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16 text-xs font-black uppercase tracking-[0.4em] text-zinc-400">
                 <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="hover:text-brand-600 transition-colors">Portfolio</a>
                 <a href="#why-me" onClick={(e) => scrollToSection(e, 'why-me')} className="hover:text-brand-600 transition-colors">Why Me</a>
                 <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="hover:text-brand-600 transition-colors">Process</a>
                 <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-brand-600 transition-colors">Contact</a>
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-zinc-900 font-black text-xl mb-4 tracking-tight">Design with purpose. Design that works.</p>
                <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-12">실무 경험을 바탕으로 클라이언트의 성공을 디자인하는<br />그래픽 파트너 Elly입니다.</p>
              </div>
              <div className="w-16 h-[2px] bg-brand-100 mx-auto mb-12"></div>
              <p className="text-[10px] text-zinc-300 font-black uppercase tracking-[0.5em]">© 2024 Elly Design Studio. All Rights Reserved.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
