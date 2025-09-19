import { LegalCategory } from '../types';

export const legalCategories: Record<LegalCategory, { name: string; description: string; icon: string }> = {
  civil_law: {
    name: 'القانون المدني',
    description: 'القوانين المتعلقة بالحقوق والالتزامات المدنية',
    icon: '⚖️'
  },
  criminal_law: {
    name: 'القانون الجنائي',
    description: 'قوانين الجرائم والعقوبات',
    icon: '🔒'
  },
  administrative_law: {
    name: 'القانون الإداري',
    description: 'القوانين المنظمة للإدارة العامة',
    icon: '🏛️'
  },
  commercial_law: {
    name: 'القانون التجاري',
    description: 'قوانين التجارة والشركات',
    icon: '💼'
  },
  constitution: {
    name: 'الدستور الجزائري',
    description: 'النصوص الدستورية الأساسية',
    icon: '📜'
  },
  decrees_decisions: {
    name: 'المراسيم والقرارات',
    description: 'المراسيم التنفيذية والقرارات الوزارية',
    icon: '📋'
  },
  family_law: {
    name: 'قانون الأسرة',
    description: 'قوانين الزواج والطلاق والميراث',
    icon: '👨‍👩‍👧‍👦'
  },
  labor_law: {
    name: 'قانون العمل',
    description: 'قوانين العمل والضمان الاجتماعي',
    icon: '👷'
  },
  tax_law: {
    name: 'القانون الضريبي',
    description: 'قوانين الضرائب والرسوم',
    icon: '💰'
  },
  procedural_law: {
    name: 'قانون الإجراءات',
    description: 'قوانين الإجراءات المدنية والجزائية',
    icon: '📝'
  }
};

export const commonTags = [
  'عقود',
  'مسؤولية مدنية',
  'ملكية',
  'ميراث',
  'شركات',
  'جنح',
  'جنايات',
  'إجراءات',
  'استئناف',
  'نقض',
  'إداري',
  'ضرائب',
  'عمل',
  'أسرة',
  'تجاري',
  'عقاري',
  'دستوري'
];