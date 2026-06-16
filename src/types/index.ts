export interface Detainee {
  id: string;
  name: string;
  idCard: string;
  gender: "男" | "女";
  birthDate: string;
  ethnicity: string;
  education: string;
  address: string;
  admitDate: string;
  durationMonths: number;
  currentLevel: "一级" | "二级" | "三级" | "四级";
  status: "正常" | "治疗中" | "隔离" | "待解除";
  avatar?: string;
}

export interface HealthCheckup {
  id: string;
  detaineeId: string;
  checkDate: string;
  height: number;
  weight: number;
  bloodPressure: string;
  heartRate: string;
  bloodType: string;
  infectiousDisease: boolean;
  dependenceLevel: 1 | 2 | 3 | 4;
  notes: string;
}

export interface Treatment {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  medication: string;
  dosage: string;
  vitalSigns: string;
  progress: number;
  doctor: string;
  notes: string;
}

export interface UrineTest {
  id: string;
  detaineeId: string;
  detaineeName: string;
  testDate: string;
  testType: string;
  result: "阴性" | "阳性";
  tester: string;
  notes: string;
}

export interface Counseling {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  counselor: string;
  topic: string;
  duration: number;
  mood: "稳定" | "焦虑" | "抑郁" | "愤怒" | "积极";
  summary: string;
}

export interface PsychAssessment {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  scale: string;
  score: number;
  riskLevel: "低风险" | "中风险" | "高风险";
  conclusion: string;
}

export interface TrainingRecord {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  type: "体能训练" | "技能培训";
  content: string;
  duration: number;
  performance: number;
  coach: string;
}

export interface LevelChange {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  fromLevel: string;
  toLevel: string;
  reason: string;
  approver: string;
}

export interface Violation {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  type: string;
  description: string;
  evidence: string;
  punishment: string;
  status: "待处理" | "处理中" | "已处理" | "申诉中";
}

export interface Visit {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  visitor: string;
  relation: string;
  visitType: "现场会见" | "远程会见";
  duration: number;
  notes: string;
  status: "待审批" | "已批准" | "已完成" | "已取消";
}

export interface Education {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  type: "思想教育" | "文化教育" | "职业技能";
  content: string;
  score: number;
  teacher: string;
}

export interface Release {
  id: string;
  detaineeId: string;
  detaineeName: string;
  releaseDate: string;
  assessmentResult: string;
  destination: string;
  contact: string;
  status: "待审批" | "已批准" | "已解除" | "衔接中";
}

export interface AftercareRecord {
  id: string;
  detaineeId: string;
  detaineeName: string;
  date: string;
  type: "社区对接" | "回访记录" | "复吸干预" | "帮扶救助";
  content: string;
  contact: string;
  result: string;
}
