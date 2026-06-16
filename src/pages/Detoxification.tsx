import { useState, useMemo } from "react";
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
  X,
  Check,
  ChevronDown,
  FileText,
  AlertCircle,
  Heart,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useAppStore } from "@/store/useAppStore";
import type { Treatment, UrineTest } from "@/types";

const tabs = [
  { id: "treatment", label: "脱毒治疗" },
  { id: "urine", label: "尿检筛查" },
];

export default function Detoxification() {
  const [activeTab, setActiveTab] = useState("treatment");
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [urineModalOpen, setUrineModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const { detainees, treatments, urineTests, addTreatment, addUrineTest } = useAppStore();

  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  const [treatmentForm, setTreatmentForm] = useState({
    detaineeId: "",
    date: new Date().toISOString().split("T")[0],
    medication: "",
    dosage: "",
    vitalSigns: "",
    progress: 0,
    doctor: "",
    notes: "",
  });

  const [urineForm, setUrineForm] = useState({
    detaineeId: "",
    testDate: new Date().toISOString().split("T")[0],
    testType: "吗啡检测",
    result: "阴性" as "阴性" | "阳性",
    tester: "",
    notes: "",
  });

  const positiveCount = urineTests.filter((u) => u.result === "阳性").length;
  const treatmentCount = treatments.length;
  const treatingCount = detainees.filter((d) => d.status === "治疗中").length;

  const selectedDetaineeForTreatment = detainees.find(
    (d) => d.id === treatmentForm.detaineeId
  );
  const selectedDetaineeForUrine = detainees.find(
    (d) => d.id === urineForm.detaineeId
  );

  const urineStatOption = useMemo(
    () => ({
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
            {
              value: urineTests.filter((u) => u.result === "阴性").length,
              name: "阴性",
              itemStyle: { color: "#065f46" },
            },
            {
              value: urineTests.filter((u) => u.result === "阳性").length,
              name: "阳性",
              itemStyle: { color: "#dc2626" },
            },
          ],
        },
      ],
    }),
    [urineTests]
  );

  const vitalSignsOption = useMemo(() => {
    const sorted = [...treatments]
      .filter((t) => t.vitalSigns)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (sorted.length === 0) {
      return {
        title: { text: "暂无数据", left: "center", top: "center", textStyle: { color: "#94a3b8", fontSize: 14 } },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [],
      };
    }

    const dates = sorted.map((t) => t.date.slice(5));

    const extractNum = (text: string, keyword: string): number | null => {
      const match = text.match(new RegExp(keyword + `[^.0-9]*(\\d+(?:\\.\\d+)?)`));
      return match ? parseFloat(match[1]) : null;
    };

    const temps = sorted.map((t) => {
      const v = extractNum(t.vitalSigns, "体温");
      return v !== null && v >= 35 && v <= 42 ? v : null;
    });
    const heartRates = sorted.map((t) => {
      const v = extractNum(t.vitalSigns, "心率");
      return v !== null && v >= 40 && v <= 200 ? v : null;
    });
    const bloodPressures = sorted.map((t) => {
      const match = t.vitalSigns.match(/血压[^.0-9]*(\d+)/);
      const v = match ? parseInt(match[1]) : null;
      return v !== null && v >= 60 && v <= 250 ? v : null;
    });

    const series: Array<{
      name: string; type: string; smooth: boolean; data: (number | null)[];
      itemStyle: { color: string }; lineStyle: { color: string; width: number };
      symbol: string; symbolSize: number; connectNulls: boolean;
    }> = [
      {
        name: "体温(℃)", type: "line", smooth: true, data: temps,
        itemStyle: { color: "#dc2626" }, lineStyle: { color: "#dc2626", width: 2 },
        symbol: "circle", symbolSize: 6, connectNulls: true,
      },
      {
        name: "心率(次/分)", type: "line", smooth: true, data: heartRates,
        itemStyle: { color: "#1e40af" }, lineStyle: { color: "#1e40af", width: 2 },
        symbol: "circle", symbolSize: 6, connectNulls: true,
      },
      {
        name: "血压(mmHg)", type: "line", smooth: true, data: bloodPressures,
        itemStyle: { color: "#7c3aed" }, lineStyle: { color: "#7c3aed", width: 2 },
        symbol: "circle", symbolSize: 6, connectNulls: true,
      },
    ];

    return {
      tooltip: { trigger: "axis" },
      legend: { data: series.map((s) => s.name), top: 0 },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
      },
      series,
    };
  }, [treatments]);

  const extractVitalSigns = (text: string) => {
    const extractNum = (keyword: string): number | null => {
      const match = text.match(new RegExp(keyword + `[^.0-9]*(\\d+(?:\\.\\d+)?)`));
      return match ? parseFloat(match[1]) : null;
    };
    const temp = extractNum("体温");
    let heartRate = extractNum("心率");
    if (heartRate === null) heartRate = extractNum("脉搏");
    const bpMatch = text.match(/血压[^.0-9]*(\d+)/);
    const bloodPressure = bpMatch ? parseInt(bpMatch[1]) : null;
    return {
      temp: temp !== null && temp >= 35 && temp <= 42 ? temp : null,
      heartRate: heartRate !== null && heartRate >= 40 && heartRate <= 200 ? heartRate : null,
      bloodPressure: bloodPressure !== null && bloodPressure >= 60 && bloodPressure <= 250 ? bloodPressure : null,
    };
  };

  const selectedProfile = useMemo(
    () => detainees.find((d) => d.id === selectedProfileId) || null,
    [detainees, selectedProfileId]
  );

  const profileTreatments = useMemo(
    () =>
      treatments
        .filter((t) => t.detaineeId === selectedProfileId)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [treatments, selectedProfileId]
  );

  const profileUrineTests = useMemo(
    () =>
      urineTests
        .filter((u) => u.detaineeId === selectedProfileId)
        .sort((a, b) => a.testDate.localeCompare(b.testDate)),
    [urineTests, selectedProfileId]
  );

  const profileVitalOption = useMemo(() => {
    if (profileTreatments.length === 0) {
      return {
        title: {
          text: "暂无体征数据",
          left: "center",
          top: "center",
          textStyle: { color: "#94a3b8", fontSize: 13 },
        },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [],
      };
    }
    const dates = profileTreatments.map((t) => t.date.slice(5));
    const temps: (number | null)[] = [];
    const heartRates: (number | null)[] = [];
    const bps: (number | null)[] = [];
    profileTreatments.forEach((t) => {
      const vs = extractVitalSigns(t.vitalSigns);
      temps.push(vs.temp);
      heartRates.push(vs.heartRate);
      bps.push(vs.bloodPressure);
    });
    return {
      tooltip: { trigger: "axis" },
      legend: { data: ["体温", "心率", "血压"], top: 0, textStyle: { fontSize: 11 } },
      grid: { left: 40, right: 20, top: 35, bottom: 25 },
      xAxis: { type: "category", data: dates, axisLine: { lineStyle: { color: "#cbd5e1" } }, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", axisLine: { show: false }, splitLine: { lineStyle: { color: "#f1f5f9" } } },
      series: [
        { name: "体温", type: "line", smooth: true, data: temps, itemStyle: { color: "#dc2626" }, lineStyle: { width: 2 }, connectNulls: true, symbol: "circle", symbolSize: 6 },
        { name: "心率", type: "line", smooth: true, data: heartRates, itemStyle: { color: "#1e40af" }, lineStyle: { width: 2 }, connectNulls: true, symbol: "circle", symbolSize: 6 },
        { name: "血压", type: "line", smooth: true, data: bps, itemStyle: { color: "#7c3aed" }, lineStyle: { width: 2 }, connectNulls: true, symbol: "circle", symbolSize: 6 },
      ],
    };
  }, [profileTreatments]);

  const profileAbnormalAlerts = useMemo(() => {
    const alerts: Array<{ date: string; type: string; level: "warning" | "danger"; desc: string }> = [];
    profileTreatments.forEach((t) => {
      const vs = extractVitalSigns(t.vitalSigns);
      if (vs.temp !== null && (vs.temp > 37.3 || vs.temp < 36)) {
        alerts.push({
          date: t.date,
          type: "体温异常",
          level: vs.temp > 37.3 ? "danger" : "warning",
          desc: `体温 ${vs.temp}℃，${vs.temp > 37.3 ? "偏高" : "偏低"}，需关注`,
        });
      }
      if (vs.heartRate !== null && (vs.heartRate > 100 || vs.heartRate < 60)) {
        alerts.push({
          date: t.date,
          type: "心率异常",
          level: vs.heartRate > 100 ? "warning" : "warning",
          desc: `心率 ${vs.heartRate}次/分，${vs.heartRate > 100 ? "偏快" : "偏慢"}`,
        });
      }
      if (vs.bloodPressure !== null && (vs.bloodPressure > 140 || vs.bloodPressure < 90)) {
        alerts.push({
          date: t.date,
          type: "血压异常",
          level: vs.bloodPressure > 140 ? "danger" : "warning",
          desc: `收缩压 ${vs.bloodPressure}mmHg，${vs.bloodPressure > 140 ? "偏高" : "偏低"}`,
        });
      }
    });
    profileUrineTests.forEach((u) => {
      if (u.result === "阳性") {
        alerts.push({
          date: u.testDate,
          type: "尿检阳性",
          level: "danger",
          desc: `${u.testType}结果阳性，需重点关注`,
        });
      }
    });
    return alerts.sort((a, b) => b.date.localeCompare(a.date));
  }, [profileTreatments, profileUrineTests]);

  const handleAddTreatment = () => {
    if (!treatmentForm.detaineeId || !treatmentForm.medication) return;
    const detainee = detainees.find((d) => d.id === treatmentForm.detaineeId);
    if (!detainee) return;

    addTreatment({
      ...treatmentForm,
      detaineeName: detainee.name,
    } as Omit<Treatment, "id">);

    setTreatmentForm({
      detaineeId: "",
      date: new Date().toISOString().split("T")[0],
      medication: "",
      dosage: "",
      vitalSigns: "",
      progress: 0,
      doctor: "",
      notes: "",
    });
    setTreatmentModalOpen(false);
  };

  const handleAddUrineTest = () => {
    if (!urineForm.detaineeId) return;
    const detainee = detainees.find((d) => d.id === urineForm.detaineeId);
    if (!detainee) return;

    addUrineTest({
      ...urineForm,
      detaineeName: detainee.name,
    } as Omit<UrineTest, "id">);

    setUrineForm({
      detaineeId: "",
      testDate: new Date().toISOString().split("T")[0],
      testType: "吗啡检测",
      result: "阴性",
      tester: "",
      notes: "",
    });
    setUrineModalOpen(false);
  };

  const treatmentColumns: Column<Treatment>[] = [
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
          <span className="text-xs font-medium text-slate-600 w-8">
            {row.progress}%
          </span>
        </div>
      ),
    },
    { key: "doctor", title: "主治医生", width: "100px" },
    { key: "notes", title: "备注" },
  ];

  const urineColumns: Column<UrineTest>[] = [
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

  return (
    <PageContainer
      title="生理脱毒"
      subtitle="生理脱毒治疗记录、体征监测与尿检复吸筛查管理"
      breadcrumbs={[{ label: "生理脱毒" }]}
      actions={
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => setPlanModalOpen(true)}>
            <CalendarDays className="w-4 h-4" />
            生成检测计划
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              activeTab === "treatment"
                ? setTreatmentModalOpen(true)
                : setUrineModalOpen(true)
            }
          >
            <Plus className="w-4 h-4" />
            {activeTab === "treatment" ? "新增治疗记录" : "新增尿检记录"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="治疗中人数"
          value={treatingCount}
          icon={Pill}
          color="blue"
        />
        <StatCard
          title="本月治疗记录"
          value={treatmentCount}
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
              本月共有 {positiveCount}{" "}
              人次尿检结果呈阳性，请重点关注相关人员并加强管控。
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
                  <span>共有 {treatments.length} 条治疗记录</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="form-input pl-9 appearance-none"
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                  >
                    <option value="">选择人员查看治疗档案</option>
                    {detainees.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} - {d.idCard.slice(-4)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {selectedProfileId && (
                  <button
                    className="text-xs text-slate-500 hover:text-slate-700"
                    onClick={() => setSelectedProfileId("")}
                  >
                    清除选择
                  </button>
                )}
              </div>

              <DataTable columns={treatmentColumns} data={treatments} rowKey="id" />
            </div>
          </div>

          <div className="space-y-6">
            {selectedProfile ? (
              <>
                <div className="card bg-gradient-to-br from-police-50 to-blue-50 border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-police-500 to-police-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">
                        {selectedProfile.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">
                          {selectedProfile.gender} · {selectedProfile.currentLevel}
                        </span>
                        <StatusBadge
                          type={
                            selectedProfile.status === "正常"
                              ? "success"
                              : selectedProfile.status === "治疗中"
                              ? "blue"
                              : "warning"
                          }
                        >
                          {selectedProfile.status}
                        </StatusBadge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-police-700">
                        {profileTreatments.length}
                      </p>
                      <p className="text-xs text-slate-500">治疗记录</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="section-title">体征曲线</h3>
                  <ReactECharts option={profileVitalOption} style={{ height: 220 }} />
                </div>

                <div className="card">
                  <h3 className="section-title">尿检记录</h3>
                  {profileUrineTests.length > 0 ? (
                    <div className="space-y-2">
                      {profileUrineTests.slice(0, 5).map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                u.result === "阴性"
                                  ? "bg-health-500"
                                  : "bg-warning-500"
                              }`}
                            />
                            <span className="text-sm text-slate-700">
                              {u.testType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {u.testDate}
                            </span>
                            <StatusBadge
                              type={u.result === "阴性" ? "success" : "danger"}
                            >
                              {u.result}
                            </StatusBadge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      暂无尿检记录
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="section-title mb-0">异常提醒</h3>
                    {profileAbnormalAlerts.length > 0 && (
                      <span className="text-xs text-warning-600 font-medium">
                        {profileAbnormalAlerts.length} 条异常
                      </span>
                    )}
                  </div>
                  {profileAbnormalAlerts.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {profileAbnormalAlerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-sm flex items-start gap-2 ${
                            alert.level === "danger"
                              ? "bg-red-50 border border-red-100"
                              : "bg-amber-50 border border-amber-100"
                          }`}
                        >
                          {alert.level === "danger" ? (
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium ${
                                alert.level === "danger"
                                  ? "text-red-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {alert.date} · {alert.type}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                alert.level === "danger"
                                  ? "text-red-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {alert.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Heart className="w-8 h-8 text-health-400 mx-auto mb-2" />
                      <p className="text-sm text-health-600">体征状态良好</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
                          <span className="text-xs text-slate-500">
                            {t.progress}%
                          </span>
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
              </>
            )}
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
                  const dayStr = String(day).padStart(2, "0");
                  const testsOnDay = urineTests.filter(
                    (u) => u.testDate.slice(8) === dayStr
                  );
                  const hasTest = testsOnDay.length > 0;
                  const isPositive = testsOnDay.some((u) => u.result === "阳性");
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
                    {urineTests.length > 0
                      ? (
                          ((urineTests.length - positiveCount) /
                            urineTests.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={treatmentModalOpen}
        onClose={() => setTreatmentModalOpen(false)}
        title="新增脱毒治疗记录"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setTreatmentModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddTreatment}
              disabled={!treatmentForm.detaineeId || !treatmentForm.medication}
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
              value={treatmentForm.detaineeId}
              onChange={(e) =>
                setTreatmentForm({
                  ...treatmentForm,
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
              <label className="form-label">治疗日期</label>
              <input
                type="date"
                className="form-input"
                value={treatmentForm.date}
                onChange={(e) =>
                  setTreatmentForm({ ...treatmentForm, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">主治医生</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入医生姓名"
                value={treatmentForm.doctor}
                onChange={(e) =>
                  setTreatmentForm({ ...treatmentForm, doctor: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">用药名称</label>
              <input
                type="text"
                className="form-input"
                placeholder="如：美沙酮"
                value={treatmentForm.medication}
                onChange={(e) =>
                  setTreatmentForm({
                    ...treatmentForm,
                    medication: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="form-label">剂量</label>
              <input
                type="text"
                className="form-input"
                placeholder="如：20mg/日"
                value={treatmentForm.dosage}
                onChange={(e) =>
                  setTreatmentForm({ ...treatmentForm, dosage: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="form-label">体征记录</label>
            <input
              type="text"
              className="form-input"
              placeholder="体温、血压、心率等"
              value={treatmentForm.vitalSigns}
              onChange={(e) =>
                setTreatmentForm({
                  ...treatmentForm,
                  vitalSigns: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="form-label">
              治疗进度：{treatmentForm.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              value={treatmentForm.progress}
              onChange={(e) =>
                setTreatmentForm({
                  ...treatmentForm,
                  progress: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="form-label">备注</label>
            <textarea
              className="form-input min-h-[80px]"
              placeholder="请输入治疗备注"
              value={treatmentForm.notes}
              onChange={(e) =>
                setTreatmentForm({ ...treatmentForm, notes: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={urineModalOpen}
        onClose={() => setUrineModalOpen(false)}
        title="新增尿检记录"
        width="max-w-xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setUrineModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={handleAddUrineTest}
              disabled={!urineForm.detaineeId}
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
              value={urineForm.detaineeId}
              onChange={(e) =>
                setUrineForm({ ...urineForm, detaineeId: e.target.value })
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
              <label className="form-label">检测日期</label>
              <input
                type="date"
                className="form-input"
                value={urineForm.testDate}
                onChange={(e) =>
                  setUrineForm({ ...urineForm, testDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="form-label">检验人员</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入检验人员"
                value={urineForm.tester}
                onChange={(e) =>
                  setUrineForm({ ...urineForm, tester: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">检测类型</label>
              <select
                className="form-input"
                value={urineForm.testType}
                onChange={(e) =>
                  setUrineForm({ ...urineForm, testType: e.target.value })
                }
              >
                <option value="吗啡检测">吗啡检测</option>
                <option value="冰毒检测">冰毒检测</option>
                <option value="K粉检测">K粉检测</option>
                <option value="大麻检测">大麻检测</option>
                <option value="综合检测">综合检测</option>
              </select>
            </div>
            <div>
              <label className="form-label">检测结果</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    checked={urineForm.result === "阴性"}
                    onChange={() =>
                      setUrineForm({ ...urineForm, result: "阴性" })
                    }
                    className="w-4 h-4 text-health-600"
                  />
                  <span className="text-sm text-slate-700">阴性</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="result"
                    checked={urineForm.result === "阳性"}
                    onChange={() =>
                      setUrineForm({ ...urineForm, result: "阳性" })
                    }
                    className="w-4 h-4 text-warning-600"
                  />
                  <span className="text-sm text-slate-700">阳性</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">备注</label>
            <textarea
              className="form-input min-h-[80px]"
              placeholder="请输入检测备注"
              value={urineForm.notes}
              onChange={(e) =>
                setUrineForm({ ...urineForm, notes: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title="检测计划"
        width="max-w-lg"
        footer={
          <button
            className="btn-primary"
            onClick={() => setPlanModalOpen(false)}
          >
            <Check className="w-4 h-4" />
            确定
          </button>
        }
      >
        {(() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const scheduledDays = [5, 10, 15, 20, 25].filter(
            (d) => d <= daysInMonth
          );
          const existingDays = new Set(
            urineTests
              .filter((u) => {
                const d = new Date(u.testDate);
                return d.getFullYear() === year && d.getMonth() === month;
              })
              .map((u) => new Date(u.testDate).getDate())
          );
          return (
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                {year}年{month + 1}月尿检筛查计划
              </div>
              <div className="space-y-2">
                {scheduledDays.map((day) => {
                  const done = existingDays.has(day);
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between p-3 rounded-sm border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-police-600" />
                        <span className="text-sm font-medium">
                          {month + 1}月{day}日
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          done
                            ? "bg-health-50 text-health-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {done ? "已检测" : "待检测"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                共 {scheduledDays.length} 次计划检测，已完成 {scheduledDays.filter((d) => existingDays.has(d)).length} 次
              </div>
            </div>
          );
        })()}
      </Modal>
    </PageContainer>
  );
}
