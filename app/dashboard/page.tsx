'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  FileText,
  Star,
  Download,
  BarChart3,
  Building2,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect('/auth/login');
  }

  const menuItems = [
    {
      title: '我的收藏',
      description: '查看和管理收藏的行业',
      icon: Star,
      href: '/dashboard/favorites',
      color: 'from-[#F59E0B]/20 to-[#F59E0B]/5 border-[#F59E0B]/30',
      iconColor: 'text-[#F59E0B]',
    },
    {
      title: '导出记录',
      description: '查看报告导出历史',
      icon: Download,
      href: '/dashboard/exports',
      color: 'from-[#3B82F6]/20 to-[#3B82F6]/5 border-[#3B82F6]/30',
      iconColor: 'text-[#3B82F6]',
    },
    {
      title: '行业研究',
      description: '浏览产业链分析',
      icon: BarChart3,
      href: '/industries',
      color: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5 border-[#8B5CF6]/30',
      iconColor: 'text-[#8B5CF6]',
    },
    {
      title: '公司研究',
      description: '查看上市公司分析',
      icon: Building2,
      href: '/companies',
      color: 'from-[#10B981]/20 to-[#10B981]/5 border-[#10B981]/30',
      iconColor: 'text-[#10B981]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0E17]/95 backdrop-blur-sm border-b border-[#374151]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-semibold text-white">Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{session.user?.name}</div>
                <div className="text-xs text-[#6B7280]">{session.user?.email}</div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-[#6B7280] hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">
            欢迎回来，{session.user?.name}
          </h1>
          <p className="text-[#6B7280]">
            开始探索产业链研究和投资分析
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#374151]">
            <div className="text-3xl font-mono font-bold text-[#3B82F6]">0</div>
            <div className="text-sm text-[#6B7280]">收藏行业</div>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#374151]">
            <div className="text-3xl font-mono font-bold text-[#10B981]">0</div>
            <div className="text-sm text-[#6B7280]">导出报告</div>
          </div>
          <div className="p-4 rounded-xl bg-[#111827] border border-[#374151]">
            <div className="text-3xl font-mono font-bold text-[#8B5CF6]">4</div>
            <div className="text-sm text-[#6B7280]">可研究行业</div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`p-6 rounded-xl bg-gradient-to-br ${item.color} transition-all hover:scale-[1.02] group`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.iconColor}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <ArrowRight className={`w-5 h-5 ${item.iconColor} group-hover:translate-x-1 transition-transform`} />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">{item.title}</h3>
              <p className="text-sm text-[#9CA3AF]">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 p-6 rounded-xl bg-[#111827] border border-[#374151]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3B82F6]" />
            最近活动
          </h2>
          <div className="text-center py-8 text-[#6B7280]">
            暂无最近活动记录
          </div>
        </div>
      </main>
    </div>
  );
}
