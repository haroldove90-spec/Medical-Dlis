/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  ADMIN = 'Administrador',
  MEDICO = 'Médico',
  ESTETICA = 'Estética',
  RECEPCION = 'Recepción',
  PACIENTE = 'Paciente'
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  commission: number;
  services: number;
}

export interface Patient {
  id: string;
  name: string;
  lastVisit: string;
  service: string;
  email?: string;
  phone?: string;
  status?: string;
  sessions?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
}

export type Specialty = 'Cirugía General' | 'Medicina Estética' | 'Aparatología' | 'Podología';

export interface ClinicalRecordData {
  id: string;
  patientId: string;
  date: string;
  recordNumber: string;
  personalData: {
    fullName: string;
    age: number;
    dob: string;
    address: string;
    sex: string;
    phone: string;
    occupation: string;
    maritalStatus: string;
    education: string;
    email: string;
  };
  reasonForConsultation: {
    reason: string;
    firstSymptomDate: string;
    location: string;
    modifyingCircumstance: string;
    painType: string;
    intensity: number;
  };
  familyHistory: {
    diabetes: boolean;
    hypertension: boolean;
    hypotension: boolean;
    rheumatoidArthritis: boolean;
    heartDisease: boolean;
    osteoarticular: boolean;
    circulatory: boolean;
    dermatological: boolean;
    allergies: boolean;
    notes: string;
  };
  pathologicalHistory: {
    cardiovascular: boolean;
    pulmonary: boolean;
    renal: boolean;
    gastrointestinal: boolean;
    hematological: boolean;
    endocrine: boolean;
    mental: boolean;
    dermatological: boolean;
    neurological: boolean;
    metabolic: boolean;
    heartDisease: boolean;
    seizures: boolean;
    pacemaker: boolean;
    neuropathy: boolean;
    diabetes: boolean;
    cancer: boolean;
    hypertension: boolean;
    hypotension: boolean;
    hyperthyroidism: boolean;
    notes: string;
  };
  nonPathologicalHistory: {
    smoking: boolean;
    alcohol: boolean;
    drugs: boolean;
    flatFoot: boolean;
    cavusFoot: boolean;
    stress: boolean;
    polydisplasia: boolean;
    pregnancy: boolean;
    polyphagia: boolean;
    polyuria: boolean;
    tattoos: boolean;
    lactation: boolean;
    prosthesis: boolean;
    pacemaker: boolean;
    sport: boolean;
    sedentary: boolean;
    traumas: boolean;
    medications: boolean;
    allergies: boolean;
    gout: boolean;
    notes: string;
  };
  medications: {
    name: string;
    dosage: string;
    duration: string;
  }[];
}

export interface InformedConsent {
  id: string;
  patientId: string;
  clinicalRecordId?: string;
  date: string;
  patientData: {
    fullName: string;
    phone: string;
    email: string;
    age: number;
    sex: string;
    medicalHistory: string;
  };
  procedures: {
    nailCutting: boolean;
    callusRemoval: boolean;
    ingrownNail: boolean;
    antisepticCleaning: boolean;
    topicalApplication: boolean;
    complementaryProcedures: boolean;
  };
  alternative: 'none' | 'valuation' | 'alternative';
  signature: string; // Base64 signature
}

export interface ConsentClosure {
  id: string;
  patientId: string;
  date: string;
  patientName: string;
  location?: string;
  treatmentCompleted: string;
  observations: string;
  patientSignature: string;
  specialistSignature: string;
}

export interface PhysicalExploration {
  id: string;
  patientId: string;
  date: string;
  // 1. Visual Exploration (Block A & B)
  visualExploration: {
    [key: string]: { der: boolean; izq: boolean };
  };
  otherVisualObservations: string;
  // 2. Morphological
  footType: 'Egipcio' | 'Romano' | 'Griego' | 'Germánico' | 'Celta';
  stepType: 'Neutro' | 'Pronación' | 'Supinación';
  // 3. Manual/Instrumented
  manualExploration: {
    osteoarticular: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    temperature: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    capillaryRefill: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    tibialPulse: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    monofilament: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    tuningFork: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
    reflexHammer: { der: 'Normal' | 'Anormal'; izq: 'Normal' | 'Anormal' };
  };
  // 4. Diagnostics
  diagnostics: {
    biomechanical: string;
    dermatological: string;
    neurological: string;
    vascular: string;
  };
  // 5. Therapeutics & Reference
  reference: boolean;
  referenceTo: string;
  therapeuticPlan: string;
  // 6. Validation
  patientSignature: string;
  professionalName: string;
}

export type AppointmentCategory = Specialty;

export interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}
