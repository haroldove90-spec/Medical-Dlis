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
}

export type Specialty = 'Cirugía General' | 'Medicina Estética' | 'Aparatología' | 'Podología';

export interface ClinicalRecordData {
  patientId: string;
  specialty: Specialty;
  medicalInfo?: {
    history: string;
    allergies: string;
    bloodType: string;
    surgicalNote: string;
  };
  aestheticInfo?: {
    parameters: string;
    sessionNumber: number;
    totalSessions: number;
  };
  images: string[];
}

export type AppointmentCategory = Specialty;

export interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}
