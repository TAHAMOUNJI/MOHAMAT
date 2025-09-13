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

export interface LegalText {
  id: string;
  title: string;
  category: LegalCategory;
  articleNumber?: string;
  content: string;
  publishDate: string;
  officialGazetteNumber?: string;
  officialGazetteUrl?: string;
  tags: string[];
  isActive: boolean;
  amendments?: Amendment[];
  createdAt: string;
  updatedAt: string;
}

export interface Amendment {
  id: string;
  originalTextId: string;
  amendmentDate: string;
  amendmentContent: string;
  officialGazetteNumber: string;
  description: string;
}

export interface PersonalNote {
  id: string;
  legalTextId: string;
  userId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  legalTextId: string;
  userId: string;
  createdAt: string;
}

export type LegalCategory = 
  | 'civil_law'
  | 'criminal_law'
  | 'administrative_law'
  | 'commercial_law'
  | 'constitution'
  | 'decrees_decisions'
  | 'family_law'
  | 'labor_law'
  | 'tax_law'
  | 'procedural_law';

export interface SearchFilters {
  category?: LegalCategory;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  articleNumber?: string;
  officialGazetteNumber?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_law' | 'amendment' | 'reminder' | 'system';
  isRead: boolean;
  createdAt: string;
  relatedLegalTextId?: string;
}