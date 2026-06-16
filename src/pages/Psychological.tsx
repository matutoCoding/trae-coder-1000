import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Brain,
  MessageSquare,
  ClipboardList,
  AlertCircle,
  Plus,
  Calendar,
  User,
  Clock,
  Smile,
  Meh,
  Frown,
  Angry,
  PartyPopper,
  Check,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useAppStore } from "@/store/useAppStore";
import type { Counseling, PsychAssessment } from "@/types";

const tabs = [
  { id: "counseling", label: "心理咨询" },
  { id: "assessment", label: "心理评估" },
];

const moodMap: Record<string, { icon: typeof Smile; color: string }> = {
  积极: { icon: PartyPopper, color: "text-health-600" },
  稳定: { icon: Smile, color: "text-police-600" },
  焦虑: { icon: Meh, color: "text-amber-600" },
  抑郁: { icon: Frown, color: "text-slate-600" },
  愤怒: { icon: Angry, color: "text-warning-600" },
};

export default function Psychological() {
  const [activeTab, setActiveTab] = useState("counseling");
  const [counselingModalOpen, setCounselingModalOpen] = useState(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  const { detainees, counselings, psychAssessments, addCounseling, addPsychAssessment } =
    useAppStore();

  const [counselingForm, setCounselingForm] = useState({
    detaineeId: "",
    date: new Date().toISOString().split("T")[0],
    counselor: "",
    topic: "",
    duration: 60,
    mood: "稳定" as Counseling["mood"],
    summary: "",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    detaineeId: "",
    date: new Date().toISOString().split("T")[0],
    scale: "SCL-90症状自评量表",
    score: 50,
    riskLevel: "低风险" as PsychAssessment["riskLevel"],
    conclusion: "",
  });

  const highRiskCount = psychAssessments.filter((a) => a.riskLevel === "高风险").length;
  const avgDuration = counselings.length > 0
    ? Math.round(counselings.reduce((sum, c) => sum + c.duration, 0) / counselings.length)
    : 0;

  const handleAddCounseling = () => {
    if (!counselingForm.detaineeId || !counselingForm.topic) return;
    const detainee = detainees.find((d) => d.id === counselingForm.detaineeId);
    if (!detainee) return;

    addCounseling({
      ...counselingForm,
      detaineeName: detainee.name,
    } as Omit<Counseling, "id">);

    setCounselingForm({
      detaineeId: "",
      date: new Date().toISOString().split("T")[0],
      counselor: "",
      topic: "",
      duration: 60,
      mood: "稳定",
      summary: "",
    });
    setCounselingModalOpen(false);
  };

  const handleAddAssessment = () => {
    if (!assessmentForm.detaineeId) return;
    const detainee = detainees.find((d) => d.id === assessmentForm.detaineeId);
    if (!detainee) return;

    addPsychAssessment({
      ...assessmentForm,
      detaineeName: detainee.name,
    } as Omit<PsychAssessment, "id">);

    setAssessmentForm({
      detaineeId: "",
      date: new Date().toISOString().split("T")[0],
      scale: "SCL-90症状自评量表",
      score: 50,
      riskLevel: "低风险",
      conclusion: "",
    });
    setAssessmentModalOpen(false);
  };

  const counselingColumns: Column<Counseling>[] = [
    { key: "date", title: "咨询日期", width: "120px" },
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
    { key: "counselor", title: "咨询师", width: "100px" },
    { key: "topic", title: "咨询主题" },
    {
      key: "duration",
      title: "时长",
      width: "90px",
      render: (row) => (
        <div className="flex items-center gap-1 text-slate-600 text-sm">
          <Clock className="w-3.5 h-3.5" />
          {row.duration}分钟
        </div>
      ),
    },
    {
      key: "mood",
      title: "情绪状态",
      width: "100px",
      render: (row) => {
        const mood = moodMap[row.mood];
        const MoodIcon = mood?.icon || Meh;
        return (
          <div className="flex items-center gap-1.5">
            <MoodIcon className={`w-4 h-4 ${mood?.color || "text-slate-500"}`} />
            <span className="text-sm">{row.mood}</span>
          </div>
        );
      },
    },
    { key: "summary", title: "咨询摘要" },
  ];

  const assessmentColumns: Column<PsychAssessment>[] = [
    { key: "date", title: "评估日期", width: "120px" },
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
    { key: "scale", title: "测评量表" },
    {
      key: "score",
      title: "得分",
      width: "90px",
      render: (row) => (
        <span className="font-mono font-medium text-police-700">{row.score}</span>
      ),
    },
    {
      key: "riskLevel",
      title: "风险等级",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.riskLevel === "低风险"
              ? "success"
              : row.riskLevel === "中风险"
              ? "warning"
              : "danger"
          }
        >
          {row.riskLevel}
        </StatusBadge>
      ),
    },
    { key: "conclusion", title: "评估结论" },
  ];

  const moodTrendOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["积极", "稳定", "焦虑", "抑郁"], top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周"],
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "积极",
        type: "line",
        smooth: true,
        stack: "total",
        areaStyle: {},
        data: [3, 5, 8, 10, 12, 15],
        itemStyle: { color: "#065f46" },
      },
      {
        name: "稳定",
        type: "line",
        smooth: true,
        stack: "total",
        areaStyle: {},
        data: [10, 12, 14, 16, 18, 20],
        itemStyle: { color: "#1e40af" },
      },
      {
        name: "焦虑",
        type: "line",
        smooth: true,
        stack: "total",
        areaStyle: {},
        data: [8, 6, 5, 4, 3, 2],
        itemStyle: { color: "#d97706" },
      },
      {
        name: "抑郁",
        type: "line",
        smooth: true,
        stack: "total",
        areaStyle: {},
        data: [5, 4, 3, 2, 2, 1],
        itemStyle: { color: "#64748b" },
      },
    ],
  };

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: "焦虑", max: 100 },
        { name: "抑郁", max: 100 },
        { name: "敌对", max: 100 },
        { name: "人际敏感", max: 100 },
        { name: "强迫", max: 100 },
        { name: "偏执", max: 100 },
      ],
      radius: "65%",
      axisName: { color: "#64748b", fontSize: 12 },
      splitArea: {
        areaStyle: { color: ["#f8fafc", "#f1f5f9"] },
      },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: [42, 38, 25, 30, 55, 28],
            name: "当前评估",
            itemStyle: { color: "#1e40af" },
            areaStyle: { color: "rgba(30, 64, 175, 0.2)" },
            lineStyle: { color: "#1e40af", width: 2 },
          },
          {
            value: [65, 58, 45, 52, 72, 48],
            name: "入所评估",
            itemStyle: { color: "#94a3b8" },
            areaStyle: { color: "rgba(148, 163, 184, 0.1)" },
            lineStyle: { color: "#94a3b8", width: 2, type: "dashed" },
          },
        ],
      },
    ],
    legend: { data: ["当前评估", "入所评估"], bottom: 0 },
  };

  const topicTags = [
    { name: "家庭关系", count: 18, color: "bg-police-100 text-police-700" },
    { name: "心理依赖", count: 25, color: "bg-warning-100 text-warning-700" },
    { name: "焦虑情绪", count: 22, color: "bg-amber-100 text-amber-700" },
    { name: "未来规划", count: 12, color: "bg-health-100 text-health-700" },
    { name: "人际沟通", count: 15, color: "bg-purple-100 text-purple-700" },
    { name: "自我认知", count: 10, color: "bg-sky-100 text-sky-700" },
    { name: "睡眠问题", count: 8, color: "bg-indigo-100 text-indigo-700" },
    { name: "抑郁情绪", count: 14, color: "bg-slate-100 text-slate-700" },
  ];

  return (
    <PageContainer
      title="心理矫治"
      subtitle="心理咨询、心理评估与干预方案管理"
      breadcrumbs={[{ label: "心理矫治" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => setAssessmentModalOpen(true)}>
            <ClipboardList className="w-4 h-4" />
            心理测评
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              activeTab === "counseling"
                ? setCounselingModalOpen(true)
                : setAssessmentModalOpen(true)
            }
          >
            <Plus className="w-4 h-4" />
            {activeTab === "counseling" ? "新增咨询记录" : "新增评估记录"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月咨询人次"
          value={counselings.length}
          icon={MessageSquare}
          color="blue"
          trend={{ value: 20, label: "环比" }}
        />
        <StatCard
          title="心理评估数"
          value={psychAssessments.length}
          icon={Brain}
          color="purple"
        />
        <StatCard
          title="高风险人数"
          value={highRiskCount}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="平均咨询时长"
          value={`${avgDuration}分钟`}
          icon={Clock}
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

      {activeTab === "counseling" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">心理咨询记录</h3>
              <DataTable columns={counselingColumns} data={counselings} rowKey="id" />
            </div>

            <div className="card">
              <h3 className="section-title">咨询预约日历</h3>
              <div className="grid grid-cols-7 gap-2">
                {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs text-slate-400 font-medium"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
                  const hasAppointment = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26].includes(
                    day
                  );
                  const isToday = day === 16;
                  return (
                    <div
                      key={day}
                      className={`aspect-square p-1.5 rounded-sm text-sm relative ${
                        isToday
                          ? "bg-police-600 text-white"
                          : hasAppointment
                          ? "bg-police-50 hover:bg-police-100 cursor-pointer"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs ${isToday ? "text-white" : "text-slate-700"}`}
                      >
                        {day}
                      </span>
                      {hasAppointment && !isToday && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-police-500" />
                          {[10, 15, 22].includes(day) && (
                            <span className="w-1 h-1 rounded-full bg-warning-500" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">情绪分布趋势</h3>
              <ReactECharts option={moodTrendOption} style={{ height: 280 }} />
            </div>

            <div className="card">
              <h3 className="section-title">咨询主题分布</h3>
              <div className="flex flex-wrap gap-2">
                {topicTags.map((tag) => (
                  <span
                    key={tag.name}
                    className={`px-3 py-1.5 rounded-sm text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${tag.color}`}
                  >
                    {tag.name}
                    <span className="ml-1.5 text-xs opacity-70">{tag.count}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">近期咨询</h3>
              <div className="space-y-3">
                {counselings.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm text-slate-800">
                        {c.detaineeName}
                      </span>
                      <StatusBadge type="info">{c.mood}</StatusBadge>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {c.date} · {c.counselor}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "assessment" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="section-title">心理评估记录</h3>
              <DataTable
                columns={assessmentColumns}
                data={psychAssessments}
                rowKey="id"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">SCL-90 雷达图对比</h3>
              <ReactECharts option={radarOption} style={{ height: 320 }} />
            </div>

            <div className="card">
              <h3 className="section-title">风险等级分布</h3>
              <div className="space-y-3">
                {[
                  {
                    level: "高风险",
                    count: psychAssessments.filter((a) => a.riskLevel === "高风险").length,
                    color: "bg-warning-500",
                    textColor: "text-warning-700",
                    bgColor: "bg-warning-50",
                  },
                  {
                    level: "中风险",
                    count: psychAssessments.filter((a) => a.riskLevel === "中风险").length,
                    color: "bg-amber-500",
                    textColor: "text-amber-700",
                    bgColor: "bg-amber-50",
                  },
                  {
                    level: "低风险",
                    count: psychAssessments.filter((a) => a.riskLevel === "低风险").length,
                    color: "bg-health-500",
                    textColor: "text-health-700",
                    bgColor: "bg-health-50",
                  },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-3">
                    <div className={`w-24 text-sm font-medium ${item.textColor}`}>
                      {item.level}
                    </div>
                    <div className="flex-1 h-6 bg-slate-100 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-sm transition-all`}
                        style={{
                          width: `${psychAssessments.length > 0 ? (item.count / psychAssessments.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className={`w-10 text-sm font-medium text-right ${item.textColor}`}>
                      {item.count}人
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={counselingModalOpen}
        onClose={() => setCounselingModalOpen(false)}
        title="新增心理咨询记录"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setCounselingModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddCounseling}
              disabled={!counselingForm.detaineeId || !counselingForm.topic}
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
              value={counselingForm.detaineeId}
              onChange={(e) =>
                setCounselingForm({
                  ...counselingForm,
                  detaineeId: e.target.value,
                })
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
              <label className="form-label">咨询日期</label>
              <input
                type="date"
                className="form-input"
                value={counselingForm.date}
                onChange={(e) =>
                  setCounselingForm({ ...counselingForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">咨询师</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入咨询师姓名"
                value={counselingForm.counselor}
                onChange={(e) =>
                  setCounselingForm({
                    ...counselingForm,
                    counselor: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                咨询主题 <span className="text-warning-600">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="如：家庭关系、心理依赖"
                value={counselingForm.topic}
                onChange={(e) =>
                  setCounselingForm({ ...counselingForm, topic: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">咨询时长（分钟）</label>
              <input
                type="number"
                className="form-input"
                value={counselingForm.duration}
                onChange={(e) =>
                  setCounselingForm({
                    ...counselingForm,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">情绪状态</label>
            <div className="flex gap-3 mt-2">
              {["积极", "稳定", "焦虑", "抑郁", "愤怒"].map((mood) => {
                const moodInfo = moodMap[mood];
                const MoodIcon = moodInfo?.icon || Meh;
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() =>
                      setCounselingForm({
                        ...counselingForm,
                        mood: mood as Counseling["mood"],
                      })
                    }
                    className={`flex-1 p-3 rounded-sm border-2 transition-all flex flex-col items-center gap-1 ${
                      counselingForm.mood === mood
                        ? "border-police-500 bg-police-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <MoodIcon
                      className={`w-5 h-5 ${moodInfo?.color || "text-slate-500"}`}
                    />
                    <span className="text-xs">{mood}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="form-label">咨询摘要</label>
            <textarea
              className="form-input min-h-[100px]"
              placeholder="请输入咨询内容摘要"
              value={counselingForm.summary}
              onChange={(e) =>
                setCounselingForm({ ...counselingForm, summary: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        title="新增心理评估记录"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setAssessmentModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddAssessment}
              disabled={!assessmentForm.detaineeId}
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
              value={assessmentForm.detaineeId}
              onChange={(e) =>
                setAssessmentForm({
                  ...assessmentForm,
                  detaineeId: e.target.value,
                })
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
              <label className="form-label">评估日期</label>
              <input
                type="date"
                className="form-input"
                value={assessmentForm.date}
                onChange={(e) =>
                  setAssessmentForm({ ...assessmentForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">测评量表</label>
              <select
                className="form-input"
                value={assessmentForm.scale}
                onChange={(e) =>
                  setAssessmentForm({ ...assessmentForm, scale: e.target.value })
                }
              >
                <option value="SCL-90症状自评量表">SCL-90症状自评量表</option>
                <option value="SAS焦虑自评量表">SAS焦虑自评量表</option>
                <option value="SDS抑郁自评量表">SDS抑郁自评量表</option>
                <option value="MMPI明尼苏达多相人格测验">MMPI明尼苏达多相人格测验</option>
                <option value="艾森克人格问卷">艾森克人格问卷</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                评估得分：{assessmentForm.score}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                value={assessmentForm.score}
                onChange={(e) => {
                  const score = parseInt(e.target.value);
                  let riskLevel: PsychAssessment["riskLevel"] = "低风险";
                  if (score >= 70) riskLevel = "高风险";
                  else if (score >= 50) riskLevel = "中风险";
                  setAssessmentForm({
                    ...assessmentForm,
                    score,
                    riskLevel,
                  });
                }}
              />
            </div>
            <div>
              <label className="form-label">风险等级</label>
              <div className="flex gap-2 mt-2">
                {(["低风险", "中风险", "高风险"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setAssessmentForm({ ...assessmentForm, riskLevel: level })
                    }
                    className={`flex-1 py-2 px-3 rounded-sm text-sm font-medium transition-all ${
                      assessmentForm.riskLevel === level
                        ? level === "高风险"
                          ? "bg-warning-100 text-warning-700 border border-warning-300"
                          : level === "中风险"
                          ? "bg-amber-100 text-amber-700 border border-amber-300"
                          : "bg-health-100 text-health-700 border border-health-300"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">评估结论</label>
            <textarea
              className="form-input min-h-[100px]"
              placeholder="请输入评估结论和建议"
              value={assessmentForm.conclusion}
              onChange={(e) =>
                setAssessmentForm({
                  ...assessmentForm,
                  conclusion: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
