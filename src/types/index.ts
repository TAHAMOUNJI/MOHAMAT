export interface Opposition {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  documentType: 'id_card' | 'driving_license' | 'passport';
  documentNumber: string;
  documentIssueDate: string;
  wilaya: string;
  municipality: string;
  phoneNumber: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  documentType: 'id_card' | 'driving_license' | 'passport';
  documentNumber: string;
  documentIssueDate: string;
  wilaya: string;
  municipality: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  cases?: Case[];
  opposition?: Opposition;
}

export interface Case {
  id: string;
  clientId: string;
  caseNumber: string;
  sessionNumber: string;
  level: 'المحكمة (Tribunal)' | 'مجلس القضاء (Cour d’appel)' | 'المحكمة العليا (Cour Suprême)' | 'مجلس الدولة (Conseil d’État)';
  wilaya: string;
  court: string;
  section: string;
  subject: string;
  details: string;
  sessionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wilaya {
  id: string;
  name: string;
  municipalities: Municipality[];
}

export interface Municipality {
  id: string;
  name: string;
  wilayaId: string;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'client' | 'case';
  entityId: string;
  timestamp: string;
  details: string;
}