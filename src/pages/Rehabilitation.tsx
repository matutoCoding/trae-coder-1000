import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  Dumbbell,
  GraduationCap,
  Award,
  TrendingUp,
  Plus,
  User,
  Clock,
  Calendar,
  CheckCircle,
  Star,
  Check,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useAppStore } from "@/store/useAppStore";
import type { TrainingRecord } from "@/types";

const tabs = [
  { id: "physical", label: "体能训练" },
  { id: "skill", label: "技能培训" },
];

export default function Rehabilitation() {
  const [activeTab, setActiveTab] = useState("physical");
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [courseDetailModalOpen, setCourseDetailModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    name: string;
    category: string;
    totalHours: number;
    completedHours: number;
    students: number;
    teacher: string;
    color: string;
  } | null>(null);

  const { detainees, trainingRecords, addTrainingRecord } = useAppStore();

  const [trainingForm, setTrainingForm] = useState({
    detaineeId: "",
    date: new Date().toISOString().split("T")[0],
    type: "体能训练" as "体能训练" | "技能培训",
    content: "",
    duration: 60,
    performance: 70,
    coach: "",
  });

  const physicalRecords = trainingRecords.filter((t) => t.type === "体能训练");
  const skillRecords = trainingRecords.filter((t) => t.type === "技能培训");

  const avgPerformance =
    physicalRecords.length > 0
      ? (
          physicalRecords.reduce((sum, t) => sum + t.performance, 0) /
          physicalRecords.length
        ).toFixed(1)
      : "0";

  const handleAddTraining = () => {
    if (!trainingForm.detaineeId || !trainingForm.content) return;
    const detainee = detainees.find((d) => d.id === trainingForm.detaineeId);
    if (!detainee) return;

    addTrainingRecord({
      ...trainingForm,
      detaineeName: detainee.name,
    } as Omit<TrainingRecord, "id">);

    setTrainingForm({
      detaineeId: "",
      date: new Date().toISOString().split("T")[0],
      type: activeTab === "physical" ? "体能训练" : "技能培训",
      content: "",
      duration: 60,
      performance: 70,
      coach: "",
    });
    setTrainingModalOpen(false);
  };

  const physicalColumns: Column<TrainingRecord>[] = [
    { key: "date", title: "训练日期", width: "120px" },
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
    { key: "content", title: "训练内容" },
    {
      key: "duration",
      title: "训练时长",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-1 text-slate-600 text-sm">
          <Clock className="w-3.5 h-3.5" />
          {row.duration}分钟
        </div>
      ),
    },
    {
      key: "performance",
      title: "表现评分",
      width: "140px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(row.performance / 20)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-mono text-slate-600">
            {row.performance}
          </span>
        </div>
      ),
    },
    { key: "coach", title: "教练", width: "100px" },
  ];

  const skillColumns: Column<TrainingRecord>[] = [
    { key: "date", title: "培训日期", width: "120px" },
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
    { key: "content", title: "培训课程" },
    {
      key: "duration",
      title: "课时",
      width: "90px",
      render: (row) => <span className="text-sm">{row.duration / 45}课时</span>,
    },
    {
      key: "performance",
      title: "考核成绩",
      width: "110px",
      render: (row) => (
        <StatusBadge
          type={
            row.performance >= 80
              ? "success"
              : row.performance >= 60
              ? "warning"
              : "danger"
          }
        >
          {row.performance}分
        </StatusBadge>
      ),
    },
    { key: "coach", title: "授课老师", width: "100px" },
  ];

  const performanceTrendOption = useMemo(() => {
    const weekMap = new Map<string, { totalPerf: number; count: number }>();
    physicalRecords.forEach((r) => {
      const d = new Date(r.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().split("T")[0];
      const entry = weekMap.get(key) ?? { totalPerf: 0, count: 0 };
      entry.totalPerf += r.performance;
      entry.count += 1;
      weekMap.set(key, entry);
    });
    const sortedWeeks = [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const labels = sortedWeeks.map(([key]) => {
      const d = new Date(key);
      return `${d.getMonth() + 1}/${d.getDate()}周`;
    });
    const avgScores = sortedWeeks.map(([, v]) => +(v.totalPerf / v.count).toFixed(1));
    const counts = sortedWeeks.map(([, v]) => v.count);
    return {
      tooltip: { trigger: "axis" },
      legend: { data: ["平均评分", "参与人数"], top: 0 },
      grid: { left: 40, right: 40, top: 40, bottom: 30 },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
      },
      yAxis: [
        {
          type: "value",
          name: "评分",
          max: 100,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: "#f1f5f9" } },
        },
        {
          type: "value",
          name: "人数",
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "平均评分",
          type: "line",
          smooth: true,
          data: avgScores,
          itemStyle: { color: "#1e40af" },
          lineStyle: { color: "#1e40af", width: 3 },
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
                { offset: 0, color: "rgba(30, 64, 175, 0.3)" },
                { offset: 1, color: "rgba(30, 64, 175, 0.02)" },
              ],
            },
          },
        },
        {
          name: "参与人数",
          type: "bar",
          yAxisIndex: 1,
          data: counts,
          itemStyle: {
            color: "rgba(6, 95, 70, 0.6)",
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: 20,
        },
      ],
    };
  }, [physicalRecords]);

  const skillDistributionOption = useMemo(() => {
    const contentMap = new Map<string, number>();
    skillRecords.forEach((r) => {
      contentMap.set(r.content, (contentMap.get(r.content) ?? 0) + 1);
    });
    const palette = ["#ec4899", "#f59e0b", "#1e40af", "#065f46", "#7c3aed", "#0891b2"];
    const data = [...contentMap.entries()].map(([name, value], i) => ({
      value,
      name,
      itemStyle: { color: palette[i % palette.length] },
    }));
    return {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          type: "pie",
          radius: ["35%", "65%"],
          center: ["50%", "45%"],
          roseType: "radius" as const,
          itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
          label: {
            formatter: "{b}\n{c}人",
            fontSize: 12,
          },
          data,
        },
      ],
    };
  }, [skillRecords]);

  const physicalStats = useMemo(() => {
    const contentMap = new Map<string, { count: number; totalPerf: number }>();
    physicalRecords.forEach((r) => {
      const entry = contentMap.get(r.content) ?? { count: 0, totalPerf: 0 };
      entry.count += 1;
      entry.totalPerf += r.performance;
      contentMap.set(r.content, entry);
    });
    const maxCount = Math.max(...[...contentMap.values()].map((v) => v.count), 1);
    return [...contentMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, { count, totalPerf }]) => ({
        name,
        count,
        avgPerformance: +(totalPerf / count).toFixed(1),
        progress: Math.round((count / maxCount) * 100),
      }));
  }, [physicalRecords]);

  const skillAssessmentSummary = useMemo(() => {
    const contentMap = new Map<string, { count: number; totalPerf: number; passCount: number }>();
    skillRecords.forEach((r) => {
      const entry = contentMap.get(r.content) ?? { count: 0, totalPerf: 0, passCount: 0 };
      entry.count += 1;
      entry.totalPerf += r.performance;
      if (r.performance >= 60) entry.passCount += 1;
      contentMap.set(r.content, entry);
    });
    return [...contentMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, { count, totalPerf, passCount }]) => ({
        name,
        count,
        avgPerformance: +(totalPerf / count).toFixed(1),
        passRate: +((passCount / count) * 100).toFixed(1),
      }));
  }, [skillRecords]);

  const skillCourses = [
    {
      id: 1,
      name: "中式烹饪",
      category: "职业技能",
      totalHours: 120,
      completedHours: 85,
      students: 35,
      teacher: "周老师",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 2,
      name: "美容美发",
      category: "职业技能",
      totalHours: 96,
      completedHours: 60,
      students: 28,
      teacher: "陈老师",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: 3,
      name: "电工基础",
      category: "职业技能",
      totalHours: 144,
      completedHours: 45,
      students: 22,
      teacher: "赵老师",
      color: "from-police-500 to-police-700",
    },
    {
      id: 4,
      name: "计算机办公软件",
      category: "职业技能",
      totalHours: 80,
      completedHours: 72,
      students: 18,
      teacher: "李老师",
      color: "from-emerald-500 to-health-700",
    },
    {
      id: 5,
      name: "汽车维修入门",
      category: "职业技能",
      totalHours: 160,
      completedHours: 32,
      students: 15,
      teacher: "王老师",
      color: "from-violet-500 to-purple-700",
    },
    {
      id: 6,
      name: "家政服务培训",
      category: "职业技能",
      totalHours: 72,
      completedHours: 50,
      students: 12,
      teacher: "孙老师",
      color: "from-cyan-500 to-sky-700",
    },
  ];

  const openAddModal = () => {
    setTrainingForm({
      ...trainingForm,
      type: activeTab === "physical" ? "体能训练" : "技能培训",
    });
    setTrainingModalOpen(true);
  };

  return (
    <PageContainer
      title="康复训练"
      subtitle="体能康复训练与职业技能培训管理"
      breadcrumbs={[{ label: "康复训练" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => setAssessmentModalOpen(true)}>
            <Award className="w-4 h-4" />
            技能考核
          </button>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            {activeTab === "physical" ? "新增训练记录" : "新增培训记录"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月体能训练"
          value={physicalRecords.length}
          icon={Dumbbell}
          color="blue"
          trend={{ value: 12, label: "环比" }}
        />
        <StatCard
          title="技能培训课程"
          value="6"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="获证人数"
          value="24"
          icon={Award}
          color="green"
          trend={{ value: 8, label: "较上月" }}
        />
        <StatCard
          title="平均表现分"
          value={avgPerformance}
          icon={TrendingUp}
          color="orange"
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

      {activeTab === "physical" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="section-title">体能训练记录</h3>
              <DataTable
                columns={physicalColumns}
                data={physicalRecords}
                rowKey="id"
              />
            </div>

            <div className="card">
              <h3 className="section-title">本月训练打卡</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
                  <div key={d} className="text-center text-xs text-slate-400 py-1">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2;
                  const validDay = day > 0 && day <= 30;
                  const activity = validDay
                    ? [
                        1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19,
                        20, 21, 22, 24, 25, 26, 27, 28, 29,
                      ].includes(day)
                      ? Math.random() > 0.4
                        ? "high"
                        : "low"
                      : "none"
                    : "none";
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        !validDay
                          ? ""
                          : activity === "high"
                          ? "bg-health-500"
                          : activity === "low"
                          ? "bg-health-300"
                          : "bg-slate-100"
                      }`}
                      title={validDay ? `${day}日` : ""}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 text-xs text-slate-500">
                <span>少</span>
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-sm bg-slate-100" />
                  <span className="w-3 h-3 rounded-sm bg-health-300" />
                  <span className="w-3 h-3 rounded-sm bg-health-500" />
                </div>
                <span>多</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="section-title">训练表现趋势</h3>
              <ReactECharts
                option={performanceTrendOption}
                style={{ height: 280 }}
              />
            </div>

            <div className="card">
              <h3 className="section-title">训练项目</h3>
              <div className="space-y-3">
                {physicalStats.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">暂无训练数据</p>
                )}
                {physicalStats.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{item.name}</span>
                      <span className="text-xs text-slate-500">
                        {item.count}人次 · 均分{item.avgPerformance}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-police-500 to-police-700 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "skill" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCourses.map((course) => (
              <div
                key={course.id}
                className="card card-hover cursor-pointer overflow-hidden"
              >
                <div
                  className={`h-24 bg-gradient-to-br ${course.color} -m-6 mb-4`}
                >
                  <div className="h-full flex items-center justify-between px-6">
                    <div>
                      <StatusBadge type="default">{course.category}</StatusBadge>
                      <h4 className="text-white text-lg font-semibold mt-2">
                        {course.name}
                      </h4>
                    </div>
                    <GraduationCap className="w-12 h-12 text-white/30" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">授课老师</span>
                    <span className="text-slate-700 font-medium">
                      {course.teacher}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">学员人数</span>
                    <span className="text-slate-700 font-medium">
                      {course.students}人
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-slate-500">课程进度</span>
                      <span className="text-slate-700 font-medium">
                        {course.completedHours}/{course.totalHours}课时
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                        style={{
                          width: `${
                            (course.completedHours / course.totalHours) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 btn-secondary text-xs"
                      onClick={() => {
                        setSelectedCourse(course);
                        setCourseDetailModalOpen(true);
                      }}
                    >
                      查看详情
                    </button>
                    <button
                      className="flex-1 btn-primary text-xs"
                      onClick={() => {
                        setSelectedCourse(course);
                        setAssessmentModalOpen(true);
                      }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      考核
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="section-title">培训考核记录</h3>
                <DataTable columns={skillColumns} data={skillRecords} rowKey="id" />
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">技能培训分布</h3>
              <ReactECharts
                option={skillDistributionOption}
                style={{ height: 320 }}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
        title={
          trainingForm.type === "体能训练" ? "新增体能训练记录" : "新增技能培训记录"
        }
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setTrainingModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddTraining}
              disabled={!trainingForm.detaineeId || !trainingForm.content}
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
              value={trainingForm.detaineeId}
              onChange={(e) =>
                setTrainingForm({
                  ...trainingForm,
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
              <label className="form-label">
                {trainingForm.type === "体能训练" ? "训练日期" : "培训日期"}
              </label>
              <input
                type="date"
                className="form-input"
                value={trainingForm.date}
                onChange={(e) =>
                  setTrainingForm({ ...trainingForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">
                {trainingForm.type === "体能训练" ? "教练" : "授课老师"}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入姓名"
                value={trainingForm.coach}
                onChange={(e) =>
                  setTrainingForm({ ...trainingForm, coach: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              {trainingForm.type === "体能训练" ? "训练内容" : "培训课程"}{" "}
              <span className="text-warning-600">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={
                trainingForm.type === "体能训练"
                  ? "如：晨跑、力量训练、球类运动"
                  : "如：中式烹饪、美容美发、电工基础"
              }
              value={trainingForm.content}
              onChange={(e) =>
                setTrainingForm({ ...trainingForm, content: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                {trainingForm.type === "体能训练" ? "训练时长（分钟）" : "课时（分钟）"}
              </label>
              <input
                type="number"
                className="form-input"
                value={trainingForm.duration}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="form-label">
                {trainingForm.type === "体能训练" ? "表现评分" : "考核成绩"}：
                {trainingForm.performance}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                value={trainingForm.performance}
                onChange={(e) =>
                  setTrainingForm({
                    ...trainingForm,
                    performance: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={assessmentModalOpen}
        onClose={() => {
          setAssessmentModalOpen(false);
          setSelectedCourse(null);
        }}
        title={selectedCourse ? `${selectedCourse.name} - 技能考核` : "技能考核总览"}
        width="max-w-2xl"
        footer={
          <button
            className="btn-secondary"
            onClick={() => {
              setAssessmentModalOpen(false);
              setSelectedCourse(null);
            }}
          >
            关闭
          </button>
        }
      >
        {selectedCourse ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">课程名称</p>
                <p className="text-lg font-semibold text-slate-800">{selectedCourse.name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">授课老师</p>
                <p className="text-lg font-semibold text-slate-800">{selectedCourse.teacher}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">学员人数</p>
                <p className="text-lg font-semibold text-slate-800">{selectedCourse.students}人</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">课程进度</p>
                <p className="text-lg font-semibold text-slate-800">
                  {selectedCourse.completedHours}/{selectedCourse.totalHours}课时
                </p>
              </div>
            </div>
            {(() => {
              const courseRecords = skillRecords.filter((r) => r.content === selectedCourse.name);
              const passCount = courseRecords.filter((r) => r.performance >= 60).length;
              const avgScore =
                courseRecords.length > 0
                  ? (courseRecords.reduce((s, r) => s + r.performance, 0) / courseRecords.length).toFixed(1)
                  : "0";
              return (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-emerald-600">{courseRecords.length}</p>
                    <p className="text-xs text-slate-500">考核次数</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{avgScore}</p>
                    <p className="text-xs text-slate-500">平均成绩</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {courseRecords.length > 0 ? ((passCount / courseRecords.length) * 100).toFixed(0) : 0}%
                    </p>
                    <p className="text-xs text-slate-500">及格率</p>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="space-y-3">
            {skillAssessmentSummary.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">暂无考核数据</p>
            )}
            {skillAssessmentSummary.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{item.count}人次</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm text-blue-600">均分 {item.avgPerformance}</span>
                  <span className="text-sm text-emerald-600">及格率 {item.passRate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={courseDetailModalOpen}
        onClose={() => {
          setCourseDetailModalOpen(false);
          setSelectedCourse(null);
        }}
        title={selectedCourse ? selectedCourse.name : "课程详情"}
        width="max-w-lg"
        footer={
          <button
            className="btn-secondary"
            onClick={() => {
              setCourseDetailModalOpen(false);
              setSelectedCourse(null);
            }}
          >
            关闭
          </button>
        }
      >
        {selectedCourse && (
          <div className="space-y-4">
            <div className={`h-20 bg-gradient-to-br ${selectedCourse.color} rounded-lg flex items-center justify-between px-6`}>
              <div>
                <StatusBadge type="default">{selectedCourse.category}</StatusBadge>
                <h4 className="text-white text-lg font-semibold mt-1">{selectedCourse.name}</h4>
              </div>
              <GraduationCap className="w-10 h-10 text-white/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">授课老师</p>
                <p className="text-sm font-medium text-slate-800">{selectedCourse.teacher}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">学员人数</p>
                <p className="text-sm font-medium text-slate-800">{selectedCourse.students}人</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">总课时</p>
                <p className="text-sm font-medium text-slate-800">{selectedCourse.totalHours}课时</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">已完成</p>
                <p className="text-sm font-medium text-slate-800">{selectedCourse.completedHours}课时</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="text-slate-500">课程进度</span>
                <span className="text-slate-700 font-medium">
                  {((selectedCourse.completedHours / selectedCourse.totalHours) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${selectedCourse.color} rounded-full`}
                  style={{
                    width: `${(selectedCourse.completedHours / selectedCourse.totalHours) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
