'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

// 模拟行业数据
const mockIndustries = [
  {
    id: '1',
    slug: 'oil',
    name: '石油化工',
    nameEn: 'Petroleum & Petrochemical',
    description: '石油化工行业是现代工业的基础',
    nodeCount: 6,
    companyCount: 4,
    viewCount: 1250,
    isPublished: true,
  },
  {
    id: '2',
    slug: 'semiconductor',
    name: '半导体',
    nameEn: 'Semiconductor',
    description: '半导体产业是现代电子信息技术的基础',
    nodeCount: 6,
    companyCount: 4,
    viewCount: 980,
    isPublished: true,
  },
  {
    id: '3',
    slug: 'ev',
    name: '新能源汽车',
    nameEn: 'New Energy Vehicle',
    description: '新能源汽车产业链涵盖从上游原材料到整车制造',
    nodeCount: 6,
    companyCount: 4,
    viewCount: 856,
    isPublished: true,
  },
  {
    id: '4',
    slug: 'humanoid',
    name: '人形机器人',
    nameEn: 'Humanoid Robot',
    description: '人形机器人产业链涵盖核心零部件到整机集成',
    nodeCount: 6,
    companyCount: 4,
    viewCount: 423,
    isPublished: false,
  },
];

export default function IndustriesAdminPage() {
  const [search, setSearch] = useState('');
  const [industries, setIndustries] = useState(mockIndustries);

  const filteredIndustries = industries.filter(
    (ind) =>
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">行业管理</h1>
          <p className="text-[#6B7280] mt-1">管理产业链行业数据</p>
        </div>
        <Link
          href="/admin/industries/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增行业
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索行业..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      </div>

      {/* Industries Table */}
      <div className="rounded-xl bg-[#111827] border border-[#374151] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#374151]">
              <th className="text-left px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                行业
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                节点
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                公司
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                浏览
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                状态
              </th>
              <th className="text-right px-6 py-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#374151]">
            {filteredIndustries.map((industry) => (
              <tr key={industry.id} className="hover:bg-[#1F2937]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{industry.name}</div>
                      <div className="text-xs text-[#6B7280]">/{industry.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{industry.nodeCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white">{industry.companyCount}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-[#6B7280]">
                    <Eye className="w-4 h-4" />
                    <span>{industry.viewCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      industry.isPublished
                        ? 'bg-[#10B981]/20 text-[#10B981]'
                        : 'bg-[#6B7280]/20 text-[#6B7280]'
                    }`}
                  >
                    {industry.isPublished ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/industry/${industry.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#374151] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/industries/${industry.id}`}
                      className="p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#374151] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/admin/industries/${industry.id}/nodes`}
                      className="p-2 rounded-lg text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIndustries.length === 0 && (
          <div className="text-center py-12 text-[#6B7280]">
            未找到匹配的行业
          </div>
        )}
      </div>
    </div>
  );
}
