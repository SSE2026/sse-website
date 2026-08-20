'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Clock,
  Star,
  BarChart3,
  Building2,
  FileText,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  recentSearches?: Array<{
    type: 'industry' | 'company';
    name: string;
    code?: string;
    timestamp: string;
  }>;
  favorites?: Array<{
    type: 'industry' | 'company';
    name: string;
    code?: string;
  }>;
}

export default function Sidebar({ recentSearches = [], favorites = [] }: SidebarProps) {
  const pathname = usePathname();

  const defaultFavorites = [
    { type: 'industry' as const, name: '石油化工', code: 'oil' },
    { type: 'industry' as const, name: '半导体', code: 'semiconductor' },
    { type: 'company' as const, name: '中国海油', code: '600938' },
    { type: 'company' as const, name: '宁德时代', code: '300750' },
  ];

  const defaultRecent = [
    { type: 'industry' as const, name: '新能源汽车', timestamp: '2小时前' },
    { type: 'company' as const, name: '中芯国际', code: '688981', timestamp: '昨天' },
    { type: 'industry' as const, name: 'AI服务器', timestamp: '3天前' },
  ];

  const displayFavorites = favorites.length > 0 ? favorites : defaultFavorites;
  const displayRecent = recentSearches.length > 0 ? recentSearches : defaultRecent;

  const navItems = [
    { href: '/', icon: Search, label: '搜索', key: 'nav-search' },
    { href: '/industry', icon: BarChart3, label: '行业研究', key: 'nav-industry' },
    { href: '/company', icon: Building2, label: '公司分析', key: 'nav-company' },
    { href: '/export', icon: FileText, label: '报告导出', key: 'nav-export' },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-[#374151] bg-[#0F1623] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-l-2 border-[#F59E0B]'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-[#374151]" />

        {/* Favorites */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-3">
            <Star className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              我的收藏
            </h3>
          </div>
          <div className="space-y-1">
            {displayFavorites.map((item, index) => (
              <Link
                key={`favorite-${index}`}
                href={item.type === 'industry' ? `/industry/${item.code}` : `/company/${item.code}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm truncate">{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#374151]" />

        {/* Recent Searches */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-3">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              最近搜索
            </h3>
          </div>
          <div className="space-y-1">
            {displayRecent.map((item, index) => (
              <Link
                key={`recent-${index}`}
                href={item.type === 'industry' ? `/industry/${item.code || item.name}` : `/company/${item.code}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.type === 'industry' ? (
                    <BarChart3 className="w-4 h-4 text-[#6B7280] shrink-0" />
                  ) : (
                    <Building2 className="w-4 h-4 text-[#6B7280] shrink-0" />
                  )}
                  <span className="text-sm truncate">{item.name}</span>
                </div>
                <span className="text-xs text-[#6B7280] shrink-0 ml-2">
                  {item.timestamp}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#1F2937]/50 to-[#111827] border border-[#374151]">
          <h4 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
            数据概览
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">行业覆盖</span>
              <span className="text-sm font-mono text-[#10B981]">128 个</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">公司研究</span>
              <span className="text-sm font-mono text-[#10B981]">2,456 家</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">今日更新</span>
              <span className="text-sm font-mono text-[#F59E0B]">23 份</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
