import { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Shield,
  AlertOctagon,
  Users,
  Video,
  Plus,
  User,
  Calendar,
  Clock,
  ArrowUpDown,
  FileWarning,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { levelChanges, violations, visits, detainees } from "@/data/mock";

const tabs = [
  { id: "level", label: "分级管理" },
  { id: "violation", label: "违规处理" },
  { id: "visit", label: "亲情会见" },
];

export default function Management() {
  const [activeTab, setActiveTab] = useState("level");

  const levelColumns: Column<typeof levelChanges[0]>[] = [
    { key: "date", title: "调整日期", width: "120px" },
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
      key: "fromLevel",
      title: "等级变动",
      width: "160px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge
            type={
              row.fromLevel === "一级"
                ? "danger"
                : row.fromLevel === "二级"
                ? "warning"
                : row.fromLevel === "三级"
                ? "info"
                : "success"
            }
          >
            {row.fromLevel}
          </StatusBadge>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <StatusBadge
            type={
              row.toLevel === "一级"
                ? "danger"
                : row.toLevel === "二级"
                ? "warning"
                : row.toLevel === "三级"
                ? "info"
                : "success"
            }
          >
            {row.toLevel}
          </StatusBadge>
        </div>
      ),
    },
    { key: "reason", title: "调整原因" },
    { key: "approver", title: "审批人", width: "100px" },
  ];

  const violationColumns: Column<typeof violations[0]>[] = [
    { key: "date", title: "违规日期", width: "120px" },
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
      title: "违规类型",
      width: "120px",
      render: (row) => (
        <StatusBadge type="warning">{row.type}</StatusBadge>
      ),
    },
    { key: "description", title: "违规描述" },
    { key: "punishment", title: "处理结果", width: "160px" },
    {
      key: "status",
      title: "状态",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.status === "已处理"
              ? "success"
              : row.status === "处理中"
              ? "blue"
              : row.status === "申诉中"
              ? "warning"
              : "default"
          }
        >
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  const visitColumns: Column<typeof visits[0]>[] = [
    { key: "date", title: "会见日期", width: "120px" },
    {
      key: "detaineeName",
      title: "被会见人",
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
    { key: "visitor", title: "会见人" },
    { key: "relation", title: "关系", width: "80px" },
    {
      key: "visitType",
      title: "会见方式",
      width: "100px",
      render: (row) => (
        <StatusBadge type={row.visitType === "现场会见" ? "blue" : "info"}>
          {row.visitType}
        </StatusBadge>
      ),
    },
    {
      key: "duration",
      title: "时长",
      width: "90px",
      render: (row) =>
        row.duration > 0 ? (
          <div className="flex items-center gap-1 text-slate-600 text-sm">
            <Clock className="w-3.5 h-3.5" />
            {row.duration}分钟
          </div>
        ) : (
          <span className="text-slate-400">未开始</span>
        ),
    },
    {
      key: "status",
      title: "状态",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.status === "已完成"
              ? "success"
              : row.status === "已批准"
              ? "blue"
              : row.status === "待审批"
              ? "warning"
              : "default"
          }
        >
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  const levelDistributionOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        type: "pie",
        radius: ["45%", "70%"],
        center: ["50%", "45%"],
        itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        label: { formatter: "{b}\n{d}%", fontSize: 12 },
        data: [
          { value: detainees.filter((d) => d.currentLevel === "一级").length, name: "一级管理", itemStyle: { color: "#dc2626" } },
          { value: detainees.filter((d) => d.currentLevel === "二级").length, name: "二级管理", itemStyle: { color: "#d97706" } },
          { value: detainees.filter((d) => d.currentLevel === "三级").length, name: "三级管理", itemStyle: { color: "#0284c7" } },
          { value: detainees.filter((d) => d.currentLevel === "四级").length, name: "四级管理", itemStyle: { color: "#065f46" } },
        ],
      },
    ],
  };

  const violationTypeOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 90, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    yAxis: {
      type: "category",
      data: ["其他违规", "不服从管理", "私藏违禁品", "寻衅滋事", "打架斗殴"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    series: [
      {
        type: "bar",
        data: [3, 8, 12, 6, 5],
        itemStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: "#fca5a5" },
              { offset: 1, color: "#dc2626" },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
        barWidth: 20,
        label: {
          show: true,
          position: "right",
          color: "#64748b",
          fontSize: 12,
        },
      },
    ],
  };

  const pendingViolations = violations.filter((v) => v.status !== "已处理").length;
  const pendingVisits = visits.filter((v) => v.status === "待审批").length;

  return (
    <PageContainer
      title="所内管理"
      subtitle="分级管理、违规违纪处理与亲情会见安排"
      breadcrumbs={[{ label: "所内管理" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary">
            <FileWarning className="w-4 h-4" />
            违规登记
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            会见审批
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="一级管理人"
          value={detainees.filter((d) => d.currentLevel === "一级").length}
          icon={Shield}
          color="red"
        />
        <StatCard
          title="待处理违规"
          value={pendingViolations}
          icon={AlertOctagon}
          color="orange"
        />
        <StatCard
          title="待审批会见"
          value={pendingVisits}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="本月远程会见"
          value="12"
          icon={Video}
          color="green"
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

      {activeTab === "level" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">管理等级调整记录</h3>
              <DataTable columns={levelColumns} data={levelChanges} rowKey="id" />
            </div>

            <div className="card">
              <h3 className="section-title">分级处遇对照表</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-3 text-left">管理等级</th>
                      <th className="px-4 py-3 text-left">处遇标准</th>
                      <th className="px-4 py-3 text-left">会见次数</th>
                      <th className="px-4 py-3 text-left">通信次数</th>
                      <th className="px-4 py-3 text-left">活动范围</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { level: "一级", color: "danger", meet: "每月1次", call: "每月2次", scope: "严格限制" },
                      { level: "二级", color: "warning", meet: "每月2次", call: "每月4次", scope: "部分限制" },
                      { level: "三级", color: "info", meet: "每月3次", call: "每周1次", scope: "适度放宽" },
                      { level: "四级", color: "success", meet: "每月4次", call: "每周2次", scope: "正常范围" },
                    ].map((item) => (
                      <tr key={item.level} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <StatusBadge type={item.color as "danger" | "warning" | "info" | "success"}>
                            {item.level}管理
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{
                          item.level === "一级" ? "严格管理" :
                          item.level === "二级" ? "规范管理" :
                          item.level === "三级" ? "普通管理" : "宽松管理"
                        }</td>
                        <td className="px-4 py-3 text-slate-600">{item.meet}</td>
                        <td className="px-4 py-3 text-slate-600">{item.call}</td>
                        <td className="px-4 py-3 text-slate-600">{item.scope}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">等级人员分布</h3>
              <ReactECharts option={levelDistributionOption} style={{ height: 300 }} />
            </div>

            <div className="card">
              <h3 className="section-title">等级调整记录</h3>
              <div className="space-y-4">
                {levelChanges.map((change) => (
                  <div key={change.id} className="flex gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-police-500 mt-2" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-full bg-slate-200" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-800">
                          {change.detaineeName}
                        </span>
                        <span className="text-xs text-slate-400">{change.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{change.reason}</p>
                      <div className="flex items-center gap-1.5 text-xs">
                        <StatusBadge
                          type={
                            change.fromLevel === "一级" ? "danger" :
                            change.fromLevel === "二级" ? "warning" :
                            change.fromLevel === "三级" ? "info" : "success"
                          }
                        >
                          {change.fromLevel}
                        </StatusBadge>
                        <span className="text-slate-400">→</span>
                        <StatusBadge
                          type={
                            change.toLevel === "一级" ? "danger" :
                            change.toLevel === "二级" ? "warning" :
                            change.toLevel === "三级" ? "info" : "success"
                          }
                        >
                          {change.toLevel}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "violation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="section-title">违规处理记录</h3>
              <DataTable columns={violationColumns} data={violations} rowKey="id" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">违规类型统计</h3>
              <ReactECharts option={violationTypeOption} style={{ height: 280 }} />
            </div>

            <div className="card">
              <h3 className="section-title">待处理违规</h3>
              <div className="space-y-3">
                {violations
                  .filter((v) => v.status !== "已处理")
                  .map((v) => (
                    <div
                      key={v.id}
                      className="p-3 bg-warning-50 border border-warning-100 rounded-sm"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 text-warning-600" />
                          <span className="font-medium text-sm text-warning-800">
                            {v.detaineeName}
                          </span>
                        </div>
                        <StatusBadge type="warning">{v.status}</StatusBadge>
                      </div>
                      <p className="text-xs text-warning-700 mb-1">{v.type}</p>
                      <p className="text-xs text-slate-600">{v.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "visit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">亲情会见安排</h3>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs text-slate-400 font-medium"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 1;
                  const validDay = day > 0 && day <= 30;
                  const hasVisit = [8, 10, 12, 15, 17, 19, 22, 24, 26].includes(day);
                  const isToday = day === 16;
                  return (
                    <div
                      key={i}
                      className={`aspect-square p-1 rounded-sm text-xs relative ${
                        !validDay
                          ? ""
                          : isToday
                          ? "bg-police-600 text-white"
                          : hasVisit
                          ? "bg-police-50 hover:bg-police-100 cursor-pointer"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span>{validDay ? day : ""}</span>
                      {hasVisit && validDay && !isToday && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-police-500" />
                          {[15, 22].includes(day) && (
                            <span className="w-1 h-1 rounded-full bg-health-500" />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">会见申请列表</h3>
              <DataTable columns={visitColumns} data={visits} rowKey="id" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">今日会见安排</h3>
              <div className="space-y-3">
                {[
                  { time: "09:00", room: "会见室1", visitor: "张建国", detainee: "张伟", type: "现场" },
                  { time: "10:30", room: "会见室2", visitor: "李秀英", detainee: "王芳", type: "远程" },
                  { time: "14:00", room: "会见室1", visitor: "孙强", detainee: "孙丽", type: "现场" },
                  { time: "15:30", room: "会见室3", visitor: "刘先生", detainee: "陈静", type: "远程" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm"
                  >
                    <div className="text-center">
                      <Clock className="w-4 h-4 text-police-600 mx-auto mb-0.5" />
                      <span className="text-sm font-mono font-medium text-slate-700">
                        {item.time}
                      </span>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-slate-800">
                          {item.visitor}
                        </span>
                        <StatusBadge type={item.type === "现场" ? "blue" : "info"}>
                          {item.type}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500">
                        会见 {item.detainee} · {item.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">会见室状态</h3>
              <div className="space-y-2">
                {["会见室1", "会见室2", "会见室3", "远程会见室A", "远程会见室B"].map(
                  (room, index) => (
                    <div
                      key={room}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm"
                    >
                      <span className="text-sm text-slate-700">{room}</span>
                      <StatusBadge
                        type={index < 2 ? "success" : index < 4 ? "info" : "default"}
                      >
                        {index < 2 ? "使用中" : index < 4 ? "空闲" : "维护中"}
                      </StatusBadge>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="card bg-gradient-to-br from-police-50 to-police-100 border-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-police-600 rounded-sm">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-police-900">远程视频会见</p>
                  <p className="text-xs text-police-700">点击启动远程会见系统</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
