"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  Mail,
  Crown,
  User,
  Users,
  MoreVertical,
} from "lucide-react";
import { useAdmin } from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST" | "USER";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

// Mock users data
const mockUsers: UserData[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@shensafu.com",
    role: "ADMIN",
    status: "active",
    lastLogin: "2024-07-28",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "John Chen",
    email: "john@company.com",
    role: "ANALYST",
    status: "active",
    lastLogin: "2024-07-27",
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    name: "Sarah Liu",
    email: "sarah@company.com",
    role: "ANALYST",
    status: "active",
    lastLogin: "2024-07-26",
    createdAt: "2024-04-20",
  },
  {
    id: "4",
    name: "Mike Wang",
    email: "mike@company.com",
    role: "USER",
    status: "active",
    lastLogin: "2024-07-25",
    createdAt: "2024-05-10",
  },
  {
    id: "5",
    name: "Test User",
    email: "test@test.com",
    role: "USER",
    status: "inactive",
    lastLogin: "2024-06-15",
    createdAt: "2024-06-01",
  },
];

// Users translations
const usersTranslations = {
  en: {
    title: "User Management",
    subtitle: "Manage system users and roles",
    addUser: "Add User",
    searchPlaceholder: "Search users...",
    filter: "Filter",
    name: "Name",
    email: "Email",
    role: "Role",
    status: "Status",
    lastLogin: "Last Login",
    createdAt: "Created",
    actions: "Actions",
    active: "Active",
    inactive: "Inactive",
    roles: {
      ADMIN: "Admin",
      ANALYST: "Analyst",
      USER: "User",
    },
    edit: "Edit",
    delete: "Delete",
    noUsers: "No users found",
  },
  zh: {
    title: "用户管理",
    subtitle: "管理系统用户和角色",
    addUser: "添加用户",
    searchPlaceholder: "搜索用户...",
    filter: "筛选",
    name: "姓名",
    email: "邮箱",
    role: "角色",
    status: "状态",
    lastLogin: "最后登录",
    createdAt: "创建时间",
    actions: "操作",
    active: "已激活",
    inactive: "未激活",
    roles: {
      ADMIN: "管理员",
      ANALYST: "分析师",
      USER: "普通用户",
    },
    edit: "编辑",
    delete: "删除",
    noUsers: "未找到用户",
  },
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "ADMIN":
      return Crown;
    case "ANALYST":
      return Shield;
    default:
      return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "#F59E0B";
    case "ANALYST":
      return "#8B5CF6";
    default:
      return "#3B82F6";
  }
};

export default function UsersAdminPage() {
  const { locale } = useAdmin();
  const isLocale = locale;
  const t = usersTranslations[isLocale];

  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t.title}
          </h1>
          <p className="text-white/50 mt-1">
            {t.subtitle}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t.addUser}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          {t.filter}
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {t.name}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {t.email}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {t.role}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {t.status}
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/50">
                  {t.lastLogin}
                </th>
                <th className="text-right p-4 text-sm font-medium text-white/50">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: `${roleColor}30` }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${roleColor}15`,
                          color: roleColor,
                          border: `1px solid ${roleColor}30`,
                        }}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {t.roles[user.role]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                            : "bg-white/10 text-white/50 border border-white/10"
                        }`}
                      >
                        {user.status === "active" ? t.active : t.inactive}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-sm">
                      {user.lastLogin}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-white/40 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">{t.noUsers}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          {isLocale === "en"
            ? `Showing ${filteredUsers.length} of ${users.length} users`
            : `显示 ${filteredUsers.length} / ${users.length} 个用户`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            {isLocale === "en" ? "Previous" : "上一页"}
          </Button>
          <Button variant="outline" size="sm">
            {isLocale === "en" ? "Next" : "下一页"}
          </Button>
        </div>
      </div>
    </div>
  );
}
