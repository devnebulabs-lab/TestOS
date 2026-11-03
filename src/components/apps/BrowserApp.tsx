import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Globe,
  Share2,
  ExternalLink,
  Plus,
  X,
  Newspaper,
  BookOpen,
  Gamepad,
  Sparkles,
  Check,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

interface Tab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

export const BrowserApp: React.FC = () => {
  const { registerBackHandler } = useOS();

  // Tabs state
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'CloudSearch Engine',
      url: 'cloudsearch://home',
      history: ['cloudsearch://home'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [urlInput, setUrlInput] = useState('cloudsearch://home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'news' | 'wiki' | 'tech'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ name: string; url: string; icon: string }[]>([
    { name: 'CloudSearch', url: 'cloudsearch://home', icon: '🔍' },
    { name: 'TechWire Daily', url: 'https://techwire.net', icon: '📰' },
    { name: 'WikiPedia Reader', url: 'https://wikipedia.test', icon: '📚' },
    { name: 'Mini Arcade', url: 'https://arcade.fun', icon: '🕹️' },
    { name: 'TestOS Docs', url: 'https://docs.testos.dev', icon: '⚡' },
  ]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Sync urlInput with current tab url
  useEffect(() => {
    if (currentTab) {
      setUrlInput(currentTab.url);
      if (currentTab.url.startsWith('cloudsearch://search?q=')) {
        const query = decodeURIComponent(currentTab.url.replace('cloudsearch://search?q=', ''));
        setSearchQuery(query);
      }
    }
  }, [currentTab?.url, activeTabId]);

  // Connect OS back button to browser history
  useEffect(() => {
    return registerBackHandler(() => {
      if (currentTab && currentTab.historyIndex > 0) {
        handleGoBack();
        return true; // back handled
      }
      return false; // let OS close app
    });
  }, [currentTab, registerBackHandler]);

  const navigateTo = (url: string, newTitle?: string) => {
    sounds.click();
    setIsLoading(true);
    let targetUrl = url.trim();

    // Check if it's a search or URL
    if (
      !targetUrl.includes('://') &&
      !targetUrl.startsWith('http') &&
      !targetUrl.includes('.test') &&
      !targetUrl.includes('.net') &&
      !targetUrl.includes('.dev') &&
      !targetUrl.includes('.org') &&
      !targetUrl.includes('.com')
    ) {
      // It's a search query!
      targetUrl = `cloudsearch://search?q=${encodeURIComponent(targetUrl)}`;
    }

    setTimeout(() => {
      setIsLoading(false);
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const nextHistory = tab.history.slice(0, tab.historyIndex + 1);
          nextHistory.push(targetUrl);
          return {
            ...tab,
            url: targetUrl,
            title: newTitle || getTitleFromUrl(targetUrl),
            history: nextHistory,
            historyIndex: nextHistory.length - 1,
          };
        })
      );
    }, 280);
  };

  const getTitleFromUrl = (url: string) => {
    if (url === 'cloudsearch://home') return 'CloudSearch Engine';
    if (url.startsWith('cloudsearch://search?q=')) {
      const q = decodeURIComponent(url.replace('cloudsearch://search?q=', ''));
      return `${q} - CloudSearch`;
    }
    if (url.includes('techwire')) return 'TechWire Daily News';
    if (url.includes('wikipedia')) return 'Encyclopedia - WikiPedia';
    if (url.includes('arcade')) return 'Arcade Portal';
    if (url.includes('docs.testos')) return 'TestOS Architecture Docs';
    return url.replace(/^https?:\/\//, '');
  };

  const handleGoBack = () => {
    if (!currentTab || currentTab.historyIndex <= 0) return;
    sounds.click();
    const nextIndex = currentTab.historyIndex - 1;
    const prevUrl = currentTab.history[nextIndex];
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: prevUrl,
              title: getTitleFromUrl(prevUrl),
              historyIndex: nextIndex,
            }
          : t
      )
    );
  };

  const handleGoForward = () => {
    if (!currentTab || currentTab.historyIndex >= currentTab.history.length - 1) return;
    sounds.click();
    const nextIndex = currentTab.historyIndex + 1;
    const nextUrl = currentTab.history[nextIndex];
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: nextUrl,
              title: getTitleFromUrl(nextUrl),
              historyIndex: nextIndex,
            }
          : t
      )
    );
  };

  const handleReload = () => {
    sounds.click();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  const handleCreateTab = () => {
    sounds.click();
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title: 'New Tab',
      url: 'cloudsearch://home',
      history: ['cloudsearch://home'],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.click();
    if (tabs.length === 1) {
      // Don't close last tab, just reset to home
      navigateTo('cloudsearch://home');
      return;
    }
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigateTo(`cloudsearch://search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 select-none overflow-hidden">
      {/* Top Browser Bar: Tabs */}
      <div className="bg-slate-950 px-2 pt-2 pb-1 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                sounds.click();
                setActiveTabId(tab.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs max-w-[150px] cursor-pointer transition-all border-t border-x ${
                isActive
                  ? 'bg-slate-900 border-white/20 text-white font-medium shadow-sm'
                  : 'bg-black/40 border-transparent text-white/50 hover:text-white/80'
              }`}
            >
              <Globe className="w-3 h-3 text-sky-400 flex-shrink-0" />
              <span className="truncate flex-1 text-[11px]">{tab.title}</span>
              <button
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="hover:bg-white/20 rounded p-0.5 text-white/40 hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        <button
          onClick={handleCreateTab}
          className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Controls & URL Bar */}
      <div className="p-2.5 bg-slate-900/95 border-b border-white/10 flex items-center gap-2 text-white/80">
        <button
          onClick={handleGoBack}
          disabled={!currentTab || currentTab.historyIndex <= 0}
          className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleGoForward}
          disabled={!currentTab || currentTab.historyIndex >= currentTab.history.length - 1}
          className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleReload}
          className={`p-1 rounded-lg hover:bg-white/10 ${isLoading ? 'animate-spin text-sky-400' : ''}`}
          title="Reload"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('cloudsearch://home')}
          className="p-1 rounded-lg hover:bg-white/10"
          title="Search Engine Home"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Address & Search Input */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="w-full relative flex items-center">
            <span className="absolute left-2.5 text-xs text-sky-400 font-mono">
              {currentTab?.url.startsWith('https://') ? '🔒' : '🌐'}
            </span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-slate-950/90 border border-white/15 focus:border-sky-400 rounded-xl pl-8 pr-16 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all font-mono"
              placeholder="Search or enter web address..."
            />
            <button
              type="submit"
              className="absolute right-2 px-2 py-0.5 bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 text-[10px] font-medium rounded-md transition-colors"
            >
              Go
            </button>
          </div>
        </form>

        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`p-1 rounded-lg transition-colors ${
            showBookmarks ? 'text-amber-300 bg-white/10' : 'hover:bg-white/10 text-white/70'
          }`}
          title="Bookmarks"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Bookmarks Bar (Quick Access) */}
      <div className="bg-slate-950/60 px-3 py-1.5 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[10px] text-white/40 uppercase tracking-wider mr-1">Favorites:</span>
        {bookmarks.map((bm) => (
          <button
            key={bm.name}
            onClick={() => navigateTo(bm.url, bm.name)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors text-[11px] whitespace-nowrap"
          >
            <span>{bm.icon}</span>
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="w-full h-0.5 bg-slate-800 overflow-hidden">
          <div className="h-full bg-sky-400 animate-pulse w-3/4" />
        </div>
      )}

      {/* Web Page Viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-900/90 p-4 no-scrollbar">
        {/* VIEW 1: CloudSearch Home */}
        {currentTab?.url === 'cloudsearch://home' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] max-w-lg mx-auto py-8">
            {/* Search Engine Branding */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
                <Globe className="w-6 h-6 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                  CloudSearch
                </h1>
                <p className="text-[11px] text-sky-300/70 tracking-wider uppercase font-semibold">
                  TestOS Distributed Search Engine
                </p>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="w-full space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 text-white/40 absolute left-4 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, docs, websites, games..."
                  className="w-full bg-slate-950/80 border border-white/20 focus:border-sky-400 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-2xl transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all active:scale-95"
                >
                  Cloud Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const randomQueries = ['TestOS features', 'Space travel', 'Silicon semiconductors', 'Retro Arcade games'];
                    const pick = randomQueries[Math.floor(Math.random() * randomQueries.length)];
                    setSearchQuery(pick);
                    navigateTo(`cloudsearch://search?q=${encodeURIComponent(pick)}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-all active:scale-95"
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </form>

            {/* Trending & Quick Links */}
            <div className="w-full mt-10 pt-6 border-t border-white/10">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Trending on TestOS Net
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'TestOS Architecture',
                  'Next-Gen Mobile GPU',
                  'Quantum Computing',
                  'Galaxy Runner High Scores',
                  'Ambient Sound Synthesis',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearchQuery(item);
                      navigateTo(`cloudsearch://search?q=${encodeURIComponent(item)}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sky-200 hover:text-white transition-colors"
                  >
                    #{item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Search Engine Results */}
        {currentTab?.url.startsWith('cloudsearch://search?q=') && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Search Header query info */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <p className="text-xs text-white/60">
                Results for <span className="text-sky-300 font-bold">"{searchQuery}"</span>
              </p>
              <div className="flex items-center gap-1">
                {(['all', 'news', 'wiki', 'tech'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSearchFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] capitalize transition-colors ${
                      searchFilter === filter
                        ? 'bg-sky-500 text-white font-medium'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge Graph Card (e.g. if searching TestOS or Weather) */}
            {searchQuery.toLowerCase().includes('testos') && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/70 to-indigo-950/70 border border-sky-500/30 shadow-xl space-y-2">
                <span className="text-[10px] text-sky-400 uppercase font-mono font-bold tracking-wider">
                  System Overview
                </span>
                <h3 className="text-base font-bold text-white">TestOS 1 Mobile Operating System</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  A high-performance simulated mobile OS crafted for modern touch interactions, featuring clouded frosted glass window sheets, animated 3D app switcher, classic 3-button navigation, and an open application ecosystem.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => navigateTo('https://docs.testos.dev', 'TestOS Documentation')}
                    className="text-xs text-sky-300 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Read Technical Docs <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Simulated Search Result Items */}
            <div className="space-y-4">
              <article
                onClick={() => navigateTo('https://techwire.net', 'TechWire Daily News')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center gap-2 text-[11px] text-sky-400">
                  <Newspaper className="w-3.5 h-3.5" />
                  <span className="font-mono">techwire.net/news</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  Next-Gen Mobile Architecture Released: How TestOS Handles Clouded Windows
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Breakthrough GPU compositing allows realistic backdrop-blur and 60fps spring transitions on mobile web browsers without thermal throttling...
                </p>
              </article>

              <article
                onClick={() => navigateTo('https://wikipedia.test', 'Encyclopedia - WikiPedia')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="font-mono">wikipedia.test/wiki/{encodeURIComponent(searchQuery)}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {searchQuery || 'Mobile Operating System'} - Free Encyclopedia
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Historical evolution from early physical keypads to modern gesture-based and 3-button navigation paradigms with hardware-accelerated user interfaces...
                </p>
              </article>

              <article
                onClick={() => navigateTo('https://arcade.fun', 'Mini Arcade Portal')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center gap-2 text-[11px] text-pink-400">
                  <Gamepad className="w-3.5 h-3.5" />
                  <span className="font-mono">arcade.fun/games</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                  Play Free HTML5 Mini Games in Your TestOS Browser
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Instant playable arcade games, reaction tests, spaceship runner, and retro brain teasers directly inside your web window.
                </p>
              </article>
            </div>
          </div>
        )}

        {/* VIEW 3: TechWire News Website */}
        {currentTab?.url.includes('techwire') && (
          <div className="max-w-2xl mx-auto space-y-5 py-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-rose-500" /> TECHWIRE DAILY
              </span>
              <span className="text-[11px] font-mono text-white/50">Issue #4,102</span>
            </div>

            <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">
                Breaking Analysis
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">
                The Rise of Browser-Hosted Mobile Operating Systems
              </h2>
              <p className="text-xs text-white/60">
                Published 2 hours ago · By Dr. Elena Rostova
              </p>
              <p className="text-xs text-white/80 leading-relaxed">
                As WebAssembly and modern CSS backdrops mature, developers are deploying fully functional mobile operating systems right inside web browsers. Systems like TestOS showcase animated 3-button navigation, real-time audio synthesis, and modular app stores without requiring native installations.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('cloudsearch://home')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white"
                >
                  Return to Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: WikiPedia Test Reader */}
        {currentTab?.url.includes('wikipedia') && (
          <div className="max-w-2xl mx-auto space-y-4 py-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <span className="text-base font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" /> WIKIPEDIA
              </span>
              <span className="text-xs text-white/50">The Free Encyclopedia</span>
            </div>

            <h1 className="text-xl font-serif font-bold text-white">Mobile Operating System</h1>
            <p className="text-xs text-white/70 italic border-l-2 border-sky-400 pl-3">
              From Wikipedia, the free encyclopedia for TestOS
            </p>

            <p className="text-xs text-white/80 leading-relaxed">
              A <strong>mobile operating system</strong> (mobile OS) is an operating system that controls a mobile device—similar in principle to how Linux, macOS, or Windows controls a desktop computer.
            </p>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <h3 className="text-xs font-bold text-white">Key Features:</h3>
              <ul className="text-xs text-white/70 list-disc list-inside space-y-1">
                <li>Touch-screen user interface with gestural input</li>
                <li>Clouded frosted-glass window compositing</li>
                <li>Application store for distribution and automated installation</li>
                <li>Persistent multitasking with card-deck app switching</li>
                <li>Unified status bar and pull-down control centers</li>
              </ul>
            </div>
          </div>
        )}

        {/* VIEW 5: Arcade Portal */}
        {currentTab?.url.includes('arcade') && (
          <div className="max-w-2xl mx-auto space-y-4 py-2 text-center">
            <h2 className="text-lg font-bold text-pink-400 flex items-center justify-center gap-2">
              <Gamepad className="w-5 h-5" /> Web Arcade Portal
            </h2>
            <p className="text-xs text-white/70">
              You can play games right inside TestOS! Check out Galaxy Runner in your Store app.
            </p>
            <div className="p-6 bg-gradient-to-tr from-purple-900/40 to-pink-900/40 rounded-2xl border border-pink-500/30">
              <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-sm font-bold text-white">Galaxy Runner is Available!</h3>
              <p className="text-xs text-white/70 mt-1 mb-4">
                Head to the TestOS Store to download Galaxy Runner with 1-click install.
              </p>
              <button
                onClick={() => navigateTo('cloudsearch://home')}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold rounded-xl transition-all"
              >
                Back to CloudSearch
              </button>
            </div>
          </div>
        )}

        {/* VIEW 6: TestOS Documentation */}
        {currentTab?.url.includes('docs.testos') && (
          <div className="max-w-2xl mx-auto space-y-4 py-2">
            <div className="flex items-center gap-2 pb-3 border-b border-white/15">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-bold text-white">TestOS Developer Docs</h2>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Welcome to the TestOS architecture manual. TestOS is built on modern React with reactive spring transitions, Web Audio API sound synthesis, and real-time state persistence.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold text-sky-300">3-Button Navigation</h4>
                <p className="text-[11px] text-white/60 mt-1">
                  Back ◀ pops navigation stack; Home ⚪ animates to home screen; Recents ▢ opens the 3D card switcher.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold text-emerald-300">App Store Engine</h4>
                <p className="text-[11px] text-white/60 mt-1">
                  Download, install, and uninstall apps seamlessly into the local system runtime.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
