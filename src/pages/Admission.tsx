import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  UserPlus,
  FileText,
  Stethoscope,
  ClipboardCheck,
  Upload,
  Camera,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  MapPin,
  X,
  Save,
  Check,
  Eye,
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useAppStore } from "@/store/useAppStore";
import type { Detainee, HealthCheckup } from "@/types";

const tabs = [
  { id: "list", label: "收治人员列表" },
  { id: "register", label: "收治登记" },
  { id: "checkup", label: "入所体检" },
];

export default function Admission() {
  const [activeTab, setActiveTab] = useState("list");
  const [registerStep, setRegisterStep] = useState(1);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedDetainee, setSelectedDetainee] = useState<string | null>(null);
  const [showCheckupModal, setShowCheckupModal] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [printReportModalOpen, setPrintReportModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileDetaineeId, setProfileDetaineeId] = useState<string>("");

  const {
    detainees,
    healthCheckups,
    treatments,
    urineTests,
    counselings,
    psychAssessments,
    trainingRecords,
    violations,
    levelChanges,
    documents,
    addDetainee,
    addHealthCheckup,
    admissionFilters,
    setAdmissionFilters,
    resetAdmissionFilters,
  } = useAppStore();

  const searchText = admissionFilters.search;
  const filterLevel = admissionFilters.level;
  const filterStatus = admissionFilters.status;
  const filterGender = admissionFilters.gender;

  const [formData, setFormData] = useState({
    name: "",
    idCard: "",
    gender: "男" as "男" | "女",
    birthDate: "",
    ethnicity: "汉族",
    education: "高中",
    address: "",
    admitDate: new Date().toISOString().split("T")[0],
    durationMonths: 24,
    currentLevel: "一级" as Detainee["currentLevel"],
    status: "正常" as Detainee["status"],
  });

  const [checkupForm, setCheckupForm] = useState({
    detaineeId: "",
    detaineeName: "",
    checkDate: new Date().toISOString().split("T")[0],
    height: 0,
    weight: 0,
    bloodPressure: "120/80",
    heartRate: "75",
    bloodType: "A型",
    infectiousDisease: false,
    dependenceLevel: 2 as 1 | 2 | 3 | 4,
    notes: "",
  });

  const filteredDetainees = useMemo(() =>
    detainees.filter(
      (d) => {
        const matchesSearch =
          d.name.includes(searchText) ||
          d.idCard.includes(searchText) ||
          d.id.includes(searchText);
        const matchesLevel = !filterLevel || d.currentLevel === filterLevel;
        const matchesStatus = !filterStatus || d.status === filterStatus;
        const matchesGender = !filterGender || d.gender === filterGender;
        return matchesSearch && matchesLevel && matchesStatus && matchesGender;
      }
    ),
  [detainees, searchText, filterLevel, filterStatus, filterGender]);

  const pendingCheckupCount = useMemo(() =>
    detainees.filter((d) =>
      !healthCheckups.some((h) => h.detaineeId === d.id)
    ).length
  , [detainees, healthCheckups]);

  const completedCheckupCount = useMemo(() =>
    healthCheckups.length
  , [healthCheckups]);

  const columns: Column<typeof detainees[0]>[] = [
    { key: "id", title: "编号", width: "100px" },
    {
      key: "name",
      title: "姓名",
      width: "120px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-police-100 flex items-center justify-center">
            <User className="w-4 h-4 text-police-600" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "gender", title: "性别", width: "80px" },
    {
      key: "birthDate",
      title: "出生日期",
      width: "130px",
      render: (row) => (
        <div className="flex items-center gap-1 text-slate-600">
          <Calendar className="w-3.5 h-3.5" />
          {row.birthDate}
        </div>
      ),
    },
    { key: "ethnicity", title: "民族", width: "80px" },
    { key: "education", title: "文化程度", width: "100px" },
    {
      key: "address",
      title: "户籍地址",
      render: (row) => (
        <div className="flex items-center gap-1 text-slate-600 max-w-xs truncate">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{row.address}</span>
        </div>
      ),
    },
    { key: "admitDate", title: "入所日期", width: "120px" },
    {
      key: "currentLevel",
      title: "管理等级",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.currentLevel === "一级"
              ? "danger"
              : row.currentLevel === "二级"
              ? "warning"
              : row.currentLevel === "三级"
              ? "info"
              : "success"
          }
        >
          {row.currentLevel}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      title: "状态",
      width: "100px",
      render: (row) => (
        <StatusBadge
          type={
            row.status === "正常"
              ? "success"
              : row.status === "治疗中"
              ? "blue"
              : row.status === "隔离"
              ? "warning"
              : "info"
          }
        >
          {row.status}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      title: "操作",
      width: "150px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetail(row.id)}
            className="text-xs text-police-600 hover:text-police-700 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            详情
          </button>
          <button
            onClick={() => handleAddCheckup(row.id, row.name)}
            className="text-xs text-health-600 hover:text-health-700 flex items-center gap-1"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            体检
          </button>
          <button
            onClick={() => {
              setProfileDetaineeId(row.id);
              setProfileModalOpen(true);
            }}
            className="text-xs text-police-600 hover:text-police-700 flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" />
            画像
          </button>
        </div>
      ),
    },
  ];

  const admitTrendOption = {
    tooltip: { trigger: "axis" },
    legend: { data: ["收治人数"], right: 20 },
    grid: { left: 40, right: 20, top: 50, bottom: 30 },
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
        name: "收治人数",
        type: "bar",
        data: [12, 18, 15, 22, 19, detainees.length],
        itemStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#3b82f6" },
              { offset: 1, color: "#1e40af" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: 24,
      },
    ],
  };

  const handleViewDetail = (id: string) => {
    setSelectedDetainee(id);
    setShowAdmitModal(true);
  };

  const handleAddCheckup = (id: string, name: string) => {
    setCheckupForm({
      ...checkupForm,
      detaineeId: id,
      detaineeName: name,
    });
    setShowCheckupModal(true);
  };

  const handleSubmitAdmit = () => {
    if (!formData.name || !formData.idCard) {
      alert("请填写必填项：姓名和身份证号");
      return;
    }
    addDetainee(formData);
    setRegisterStep(1);
    setFormData({
      name: "",
      idCard: "",
      gender: "男",
      birthDate: "",
      ethnicity: "汉族",
      education: "高中",
      address: "",
      admitDate: new Date().toISOString().split("T")[0],
      durationMonths: 24,
      currentLevel: "一级",
      status: "正常",
    });
    setActiveTab("list");
    alert("收治登记成功！");
  };

  const handleSubmitCheckup = () => {
    if (!checkupForm.detaineeId) {
      alert("请选择戒毒人员");
      return;
    }
    const { detaineeName, ...checkupData } = checkupForm;
    addHealthCheckup(checkupData as Omit<HealthCheckup, "id">);
    setShowCheckupModal(false);
    setCheckupForm({
      detaineeId: "",
      detaineeName: "",
      checkDate: new Date().toISOString().split("T")[0],
      height: 0,
      weight: 0,
      bloodPressure: "120/80",
      heartRate: "75",
      bloodType: "A型",
      infectiousDisease: false,
      dependenceLevel: 2,
      notes: "",
    });
    alert("体检评估提交成功！");
  };

  return (
    <PageContainer
      title="人员收治"
      subtitle="戒毒人员收治登记、信息管理与入所体检评估"
      breadcrumbs={[{ label: "人员收治" }]}
      actions={
        <button className="btn-primary" onClick={() => setActiveTab("register")}>
          <Plus className="w-4 h-4" />
          新增收治
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="在戒人员总数"
          value={
            filterLevel || filterStatus || filterGender || searchText
              ? `${filteredDetainees.length} / ${detainees.length}`
              : detainees.length
          }
          icon={UserPlus}
          color="blue"
          trend={{ value: 8, label: "较上月" }}
        />
        <StatCard
          title="本月新增收治"
          value={detainees.filter((d) => d.admitDate.startsWith("2025-06")).length}
          icon={FileText}
          color="green"
          trend={{ value: 12, label: "环比" }}
        />
        <StatCard
          title="待体检人员"
          value={pendingCheckupCount}
          icon={Stethoscope}
          color="orange"
        />
        <StatCard
          title="已完成体检"
          value={completedCheckupCount}
          icon={ClipboardCheck}
          color="purple"
        />
      </div>

      {(filterLevel || filterStatus || filterGender || searchText) && (
        <div className="bg-blue-50 border border-blue-200 rounded-sm px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Filter className="w-4 h-4" />
            <span>
              筛选条件：
              {[
                filterLevel && `等级：${filterLevel}`,
                filterStatus && `状态：${filterStatus}`,
                filterGender && `性别：${filterGender}`,
                searchText && `搜索：${searchText}`,
              ]
                .filter(Boolean)
                .join("，")}
            </span>
          </div>
          <button
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => resetAdmissionFilters()}
          >
            清除筛选
          </button>
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

      {activeTab === "list" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title mb-0">收治人员列表</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜索姓名/身份证..."
                        value={searchText}
                        onChange={(e) =>
                          setAdmissionFilters({ search: e.target.value })
                        }
                        className="pl-9 pr-4 py-2 w-48 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-police-500"
                      />
                    </div>
                    <button className="btn-secondary" onClick={() => setFilterModalOpen(true)}>
                      <Filter className="w-4 h-4" />
                      筛选
                    </button>
                  </div>
                </div>
                <DataTable
                  columns={columns}
                  data={filteredDetainees}
                  rowKey="id"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="section-title">月度收治趋势</h3>
              <ReactECharts option={admitTrendOption} style={{ height: 300 }} />
            </div>
          </div>
        </>
      )}

      {activeTab === "register" && (
        <div className="card">
          <div className="flex items-center justify-center gap-4 mb-8">
            {["基本信息", "收治依据", "审批确认"].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registerStep > index
                      ? "bg-health-500 text-white"
                      : registerStep === index + 1
                      ? "bg-police-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {registerStep > index ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`text-sm ${
                    registerStep >= index + 1
                      ? "text-police-600 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  {step}
                </span>
                {index < 2 && (
                  <div
                    className={`w-16 h-0.5 ${
                      registerStep > index ? "bg-health-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {registerStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 text-center">
                  <div className="w-32 h-40 mx-auto bg-slate-50 rounded-sm flex flex-col items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-400">证件照片</p>
                  </div>
                  <button className="btn-secondary w-full" onClick={() => alert("照片上传功能开发中")}>
                    <Upload className="w-4 h-4" />
                    上传照片
                  </button>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <h4 className="section-title text-sm border-b pb-2 mb-4">基本信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">姓名 *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">身份证号 *</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入身份证号"
                      value={formData.idCard}
                      onChange={(e) =>
                        setFormData({ ...formData, idCard: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">性别 *</label>
                    <select
                      className="select"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gender: e.target.value as "男" | "女",
                        })
                      }
                    >
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">出生日期</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.birthDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">民族</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入民族"
                      value={formData.ethnicity}
                      onChange={(e) =>
                        setFormData({ ...formData, ethnicity: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">文化程度</label>
                    <select
                      className="select"
                      value={formData.education}
                      onChange={(e) =>
                        setFormData({ ...formData, education: e.target.value })
                      }
                    >
                      <option>小学</option>
                      <option>初中</option>
                      <option>高中</option>
                      <option>中专</option>
                      <option>大专</option>
                      <option>本科</option>
                      <option>研究生及以上</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">户籍地址</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="请输入户籍地址"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">入所日期 *</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.admitDate}
                      onChange={(e) =>
                        setFormData({ ...formData, admitDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">戒毒期限（月）</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="请输入期限"
                      value={formData.durationMonths}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMonths: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {registerStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="section-title text-sm border-b pb-2">收治依据</h4>
              <div className="space-y-4">
                <div>
                  <label className="label">强制隔离戒毒决定书编号</label>
                  <input type="text" className="input" placeholder="请输入决定书编号" />
                </div>
                <div>
                  <label className="label">决定机关</label>
                  <input type="text" className="input" placeholder="请输入决定机关" defaultValue="XX市公安局" />
                </div>
                <div>
                  <label className="label">决定日期</label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="label">法律文书</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">点击或拖拽上传法律文书</p>
                    <p className="text-xs text-slate-400 mt-1">支持 PDF、JPG、PNG 格式</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {registerStep === 3 && (
            <div className="max-w-md mx-auto text-center py-8">
              <div className="w-20 h-20 mx-auto bg-health-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-health-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">确认收治登记</h4>
              <p className="text-sm text-slate-500 mb-6">
                请确认以上信息无误，提交后将进入审批流程
              </p>
              <div className="bg-slate-50 rounded-sm p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">姓名</span>
                  <span className="font-medium text-slate-800">{formData.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">身份证号</span>
                  <span className="font-medium text-slate-800">{formData.idCard || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">入所日期</span>
                  <span className="font-medium text-slate-800">{formData.admitDate || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">戒毒期限</span>
                  <span className="font-medium text-slate-800">{formData.durationMonths}个月</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-6 mt-6 border-t border-slate-100">
            {registerStep > 1 && (
              <button
                className="btn-secondary"
                onClick={() => setRegisterStep(registerStep - 1)}
              >
                上一步
              </button>
            )}
            {registerStep < 3 ? (
              <button
                className="btn-primary"
                onClick={() => setRegisterStep(registerStep + 1)}
              >
                下一步
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmitAdmit}>
                <Save className="w-4 h-4" />
                提交收治登记
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "checkup" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title mb-0">体检项目</h3>
              <select
                className="select w-48"
                value={checkupForm.detaineeId}
                onChange={(e) => {
                  const detainee = detainees.find((d) => d.id === e.target.value);
                  setCheckupForm({
                    ...checkupForm,
                    detaineeId: e.target.value,
                    detaineeName: detainee?.name || "",
                  });
                }}
              >
                <option value="">选择戒毒人员</option>
                {detainees.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}（{d.id}）
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {[
                { name: "身高体重检查", key: "height", status: "completed" },
                { name: "血压心率测量", key: "vital", status: "completed" },
                { name: "血液常规检测", key: "blood", status: "pending" },
                { name: "传染病筛查", key: "infectious", status: "pending" },
                { name: "毒品依赖评估", key: "dependence", status: "pending" },
                { name: "胸部X光检查", key: "xray", status: "pending" },
                { name: "心电图检查", key: "ecg", status: "pending" },
              ].map((item, index) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-health-100 text-health-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.status === "completed" ? (
                        <ClipboardCheck className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    </div>
                  </div>
                  <StatusBadge
                    type={item.status === "completed" ? "success" : "warning"}
                  >
                    {item.status === "completed" ? "已完成" : "待检查"}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">健康检查评估</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">身高 (cm)</label>
                  <input
                    type="number"
                    className="input"
                    value={checkupForm.height}
                    onChange={(e) =>
                      setCheckupForm({
                        ...checkupForm,
                        height: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">体重 (kg)</label>
                  <input
                    type="number"
                    className="input"
                    value={checkupForm.weight}
                    onChange={(e) =>
                      setCheckupForm({
                        ...checkupForm,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">血压</label>
                  <input
                    type="text"
                    className="input"
                    value={checkupForm.bloodPressure}
                    onChange={(e) =>
                      setCheckupForm({ ...checkupForm, bloodPressure: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">心率 (次/分)</label>
                  <input
                    type="text"
                    className="input"
                    value={checkupForm.heartRate}
                    onChange={(e) =>
                      setCheckupForm({ ...checkupForm, heartRate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">血型</label>
                <select
                  className="select"
                  value={checkupForm.bloodType}
                  onChange={(e) =>
                    setCheckupForm({ ...checkupForm, bloodType: e.target.value })
                  }
                >
                  <option>A型</option>
                  <option>B型</option>
                  <option>AB型</option>
                  <option>O型</option>
                </select>
              </div>
              <div>
                <label className="label">传染病筛查</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={checkupForm.infectiousDisease}
                    onChange={(e) =>
                      setCheckupForm({
                        ...checkupForm,
                        infectiousDisease: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm text-slate-700">检出传染病</span>
                </div>
              </div>
              <div>
                <label className="label">依赖程度等级</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((level) => (
                    <label
                      key={level}
                      className={`flex-1 text-center py-2 rounded-sm cursor-pointer border text-sm ${
                        checkupForm.dependenceLevel === level
                          ? "bg-police-50 border-police-500 text-police-700"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() =>
                        setCheckupForm({
                          ...checkupForm,
                          dependenceLevel: level as 1 | 2 | 3 | 4,
                        })
                      }
                    >
                      {level}级
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">医生评估意见</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="请填写医生评估意见"
                  value={checkupForm.notes}
                  onChange={(e) =>
                    setCheckupForm({ ...checkupForm, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3">
                <button className="btn-primary flex-1" onClick={handleSubmitCheckup}>
                  <Stethoscope className="w-4 h-4" />
                  提交体检评估
                </button>
                <button className="btn-secondary" onClick={() => setPrintReportModalOpen(true)}>打印体检报告</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 体检弹窗 */}
      <Modal
        isOpen={showCheckupModal}
        onClose={() => setShowCheckupModal(false)}
        title="入所体检登记"
        width="max-w-lg"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setShowCheckupModal(false)}
            >
              取消
            </button>
            <button className="btn-primary" onClick={handleSubmitCheckup}>
              <Save className="w-4 h-4" />
              保存
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-police-50 p-3 rounded-sm">
            <p className="text-sm font-medium text-police-800">
              戒毒人员：{checkupForm.detaineeName || "-"}
            </p>
            <p className="text-xs text-police-600 mt-1">
              体检日期：{checkupForm.checkDate}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">身高 (cm)</label>
              <input
                type="number"
                className="input"
                value={checkupForm.height || ""}
                onChange={(e) =>
                  setCheckupForm({
                    ...checkupForm,
                    height: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="label">体重 (kg)</label>
              <input
                type="number"
                className="input"
                value={checkupForm.weight || ""}
                onChange={(e) =>
                  setCheckupForm({
                    ...checkupForm,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">血压</label>
              <input
                type="text"
                className="input"
                value={checkupForm.bloodPressure}
                onChange={(e) =>
                  setCheckupForm({ ...checkupForm, bloodPressure: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">心率</label>
              <input
                type="text"
                className="input"
                value={checkupForm.heartRate}
                onChange={(e) =>
                  setCheckupForm({ ...checkupForm, heartRate: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label">依赖程度等级</label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  className={`flex-1 py-2 text-sm rounded-sm border transition-colors ${
                    checkupForm.dependenceLevel === level
                      ? "bg-police-50 border-police-500 text-police-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                  onClick={() =>
                    setCheckupForm({
                      ...checkupForm,
                      dependenceLevel: level as 1 | 2 | 3 | 4,
                    })
                  }
                >
                  {level}级
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">评估意见</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="请填写医生评估意见"
              value={checkupForm.notes}
              onChange={(e) =>
                setCheckupForm({ ...checkupForm, notes: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="筛选条件"
        width="max-w-md"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                resetAdmissionFilters();
              }}
            >
              重置
            </button>
            <button className="btn-primary" onClick={() => setFilterModalOpen(false)}>
              确定
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="label">管理等级</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["一级", "二级", "三级", "四级"].map((level) => (
                <button
                  key={level}
                  className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                    filterLevel === level
                      ? "bg-police-50 border-police-500 text-police-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                  onClick={() =>
                    setAdmissionFilters({
                      level: filterLevel === level ? "" : level,
                    })
                  }
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">状态</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["正常", "治疗中", "隔离", "待解除"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                    filterStatus === status
                      ? "bg-police-50 border-police-500 text-police-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                  onClick={() =>
                    setAdmissionFilters({
                      status: filterStatus === status ? "" : status,
                    })
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">性别</label>
            <div className="flex gap-2 mt-2">
              {["男", "女"].map((gender) => (
                <button
                  key={gender}
                  className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                    filterGender === gender
                      ? "bg-police-50 border-police-500 text-police-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                  onClick={() =>
                    setAdmissionFilters({
                      gender: filterGender === gender ? "" : gender,
                    })
                  }
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAdmitModal}
        onClose={() => setShowAdmitModal(false)}
        title="人员详情"
        width="max-w-lg"
      >
        {(() => {
          const d = detainees.find((item) => item.id === selectedDetainee);
          if (!d) return <p className="text-slate-500">未找到人员信息</p>;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-police-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-police-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">{d.name}</h4>
                  <p className="text-sm text-slate-500">{d.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <span className="text-xs text-slate-400">身份证号</span>
                  <p className="text-sm font-medium text-slate-800">{d.idCard}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">性别</span>
                  <p className="text-sm font-medium text-slate-800">{d.gender}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">出生日期</span>
                  <p className="text-sm font-medium text-slate-800">{d.birthDate}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">民族</span>
                  <p className="text-sm font-medium text-slate-800">{d.ethnicity}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">文化程度</span>
                  <p className="text-sm font-medium text-slate-800">{d.education}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">入所日期</span>
                  <p className="text-sm font-medium text-slate-800">{d.admitDate}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">戒毒期限</span>
                  <p className="text-sm font-medium text-slate-800">{d.durationMonths}个月</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">管理等级</span>
                  <p className="text-sm font-medium text-slate-800">{d.currentLevel}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">当前状态</span>
                  <p className="text-sm font-medium text-slate-800">{d.status}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400">户籍地址</span>
                <p className="text-sm font-medium text-slate-800">{d.address}</p>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal
        isOpen={printReportModalOpen}
        onClose={() => setPrintReportModalOpen(false)}
        title="体检报告预览"
        width="max-w-2xl"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setPrintReportModalOpen(false)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                alert("体检报告已发送至打印队列");
                setPrintReportModalOpen(false);
              }}
            >
              确认打印
            </button>
          </>
        }
      >
        <div className="border border-slate-200 rounded-sm p-6 space-y-4">
          <div className="text-center border-b border-slate-200 pb-4">
            <h4 className="text-lg font-semibold text-slate-800">入所健康检查报告</h4>
            <p className="text-sm text-slate-500 mt-1">检查日期：{checkupForm.checkDate}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">人员姓名：</span>
              <span className="font-medium">{checkupForm.detaineeName || "-"}</span>
            </div>
            <div>
              <span className="text-slate-500">人员编号：</span>
              <span className="font-medium">{checkupForm.detaineeId || "-"}</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <h5 className="text-sm font-semibold text-slate-700 mb-3">体格检查</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">身高：</span>
                <span className="font-medium">{checkupForm.height} cm</span>
              </div>
              <div>
                <span className="text-slate-500">体重：</span>
                <span className="font-medium">{checkupForm.weight} kg</span>
              </div>
              <div>
                <span className="text-slate-500">血压：</span>
                <span className="font-medium">{checkupForm.bloodPressure} mmHg</span>
              </div>
              <div>
                <span className="text-slate-500">心率：</span>
                <span className="font-medium">{checkupForm.heartRate} 次/分</span>
              </div>
              <div>
                <span className="text-slate-500">血型：</span>
                <span className="font-medium">{checkupForm.bloodType}</span>
              </div>
              <div>
                <span className="text-slate-500">传染病筛查：</span>
                <span className="font-medium">{checkupForm.infectiousDisease ? "阳性" : "阴性"}</span>
              </div>
              <div>
                <span className="text-slate-500">依赖程度：</span>
                <span className="font-medium">{checkupForm.dependenceLevel}级</span>
              </div>
            </div>
          </div>
          {checkupForm.notes && (
            <div className="border-t border-slate-100 pt-4">
              <h5 className="text-sm font-semibold text-slate-700 mb-2">医生评估意见</h5>
              <p className="text-sm text-slate-600">{checkupForm.notes}</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileDetaineeId("");
        }}
        title="个人戒治画像"
        width="max-w-3xl"
        footer={
          <button
            className="btn-secondary"
            onClick={() => {
              setProfileModalOpen(false);
              setProfileDetaineeId("");
            }}
          >
            关闭
          </button>
        }
      >
        {(() => {
          const d = detainees.find((item) => item.id === profileDetaineeId);
          if (!d) return <p className="text-slate-500">未找到人员信息</p>;

          const personTreatments = treatments.filter(
            (t) => t.detaineeId === profileDetaineeId
          );
          const personUrineTests = urineTests.filter(
            (u) => u.detaineeId === profileDetaineeId
          );
          const personCounselings = counselings.filter(
            (c) => c.detaineeId === profileDetaineeId
          );
          const personAssessments = psychAssessments.filter(
            (p) => p.detaineeId === profileDetaineeId
          );
          const personTrainings = trainingRecords.filter(
            (t) => t.detaineeId === profileDetaineeId
          );
          const personViolations = violations.filter(
            (v) => v.detaineeId === profileDetaineeId
          );
          const personHealth = healthCheckups.filter(
            (h) => h.detaineeId === profileDetaineeId
          );
          const personDocs = documents.filter(
            (doc) => doc.detaineeId === profileDetaineeId
          );
          const personLevels = levelChanges.filter(
            (l) => l.detaineeId === profileDetaineeId
          );

          const avgProgress =
            personTreatments.length > 0
              ? Math.round(
                  personTreatments.reduce((s, t) => s + t.progress, 0) /
                    personTreatments.length
                )
              : 0;
          const avgPerformance =
            personTrainings.length > 0
              ? Math.round(
                  personTrainings.reduce((s, t) => s + t.performance, 0) /
                    personTrainings.length
                )
              : 0;
          const latestAssessment = [...personAssessments].sort(
            (a, b) => b.date.localeCompare(a.date)
          )[0];

          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-police-500 to-police-700 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-800">
                    {d.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">{d.id}</span>
                    <StatusBadge
                      type={
                        d.currentLevel === "一级"
                          ? "danger"
                          : d.currentLevel === "二级"
                          ? "warning"
                          : d.currentLevel === "三级"
                          ? "info"
                          : "success"
                      }
                    >
                      {d.currentLevel}
                    </StatusBadge>
                    <StatusBadge
                      type={
                        d.status === "正常"
                          ? "success"
                          : d.status === "治疗中"
                          ? "blue"
                          : d.status === "隔离"
                          ? "warning"
                          : "info"
                      }
                    >
                      {d.status}
                    </StatusBadge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">入所日期</p>
                  <p className="text-base font-semibold text-slate-800">
                    {d.admitDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-sm p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">
                    {personTreatments.length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">治疗记录</p>
                </div>
                <div className="bg-green-50 rounded-sm p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {personUrineTests.length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">尿检次数</p>
                </div>
                <div className="bg-purple-50 rounded-sm p-3 text-center">
                  <p className="text-2xl font-bold text-purple-700">
                    {personCounselings.length}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">心理咨询</p>
                </div>
                <div className="bg-orange-50 rounded-sm p-3 text-center">
                  <p className="text-2xl font-bold text-orange-700">
                    {personTrainings.length}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">训练记录</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card mb-0">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    生理脱毒
                  </h5>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">平均治疗进度</span>
                      <span className="font-medium text-slate-700">
                        {avgProgress}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">尿检阴性率</span>
                      <span className="font-medium text-health-600">
                        {personUrineTests.length > 0
                          ? (
                              (personUrineTests.filter(
                                (u) => u.result === "阴性"
                              ).length /
                                personUrineTests.length) *
                              100
                            ).toFixed(1) + "%"
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">体检次数</span>
                      <span className="font-medium text-slate-700">
                        {personHealth.length}次
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card mb-0">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    心理矫治
                  </h5>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">最新评估</span>
                      <span className="font-medium text-slate-700">
                        {latestAssessment
                          ? latestAssessment.scale.slice(0, 6)
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">风险等级</span>
                      <StatusBadge
                        type={
                          latestAssessment?.riskLevel === "高风险"
                            ? "danger"
                            : latestAssessment?.riskLevel === "中风险"
                            ? "warning"
                            : "success"
                        }
                      >
                        {latestAssessment?.riskLevel || "未评估"}
                      </StatusBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">咨询总时长</span>
                      <span className="font-medium text-slate-700">
                        {personCounselings.reduce(
                          (s, c) => s + c.duration,
                          0
                        )}{" "}
                        分钟
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card mb-0">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    康复训练
                  </h5>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">平均表现分</span>
                      <span className="font-medium text-slate-700">
                        {avgPerformance}分
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">体能训练</span>
                      <span className="font-medium text-slate-700">
                        {
                          personTrainings.filter(
                            (t) => t.type === "体能训练"
                          ).length
                        }{" "}
                        次
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">技能培训</span>
                      <span className="font-medium text-slate-700">
                        {
                          personTrainings.filter(
                            (t) => t.type === "技能培训"
                          ).length
                        }{" "}
                        次
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card mb-0">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    所内管理
                  </h5>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">违规记录</span>
                      <span
                        className={`font-medium ${
                          personViolations.length > 0
                            ? "text-warning-600"
                            : "text-slate-700"
                        }`}
                      >
                        {personViolations.length}次
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">等级变更</span>
                      <span className="font-medium text-slate-700">
                        {personLevels.length}次
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">当前等级</span>
                      <span className="font-medium text-police-600">
                        {d.currentLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {personDocs.length > 0 && (
                <div className="card mb-0">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    已生成文书
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {personDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-2.5 bg-slate-50 rounded-sm border border-slate-100"
                      >
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {doc.type}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {doc.generatedAt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </PageContainer>
  );
}
