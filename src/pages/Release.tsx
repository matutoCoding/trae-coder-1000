import { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  LogOut,
  HandHeart,
  FileCheck,
  AlertTriangle,
  Plus,
  User,
  Calendar,
  Phone,
  MapPin,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { releases, aftercareRecords } from "@/data/mock";

const tabs = [
  { id: "release", label: "期满解除" },
  { id: "aftercare", label: "后续照管" },
];

export default function Release() {
  const [activeTab, setActiveTab] = useState("release");

  const releaseColumns: Column<typeof releases[0]>[] = [
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
      key: "releaseDate",
      title: "解除日期",
      width: "120px",
      render: (row) => (
        <div className="flex items-center gap-1 text-slate-600 text-sm">
          <Calendar className="w-3.5 h-3.5" />
          {row.releaseDate}
        </div>
      ),
    },
    { key: "assessmentResult", title: "出所鉴定", width: "300px" },
    {
      key: "destination",
      title: "安置去向",
      render: (row) =>
        row.destination ? (
          <div className="flex items-center gap-1 text-slate-600 text-sm max-w-xs truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{row.destination}</span>
          </div>
        ) : (
          <span className="text-slate-400">待确认</span>
        ),
    },
    {
      key: "status",
      title: "状态",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.status === "已解除"
              ? "success"
              : row.status === "已批准"
              ? "blue"
              : row.status === "衔接中"
              ? "info"
              : "warning"
          }
        >
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  const aftercareColumns: Column<typeof aftercareRecords[0]>[] = [
    { key: "date", title: "日期", width: "120px" },
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
      title: "类型",
      width: "120px",
      render: (row) => (
        <StatusBadge
          type={
            row.type === "社区对接"
              ? "blue"
              : row.type === "回访记录"
              ? "info"
              : row.type === "复吸干预"
              ? "danger"
              : "success"
          }
        >
          {row.type}
        </StatusBadge>
      ),
    },
    { key: "content", title: "内容" },
    {
      key: "contact",
      title: "联系人",
      width: "200px",
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <Phone className="w-3.5 h-3.5" />
          {row.contact}
        </div>
      ),
    },
  ];

  const releaseTrendOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["解除人数", "后续衔接"], top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "解除人数",
        type: "line",
        smooth: true,
        data: [8, 12, 10, 15, 13, 18],
        itemStyle: { color: "#065f46" },
        lineStyle: { color: "#065f46", width: 3 },
        symbol: "circle",
        symbolSize: 8,
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(6, 95, 70, 0.25)" },
              { offset: 1, color: "rgba(6, 95, 70, 0.02)" },
            ],
          },
        },
      },
      {
        name: "后续衔接",
        type: "line",
        smooth: true,
        data: [7, 11, 10, 14, 12, 17],
        itemStyle: { color: "#1e40af" },
        lineStyle: { color: "#1e40af", width: 3 },
        symbol: "circle",
        symbolSize: 8,
      },
    ],
  };

  const aftercareStatOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "45%"],
        itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        label: { formatter: "{b}\n{c}", fontSize: 11 },
        data: [
          { value: 86, name: "社区对接", itemStyle: { color: "#1e40af" } },
          { value: 72, name: "回访记录", itemStyle: { color: "#065f46" } },
          { value: 12, name: "复吸干预", itemStyle: { color: "#dc2626" } },
          { value: 35, name: "帮扶救助", itemStyle: { color: "#d97706" } },
        ],
      },
    ],
  };

  const pendingRelease = releases.filter((r) => r.status === "待审批").length;

  return (
    <PageContainer
      title="解除回归"
      subtitle="期满解除登记、出所鉴定与后续照管衔接管理"
      breadcrumbs={[{ label: "解除回归" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            批量导出
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            解除登记
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月解除人数"
          value="18"
          icon={LogOut}
          color="green"
          trend={{ value: 15, label: "环比" }}
        />
        <StatCard
          title="待办解除审批"
          value={pendingRelease}
          icon={FileCheck}
          color="orange"
        />
        <StatCard
          title="后续照管中"
          value="86"
          icon={HandHeart}
          color="blue"
        />
        <StatCard
          title="复吸预警"
          value="3"
          icon={AlertTriangle}
          color="red"
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

      {activeTab === "release" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {releases.map((release) => (
                <div key={release.id} className="card card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-police-500 to-police-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {release.detaineeName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusBadge
                            type={
                              release.status === "已解除"
                                ? "success"
                                : release.status === "已批准"
                                ? "blue"
                                : "warning"
                            }
                          >
                            {release.status}
                          </StatusBadge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {release.releaseDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      {["收治登记", "生理脱毒", "心理矫治", "康复训练", "出所鉴定"].map(
                        (step, index) => (
                          <div key={step} className="flex items-center gap-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                index < 4
                                  ? "bg-health-100 text-health-700"
                                  : release.status !== "待审批"
                                  ? "bg-health-100 text-health-700"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {index < 4 || release.status !== "待审批" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                            </div>
                            {index < 4 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {release.destination && (
                    <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>安置去向：{release.destination}</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>联系方式：{release.contact}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button className="flex-1 btn-secondary text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      鉴定报告
                    </button>
                    <button className="flex-1 btn-primary text-xs">
                      <Download className="w-3.5 h-3.5" />
                      办理文书
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="section-title">期满解除列表</h3>
              <DataTable columns={releaseColumns} data={releases} rowKey="id" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">解除趋势</h3>
              <ReactECharts option={releaseTrendOption} style={{ height: 280 }} />
            </div>

            <div className="card bg-gradient-to-br from-health-50 to-emerald-50 border-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">即将期满</h3>
                <StatusBadge type="info">未来30天</StatusBadge>
              </div>
              <div className="space-y-3">
                {[
                  { name: "陈静", days: 8, date: "2025-07-15" },
                  { name: "王芳", days: 22, date: "2025-07-29" },
                  { name: "孙丽", days: 28, date: "2025-08-04" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/80 backdrop-blur rounded-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-health-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-health-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-health-700">{item.days}</p>
                      <p className="text-xs text-slate-500">天后解除</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">解除流程</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "期满评估", desc: "戒治效果综合评估", done: true },
                  { step: 2, title: "出所鉴定", desc: "心理、生理健康鉴定", done: true },
                  { step: 3, title: "审批确认", desc: "所领导审批签字", done: false },
                  { step: 4, title: "文书办理", desc: "法律文书制作发放", done: false },
                  { step: 5, title: "社区衔接", desc: "后续照管对接", done: false },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.done
                            ? "bg-health-100 text-health-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.done ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                      </div>
                      {item.step < 5 && (
                        <div
                          className={`absolute top-9 left-1/2 -translate-x-1/2 w-px h-6 ${
                            item.done ? "bg-health-200" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "aftercare" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">后续照管记录</h3>
              <DataTable
                columns={aftercareColumns}
                data={aftercareRecords}
                rowKey="id"
              />
            </div>

            <div className="card">
              <h3 className="section-title">跟踪回访时间线</h3>
              <div className="space-y-6 py-2">
                {[
                  {
                    date: "2025-07-10",
                    title: "社区对接完成",
                    type: "社区对接",
                    desc: "与杭州市西湖区XX街道司法所完成对接，移交相关档案材料，社区同意接收并安排后续照管。",
                    contact: "司法所王主任：13900139000",
                    tagType: "blue" as const,
                  },
                  {
                    date: "2025-07-12",
                    title: "出所前回访",
                    type: "回访记录",
                    desc: "出所前最后一次回访，了解其出所计划和心理准备情况。状态积极，对未来生活有明确规划。",
                    contact: "陈静本人",
                    tagType: "info" as const,
                  },
                  {
                    date: "2025-07-20",
                    title: "首次社区尿检",
                    type: "复吸干预",
                    desc: "出所后首次社区监督尿检，检测结果为阴性，状态良好。",
                    contact: "社区民警",
                    tagType: "success" as const,
                  },
                  {
                    date: "2025-08-05",
                    title: "就业帮扶对接",
                    type: "帮扶救助",
                    desc: "联系XX企业联盟，推荐参加美容美发岗位面试，企业表示愿意接收。",
                    contact: "XX企业联盟",
                    tagType: "success" as const,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-police-50 rounded-full flex items-center justify-center">
                        <HandHeart className="w-5 h-5 text-police-600" />
                      </div>
                      {index < 3 && (
                        <div className="absolute top-11 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <StatusBadge type={item.tagType}>{item.type}</StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </p>
                      <p className="text-sm text-slate-600 mb-2">{item.desc}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {item.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">照管类型分布</h3>
              <ReactECharts option={aftercareStatOption} style={{ height: 280 }} />
            </div>

            <div className="card">
              <h3 className="section-title">复吸风险预警</h3>
              <div className="space-y-3">
                {[
                  { name: "张XX", risk: "高风险", days: "出所30天", lastTest: "检测阴性" },
                  { name: "李XX", risk: "中风险", days: "出所15天", lastTest: "检测阴性" },
                  { name: "王XX", risk: "中风险", days: "出所45天", lastTest: "待检测" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-sm flex items-center gap-3 ${
                      item.risk === "高风险" ? "bg-warning-50 border border-warning-100" : "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-sm text-slate-800">{item.name}</span>
                        <StatusBadge type={item.risk === "高风险" ? "danger" : "warning"}>
                          {item.risk}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500">{item.days} · {item.lastTest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">照管资源链接</h3>
              <div className="space-y-2">
                {[
                  { name: "XX市禁毒办", desc: "官方禁毒服务热线", phone: "0XX-12345678" },
                  { name: "XX心理咨询热线", desc: "24小时心理援助", phone: "400-XXX-XXXX" },
                  { name: "XX就业帮扶中心", desc: "职业介绍与培训", phone: "0XX-87654321" },
                  { name: "XX社区康复中心", desc: "社区戒毒康复服务", phone: "0XX-11223344" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-police-600 text-sm">
                      <Phone className="w-3.5 h-3.5" />
                      {item.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
