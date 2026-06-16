import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Detainee,
  HealthCheckup,
  Treatment,
  UrineTest,
  Counseling,
  PsychAssessment,
  TrainingRecord,
  LevelChange,
  Violation,
  Visit,
  Education,
  Release,
  AftercareRecord,
} from "../types";
import {
  detainees as initialDetainees,
  healthCheckups as initialHealthCheckups,
  treatments as initialTreatments,
  urineTests as initialUrineTests,
  counselings as initialCounselings,
  psychAssessments as initialPsychAssessments,
  trainingRecords as initialTrainingRecords,
  levelChanges as initialLevelChanges,
  violations as initialViolations,
  visits as initialVisits,
  educations as initialEducations,
  releases as initialReleases,
  aftercareRecords as initialAftercareRecords,
} from "../data/mock";

interface StoreState {
  detainees: Detainee[];
  healthCheckups: HealthCheckup[];
  treatments: Treatment[];
  urineTests: UrineTest[];
  counselings: Counseling[];
  psychAssessments: PsychAssessment[];
  trainingRecords: TrainingRecord[];
  levelChanges: LevelChange[];
  violations: Violation[];
  visits: Visit[];
  educations: Education[];
  releases: Release[];
  aftercareRecords: AftercareRecord[];

  addDetainee: (detainee: Omit<Detainee, "id">) => void;
  updateDetainee: (id: string, updates: Partial<Detainee>) => void;
  addHealthCheckup: (checkup: Omit<HealthCheckup, "id">) => void;

  addTreatment: (treatment: Omit<Treatment, "id">) => void;
  addUrineTest: (test: Omit<UrineTest, "id">) => void;

  addCounseling: (counseling: Omit<Counseling, "id">) => void;
  addPsychAssessment: (assessment: Omit<PsychAssessment, "id">) => void;

  addTrainingRecord: (record: Omit<TrainingRecord, "id">) => void;

  addLevelChange: (change: Omit<LevelChange, "id">) => void;
  addViolation: (violation: Omit<Violation, "id">) => void;
  updateViolationStatus: (id: string, status: Violation["status"]) => void;
  addVisit: (visit: Omit<Visit, "id">) => void;
  updateVisitStatus: (id: string, status: Visit["status"]) => void;

  addEducation: (education: Omit<Education, "id">) => void;

  addRelease: (release: Omit<Release, "id">) => void;
  updateReleaseStatus: (id: string, status: Release["status"]) => void;
  addAftercareRecord: (record: Omit<AftercareRecord, "id">) => void;
}

const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")}`;
};

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      detainees: initialDetainees,
      healthCheckups: initialHealthCheckups,
      treatments: initialTreatments,
      urineTests: initialUrineTests,
      counselings: initialCounselings,
      psychAssessments: initialPsychAssessments,
      trainingRecords: initialTrainingRecords,
      levelChanges: initialLevelChanges,
      violations: initialViolations,
      visits: initialVisits,
      educations: initialEducations,
      releases: initialReleases,
      aftercareRecords: initialAftercareRecords,

      addDetainee: (detainee) =>
        set((state) => ({
          detainees: [...state.detainees, { ...detainee, id: generateId("D") }],
        })),

      updateDetainee: (id, updates) =>
        set((state) => ({
          detainees: state.detainees.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      addHealthCheckup: (checkup) =>
        set((state) => ({
          healthCheckups: [
            ...state.healthCheckups,
            { ...checkup, id: generateId("H") },
          ],
        })),

      addTreatment: (treatment) =>
        set((state) => ({
          treatments: [...state.treatments, { ...treatment, id: generateId("T") }],
        })),

      addUrineTest: (test) =>
        set((state) => ({
          urineTests: [...state.urineTests, { ...test, id: generateId("U") }],
        })),

      addCounseling: (counseling) =>
        set((state) => ({
          counselings: [
            ...state.counselings,
            { ...counseling, id: generateId("C") },
          ],
        })),

      addPsychAssessment: (assessment) =>
        set((state) => ({
          psychAssessments: [
            ...state.psychAssessments,
            { ...assessment, id: generateId("P") },
          ],
        })),

      addTrainingRecord: (record) =>
        set((state) => ({
          trainingRecords: [
            ...state.trainingRecords,
            { ...record, id: generateId("TR") },
          ],
        })),

      addLevelChange: (change) =>
        set((state) => ({
          levelChanges: [
            ...state.levelChanges,
            { ...change, id: generateId("LC") },
          ],
        })),

      addViolation: (violation) =>
        set((state) => ({
          violations: [
            ...state.violations,
            { ...violation, id: generateId("V") },
          ],
        })),

      updateViolationStatus: (id, status) =>
        set((state) => ({
          violations: state.violations.map((v) =>
            v.id === id ? { ...v, status } : v
          ),
        })),

      addVisit: (visit) =>
        set((state) => ({
          visits: [...state.visits, { ...visit, id: generateId("VI") }],
        })),

      updateVisitStatus: (id, status) =>
        set((state) => ({
          visits: state.visits.map((v) => (v.id === id ? { ...v, status } : v)),
        })),

      addEducation: (education) =>
        set((state) => ({
          educations: [
            ...state.educations,
            { ...education, id: generateId("E") },
          ],
        })),

      addRelease: (release) =>
        set((state) => ({
          releases: [...state.releases, { ...release, id: generateId("R") }],
        })),

      updateReleaseStatus: (id, status) =>
        set((state) => ({
          releases: state.releases.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      addAftercareRecord: (record) =>
        set((state) => ({
          aftercareRecords: [
            ...state.aftercareRecords,
            { ...record, id: generateId("A") },
          ],
        })),
    }),
    {
      name: "detox-center-storage",
    }
  )
);
