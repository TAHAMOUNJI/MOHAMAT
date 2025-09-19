import { LegalText } from '../types';

export const sampleLegalTexts: LegalText[] = [
  {
    id: '1',
    title: 'القانون المدني الجزائري',
    category: 'civil_law',
    articleNumber: 'المادة 124',
    content: 'كل عمل أيا كان يرتكبه المرء ويسبب ضررا للغير يلزم من كان سببا في حدوثه بالتعويض.',
    publishDate: '1975-09-26',
    officialGazetteNumber: '78',
    officialGazetteUrl: 'https://www.joradp.dz/JO1975/1975078.pdf',
    tags: ['مسؤولية مدنية', 'تعويض', 'ضرر'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'قانون الإجراءات المدنية والإدارية',
    category: 'procedural_law',
    articleNumber: 'المادة 13',
    content: 'يجب أن تكون الدعوى مقبولة، وأن يكون للمدعي مصلحة قائمة أو محتملة يقرها القانون.',
    publishDate: '2008-02-25',
    officialGazetteNumber: '21',
    officialGazetteUrl: 'https://www.joradp.dz/JO2008/2008021.pdf',
    tags: ['إجراءات', 'دعوى', 'مصلحة'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'قانون العقوبات',
    category: 'criminal_law',
    articleNumber: 'المادة 264',
    content: 'يعاقب بالحبس من سنتين إلى عشر سنوات كل من اختلس أو بدد أو احتجز بدون حق أو استعمل على وجه غير شرعي أموالا عمومية أو خاصة.',
    publishDate: '1966-06-08',
    officialGazetteNumber: '49',
    officialGazetteUrl: 'https://www.joradp.dz/JO1966/1966049.pdf',
    tags: ['اختلاس', 'أموال عمومية', 'عقوبات'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'الدستور الجزائري',
    category: 'constitution',
    articleNumber: 'المادة 34',
    content: 'تضمن الدولة عدم انتهاك حرمة المسكن. فلا تفتيش إلا بمقتضى القانون وفي إطار احترامه.',
    publishDate: '2020-12-30',
    officialGazetteNumber: '82',
    officialGazetteUrl: 'https://www.joradp.dz/JO2020/2020082.pdf',
    tags: ['دستور', 'حرمة المسكن', 'حقوق أساسية'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'قانون الأسرة',
    category: 'family_law',
    articleNumber: 'المادة 78',
    content: 'الطلاق حل الرابطة الزوجية، يتم بإرادة الزوج أو بتراضي الزوجين أو بطلب من الزوجة في حدود ما ورد في هذا القانون.',
    publishDate: '1984-06-09',
    officialGazetteNumber: '24',
    officialGazetteUrl: 'https://www.joradp.dz/JO1984/1984024.pdf',
    tags: ['طلاق', 'زواج', 'أسرة'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];