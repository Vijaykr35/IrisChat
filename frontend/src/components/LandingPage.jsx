import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  BsStars, 
  BsCheckCircleFill
} from "react-icons/bs";
import { 
  FiMessageSquare, 
  FiUsers, 
  FiArrowRight, 
  FiArrowUp,
  FiZap,
  FiSend
} from "react-icons/fi";

export default function LandingPage() {
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();

  // Scroll Progress and Scroll-To-Top indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Interactive mock preview active tab: "chats" | "groups" | "ai"
  const [previewTab, setPreviewTab] = useState("chats");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
        setShowScrollTop(window.scrollY > 250);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-[#0b141a] text-[#e9edef] font-sans antialiased selection:bg-[#00a884] selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* -------------------------------------------------------------
          TOP SCROLL PROGRESS INDICATOR
         ------------------------------------------------------------- */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#00a884] via-[#25d366] to-[#00a884] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* -------------------------------------------------------------
          RICH WHATSAPP-NATIVE DARK DOODLE & AMBIENT BACKGROUND LAYER
         ------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Full Repeating WhatsApp Doodle Texture */}
        <div 
          className="absolute inset-0 opacity-[0.09] mix-blend-screen"
          style={{
            backgroundImage: "url('/bg-doodle.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "380px 380px"
          }}
        />

        {/* Soft emerald atmospheric ambient glow behind the hero */}
        <div 
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[550px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0, 168, 132, 0.16) 0%, rgba(37, 211, 102, 0.05) 45%, transparent 75%)"
          }}
        />

        {/* Right side ambient accent glow */}
        <div 
          className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0, 168, 132, 0.10) 0%, transparent 65%)"
          }}
        />

        {/* Purple accent wash behind AI section */}
        <div 
          className="absolute top-2/3 -left-32 w-[650px] h-[650px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 65%)"
          }}
        />

        {/* Floating Context Pills in Background */}
        <div className="absolute top-36 left-10 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111b21]/80 border border-[#202c33] shadow-lg text-[11px] text-[#8696a0] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#00a884] inline-block animate-pulse" />
          <span>WebSocket Pipeline Active</span>
        </div>

        <div className="absolute top-72 right-12 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111b21]/80 border border-[#202c33] shadow-lg text-[11px] text-[#8696a0] backdrop-blur-sm">
          <BsStars className="text-[#00a884]" />
          <span>Intelligent AI Assistant Active</span>
        </div>
      </div>

      {/* =========================================================
          A. HEADER / NAVIGATION
         ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#111b21]/85 backdrop-blur-md border-b border-[#202c33]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Brand (IrisChat) */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <img 
              src="/iris-logo.jpg" 
              alt="IrisChat Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-[0_0_15px_rgba(0,168,132,0.35)] transition-transform group-hover:scale-105 border border-[#00a884]/40" 
            />
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold tracking-tight text-[#e9edef]">IrisChat</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#8696a0]">
            <a href="#features" className="hover:text-[#e9edef] transition-colors">Features</a>
            <a href="#ai-assistant" className="hover:text-[#e9edef] transition-colors">AI Assistant</a>
            <a href="#about" className="hover:text-[#e9edef] transition-colors">About</a>
          </nav>

          {/* Login & Get Started Buttons */}
          <div className="flex items-center space-x-3">
            {authUser ? (
              <Link
                to="/chat"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#02b992] hover:to-[#00a884] text-white font-medium text-sm transition-all shadow-sm flex items-center gap-1.5 shadow-[#00a884]/20"
              >
                <span>Open Chat</span>
                <FiArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-[#aebac1] hover:text-[#e9edef] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#02b992] hover:to-[#00a884] text-white font-medium text-sm transition-all shadow-md shadow-[#00a884]/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================
          B. HERO SECTION
         ========================================================= */}
      <section className="relative z-10 pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto">
            Conversations, <span className="bg-gradient-to-r from-[#00a884] to-[#25d366] bg-clip-text text-transparent">made better.</span>
          </h1>

          {/* Official Tagline */}
          <p className="mt-4 text-lg sm:text-xl font-semibold tracking-wide bg-gradient-to-r from-[#e9edef] via-[#00a884] to-[#25d366] bg-clip-text text-transparent">
            "Chat, Connect, Discover."
          </p>

          {/* Supporting Description */}
          <p className="mt-3 text-base sm:text-lg text-[#8696a0] max-w-2xl mx-auto leading-relaxed font-normal">
            Stay connected with the people who matter, bring conversations together, and get more done with your personal AI assistant.
          </p>

          {/* 2 CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={authUser ? "/chat" : "/register"}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#02b992] hover:to-[#00a884] text-white font-semibold text-sm transition-all shadow-md shadow-[#00a884]/25 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Start Chatting</span>
              <FiArrowRight size={16} />
            </Link>
            
            <a
              href="#ai-assistant"
              className="px-5 py-3 rounded-lg bg-[#111b21] hover:bg-[#202c33] text-[#e9edef] font-semibold text-sm border border-[#202c33] transition-all hover:-translate-y-0.5"
            >
              Explore AI
            </a>
          </div>

          {/* Authentic Real Chat Workspace Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-xl border border-[#202c33] bg-[#111b21] shadow-2xl shadow-black/80 overflow-hidden text-left relative z-10 transition-transform">
            
            {/* Top Workspace Bar */}
            <div className="bg-[#202c33] px-4 py-2.5 border-b border-[#313d45] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="ml-3 text-xs font-mono text-[#8696a0]">irischat.app — desktop workspace</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#00a884] bg-[#00a884]/15 px-2.5 py-0.5 rounded-md border border-[#00a884]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-pulse" />
                <span>Socket.IO Live</span>
              </div>
            </div>

            {/* Split layout: Sidebar + Chat Area */}
            <div className="h-80 sm:h-96 flex">
              
              {/* Sidebar Preview with 3 Tab buttons */}
              <div className="w-72 border-r border-[#313d45] bg-[#111b21] flex flex-col justify-between hidden sm:flex">
                <div>
                  <div className="flex items-center justify-around border-b border-[#313d45] bg-[#202c33] px-2 py-2 text-xs font-semibold">
                    <button
                      onClick={() => setPreviewTab("chats")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        previewTab === "chats"
                          ? "bg-[#00a884] text-white shadow-sm"
                          : "text-[#aebac1] hover:bg-[#374248]"
                      }`}
                    >
                      <FiMessageSquare size={14} /> Direct
                    </button>

                    <button
                      onClick={() => setPreviewTab("groups")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        previewTab === "groups"
                          ? "bg-[#00a884] text-white shadow-sm"
                          : "text-[#aebac1] hover:bg-[#374248]"
                      }`}
                    >
                      <FiUsers size={14} /> Groups
                    </button>

                    <button
                      onClick={() => setPreviewTab("ai")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        previewTab === "ai"
                          ? "bg-gradient-to-r from-[#00a884] to-[#25d366] text-white shadow-sm"
                          : "text-[#aebac1] hover:bg-[#374248]"
                      }`}
                    >
                      <BsStars size={14} /> AI Assistant
                    </button>
                  </div>

                  {/* Sidebar Roster Preview */}
                  <div className="p-2 space-y-1">
                    {previewTab === "chats" && (
                      <>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#2a3942] border-b border-[#313d45] cursor-pointer">
                          <div className="relative">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111b21]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs text-white truncate">John Doe</h3>
                            <p className="text-[11px] text-[#8696a0] truncate">See you on the team sync</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#202c33] transition-colors cursor-pointer">
                          <div className="relative">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111b21]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs text-[#d1d7db] truncate">Alice Smith</h3>
                            <p className="text-[11px] text-[#8696a0] truncate">PR is ready for review!</p>
                          </div>
                        </div>
                      </>
                    )}

                    {previewTab === "groups" && (
                      <>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#2a3942] border-b border-[#313d45] cursor-pointer">
                          <img
                            src="https://ui-avatars.com/api/?name=Engineering+Core&background=00a884&color=fff"
                            alt="Engineering Core"
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-xs text-white truncate">Engineering Core</h3>
                            <p className="text-[11px] text-[#8696a0] truncate">Vijay, Alice +4 more</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#202c33] transition-colors cursor-pointer">
                          <img
                            src="https://ui-avatars.com/api/?name=Hackathon+Team&background=25d366&color=fff"
                            alt="Hackathon Team"
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs text-[#d1d7db] truncate">Hackathon Team</h3>
                            <p className="text-[11px] text-[#8696a0] truncate">5 active members</p>
                          </div>
                        </div>
                      </>
                    )}

                    {previewTab === "ai" && (
                      <>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#2a3942] border-b border-[#313d45] cursor-pointer">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white text-base">
                            <BsStars />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-xs text-white truncate">Code Refactoring</h3>
                            <p className="text-[11px] text-[#00a884] truncate">Multi-turn session active</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#202c33] transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-xl bg-[#202c33] flex items-center justify-center text-[#8696a0] text-base">
                            <BsStars />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs text-[#d1d7db] truncate">Regex Explainer</h3>
                            <p className="text-[11px] text-[#8696a0] truncate">2 days ago</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-[#8696a0] px-3 border-t border-[#313d45] py-2.5 flex items-center justify-between bg-[#111b21]">
                  <span>IrisChat Session</span>
                  <span className="text-[#00a884] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00a884]" /> Online
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 bg-[#0b141a] flex flex-col justify-between p-4 relative">
                <div 
                  className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-screen"
                  style={{ backgroundImage: "url('/bg-doodle.png')", backgroundSize: "320px", backgroundRepeat: "repeat" }}
                />

                {/* Chat Header */}
                <div className="pb-2.5 border-b border-[#202c33] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {previewTab === "chats" && (
                      <>
                        <img 
                          className="w-9 h-9 rounded-full object-cover" 
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                          alt="John Doe" 
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">John Doe</div>
                          <div className="text-[10px] text-[#00a884]">Online</div>
                        </div>
                      </>
                    )}
                    {previewTab === "groups" && (
                      <>
                        <img 
                          className="w-9 h-9 rounded-full object-cover shadow-sm" 
                          src="https://ui-avatars.com/api/?name=Engineering+Core&background=00a884&color=fff" 
                          alt="Engineering Core" 
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">Engineering Core</div>
                          <div className="text-[10px] text-[#8696a0]">Vijay, Alice +4 more</div>
                        </div>
                      </>
                    )}
                    {previewTab === "ai" && (
                      <>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white text-sm">
                          <BsStars />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">AI Assistant</div>
                          <div className="text-[10px] text-[#00a884]">Multi-turn Context Memory</div>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8696a0] font-mono">
                    {previewTab === "chats" && "Direct Room"}
                    {previewTab === "groups" && "Group Channel"}
                    {previewTab === "ai" && "AI Assistant"}
                  </span>
                </div>

                {/* Messages Body */}
                <div className="space-y-3 my-auto py-2 relative z-10 overflow-y-auto">
                  {previewTab === "chats" && (
                    <>
                      <div className="flex justify-start">
                        <div className="bg-[#202c33] text-[#e9edef] px-3.5 py-2 rounded-xl text-xs max-w-[80%] border border-[#313d45] shadow">
                          Hey! Did you have a chance to try out the new AI assistant in the group chat?
                          <div className="text-[9px] text-[#8696a0] text-right mt-1">10:41 AM</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-[#00a884] to-[#008f6f] text-white px-3.5 py-2 rounded-xl text-xs max-w-[80%] shadow-md">
                          Yes! It summarizes long discussions and helps draft meeting notes without leaving the tab.
                          <div className="text-[9px] text-white/80 text-right mt-1">10:42 AM · Delivered</div>
                        </div>
                      </div>
                    </>
                  )}

                  {previewTab === "groups" && (
                    <>
                      <div className="flex justify-start">
                        <div className="bg-[#202c33] text-[#e9edef] px-3.5 py-2 rounded-xl text-xs max-w-[80%] border border-[#313d45] shadow">
                          <span className="text-[10px] text-[#00a884] font-bold block mb-0.5">Alice (Admin)</span>
                          Group channel is verified! Permissions and socket fan-out are working smoothly.
                          <div className="text-[9px] text-[#8696a0] text-right mt-1">11:15 AM</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-[#00a884] to-[#008f6f] text-white px-3.5 py-2 rounded-xl text-xs max-w-[80%] shadow-md">
                          Confirmed. Tested adding collaborators and real-time broadcasts.
                          <div className="text-[9px] text-white/80 text-right mt-1">11:16 AM · Delivered</div>
                        </div>
                      </div>
                    </>
                  )}

                  {previewTab === "ai" && (
                    <>
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-[#00a884] to-[#008f6f] text-white px-3.5 py-2 rounded-xl text-xs max-w-[85%] shadow-md">
                          How does IrisChat separate 1-on-1 chats from group messages?
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-[#1f2c34] border border-[#00a884]/30 text-[#e9edef] px-3.5 py-2.5 rounded-xl text-xs max-w-[90%] shadow">
                          <div className="font-semibold text-xs text-[#00a884] flex items-center gap-1.5">
                            <BsStars /> AI Assistant
                          </div>
                          <p className="text-[11px] text-[#d1d7db] leading-relaxed">
                            Through strict MongoDB <code className="bg-black/30 px-1 py-0.5 rounded text-[#00a884]">conversationId</code> scoping and isolated Socket.IO room subscriptions!
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Message input bar preview */}
                <div className="relative z-10 pt-2 border-t border-[#202c33] flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder={previewTab === "ai" ? "Ask AI anything..." : "Type a message..."}
                    className="flex-1 bg-[#202c33] text-xs px-3.5 py-2 rounded-lg border border-[#313d45] text-[#8696a0] focus:outline-none"
                  />
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] text-white flex items-center justify-center text-xs shadow-sm">
                    <FiSend />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          C. FEATURES SECTION
         ========================================================= */}
      <section id="features" className="py-20 bg-[#111b21]/70 backdrop-blur-sm border-t border-b border-[#202c33] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#00a884]">Product Capabilities</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-2">
              Everything you need for daily communication
            </h2>
            <p className="mt-3 text-sm text-[#8696a0]">
              Simple, reliable tools crafted for clean conversations, team collaboration, and smart assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Personal Messaging */}
            <div className="p-7 rounded-xl border border-[#202c33] bg-[#111b21]/90 hover:border-[#00a884]/50 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mb-5 text-xl shadow-xs">
                  <FiMessageSquare />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Personal Messaging</h3>
                <p className="text-sm text-[#8696a0] mb-4 leading-relaxed">
                  Fast, focused direct communication designed to keep you connected with the people who matter most.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-[#aebac1] pt-3 border-t border-[#202c33]">
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Simple one-to-one conversations
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Share messages and media seamlessly
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Stay connected with friends and colleagues
                </li>
              </ul>
            </div>

            {/* 2. Group Conversations */}
            <div className="p-7 rounded-xl border border-[#202c33] bg-[#111b21]/90 hover:border-[#00a884]/50 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mb-5 text-xl shadow-xs">
                  <FiUsers />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. Group Conversations</h3>
                <p className="text-sm text-[#8696a0] mb-4 leading-relaxed">
                  Bring friends, family, and project teams together in shared rooms with clear member roles and privacy.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-[#aebac1] pt-3 border-t border-[#202c33]">
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Create and manage group chats easily
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Communicate with multiple people simultaneously
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Keep team conversations organized and searchable
                </li>
              </ul>
            </div>

            {/* 3. AI Assistant */}
            <div className="p-7 rounded-xl border border-[#202c33] bg-[#111b21]/90 hover:border-[#00a884]/50 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mb-5 text-xl shadow-xs">
                  <BsStars />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. AI Assistant</h3>
                <p className="text-sm text-[#8696a0] mb-4 leading-relaxed">
                  An integrated copilot ready to answer queries, format code, and think along in your chat stream.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-[#aebac1] pt-3 border-t border-[#202c33]">
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Multi-turn conversational memory
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Ask questions and get intelligent responses
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Generate, summarize, and improve text on demand
                </li>
              </ul>
            </div>

            {/* 4. Smart Conversations */}
            <div className="p-7 rounded-xl border border-[#202c33] bg-[#111b21]/90 hover:border-[#00a884]/50 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mb-5 text-xl shadow-xs">
                  <FiZap />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">4. Smart Conversations</h3>
                <p className="text-sm text-[#8696a0] mb-4 leading-relaxed">
                  Enhance your everyday productivity with instant clarification, message phrasing suggestions, and quick actions.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-[#aebac1] pt-3 border-t border-[#202c33]">
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Get help composing clear, professional messages
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Use AI to improve collaboration and productivity
                </li>
                <li className="flex items-center gap-2">
                  <BsCheckCircleFill className="text-[#00a884]" /> Make everyday communication simpler and faster
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          D. AI ASSISTANT INTRODUCTION
         ========================================================= */}
      <section id="ai-assistant" className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00a884]">
                <BsStars className="text-[#00a884]" />
                <span>Intelligent Companion</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Meet your AI Assistant, right inside IrisChat
              </h2>

              <p className="text-sm text-[#8696a0] leading-relaxed">
                Interact with an intelligent assistant directly in your conversation flow. With multi-turn context memory, it keeps track of previous exchanges so you never lose the thread of complex thoughts.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-[#aebac1]">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span><strong>Zero context switching:</strong> Ask questions, brainstorm, or debug without opening another browser tab.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>Structured output:</strong> Formatted responses, bullet points, and code syntax highlighting.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>Secure & Private:</strong> Server-side API key proxying ensures your credentials remain completely private.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={authUser ? "/chat" : "/login"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#02b992] hover:to-[#00a884] text-white font-semibold text-sm transition-all shadow-md shadow-[#00a884]/25 hover:-translate-y-0.5"
                >
                  <span>Explore AI</span>
                  <FiArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-[#202c33] bg-[#111b21] shadow-2xl overflow-hidden text-left">
                
                {/* Header */}
                <div className="px-4 py-3 bg-[#202c33] border-b border-[#313d45] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-[#00a884] text-white flex items-center justify-center text-xs shadow-xs">
                      <BsStars />
                    </div>
                    <span className="text-xs font-semibold text-white">AI Assistant</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00a884] bg-[#00a884]/20 px-2 py-0.5 rounded border border-[#00a884]/30">
                    Active Session
                  </span>
                </div>

                {/* Simulated Conversation Body */}
                <div className="p-4 space-y-3.5 bg-[#0b141a] text-xs">
                  
                  {/* User query */}
                  <div className="flex justify-end">
                    <div className="bg-[#202c33] text-[#e9edef] px-3.5 py-2 rounded-xl text-xs max-w-[90%] border border-[#313d45]">
                      Can you summarize the 3 main advantages of using Socket.IO for our chat app?
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-[#1f2c34] border border-[#00a884]/30 text-[#e9edef] px-3.5 py-3 rounded-xl max-w-[95%] space-y-1.5 shadow">
                      <div className="font-semibold text-xs text-[#00a884] flex items-center gap-1.5 mb-1">
                        <BsStars />
                        <span>AI Assistant</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#d1d7db]">
                        Here is the quick breakdown:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-[#aebac1]">
                        <li><strong>Bi-directional latency:</strong> Instant push without polling overhead.</li>
                        <li><strong>Rooms & Namespaces:</strong> Natural grouping for isolated team channels.</li>
                        <li><strong>Auto-reconnect fallback:</strong> Graceful degradation if networks flicker.</li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Footer Input Mock */}
                <div className="px-3.5 py-2.5 bg-[#111b21] border-t border-[#202c33] flex items-center justify-between text-xs">
                  <span className="text-[#8696a0] truncate font-mono text-[11px]">
                    Ask AI anything...
                  </span>
                  <span className="text-[10px] font-semibold text-[#00a884]">
                    Press Enter
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          E. FINAL CTA
         ========================================================= */}
      <section className="py-20 bg-[#111b21]/70 backdrop-blur-sm border-t border-[#202c33] text-center relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Good conversations start here.
          </h2>

          <p className="mt-4 text-base text-[#8696a0] max-w-xl mx-auto leading-relaxed">
            Join conversations with real-time peer messaging, shared group rooms, and built-in AI assistance.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to={authUser ? "/chat" : "/register"}
              className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#00a884] to-[#008f6f] hover:from-[#02b992] hover:to-[#00a884] text-white font-semibold text-sm transition-all shadow-md shadow-[#00a884]/25 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <FiArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          F. FOOTER
         ========================================================= */}
      <footer id="about" className="py-12 bg-[#0b141a] border-t border-[#202c33] text-xs text-[#8696a0] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#202c33]">
            
            {/* Logo & Description */}
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center space-x-2.5">
                <img 
                  src="/iris-logo.jpg" 
                  alt="IrisChat Logo" 
                  className="w-8 h-8 rounded-lg object-cover shadow-sm border border-[#00a884]/40" 
                />
                <span className="font-bold text-white text-base tracking-tight">IrisChat</span>
              </div>
              <p className="text-xs text-[#8696a0] leading-relaxed">
                "Chat, Connect, Discover." A modern chat application combining 1-on-1 messaging, group rooms, and an intelligent AI assistant.
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#aebac1]">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#ai-assistant" className="hover:text-white transition-colors">AI Assistant</a>
              <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>

          </div>

          {/* Copyright info */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8696a0]">
            <span>&copy; {new Date().getFullYear()} IrisChat. All rights reserved.</span>
            <span>Crafted for real human and AI conversations.</span>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------
          SCROLL-TO-TOP BUTTON
         ------------------------------------------------------------- */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#111b21] text-[#e9edef] border border-[#202c33] shadow-xl hover:border-[#00a884] hover:text-[#00a884] transition-all hover:-translate-y-1"
          title="Scroll to top"
        >
          <FiArrowUp size={18} />
        </button>
      )}

    </div>
  );
}
