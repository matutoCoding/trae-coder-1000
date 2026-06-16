import { useMemo } from "react";
import {
  User,
  FileText,
  Activity,
  Brain,
  Dumbbell,
  AlertTriangle,
  Stethoscope,
  Pill,
  Beaker,
  MessageSquare,
  ClipboardList,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { useAppStore } from "@/store/useAppStore";

interface PersonProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  detaineeId: string;
}

type TimelineItem = {
  date: string;
  type: string;
  label: string;
  detail: string;
  icon: typeof Activity;
  color: string;
  extra?: string;
};

export default function PersonProfileModal({
  isOpen,
  onClose,
  detaineeId,
}: PersonProfileModalProps) {
  const {
    detainees,
    treatments,
    urineTests,
    counselings,
    psychAssessments,
    trainingRecords,
    violations,
    healthCheckups,
    documents,
    levelChanges,
    updateDocumentStatus,
  } = useAppStore();

  const d = detainees.find((item) => item.id === detaineeId);

  const personTreatments = useMemo(
    () => treatments.filter((t) => t.detaineeId === detaineeId),
    [treatments, detaineeId]
  );
  const personUrineTests = useMemo(
    () => urineTests.filter((u) => u.detaineeId === detaineeId),
    [urineTests, detaineeId]
  );
  const personCounselings = useMemo(
    () => counselings.filter((c) => c.detaineeId === detaineeId),
    [counselings, detaineeId]
  );
  const personAssessments = useMemo(
    () => psychAssessments.filter((p) => p.detaineeId === detaineeId),
    [psychAssessments, detaineeId]
  );
  const personTrainings = useMemo(
    () => trainingRecords.filter((t) => t.detaineeId === detaineeId),
    [trainingRecords, detaineeId]
  );
  const personViolations = useMemo(
    () => violations.filter((v) => v.detaineeId === detaineeId),
    [violations, detaineeId]
  );
  const personHealth = useMemo(
    () => healthCheckups.filter((h) => h.detaineeId === detaineeId),
    [healthCheckups, detaineeId]
  );
  const personDocs = useMemo(
    () => documents.filter((doc) => doc.detaineeId === detaineeId),
    [documents, detaineeId]
  );
  const personLevels = useMemo(
    () => levelChanges.filter((l) => l.detaineeId === detaineeId),
    [levelChanges, detaineeId]
  );

  const avgProgress = useMemo(
    () =>
      personTreatments.length > 0
        ? Math.round(
            personTreatments.reduce((s, t) => s + t.progress, 0) /
              personTreatments.length
          )
        : 0,
    [personTreatments]
  );

  const avgPerformance = useMemo(
    () =>
      personTrainings.length > 0
        ? Math.round(
            personTrainings.reduce((s, t) => s + t.performance, 0) /
              personTrainings.length
          )
        : 0,
    [personTrainings]
  );

  const latestAssessment = useMemo(
    () =>
      [...personAssessments].sort((a, b) => b.date.localeCompare(a.date))[0],
    [personAssessments]
  );

  const negativeRate = useMemo(
    () =>
      personUrineTests.length > 0
        ? (
            (personUrineTests.filter((u) => u.result === "阴性").length /
              personUrineTests.length) *
            100
          ).toFixed(1) + "%"
        : "-",
    [personUrineTests]
  );

  const timeline = useMemo(() => {
    if (!d) return [];
    const items: TimelineItem[] = [];

    items.push({
      date: d.admitDate,
      type: "收治",
      label: "入所收治",
      detail: `${d.name}入所，等级${d.currentLevel}，期限${d.durationMonths}个月`,
      icon: User,
      color: "bg-police-500",
    });

    personHealth.forEach((h) => {
      items.push({
        date: h.checkDate,
        type: "体检",
        label: "入所体检",
        detail: `血压${h.bloodPressure}，心率${h.heartRate}，血型${h.bloodType}`,
        icon: Stethoscope,
        color: "bg-blue-500",
        extra: h.infectiousDisease ? "传染病筛查阳性" : undefined,
      });
    });

    personTreatments.forEach((t) => {
      items.push({
        date: t.date,
        type: "治疗",
        label: `脱毒治疗 - ${t.medication}`,
        detail: `进度${t.progress}%，体征：${t.vitalSigns}`,
        icon: Pill,
        color: "bg-cyan-500",
      });
    });

    personUrineTests.forEach((u) => {
      items.push({
        date: u.testDate,
        type: "尿检",
        label: `${u.testType}检测`,
        detail: `结果：${u.result}`,
        icon: Beaker,
        color: u.result === "阳性" ? "bg-red-500" : "bg-green-500",
        extra: u.result === "阳性" ? "阳性" : undefined,
      });
    });

    personCounselings.forEach((c) => {
      items.push({
        date: c.date,
        type: "咨询",
        label: `心理咨询 - ${c.topic}`,
        detail: `时长${c.duration}分钟，情绪${c.mood}`,
        icon: MessageSquare,
        color: "bg-purple-500",
      });
    });

    personAssessments.forEach((a) => {
      items.push({
        date: a.date,
        type: "评估",
        label: `心理评估 - ${a.scale.slice(0, 8)}`,
        detail: `得分${a.score}，${a.riskLevel}`,
        icon: ClipboardList,
        color:
          a.riskLevel === "高风险"
            ? "bg-red-500"
            : a.riskLevel === "中风险"
            ? "bg-amber-500"
            : "bg-green-500",
        extra: a.riskLevel === "高风险" ? "高风险" : undefined,
      });
    });

    personTrainings.forEach((t) => {
      items.push({
        date: t.date,
        type: "训练",
        label: `${t.type} - ${t.content}`,
        detail: `表现${t.performance}分，教练${t.coach}`,
        icon: Dumbbell,
        color: "bg-orange-500",
      });
    });

    personViolations.forEach((v) => {
      items.push({
        date: v.date,
        type: "违规",
        label: `违规 - ${v.type}`,
        detail: `${v.description}，${v.status === "已处理" ? "已处理" : "待处理"}`,
        icon: AlertTriangle,
        color: v.status === "已处理" ? "bg-slate-400" : "bg-red-500",
        extra: v.status === "待处理" ? "未处理" : undefined,
      });
    });

    personDocs.forEach((doc) => {
      items.push({
        date: doc.generatedAt,
        type: "文书",
        label: doc.type,
        detail: `${doc.status}，${doc.summary.slice(0, 30)}...`,
        icon: FileText,
        color: "bg-indigo-500",
      });
    });

    personLevels.forEach((l) => {
      items.push({
        date: l.date,
        type: "分级",
        label: `等级调整 ${l.fromLevel} → ${l.toLevel}`,
        detail: l.reason,
        icon: TrendingUp,
        color: "bg-teal-500",
      });
    });

    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [
    d,
    personHealth,
    personTreatments,
    personUrineTests,
    personCounselings,
    personAssessments,
    personTrainings,
    personViolations,
    personDocs,
    personLevels,
  ]);

  const riskAssessment = useMemo(() => {
    if (!d) return { level: "低风险" as const, score: 0, suggestions: [] as string[] };

    let score = 0;
    const suggestions: string[] = [];

    const positiveUrine = personUrineTests.filter((u) => u.result === "阳性").length;
    if (positiveUrine > 0) {
      score += positiveUrine * 15;
      suggestions.push(`尿检阳性${positiveUrine}次，需加强监测频次`);
    }

    if (latestAssessment?.riskLevel === "高风险") {
      score += 25;
      suggestions.push("心理评估高风险，建议增加心理咨询频次并制定干预方案");
    } else if (latestAssessment?.riskLevel === "中风险") {
      score += 10;
      suggestions.push("心理评估中风险，保持定期心理咨询跟进");
    }

    const pendingViolations = personViolations.filter((v) => v.status === "待处理").length;
    if (pendingViolations > 0) {
      score += pendingViolations * 10;
      suggestions.push(`有${pendingViolations}条违规未处理，需及时处置`);
    }

    if (avgPerformance > 0 && avgPerformance < 60) {
      score += 10;
      suggestions.push("训练表现偏低，建议调整训练方案加强体能康复");
    }

    if (personTreatments.length > 0 && avgProgress < 50) {
      score += 5;
      suggestions.push("脱毒进度偏低，关注治疗依从性");
    }

    const level = score >= 30 ? "高风险" : score >= 15 ? "中风险" : "低风险";

    if (suggestions.length === 0) {
      suggestions.push("当前戒治状态良好，继续保持现有方案");
    }

    return { level, score, suggestions };
  }, [d, personUrineTests, latestAssessment, personViolations, avgPerformance, personTreatments, avgProgress]);

  const handleDocStatusChange = (docId: string, newStatus: "已打印" | "已签发") => {
    updateDocumentStatus(docId, newStatus);
  };

  if (!d) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="个人戒治画像"
      width="max-w-4xl"
      footer={
        <button className="btn-secondary" onClick={onClose}>
          关闭
        </button>
      }
    >
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
          <div
            className={`ml-4 px-4 py-3 rounded-sm text-center ${
              riskAssessment.level === "高风险"
                ? "bg-red-50 border border-red-200"
                : riskAssessment.level === "中风险"
                ? "bg-amber-50 border border-amber-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldAlert
                className={`w-4 h-4 ${
                  riskAssessment.level === "高风险"
                    ? "text-red-600"
                    : riskAssessment.level === "中风险"
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  riskAssessment.level === "高风险"
                    ? "text-red-700"
                    : riskAssessment.level === "中风险"
                    ? "text-amber-700"
                    : "text-green-700"
                }`}
              >
                综合风险
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                riskAssessment.level === "高风险"
                  ? "text-red-700"
                  : riskAssessment.level === "中风险"
                  ? "text-amber-700"
                  : "text-green-700"
              }`}
            >
              {riskAssessment.level}
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

        {riskAssessment.suggestions.length > 0 && (
          <div
            className={`p-4 rounded-sm ${
              riskAssessment.level === "高风险"
                ? "bg-red-50 border border-red-200"
                : riskAssessment.level === "中风险"
                ? "bg-amber-50 border border-amber-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert
                className={`w-4 h-4 ${
                  riskAssessment.level === "高风险"
                    ? "text-red-600"
                    : riskAssessment.level === "中风险"
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  riskAssessment.level === "高风险"
                    ? "text-red-700"
                    : riskAssessment.level === "中风险"
                    ? "text-amber-700"
                    : "text-green-700"
                }`}
              >
                处置建议
              </span>
            </div>
            <ul className="space-y-1.5">
              {riskAssessment.suggestions.map((s, i) => (
                <li
                  key={i}
                  className={`text-sm flex items-start gap-2 ${
                    riskAssessment.level === "高风险"
                      ? "text-red-700"
                      : riskAssessment.level === "中风险"
                      ? "text-amber-700"
                      : "text-green-700"
                  }`}
                >
                  <span className="mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="card mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                生理脱毒
              </h5>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">平均治疗进度</span>
                <span className="font-medium text-slate-700">
                  {avgProgress}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">尿检阴性率</span>
                <span className="font-medium text-green-600">
                  {negativeRate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">体检次数</span>
                <span className="font-medium text-slate-700">
                  {personHealth.length}次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">最近治疗</span>
                <span className="font-medium text-slate-700">
                  {personTreatments.length > 0
                    ? [...personTreatments].sort((a, b) =>
                        b.date.localeCompare(a.date)
                      )[0].date
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                心理矫治
              </h5>
            </div>
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
                <span
                  className={`font-medium ${
                    latestAssessment?.riskLevel === "高风险"
                      ? "text-red-600"
                      : latestAssessment?.riskLevel === "中风险"
                      ? "text-amber-600"
                      : "text-green-600"
                  }`}
                >
                  {latestAssessment?.riskLevel || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">咨询次数</span>
                <span className="font-medium text-slate-700">
                  {personCounselings.length}次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">评估次数</span>
                <span className="font-medium text-slate-700">
                  {personAssessments.length}次
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-0">
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="w-4 h-4 text-orange-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                康复训练
              </h5>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">平均表现</span>
                <span className="font-medium text-slate-700">
                  {avgPerformance}分
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">训练次数</span>
                <span className="font-medium text-slate-700">
                  {personTrainings.length}次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">技能培训</span>
                <span className="font-medium text-slate-700">
                  {personTrainings.filter((t) => t.type === "技能培训").length}次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">最近训练</span>
                <span className="font-medium text-slate-700">
                  {personTrainings.length > 0
                    ? [...personTrainings].sort((a, b) =>
                        b.date.localeCompare(a.date)
                      )[0].date
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-0">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                所内管理
              </h5>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">违规记录</span>
                <span
                  className={`font-medium ${
                    personViolations.length > 0 ? "text-red-600" : "text-slate-700"
                  }`}
                >
                  {personViolations.length}次
                  {personViolations.filter((v) => v.status === "待处理").length >
                    0 &&
                    `（${personViolations.filter((v) => v.status === "待处理").length}条未处理）`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">分级变动</span>
                <span className="font-medium text-slate-700">
                  {personLevels.length}次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">当前级别</span>
                <span className="font-medium text-slate-700">
                  {d.currentLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">在状态</span>
                <span className="font-medium text-slate-700">{d.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-0">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <h5 className="text-sm font-semibold text-slate-700">
              文书记录
            </h5>
          </div>
          {personDocs.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {personDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 truncate">
                      {doc.type}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {doc.generatedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge
                      type={
                        doc.status === "已签发"
                          ? "success"
                          : doc.status === "已打印"
                          ? "blue"
                          : "info"
                      }
                    >
                      {doc.status}
                    </StatusBadge>
                    {doc.status === "已生成" && (
                      <button
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleDocStatusChange(doc.id, "已打印")}
                      >
                        打印
                      </button>
                    )}
                    {doc.status === "已打印" && (
                      <button
                        className="text-xs text-green-600 hover:text-green-800 font-medium"
                        onClick={() => handleDocStatusChange(doc.id, "已签发")}
                      >
                        签发
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-3">
              暂无文书记录
            </p>
          )}
        </div>

        <div className="card mb-0">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-police-600" />
            <h5 className="text-sm font-semibold text-slate-700">
              戒治轨迹
            </h5>
            <span className="text-xs text-slate-400 ml-auto">
              共 {timeline.length} 条记录
            </span>
          </div>
          {timeline.length > 0 ? (
            <div className="max-h-80 overflow-y-auto pr-2">
              <div className="relative pl-6">
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-200" />
                {timeline.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="relative pb-4 last:pb-0">
                      <div
                        className={`absolute left-[-14px] w-5 h-5 rounded-full ${item.color} flex items-center justify-center`}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-slate-400">
                            {item.date}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${item.color} text-white`}
                          >
                            {item.type}
                          </span>
                          {item.extra && (
                            <span className="text-xs px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700 font-medium">
                              {item.extra}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              暂无戒治记录
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
