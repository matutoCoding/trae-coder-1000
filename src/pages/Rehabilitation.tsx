import { useState } from "react";
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

  const performanceTrendOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["平均评分", "参与人数"], top: 0 },
    grid: { left: 40, right: 40, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周"],
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
        data: [65, 70, 72, 78, 82, 85],
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
        data: [68, 72, 75, 78, 80, 82],
        itemStyle: {
          color: "rgba(6, 95, 70, 0.6)",
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: 20,
      },
    ],
  };

  const skillDistributionOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        type: "pie",
        radius: ["35%", "65%"],
        center: ["50%", "45%"],
        roseType: "radius",
        itemStyle: { borderRadius: 4, borderColor: "#fff", borderWidth: 2 },
        label: {
          formatter: "{b}\n{c}人",
          fontSize: 12,
        },
        data: [
          { value: 28, name: "美容美发", itemStyle: { color: "#ec4899" } },
          { value: 35, name: "中式烹饪", itemStyle: { color: "#f59e0b" } },
          { value: 22, name: "电工基础", itemStyle: { color: "#1e40af" } },
          { value: 18, name: "计算机办公", itemStyle: { color: "#065f46" } },
          { value: 15, name: "汽车维修", itemStyle: { color: "#7c3aed" } },
          { value: 12, name: "家政服务", itemStyle: { color: "#0891b2" } },
        ],
      },
    ],
  };

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
          <button className="btn-secondary">
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
                {[
                  { name: "晨跑锻炼", count: 486, progress: 95 },
                  { name: "力量训练", count: 312, progress: 78 },
                  { name: "球类运动", count: 256, progress: 65 },
                  { name: "瑜伽放松", count: 198, progress: 52 },
                  { name: "拓展训练", count: 86, progress: 35 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{item.name}</span>
                      <span className="text-xs text-slate-500">
                        {item.count}人次
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
                    <button className="flex-1 btn-secondary text-xs">
                      查看详情
                    </button>
                    <button className="flex-1 btn-primary text-xs">
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
    </PageContainer>
  );
}
