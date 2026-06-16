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
  Check,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useAppStore } from "@/store/useAppStore";
import type { Release, AftercareRecord } from "@/types";

const tabs = [
  { id: "release", label: "期满解除" },
  { id: "aftercare", label: "后续照管" },
];

export default function Release() {
  const [activeTab, setActiveTab] = useState("release");
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [aftercareModalOpen, setAftercareModalOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [releaseDetailModalOpen, setReleaseDetailModalOpen] = useState(false);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState("全部记录");
  const [exportFormat, setExportFormat] = useState("Excel");

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportRelease, setSelectedReportRelease] = useState<Release | null>(null);

  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDocRelease, setSelectedDocRelease] = useState<Release | null>(null);
  const [documentType, setDocumentType] = useState("解除强制隔离戒毒决定书");

  const {
    detainees,
    releases,
    aftercareRecords,
    addRelease,
    updateReleaseStatus,
    addAftercareRecord,
  } = useAppStore();

  const [releaseForm, setReleaseForm] = useState({
    detaineeId: "",
    releaseDate: "",
    assessmentResult: "",
    destination: "",
    contact: "",
    status: "待审批" as Release["status"],
  });

  const [aftercareForm, setAftercareForm] = useState({
    detaineeId: "",
    date: new Date().toISOString().split("T")[0],
    type: "回访记录" as AftercareRecord["type"],
    content: "",
    contact: "",
    result: "",
  });

  const pendingRelease = releases.filter((r) => r.status === "待审批").length;

  const handleAddRelease = () => {
    if (!releaseForm.detaineeId) return;
    const detainee = detainees.find((d) => d.id === releaseForm.detaineeId);
    if (!detainee) return;

    addRelease({
      ...releaseForm,
      detaineeName: detainee.name,
    } as Omit<Release, "id">);

    setReleaseForm({
      detaineeId: "",
      releaseDate: "",
      assessmentResult: "",
      destination: "",
      contact: "",
      status: "待审批",
    });
    setReleaseModalOpen(false);
  };

  const handleApproveRelease = (id: string) => {
    updateReleaseStatus(id, "已批准");
  };

  const handleCompleteRelease = (id: string) => {
    updateReleaseStatus(id, "已解除");
  };

  const handleAddAftercare = () => {
    if (!aftercareForm.detaineeId || !aftercareForm.content) return;
    const detainee = detainees.find((d) => d.id === aftercareForm.detaineeId);
    if (!detainee) return;

    addAftercareRecord({
      ...aftercareForm,
      detaineeName: detainee.name,
    } as Omit<AftercareRecord, "id">);

    setAftercareForm({
      detaineeId: "",
      date: new Date().toISOString().split("T")[0],
      type: "回访记录",
      content: "",
      contact: "",
      result: "",
    });
    setAftercareModalOpen(false);
  };

  const openReleaseDetail = (release: Release) => {
    setSelectedRelease(release);
    setReleaseDetailModalOpen(true);
  };

  const releaseColumns: Column<Release>[] = [
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
    { key: "assessmentResult", title: "出所鉴定", width: "200px" },
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
    {
      key: "action",
      title: "操作",
      width: "160px",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="text-xs text-slate-600 hover:text-slate-800 font-medium"
            onClick={() => openReleaseDetail(row)}
          >
            详情
          </button>
          {row.status === "待审批" && (
            <button
              className="text-xs text-health-600 hover:text-health-700 font-medium"
              onClick={() => handleApproveRelease(row.id)}
            >
              批准
            </button>
          )}
          {row.status === "已批准" && (
            <button
              className="text-xs text-police-600 hover:text-police-700 font-medium"
              onClick={() => handleCompleteRelease(row.id)}
            >
              办理解除
            </button>
          )}
        </div>
      ),
    },
  ];

  const aftercareColumns: Column<AftercareRecord>[] = [
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
        data: [8, 12, 10, 15, 13, releases.length],
        itemStyle: { color: "#065f46" },
        lineStyle: { color: "#065f46", width: 3 },
        symbol: "circle",
        symbolSize: 8,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
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
        data: [7, 11, 10, 14, 12, aftercareRecords.length],
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
          {
            value: aftercareRecords.filter((a) => a.type === "社区对接").length,
            name: "社区对接",
            itemStyle: { color: "#1e40af" },
          },
          {
            value: aftercareRecords.filter((a) => a.type === "回访记录").length,
            name: "回访记录",
            itemStyle: { color: "#065f46" },
          },
          {
            value: aftercareRecords.filter((a) => a.type === "复吸干预").length,
            name: "复吸干预",
            itemStyle: { color: "#dc2626" },
          },
          {
            value: aftercareRecords.filter((a) => a.type === "帮扶救助").length,
            name: "帮扶救助",
            itemStyle: { color: "#d97706" },
          },
        ],
      },
    ],
  };

  const aftercareTimelineData = aftercareRecords
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const getTagType = (type: string) => {
    switch (type) {
      case "社区对接":
        return "blue" as const;
      case "回访记录":
        return "info" as const;
      case "复吸干预":
        return "danger" as const;
      case "帮扶救助":
        return "success" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <PageContainer
      title="解除回归"
      subtitle="期满解除登记、出所鉴定与后续照管衔接管理"
      breadcrumbs={[{ label: "解除回归" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => setExportModalOpen(true)}>
            <Download className="w-4 h-4" />
            批量导出
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              activeTab === "release"
                ? setReleaseModalOpen(true)
                : setAftercareModalOpen(true)
            }
          >
            <Plus className="w-4 h-4" />
            {activeTab === "release" ? "解除登记" : "新增照管记录"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月解除人数"
          value={releases.filter((r) => r.status === "已解除").length}
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
          value={aftercareRecords.length}
          icon={HandHeart}
          color="blue"
        />
        <StatCard
          title="复吸预警"
          value={aftercareRecords.filter((a) => a.type === "复吸干预").length}
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
                <div
                  key={release.id}
                  className="card card-hover cursor-pointer"
                  onClick={() => openReleaseDetail(release)}
                >
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
                    <div className="flex gap-2 flex-wrap">
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
                            {index < 4 && (
                              <ArrowRight className="w-3 h-3 text-slate-300" />
                            )}
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
                    <button
                      className="flex-1 btn-secondary text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReportRelease(release);
                        setReportModalOpen(true);
                      }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      鉴定报告
                    </button>
                    <button
                      className="flex-1 btn-primary text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocRelease(release);
                        setDocumentType("解除强制隔离戒毒决定书");
                        setDocumentModalOpen(true);
                      }}
                    >
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
                        <p className="font-medium text-sm text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-health-700">
                        {item.days}
                      </p>
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
                {aftercareTimelineData.length > 0 ? (
                  aftercareTimelineData.map((record, index) => (
                    <div key={record.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-police-50 rounded-full flex items-center justify-center">
                          <HandHeart className="w-5 h-5 text-police-600" />
                        </div>
                        {index < aftercareTimelineData.length - 1 && (
                          <div className="absolute top-11 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-800">
                            {record.detaineeName} - {record.type}
                          </h4>
                          <StatusBadge type={getTagType(record.type)}>
                            {record.type}
                          </StatusBadge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {record.date}
                        </p>
                        <p className="text-sm text-slate-600 mb-2">{record.content}</p>
                        {record.result && (
                          <p className="text-xs text-health-600 bg-health-50 px-2 py-1 rounded-sm inline-block">
                            结果：{record.result}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                          <Phone className="w-3 h-3" />
                          {record.contact}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    暂无后续照管记录
                  </div>
                )}
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
                  {
                    name: "张XX",
                    risk: "高风险",
                    days: "出所30天",
                    lastTest: "检测阴性",
                  },
                  {
                    name: "李XX",
                    risk: "中风险",
                    days: "出所15天",
                    lastTest: "检测阴性",
                  },
                  {
                    name: "王XX",
                    risk: "中风险",
                    days: "出所45天",
                    lastTest: "待检测",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-sm flex items-center gap-3 ${
                      item.risk === "高风险"
                        ? "bg-warning-50 border border-warning-100"
                        : "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-sm text-slate-800">
                          {item.name}
                        </span>
                        <StatusBadge
                          type={item.risk === "高风险" ? "danger" : "warning"}
                        >
                          {item.risk}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.days} · {item.lastTest}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">照管资源链接</h3>
              <div className="space-y-2">
                {[
                  {
                    name: "XX市禁毒办",
                    desc: "官方禁毒服务热线",
                    phone: "0XX-12345678",
                  },
                  {
                    name: "XX心理咨询热线",
                    desc: "24小时心理援助",
                    phone: "400-XXX-XXXX",
                  },
                  {
                    name: "XX就业帮扶中心",
                    desc: "职业介绍与培训",
                    phone: "0XX-87654321",
                  },
                  {
                    name: "XX社区康复中心",
                    desc: "社区戒毒康复服务",
                    phone: "0XX-11223344",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-sm hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-800">
                        {item.name}
                      </p>
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

      <Modal
        isOpen={releaseModalOpen}
        onClose={() => setReleaseModalOpen(false)}
        title="期满解除登记"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setReleaseModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddRelease}
              disabled={!releaseForm.detaineeId}
            >
              <Check className="w-4 h-4" />
              提交登记
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">
              戒毒人员 <span className="text-warning-600">*</span>
            </label>
            <select
              className="form-input"
              value={releaseForm.detaineeId}
              onChange={(e) =>
                setReleaseForm({ ...releaseForm, detaineeId: e.target.value })
              }
            >
              <option value="">请选择戒毒人员</option>
              {detainees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.idCard}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">预计解除日期</label>
              <input
                type="date"
                className="form-input"
                value={releaseForm.releaseDate}
                onChange={(e) =>
                  setReleaseForm({ ...releaseForm, releaseDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">联系电话</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入联系电话"
                value={releaseForm.contact}
                onChange={(e) =>
                  setReleaseForm({ ...releaseForm, contact: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">出所鉴定结果</label>
            <textarea
              className="form-input min-h-[80px]"
              placeholder="请输入出所鉴定结果"
              value={releaseForm.assessmentResult}
              onChange={(e) =>
                setReleaseForm({
                  ...releaseForm,
                  assessmentResult: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="form-label">安置去向</label>
            <input
              type="text"
              className="form-input"
              placeholder="请输入安置地址或单位"
              value={releaseForm.destination}
              onChange={(e) =>
                setReleaseForm({ ...releaseForm, destination: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={releaseDetailModalOpen}
        onClose={() => {
          setReleaseDetailModalOpen(false);
          setSelectedRelease(null);
        }}
        title="解除详情"
        width="max-w-lg"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                setReleaseDetailModalOpen(false);
                setSelectedRelease(null);
              }}
            >
              关闭
            </button>
            {selectedRelease?.status === "待审批" && (
              <button
                className="btn-primary"
                onClick={() => {
                  handleApproveRelease(selectedRelease.id);
                  setReleaseDetailModalOpen(false);
                  setSelectedRelease(null);
                }}
              >
                <Check className="w-4 h-4" />
                批准
              </button>
            )}
            {selectedRelease?.status === "已批准" && (
              <button
                className="btn-primary"
                onClick={() => {
                  handleCompleteRelease(selectedRelease.id);
                  setReleaseDetailModalOpen(false);
                  setSelectedRelease(null);
                }}
              >
                办理解除
              </button>
            )}
          </>
        }
      >
        {selectedRelease && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-police-500 to-police-700 flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">
                  {selectedRelease.detaineeName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge
                    type={
                      selectedRelease.status === "已解除"
                        ? "success"
                        : selectedRelease.status === "已批准"
                        ? "blue"
                        : "warning"
                    }
                  >
                    {selectedRelease.status}
                  </StatusBadge>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedRelease.releaseDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-slate-500 w-24 flex-shrink-0">出所鉴定：</span>
                <span className="text-slate-700">
                  {selectedRelease.assessmentResult || "待鉴定"}
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-24 flex-shrink-0">安置去向：</span>
                <span className="text-slate-700">
                  {selectedRelease.destination || "待确认"}
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-24 flex-shrink-0">联系方式：</span>
                <span className="text-slate-700">
                  {selectedRelease.contact || "待提供"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h5 className="text-sm font-medium text-slate-700 mb-3">
                解除流程进度
              </h5>
              <div className="space-y-3">
                {[
                  { title: "期满评估", done: true },
                  { title: "出所鉴定", done: true },
                  {
                    title: "审批确认",
                    done: selectedRelease.status !== "待审批",
                  },
                  {
                    title: "文书办理",
                    done:
                      selectedRelease.status === "已解除" ||
                      selectedRelease.status === "衔接中",
                  },
                  { title: "社区衔接", done: selectedRelease.status === "已解除" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        item.done
                          ? "bg-health-100 text-health-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        item.done ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={aftercareModalOpen}
        onClose={() => setAftercareModalOpen(false)}
        title="新增后续照管记录"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setAftercareModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddAftercare}
              disabled={!aftercareForm.detaineeId || !aftercareForm.content}
            >
              <Check className="w-4 h-4" />
              保存记录
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="form-label">
              戒毒人员 <span className="text-warning-600">*</span>
            </label>
            <select
              className="form-input"
              value={aftercareForm.detaineeId}
              onChange={(e) =>
                setAftercareForm({ ...aftercareForm, detaineeId: e.target.value })
              }
            >
              <option value="">请选择戒毒人员</option>
              {detainees.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.idCard}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">记录日期</label>
              <input
                type="date"
                className="form-input"
                value={aftercareForm.date}
                onChange={(e) =>
                  setAftercareForm({ ...aftercareForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">照管类型</label>
              <select
                className="form-input"
                value={aftercareForm.type}
                onChange={(e) =>
                  setAftercareForm({
                    ...aftercareForm,
                    type: e.target.value as AftercareRecord["type"],
                  })
                }
              >
                <option value="社区对接">社区对接</option>
                <option value="回访记录">回访记录</option>
                <option value="复吸干预">复吸干预</option>
                <option value="帮扶救助">帮扶救助</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">
              记录内容 <span className="text-warning-600">*</span>
            </label>
            <textarea
              className="form-input min-h-[100px]"
              placeholder="请输入照管记录内容"
              value={aftercareForm.content}
              onChange={(e) =>
                setAftercareForm({ ...aftercareForm, content: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">联系人</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入联系人姓名"
                value={aftercareForm.contact}
                onChange={(e) =>
                  setAftercareForm({ ...aftercareForm, contact: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">处理结果</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入处理结果"
                value={aftercareForm.result}
                onChange={(e) =>
                  setAftercareForm({ ...aftercareForm, result: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="批量导出"
        width="max-w-md"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setExportModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                alert("数据导出任务已提交，请稍后下载");
                setExportModalOpen(false);
              }}
            >
              <Download className="w-4 h-4" />
              确认导出
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="form-label">导出范围</label>
            <div className="space-y-2">
              {["全部记录", "仅解除记录", "仅照管记录"].map((scope) => (
                <label
                  key={scope}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="exportScope"
                    checked={exportScope === scope}
                    onChange={() => setExportScope(scope)}
                    className="accent-police-600"
                  />
                  <span className="text-sm text-slate-700">{scope}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">导出格式</label>
            <div className="flex gap-4">
              {["Excel", "PDF"].map((fmt) => (
                <label
                  key={fmt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === fmt}
                    onChange={() => setExportFormat(fmt)}
                    className="accent-police-600"
                  />
                  <span className="text-sm text-slate-700">{fmt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedReportRelease(null);
        }}
        title="鉴定报告"
        width="max-w-lg"
        footer={
          <button
            className="btn-secondary"
            onClick={() => {
              setReportModalOpen(false);
              setSelectedReportRelease(null);
            }}
          >
            关闭
          </button>
        }
      >
        {selectedReportRelease && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-800">出所鉴定报告</h4>
              <p className="text-xs text-slate-400 mt-1">
                报告编号：JD-{selectedReportRelease.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-slate-500 w-28 flex-shrink-0">被鉴定人：</span>
                <span className="text-slate-800 font-medium">
                  {selectedReportRelease.detaineeName}
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-28 flex-shrink-0">鉴定日期：</span>
                <span className="text-slate-700">{selectedReportRelease.releaseDate}</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-28 flex-shrink-0">鉴定结果：</span>
                <span className="text-slate-700">
                  {selectedReportRelease.assessmentResult || "戒治效果良好，符合出所条件"}
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-28 flex-shrink-0">风险评估：</span>
                <StatusBadge
                  type={
                    selectedReportRelease.status === "已解除"
                      ? "success"
                      : selectedReportRelease.status === "已批准"
                      ? "info"
                      : "warning"
                  }
                >
                  {selectedReportRelease.status === "已解除"
                    ? "低风险"
                    : selectedReportRelease.status === "已批准"
                    ? "中低风险"
                    : "待评估"}
                </StatusBadge>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <h5 className="text-sm font-medium text-slate-700 mb-2">鉴定总结</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                经综合评估，{selectedReportRelease.detaineeName}
                在强制隔离戒毒期间表现良好，生理脱毒效果显著，心理状态稳定。
                {selectedReportRelease.assessmentResult
                  ? `出所鉴定结论：${selectedReportRelease.assessmentResult}。`
                  : "出所鉴定结论：符合解除强制隔离戒毒条件。"}
                建议按期办理解除手续，并做好后续社区照管衔接工作。
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={documentModalOpen}
        onClose={() => {
          setDocumentModalOpen(false);
          setSelectedDocRelease(null);
        }}
        title="办理文书"
        width="max-w-md"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                setDocumentModalOpen(false);
                setSelectedDocRelease(null);
              }}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                alert("文书已生成，可前往文书管理查看");
                setDocumentModalOpen(false);
                setSelectedDocRelease(null);
              }}
            >
              <FileText className="w-4 h-4" />
              生成文书
            </button>
          </>
        }
      >
        {selectedDocRelease && (
          <div className="space-y-5">
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-slate-500 w-20 flex-shrink-0">人员：</span>
                <span className="text-slate-800 font-medium">
                  {selectedDocRelease.detaineeName}
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-20 flex-shrink-0">状态：</span>
                <StatusBadge
                  type={
                    selectedDocRelease.status === "已解除"
                      ? "success"
                      : selectedDocRelease.status === "已批准"
                      ? "blue"
                      : "warning"
                  }
                >
                  {selectedDocRelease.status}
                </StatusBadge>
              </div>
            </div>
            <div>
              <label className="form-label">文书类型</label>
              <div className="space-y-2">
                {[
                  "解除强制隔离戒毒决定书",
                  "出所鉴定书",
                  "社区衔接通知书",
                ].map((doc) => (
                  <label
                    key={doc}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="documentType"
                      checked={documentType === doc}
                      onChange={() => setDocumentType(doc)}
                      className="accent-police-600"
                    />
                    <span className="text-sm text-slate-700">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
