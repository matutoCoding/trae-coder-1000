import { User, FileText, Activity, Brain, Dumbbell, AlertTriangle } from "lucide-react";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { useAppStore } from "@/store/useAppStore";

interface PersonProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  detaineeId: string;
}

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
  } = useAppStore();

  const d = detainees.find((item) => item.id === detaineeId);

  if (!d) return null;

  const personTreatments = treatments.filter(
    (t) => t.detaineeId === detaineeId
  );
  const personUrineTests = urineTests.filter(
    (u) => u.detaineeId === detaineeId
  );
  const personCounselings = counselings.filter(
    (c) => c.detaineeId === detaineeId
  );
  const personAssessments = psychAssessments.filter(
    (p) => p.detaineeId === detaineeId
  );
  const personTrainings = trainingRecords.filter(
    (t) => t.detaineeId === detaineeId
  );
  const personViolations = violations.filter(
    (v) => v.detaineeId === detaineeId
  );
  const personHealth = healthCheckups.filter(
    (h) => h.detaineeId === detaineeId
  );
  const personDocs = documents.filter(
    (doc) => doc.detaineeId === detaineeId
  );
  const personLevels = levelChanges.filter(
    (l) => l.detaineeId === detaineeId
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

  const negativeRate =
    personUrineTests.length > 0
      ? (
          (personUrineTests.filter((u) => u.result === "阴性").length /
            personUrineTests.length) *
          100
        ).toFixed(1) + "%"
      : "-";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="个人戒治画像"
      width="max-w-3xl"
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
                    ? personTreatments.sort((a, b) =>
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
                      ? "text-warning-600"
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
                  {
                    personTrainings.filter((t) => t.type === "技能培训")
                      .length
                  }
                  次
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">最近训练</span>
                <span className="font-medium text-slate-700">
                  {personTrainings.length > 0
                    ? personTrainings.sort((a, b) =>
                        b.date.localeCompare(a.date)
                      )[0].date
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="card mb-0">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-warning-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                所内管理
              </h5>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">违规记录</span>
                <span
                  className={`font-medium ${
                    personViolations.length > 0
                      ? "text-red-600"
                      : "text-slate-700"
                  }`}
                >
                  {personViolations.length}次
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
              已生成文书
            </h5>
          </div>
          {personDocs.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {personDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {doc.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {doc.generatedAt}
                    </span>
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
      </div>
    </Modal>
  );
}
