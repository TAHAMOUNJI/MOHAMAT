
export const tribunals = [
  { name: "المحكمة", sections: ["القسم المدني", "القسم العقاري", "القسم التجاري", "القسم الاجتماعي", "القسم الاستعجالي", "قسم شؤون الأسرة", "القسم الجزائي (الجنح)", "قسم الأحداث"] }
];

export const courtsOfAppeal = [
  { name: "مجلس القضاء", chambers: ["الغرفة المدنية", "الغرفة العقارية", "الغرفة التجارية", "الغرفة الاجتماعية", "الغرفة الاستعجالية", "غرفة شؤون الأسرة", "الغرفة الجزائية", "غرفة الأحداث"] }
];

export const supremeCourt = [
  { name: "المحكمة العليا", chambers: ["الغرفة المدنية", "الغرفة العقارية", "الغرفة التجارية والبحرية", "الغرفة الاجتماعية", "الغرفة الجنائية", "غرفة الجنح والمخالفات", "غرفة الأحداث", "غرفة شؤون الأسرة"] }
];

export const stateCouncil = [
  { name: "مجلس الدولة", chambers: ["الغرفة الأولى", "الغرفة الثانية", "الغرفة الثالثة", "الغرفة الرابعة", "الغرفة الخامسة", "الغرفة السادسة"] }
];

export const administrativeCourt = [
    { name: "المحكمة الإدارية", sections: ["الغرفة الأولى", "الغرفة الثانية", "الغرفة الثالثة", "الغرفة الرابعة", "الغرفة الخامسة"] }
];

export const administrativeCourtOfAppeal = [
    { name: "المحكمة الادارية للاستئناف", chambers: ["الغرفة الأولى", "الغرفة الثانية", "الغرفة الثالثة", "الغرفة الرابعة", "الغرفة الخامسة"] }
];

export const judicialBodies = {
  "المحكمة (Tribunal)": tribunals[0].sections,
  "مجلس القضاء (Cour d’appel)": courtsOfAppeal[0].chambers,
  "المحكمة العليا (Cour Suprême)": supremeCourt[0].chambers,
  "مجلس الدولة (Conseil d’État)": stateCouncil[0].chambers,
  "المحكمة الإدارية": administrativeCourt[0].sections,
  "المحكمة الادارية للاستئناف": administrativeCourtOfAppeal[0].chambers
};
