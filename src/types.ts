/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  ADMIN = 'Administrador',
  MEDICO = 'Médico',
  ESTETICA = 'Estética',
  RECEPCION = 'Recepción'
}

export interface Patient {
  id: string;
  name: string;
  lastVisit: string;
  service: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export type AppointmentCategory = 'Podología' | 'Cirugía General' | 'Medicina Estética';
