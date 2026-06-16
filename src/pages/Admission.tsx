import { useState } from "react";
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
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { detainees } from "@/data/mock";

const tabs = [
  { id: "list", label: "收治人员列表" },
  { id: "register", label: "收治登记" },
  { id: "checkup", label: "入所体检" },
];

export default function Admission() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchText, setSearchText] = useState("");

  const filteredDetainees = detainees.filter(
    (d) =>
      d.name.includes(searchText) ||
      d.idCard.includes(searchText) ||
      d.id.includes(searchText)
  );

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
        data: [12, 18, 15, 22, 19, 25],
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

  return (
    <PageContainer
      title="人员收治"
      subtitle="戒毒人员收治登记、信息管理与入所体检评估"
      breadcrumbs={[{ label: "人员收治" }]}
      actions={
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          新增收治
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="在戒人员总数"
          value={detainees.length}
          icon={UserPlus}
          color="blue"
          trend={{ value: 8, label: "较上月" }}
        />
        <StatCard
          title="本月新增收治"
          value="25"
          icon={FileText}
          color="green"
          trend={{ value: 12, label: "环比" }}
        />
        <StatCard
          title="待体检人员"
          value="6"
          icon={Stethoscope}
          color="orange"
        />
        <StatCard
          title="已完成体检"
          value="2"
          icon={ClipboardCheck}
          color="purple"
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
                        placeholder="搜索..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="pl-9 pr-4 py-2 w-48 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-police-500"
                      />
                    </div>
                    <button className="btn-secondary">
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
          <div className="flex items-center gap-4 mb-6">
            {["基本信息", "收治依据", "审批确认"].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0
                      ? "bg-police-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm ${
                    index === 0 ? "text-police-600 font-medium" : "text-slate-500"
                  }`}
                >
                  {step}
                </span>
                {index < 2 && <div className="w-12 h-px bg-slate-200" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 text-center">
                <div className="w-32 h-40 mx-auto bg-slate-50 rounded-sm flex flex-col items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">证件照片</p>
                </div>
                <button className="btn-secondary w-full">
                  <Upload className="w-4 h-4" />
                  上传照片
                </button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <h4 className="section-title text-sm border-b pb-2">基本信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">姓名 *</label>
                  <input type="text" className="input" placeholder="请输入姓名" />
                </div>
                <div>
                  <label className="label">身份证号 *</label>
                  <input type="text" className="input" placeholder="请输入身份证号" />
                </div>
                <div>
                  <label className="label">性别 *</label>
                  <select className="select">
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
                <div>
                  <label className="label">出生日期</label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="label">民族</label>
                  <input type="text" className="input" placeholder="请输入民族" defaultValue="汉族" />
                </div>
                <div>
                  <label className="label">文化程度</label>
                  <select className="select">
                    <option>小学</option>
                    <option>初中</option>
                    <option>高中/中专</option>
                    <option>大专</option>
                    <option>本科及以上</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label">户籍地址</label>
                  <input type="text" className="input" placeholder="请输入户籍地址" />
                </div>
                <div>
                  <label className="label">入所日期 *</label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="label">戒毒期限（月）</label>
                  <input type="number" className="input" placeholder="请输入期限" defaultValue="24" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="btn-primary">
                  <FileText className="w-4 h-4" />
                  保存并下一步
                </button>
                <button className="btn-secondary">暂存草稿</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "checkup" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="section-title">体检项目</h3>
            <div className="space-y-3">
              {[
                { name: "身高体重检查", status: "completed", result: "身高175cm，体重68kg" },
                { name: "血压心率测量", status: "completed", result: "血压120/80mmHg，心率78次/分" },
                { name: "血液常规检测", status: "completed", result: "各项指标正常" },
                { name: "传染病筛查", status: "pending", result: "-" },
                { name: "毒品依赖评估", status: "pending", result: "-" },
                { name: "胸部X光检查", status: "pending", result: "-" },
                { name: "心电图检查", status: "pending", result: "-" },
              ].map((item, index) => (
                <div
                  key={index}
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
                      <p className="text-xs text-slate-500">{item.result}</p>
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
            <h3 className="section-title">依赖程度评估</h3>
            <div className="space-y-4">
              <div>
                <label className="label">吸毒史年限</label>
                <select className="select">
                  <option>1年以下</option>
                  <option>1-3年</option>
                  <option>3-5年</option>
                  <option>5年以上</option>
                </select>
              </div>
              <div>
                <label className="label">主要毒品类型</label>
                <select className="select">
                  <option>海洛因</option>
                  <option>冰毒</option>
                  <option>麻古</option>
                  <option>摇头丸</option>
                  <option>K粉</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="label">日均吸食量</label>
                <input type="text" className="input" placeholder="请输入日均吸食量" />
              </div>
              <div>
                <label className="label">吸食方式</label>
                <div className="flex gap-4 mt-2">
                  {["烟吸", "鼻吸", "口服", "注射"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">既往脱毒次数</label>
                <input type="number" className="input" placeholder="请输入次数" />
              </div>
              <div>
                <label className="label">评估意见</label>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder="请填写医生评估意见"
                />
              </div>
              <div className="flex gap-3">
                <button className="btn-primary">
                  <Stethoscope className="w-4 h-4" />
                  提交评估
                </button>
                <button className="btn-secondary">打印体检报告</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
