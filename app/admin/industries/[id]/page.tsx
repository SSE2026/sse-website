'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Building2,
} from 'lucide-react';

// 模拟行业数据
const mockIndustry = {
  id: '1',
  slug: 'oil',
  name: '石油化工',
  nameEn: 'Petroleum & Petrochemical',
  description: '石油化工行业是现代工业的基础，涵盖从原油勘探开采到终端应用的完整产业链。',
  isPublished: true,
  nodes: [
    {
      id: 'n1',
      name: '油气勘探开采',
      level: 'UPSTREAM',
      description: '包括陆上和海上油气田的勘探、钻井、开采作业',
      physicalProcess: '地质勘探 → 地震勘探 → 钻井 → 完井 → 采油',
      businessModel: '资本密集型，重资产运营',
      profitLogic: '油价上涨直接提升利润，成本相对固定',
      cycle: '强周期行业，与国际油价高度相关',
      beneficiaries: ['中国石油', '中国海油'],
      losers: ['炼化企业'],
      companies: ['600938', '601857'],
    },
    {
      id: 'n2',
      name: '运输仓储',
      level: 'MIDSTREAM',
      description: '原油和天然气的管道运输、储罐储存、油轮运输',
      physicalProcess: '管道输送/油轮运输 → 储罐储存 → 分销转运',
      businessModel: '物流基础设施，按量收费，稳定的现金流',
      profitLogic: '运输量稳定，收益与周转量挂钩',
      cycle: '相对稳定，防御性较强',
      beneficiaries: ['中远海能', '招商轮船'],
      losers: [],
      companies: ['600026'],
    },
    {
      id: 'n3',
      name: '炼化加工',
      level: 'MIDSTREAM',
      description: '原油蒸馏、裂解、精馏等加工过程生产各类石化产品',
      physicalProcess: '原油蒸馏 → 催化裂化 → 加氢精制 → 成品产出',
      businessModel: '加工费模式，赚取原油与成品油的价差',
      profitLogic: '炼化毛利=油价×收率+化工品价差-加工成本',
      cycle: '与油价波动、化工景气度相关',
      beneficiaries: [],
      losers: ['高油价时的炼化企业'],
      companies: ['600028'],
    },
  ],
};

const levelOptions = [
  { value: 'UPSTREAM', label: '上游' },
  { value: 'MIDSTREAM', label: '中游' },
  { value: 'DOWNSTREAM', label: '下游' },
  { value: 'ALTERNATIVE', label: '替代产业' },
];

export default function EditIndustryPage() {
  const params = useParams();
  const isNew = params.id === 'new';
  const [industry, setIndustry] = useState(mockIndustry);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // 实际项目中调用 API 保存
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const addNode = () => {
    const newNode = {
      id: `n${Date.now()}`,
      name: '新节点',
      level: 'MIDSTREAM',
      description: '',
      physicalProcess: '',
      businessModel: '',
      profitLogic: '',
      cycle: '',
      beneficiaries: [],
      losers: [],
      companies: [],
    };
    setIndustry({ ...industry, nodes: [...industry.nodes, newNode] });
  };

  const removeNode = (nodeId: string) => {
    setIndustry({
      ...industry,
      nodes: industry.nodes.filter((n) => n.id !== nodeId),
    });
  };

  const updateNode = (nodeId: string, field: string, value: any) => {
    setIndustry({
      ...industry,
      nodes: industry.nodes.map((n) =>
        n.id === nodeId ? { ...n, [field]: value } : n
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/industries"
            className="p-2 rounded-lg hover:bg-[#374151] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#9CA3AF]" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {isNew ? '新增行业' : '编辑行业'}
            </h1>
            <p className="text-[#6B7280] mt-1">
              {isNew ? '创建新的产业链' : `编辑 ${industry.name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-xl bg-[#111827] border border-[#374151]">
            <h2 className="text-lg font-semibold text-white mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">名称</label>
                <input
                  type="text"
                  value={industry.name}
                  onChange={(e) => setIndustry({ ...industry, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">英文名称</label>
                <input
                  type="text"
                  value={industry.nameEn}
                  onChange={(e) => setIndustry({ ...industry, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Slug</label>
                <input
                  type="text"
                  value={industry.slug}
                  onChange={(e) => setIndustry({ ...industry, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white focus:outline-none focus:border-[#3B82F6]"
                />
                <p className="text-xs text-[#6B7280] mt-1">URL: /industry/{industry.slug || 'slug'}</p>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">描述</label>
                <textarea
                  value={industry.description}
                  onChange={(e) => setIndustry({ ...industry, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={industry.isPublished}
                    onChange={(e) => setIndustry({ ...industry, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-[#374151] text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  <span className="text-sm text-white">发布</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Chain Nodes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">产业链节点</h2>
            <button
              onClick={addNode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加节点
            </button>
          </div>

          {industry.nodes.map((node, index) => (
            <div
              key={node.id}
              className="p-6 rounded-xl bg-[#111827] border border-[#374151]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-[#6B7280] cursor-move" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] font-semibold">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={node.name}
                    onChange={(e) => updateNode(node.id, 'name', e.target.value)}
                    placeholder="节点名称"
                    className="text-lg font-medium bg-transparent border-none text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={node.level}
                    onChange={(e) => updateNode(node.id, 'level', e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none"
                  >
                    {levelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeNode(node.id)}
                    className="p-2 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#6B7280] mb-1">描述</label>
                  <input
                    type="text"
                    value={node.description}
                    onChange={(e) => updateNode(node.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">物理过程</label>
                    <input
                      type="text"
                      value={node.physicalProcess}
                      onChange={(e) => updateNode(node.id, 'physicalProcess', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">商业模式</label>
                    <input
                      type="text"
                      value={node.businessModel}
                      onChange={(e) => updateNode(node.id, 'businessModel', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">盈利逻辑</label>
                    <input
                      type="text"
                      value={node.profitLogic}
                      onChange={(e) => updateNode(node.id, 'profitLogic', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B7280] mb-1">周期属性</label>
                    <input
                      type="text"
                      value={node.cycle}
                      onChange={(e) => updateNode(node.id, 'cycle', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#1F2937] border border-[#374151] text-white text-sm focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {industry.nodes.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-[#111827] border border-[#374151] border-dashed">
              <Building2 className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <p className="text-[#6B7280]">暂无产业链节点</p>
              <button
                onClick={addNode}
                className="mt-4 px-4 py-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB] transition-colors"
              >
                添加第一个节点
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
