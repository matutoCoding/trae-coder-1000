import { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Pill,
  Activity,
  AlertTriangle,
  Beaker,
  Plus,
  CalendarDays,
  User,
  Clock,
  TrendingUp,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { treatments, urineTests, detainees } from "@/data/mock";

const tabs = [
  { id: "treatment", label: "脱毒治疗" },
  { id: "urine", label: "尿检筛查" },
];

export default function Detoxification() {
  const [activeTab, setActiveTab] = useState("treatment");

  const treatmentColumns: Column<typeof treatments[0]>[] = [
    { key: "date", title: "治疗日期", width: "120px" },
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
    { key: "medication", title: "用药名称", width: "120px" },
    { key: "dosage", title: "剂量", width: "100px" },
    { key: "vitalSigns", title: "体征记录" },
    {
      key: "progress",
      title: "治疗进度",
      width: "160px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-police-500 to-police-700 rounded-full"
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 w-8">{row.progress}%</span>
        </div>
      ),
    },
    { key: "doctor", title: "主治医生", width: "100px" },
    { key: "notes", title: "备注" },
  ];

  const urineColumns: Column<typeof urineTests[0]>[] = [
    { key: "testDate", title: "检测日期", width: "120px" },
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
    { key: "testType", title: "检测类型", width: "120px" },
    {
      key: "result",
      title: "检测结果",
      width: "100px",
      render: (row) => (
        <StatusBadge type={row.result === "阴性" ? "success" : "danger"}>
          {row.result}
        </StatusBadge>
      ),
    },
    { key: "tester", title: "检验人员", width: "100px" },
    { key: "notes", title: "备注" },
  ];

  const vitalSignsOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["体温(℃)", "心率(次/分)", "血压(mmHg)"], top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["第1天", "第3天", "第7天", "第10天", "第14天", "第21天"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "体温(℃)",
        type: "line",
        smooth: true,
        data: [37.2, 36.9, 36.7, 36.6, 36.5, 36.5],
        itemStyle: { color: "#dc2626" },
        lineStyle: { color: "#dc2626", width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
      {
        name: "心率(次/分)",
        type: "line",
        smooth: true,
        data: [92, 88, 82, 79, 76, 75],
        itemStyle: { color: "#1e40af" },
        lineStyle: { color: "#1e40af", width: 2 },
        symbol: "circle",
        symbolSize: 6,
      },
    ],
  };

  const urineStatOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        type: "pie",
        radius: ["45%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 156, name: "阴性", itemStyle: { color: "#065f46" } },
          { value: 8, name: "阳性", itemStyle: { color: "#dc2626" } },
        ],
      },
    ],
  };

  const positiveCount = urineTests.filter((u) => u.result === "阳性").length;

  return (
    <PageContainer
      title="生理脱毒"
      subtitle="生理脱毒治疗记录、体征监测与尿检复吸筛查管理"
      breadcrumbs={[{ label: "生理脱毒" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary">
            <CalendarDays className="w-4 h-4" />
            生成检测计划
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            新增治疗记录
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="治疗中人数"
          value={detainees.filter((d) => d.status === "治疗中").length}
          icon={Pill}
          color="blue"
        />
        <StatCard
          title="本月治疗记录"
          value={treatments.length}
          icon={Activity}
          color="green"
          trend={{ value: 15, label: "环比" }}
        />
        <StatCard
          title="尿检检测次数"
          value={urineTests.length}
          icon={Beaker}
          color="purple"
        />
        <StatCard
          title="阳性预警"
          value={positiveCount}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {positiveCount > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-sm p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-800">阳性检测预警</p>
            <p className="text-xs text-warning-700 mt-1">
              本月共有 {positiveCount} 人次尿检结果呈阳性，请重点关注相关人员并加强管控。
            </p>
          </div>
        </div>
      )}

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

      {activeTab === "treatment" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">脱毒治疗记录</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>今日有 {treatments.length} 条治疗记录</span>
                </div>
              </div>
              <DataTable
                columns={treatmentColumns}
                data={treatments}
                rowKey="id"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">体征监测趋势</h3>
              <ReactECharts option={vitalSignsOption} style={{ height: 280 }} />
            </div>

            <div className="card">
              <h3 className="section-title">治疗进度</h3>
              <div className="space-y-4">
                {treatments.slice(0, 3).map((t) => (
                  <div key={t.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {t.detaineeName}
                      </span>
                      <span className="text-xs text-slate-500">{t.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-health-500 to-health-700 rounded-full transition-all"
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "urine" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">尿检筛查记录</h3>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-health-600"></span>
                    <span className="text-slate-600">阴性</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-warning-600"></span>
                    <span className="text-slate-600">阳性</span>
                  </div>
                </div>
              </div>
              <DataTable columns={urineColumns} data={urineTests} rowKey="id" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">检测结果统计</h3>
              <ReactECharts option={urineStatOption} style={{ height: 240 }} />
            </div>

            <div className="card">
              <h3 className="section-title">本月检测日历</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                  <div key={d} className="py-1.5 text-slate-400 font-medium">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const hasTest = [5, 8, 12, 15, 19, 22, 26].includes(day);
                  const isPositive = [15, 26].includes(day);
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-sm text-sm relative ${
                        hasTest
                          ? isPositive
                            ? "bg-warning-50 text-warning-700 font-medium"
                            : "bg-health-50 text-health-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {day}
                      {hasTest && (
                        <span
                          className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                            isPositive ? "bg-warning-500" : "bg-health-500"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-3 h-3 rounded-sm bg-health-50"></span>
                  <span className="text-slate-600">阴性</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-3 h-3 rounded-sm bg-warning-50"></span>
                  <span className="text-slate-600">阳性</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-police-50 rounded-sm">
                  <TrendingUp className="w-6 h-6 text-police-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">阴性率</p>
                  <p className="text-2xl font-semibold text-slate-800">
                    {((urineTests.length - positiveCount) / urineTests.length * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
