import { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Gauge,
  Plus,
  User,
  Calendar,
  Award,
  Building2,
  Phone,
  FileText,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { educations } from "@/data/mock";

const tabs = [
  { id: "ideology", label: "思想教育" },
  { id: "support", label: "社会帮扶" },
];

export default function Education() {
  const [activeTab, setActiveTab] = useState("ideology");

  const educationColumns: Column<typeof educations[0]>[] = [
    { key: "date", title: "学习日期", width: "120px" },
    {
      key: "detaineeName",
      title: "姓名",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-police-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-police-600" />
          </div>
          <span className="font-medium text-sm">{row.detaineeName}</span>
        </div>
      ),
    },
    {
      key: "type",
      title: "教育类型",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.type === "思想教育"
              ? "blue"
              : row.type === "文化教育"
              ? "info"
              : "success"
          }
        >
          {row.type}
        </StatusBadge>
      ),
    },
    { key: "content", title: "学习内容" },
    {
      key: "score",
      title: "考核成绩",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.score >= 90
                  ? "bg-health-500"
                  : row.score >= 70
                  ? "bg-police-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${row.score}%` }}
            />
          </div>
          <span className="font-mono text-sm font-medium text-slate-700 w-8">
            {row.score}
          </span>
        </div>
      ),
    },
    { key: "teacher", title: "授课人", width: "100px" },
  ];

  const educationEffectOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["参与率", "合格率", "优秀率"], top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
      axisLabel: { formatter: "{value}%" },
    },
    series: [
      {
        name: "参与率",
        type: "line",
        smooth: true,
        data: [92, 94, 95, 96, 97, 98],
        itemStyle: { color: "#1e40af" },
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
      {
        name: "合格率",
        type: "line",
        smooth: true,
        data: [82, 85, 86, 88, 90, 92],
        itemStyle: { color: "#065f46" },
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
      {
        name: "优秀率",
        type: "line",
        smooth: true,
        data: [35, 38, 42, 45, 48, 52],
        itemStyle: { color: "#d97706" },
        lineStyle: { width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
    ],
  };

  const educationTypeOption = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { data: ["思想教育", "文化教育", "职业技能"], top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["第1周", "第2周", "第3周", "第4周"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "思想教育",
        type: "bar",
        stack: "total",
        data: [32, 28, 30, 35],
        itemStyle: { color: "#1e40af" },
        barWidth: 32,
      },
      {
        name: "文化教育",
        type: "bar",
        stack: "total",
        data: [18, 22, 20, 24],
        itemStyle: { color: "#0284c7" },
      },
      {
        name: "职业技能",
        type: "bar",
        stack: "total",
        data: [15, 18, 22, 25],
        itemStyle: { color: "#065f46" },
      },
    ],
  };

  const ideologyCourses = [
    { id: 1, name: "禁毒法律法规", type: "思想教育", hours: 8, students: 68, progress: 95, teacher: "王教官" },
    { id: 2, name: "社会主义核心价值观", type: "思想教育", hours: 6, students: 68, progress: 100, teacher: "李教官" },
    { id: 3, name: "思想道德修养", type: "思想教育", hours: 12, students: 65, progress: 78, teacher: "王教官" },
    { id: 4, name: "爱国主义教育", type: "思想教育", hours: 4, students: 70, progress: 100, teacher: "张教官" },
    { id: 5, name: "语文基础", type: "文化教育", hours: 16, students: 42, progress: 65, teacher: "陈老师" },
    { id: 6, name: "数学基础", type: "文化教育", hours: 16, students: 38, progress: 58, teacher: "赵老师" },
  ];

  const supportOrganizations = [
    { id: 1, name: "XX市法律援助中心", type: "法律援助", contact: "李主任", phone: "13900139001", address: "XX市XX区XX路1号", count: 28 },
    { id: 2, name: "XX市心理卫生协会", type: "心理帮扶", contact: "王医生", phone: "13900139002", address: "XX市XX区XX路2号", count: 45 },
    { id: 3, name: "XX慈善基金会", type: "资金救助", contact: "赵秘书长", phone: "13900139003", address: "XX市XX区XX路3号", count: 18 },
    { id: 4, name: "XX职业技术学院", type: "技能培训", contact: "孙主任", phone: "13900139004", address: "XX市XX区XX路4号", count: 56 },
    { id: 5, name: "XX社区服务中心", type: "后续照管", contact: "周主任", phone: "13900139005", address: "XX市XX区XX路5号", count: 32 },
    { id: 6, name: "XX企业联盟", type: "就业帮扶", contact: "吴经理", phone: "13900139006", address: "XX市XX区XX路6号", count: 24 },
  ];

  return (
    <PageContainer
      title="教育帮扶"
      subtitle="思想文化教育与社会帮扶对接管理"
      breadcrumbs={[{ label: "教育帮扶" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Building2 className="w-4 h-4" />
            帮扶机构对接
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            新增学习记录
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月学习人次"
          value="568"
          icon={BookOpen}
          color="blue"
          trend={{ value: 18, label: "环比" }}
        />
        <StatCard
          title="教育课程数"
          value="12"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="帮扶合作机构"
          value="18"
          icon={HeartHandshake}
          color="green"
        />
        <StatCard
          title="平均优秀率"
          value="52%"
          icon={Gauge}
          color="orange"
          trend={{ value: 6, label: "环比" }}
        />
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-police-600 text-police-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "ideology" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">教育成效仪表盘</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "参与率", value: "98%", color: "text-police-600", bg: "bg-police-50" },
                  { label: "合格率", value: "92%", color: "text-health-600", bg: "bg-health-50" },
                  { label: "优秀率", value: "52%", color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "课时完成", value: "86%", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((item) => (
                  <div key={item.label} className={`p-4 ${item.bg} rounded-sm text-center`}>
                    <p className={`text-2xl font-semibold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <ReactECharts option={educationEffectOption} style={{ height: 260 }} />
            </div>

            <div className="card">
              <h3 className="section-title">学习记录列表</h3>
              <DataTable
                columns={educationColumns}
                data={educations}
                rowKey="id"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">教育类型分布</h3>
              <ReactECharts option={educationTypeOption} style={{ height: 280 }} />
            </div>

            <div className="card">
              <h3 className="section-title">在开课程</h3>
              <div className="space-y-3">
                {ideologyCourses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm text-slate-800">{course.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {course.teacher} · {course.hours}课时 · {course.students}人
                        </p>
                      </div>
                      <StatusBadge
                        type={
                          course.type === "思想教育"
                            ? "blue"
                            : course.type === "文化教育"
                            ? "info"
                            : "success"
                        }
                      >
                        {course.type}
                      </StatusBadge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span className="text-slate-500">课程进度</span>
                        <span className="font-medium text-slate-700">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-police-500 to-police-700 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">合作帮扶机构</h3>
                <button className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" />
                  新增机构
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className="p-4 border border-slate-100 rounded-sm hover:border-police-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-health-50 rounded-sm flex-shrink-0">
                        <Building2 className="w-5 h-5 text-health-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-slate-800 text-sm truncate">
                            {org.name}
                          </h4>
                          <StatusBadge type="info">{org.type}</StatusBadge>
                        </div>
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {org.contact}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {org.phone}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            累计帮扶 {org.count} 人次
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">帮扶类型统计</h3>
              <div className="space-y-4">
                {[
                  { type: "技能培训", count: 56, color: "bg-health-500", width: "80%" },
                  { type: "心理帮扶", count: 45, color: "bg-police-500", width: "65%" },
                  { type: "后续照管", count: 32, color: "bg-sky-500", width: "46%" },
                  { type: "法律援助", count: 28, color: "bg-purple-500", width: "40%" },
                  { type: "就业帮扶", count: 24, color: "bg-amber-500", width: "34%" },
                  { type: "资金救助", count: 18, color: "bg-rose-500", width: "26%" },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{item.type}</span>
                      <span className="text-xs font-medium text-slate-600">
                        {item.count}人次
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">近期帮扶活动</h3>
              <div className="space-y-3">
                {[
                  { date: "2025-06-20", title: "法律援助咨询日", org: "XX市法律援助中心", type: "法律援助" },
                  { date: "2025-06-18", title: "心理健康讲座", org: "XX市心理卫生协会", type: "心理帮扶" },
                  { date: "2025-06-15", title: "企业招聘洽谈会", org: "XX企业联盟", type: "就业帮扶" },
                  { date: "2025-06-12", title: "职业技能展示", org: "XX职业技术学院", type: "技能培训" },
                ].map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-police-50 rounded-sm flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-police-600" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{event.date.slice(5)}</p>
                    </div>
                    <div className="flex-1 pb-3 border-b border-slate-100 last:border-0">
                      <p className="text-sm font-medium text-slate-800">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge type="info">{event.type}</StatusBadge>
                        <span className="text-xs text-slate-500">{event.org}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-br from-health-50 to-emerald-50 border-0">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-health-600 rounded-sm">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">本月帮扶之星</p>
                  <p className="text-sm text-health-700 mt-1">XX市心理卫生协会</p>
                  <p className="text-xs text-slate-500 mt-1">累计帮扶45人次，获一致好评</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
