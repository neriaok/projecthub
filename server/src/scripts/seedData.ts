import { UserRole } from '../models/User';
import { RequestPriority, RequestStatus } from '../models/ProjectRequest';

export type SeedUserKey =
  | 'michal'
  | 'ori'
  | 'ronit'
  | 'daniel'
  | 'noa'
  | 'yossi'
  | 'tamar'
  | 'itay'
  | 'omer'
  | 'liat'
  | 'maya'
  | 'gal'
  | 'avi';

export interface SeedUser {
  key: SeedUserKey;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  manager: SeedUserKey | null;
}

export interface SeedRequest {
  title: string;
  description: string;
  requester: SeedUserKey;
  budget: number;
  priority: RequestPriority;
  status: RequestStatus;
  /** Offsets in days relative to the day the seed runs. */
  createdInDays: number;
  startInDays: number;
  endInDays: number;
  decidedInDays?: number;
  decisionNote?: string;
}

export const seedUsers: SeedUser[] = [
  { key: 'michal', name: 'מיכל לוי', email: 'michal.levi@telvora.co.il', role: 'pmo', department: 'משרד הפרויקטים', manager: null },
  { key: 'ori', name: 'אורי כהן', email: 'ori.cohen@telvora.co.il', role: 'manager', department: 'פיתוח', manager: 'michal' },
  { key: 'ronit', name: 'רונית אברהם', email: 'ronit.avraham@telvora.co.il', role: 'manager', department: 'תפעול', manager: 'michal' },
  { key: 'daniel', name: 'דניאל מזרחי', email: 'daniel.mizrahi@telvora.co.il', role: 'employee', department: 'פיתוח', manager: 'ori' },
  { key: 'noa', name: 'נועה פרץ', email: 'noa.peretz@telvora.co.il', role: 'employee', department: 'מערכות מידע', manager: 'ori' },
  { key: 'yossi', name: 'יוסי ביטון', email: 'yossi.biton@telvora.co.il', role: 'employee', department: 'רכש', manager: 'ronit' },
  { key: 'tamar', name: 'תמר גולן', email: 'tamar.golan@telvora.co.il', role: 'employee', department: 'פיתוח', manager: 'ori' },
  { key: 'itay', name: 'איתי שפירא', email: 'itay.shapira@telvora.co.il', role: 'employee', department: 'מערכות מידע', manager: 'ori' },
  { key: 'omer', name: 'עומר חדד', email: 'omer.hadad@telvora.co.il', role: 'employee', department: 'אבטחת מידע', manager: 'ori' },
  { key: 'liat', name: 'ליאת רוזן', email: 'liat.rosen@telvora.co.il', role: 'employee', department: 'שירות לקוחות', manager: 'ronit' },
  { key: 'maya', name: 'מאיה ברק', email: 'maya.barak@telvora.co.il', role: 'employee', department: 'כספים', manager: 'ronit' },
  { key: 'gal', name: 'גל שמעוני', email: 'gal.shimoni@telvora.co.il', role: 'employee', department: 'שיווק', manager: 'ronit' },
  { key: 'avi', name: 'אבי נחום', email: 'avi.nahum@telvora.co.il', role: 'employee', department: 'תפעול', manager: 'ronit' },
];

export const seedRequests: SeedRequest[] = [
  {
    title: 'הטמעת מערכת CRM למחלקת מכירות',
    description: 'בחירה והטמעה של מערכת CRM מבוססת ענן, כולל הסבת נתוני לקוחות קיימים, אינטגרציה למערכת הכספים והדרכת צוותי המכירות.',
    requester: 'noa', budget: 380000, priority: 'high', status: 'in-progress',
    createdInDays: -72, startInDays: -60, endInDays: 45, decidedInDays: -68,
    decisionNote: 'מאושר. יש לתאם מול מנהלת המכירות את לוח הזמנים להדרכות.',
  },
  {
    title: 'פורטל קליטת עובדים',
    description: 'פורטל אחיד לעובדים חדשים: טפסים דיגיטליים, הקצאת ציוד והרשאות, ומסלול היכרות לפי מחלקה.',
    requester: 'daniel', budget: 145000, priority: 'medium', status: 'pending',
    createdInDays: -2, startInDays: 14, endInDays: 120,
  },
  {
    title: 'אוטומציה לאישורי הזמנות רכש',
    description: 'תהליך אישור דיגיטלי להזמנות רכש לפי מדרג סכומים, עם התראות במייל ומעקב אחר סטטוס ההזמנה.',
    requester: 'yossi', budget: 92000, priority: 'high', status: 'pending',
    createdInDays: -1, startInDays: 7, endInDays: 75,
  },
  {
    title: 'שדרוג תשתית ה-CI/CD לענן',
    description: 'העברת תהליכי הבנייה והפריסה לסביבת ענן מנוהלת, כולל בדיקות אוטומטיות וסביבות Staging נפרדות.',
    requester: 'daniel', budget: 210000, priority: 'high', status: 'in-progress',
    createdInDays: -105, startInDays: -90, endInDays: -10, decidedInDays: -98,
    decisionNote: 'מאושר כחלק מתוכנית העבודה הרבעונית.',
  },
  {
    title: 'מעבר למערכת ניהול מלאי מבוססת ברקודים',
    description: 'החלפת ספירות המלאי הידניות במערכת סריקת ברקודים במחסן המרכזי ובשני מחסני הלוויין.',
    requester: 'ronit', budget: 265000, priority: 'high', status: 'approved',
    createdInDays: -50, startInDays: -30, endInDays: -5, decidedInDays: -44,
    decisionNote: 'מאושר. לוודא זמינות ספק הסורקים לפני תחילת הפרויקט.',
  },
  {
    title: 'החלפת מערכת הטלפוניה במוקד השירות',
    description: 'מעבר למרכזיית ענן עם ניתוב שיחות חכם, הקלטות ודוחות זמני המתנה למוקד השירות.',
    requester: 'ronit', budget: 180000, priority: 'medium', status: 'in-progress',
    createdInDays: -140, startInDays: -120, endInDays: -20, decidedInDays: -132,
    decisionNote: 'מאושר.',
  },
  {
    title: 'דשבורד ניהולי לנתוני מכירות',
    description: 'דשבורד יומי להנהלה עם נתוני מכירות, יעדים מול ביצוע ופילוח לפי אזורים.',
    requester: 'noa', budget: 68000, priority: 'medium', status: 'completed',
    createdInDays: -170, startInDays: -150, endInDays: -30, decidedInDays: -162,
    decisionNote: 'מאושר.',
  },
  {
    title: 'מערך גיבוי ושחזור לשרתי הייצור',
    description: 'הקמת גיבוי אוטומטי לאתר משני, כולל תרגול שחזור רבעוני ותיעוד נוהל התאוששות מאסון.',
    requester: 'ori', budget: 120000, priority: 'high', status: 'approved',
    createdInDays: -12, startInDays: 10, endInDays: 90, decidedInDays: -6,
    decisionNote: 'מאושר בעדיפות גבוהה. לשלב את צוות אבטחת המידע בשלב התכנון.',
  },
  {
    title: 'אפליקציית מובייל לנציגי שטח',
    description: 'אפליקציה לנציגי השטח לצפייה בפרטי לקוחות, עדכון ביקורים והזמנות בזמן אמת.',
    requester: 'daniel', budget: 320000, priority: 'medium', status: 'rejected',
    createdInDays: -35, startInDays: 30, endInDays: 200, decidedInDays: -30,
    decisionNote: 'לא נכלל בתקציב השנה. ניתן להגיש מחדש ברבעון הבא עם הערכת עלויות מפורטת.',
  },
  {
    title: 'מכרז ספקי ציוד משרדי לשנה הבאה',
    description: 'ניהול מכרז מסודר לבחירת ספקי ציוד משרדי ומתכלים, כולל השוואת הצעות וחוזי מסגרת.',
    requester: 'yossi', budget: 45000, priority: 'low', status: 'approved',
    createdInDays: -9, startInDays: 5, endInDays: 60, decidedInDays: -4,
    decisionNote: 'מאושר.',
  },
  {
    title: 'הטמעת מערכת ניהול חוזים דיגיטלית',
    description: 'ריכוז כל חוזי הספקים במערכת אחת עם התראות על חידושים, חתימה דיגיטלית ומעקב התחייבויות.',
    requester: 'yossi', budget: 110000, priority: 'medium', status: 'in-progress',
    createdInDays: -55, startInDays: -40, endInDays: 50, decidedInDays: -48,
    decisionNote: 'מאושר. לתאם מול היועץ המשפטי את תבניות החוזים.',
  },
  {
    title: 'שדרוג רשת ה-Wi-Fi במשרדים',
    description: 'החלפת נקודות הגישה בכל קומות המשרדים ופריסת רשת אורחים נפרדת.',
    requester: 'noa', budget: 75000, priority: 'low', status: 'completed',
    createdInDays: -125, startInDays: -100, endInDays: -60, decidedInDays: -118,
    decisionNote: 'מאושר.',
  },
  {
    title: 'אוטומציה לדוחות משמרות במחסן',
    description: 'הפקה אוטומטית של דוחות שיבוץ ונוכחות משמרות, במקום עדכון ידני בגיליונות.',
    requester: 'ronit', budget: 38000, priority: 'medium', status: 'pending',
    createdInDays: -3, startInDays: 20, endInDays: 80,
  },
  {
    title: 'פיתוח ממשק API לשותפים עסקיים',
    description: 'ממשק מאובטח שיאפשר לשותפים עסקיים לבדוק זמינות מלאי ולהעביר הזמנות ישירות למערכות החברה.',
    requester: 'ori', budget: 230000, priority: 'high', status: 'pending',
    createdInDays: -4, startInDays: 15, endInDays: 150,
  },
  {
    title: 'רכישת רישיונות לכלי ניטור אבטחה',
    description: 'רכישת רישיונות לכלי ניטור ואיתור אירועי אבטחה בתחנות הקצה ובשרתים.',
    requester: 'noa', budget: 56000, priority: 'low', status: 'rejected',
    createdInDays: -20, startInDays: 10, endInDays: 40, decidedInDays: -16,
    decisionNote: 'קיים רישיון ארגוני לכלי מקביל. יש לבדוק אם הוא עונה על הצורך לפני רכישה נוספת.',
  },

  // Pending decisions
  {
    title: 'מעבר לארכיטקטורת מיקרו-שירותים במערכת ההזמנות',
    description: 'פירוק מערכת ההזמנות המונוליטית לשירותים עצמאיים, כדי לקצר זמני פריסה ולאפשר גדילה בעומסי שיא.',
    requester: 'tamar', budget: 420000, priority: 'high', status: 'pending',
    createdInDays: -3, startInDays: 21, endInDays: 240,
  },
  {
    title: 'הטמעת Single Sign-On לכל מערכות הארגון',
    description: 'כניסה אחידה עם חשבון הארגון לכל המערכות הפנימיות, כולל אימות דו-שלבי וניהול הרשאות מרוכז.',
    requester: 'itay', budget: 165000, priority: 'high', status: 'pending',
    createdInDays: -5, startInDays: 14, endInDays: 110,
  },
  {
    title: 'מבדק חדירות שנתי ותוכנית הקשחה',
    description: 'מבדק חדירות חיצוני לאתר, לאפליקציות ולרשת הפנימית, ותוכנית עבודה לסגירת הממצאים.',
    requester: 'omer', budget: 88000, priority: 'high', status: 'pending',
    createdInDays: -1, startInDays: 10, endInDays: 55,
  },
  {
    title: "צ'אטבוט שירות לקוחות באתר ובוואטסאפ",
    description: "צ'אטבוט שעונה על שאלות נפוצות, בודק סטטוס הזמנה ומעביר לנציג אנושי כשצריך.",
    requester: 'liat', budget: 190000, priority: 'medium', status: 'pending',
    createdInDays: -6, startInDays: 30, endInDays: 150,
  },
  {
    title: 'מיתוג מחדש של אתר החברה',
    description: 'עיצוב מחדש של האתר בהתאם לשפת המותג החדשה, כולל שכתוב תוכן ושיפור ביצועים בנייד.',
    requester: 'gal', budget: 240000, priority: 'medium', status: 'pending',
    createdInDays: -2, startInDays: 25, endInDays: 140,
  },
  {
    title: 'מערכת לניהול צי רכבים',
    description: 'ניהול שיבוץ רכבי החברה, טיפולים, ביטוחים ודוחות שימוש במערכת אחת במקום גיליונות.',
    requester: 'ronit', budget: 135000, priority: 'low', status: 'pending',
    createdInDays: -8, startInDays: 30, endInDays: 120,
  },

  // Approved, not started yet
  {
    title: 'אוטומציה להתאמות בנקים',
    description: 'התאמה אוטומטית בין תנועות הבנק לרישומים בהנהלת החשבונות, עם טיפול בחריגים בלבד.',
    requester: 'maya', budget: 72000, priority: 'medium', status: 'approved',
    createdInDays: -20, startInDays: 7, endInDays: 90, decidedInDays: -15,
    decisionNote: 'מאושר. לשלב את רואה החשבון החיצוני בהגדרת כללי ההתאמה.',
  },
  {
    title: 'חיישני IoT לניטור טמפרטורה במחסן הקירור',
    description: 'פריסת חיישנים עם התראות בזמן אמת על חריגות טמפרטורה, ודוח רציפות קירור לכל משלוח.',
    requester: 'avi', budget: 158000, priority: 'high', status: 'approved',
    createdInDays: -25, startInDays: 3, endInDays: 100, decidedInDays: -18,
    decisionNote: 'מאושר בעדיפות גבוהה בעקבות דרישת הרגולציה.',
  },
  {
    title: 'מעבר לרישוי Microsoft 365 E5 לכלל העובדים',
    description: 'שדרוג הרישוי לחבילה שכוללת כלי אבטחה, ניהול מידע ותקשורת מתקדמים, והטמעה הדרגתית לפי מחלקות.',
    requester: 'itay', budget: 310000, priority: 'high', status: 'approved',
    createdInDays: -30, startInDays: 5, endInDays: 160, decidedInDays: -22,
    decisionNote: 'מאושר. לבצע בשני גלים ולתאם מול צוות אבטחת המידע.',
  },

  // In progress
  {
    title: 'פיתוח אפליקציית עובדים פנימית',
    description: 'אפליקציה לעדכונים ארגוניים, ספר טלפונים, בקשות חופשה וטפסים נפוצים.',
    requester: 'tamar', budget: 280000, priority: 'medium', status: 'in-progress',
    createdInDays: -95, startInDays: -75, endInDays: 45, decidedInDays: -88,
    decisionNote: 'מאושר. לתאם עם משאבי אנוש את סדר העדיפויות של הפיצ\'רים.',
  },
  {
    title: 'הטמעת מערכת SIEM לניטור אבטחה',
    description: 'איסוף לוגים מכל המערכות, חוקי התראה ומוקד ניטור, כחלק מעמידה בתקן אבטחת המידע.',
    requester: 'omer', budget: 360000, priority: 'high', status: 'in-progress',
    createdInDays: -120, startInDays: -100, endInDays: -8, decidedInDays: -110,
    decisionNote: 'מאושר. נדרש דיווח התקדמות דו-שבועי להנהלה.',
  },
  {
    title: 'מערכת CRM לניהול פניות שירות',
    description: 'ריכוז כל פניות הלקוחות מכל הערוצים, ניתוב אוטומטי לנציגים ומדדי זמן טיפול.',
    requester: 'liat', budget: 215000, priority: 'high', status: 'in-progress',
    createdInDays: -80, startInDays: -60, endInDays: 60, decidedInDays: -74,
    decisionNote: 'מאושר. לשלב עם פרויקט ה-CRM של מחלקת המכירות כדי למנוע כפילות.',
  },
  {
    title: 'קמפיין דיגיטלי להשקת קו מוצרים חדש',
    description: 'קמפיין ממומן ברשתות ובחיפוש, דפי נחיתה ומדידת המרות לאורך ההשקה.',
    requester: 'gal', budget: 145000, priority: 'medium', status: 'in-progress',
    createdInDays: -50, startInDays: -35, endInDays: 25, decidedInDays: -46,
    decisionNote: 'מאושר.',
  },
  {
    title: 'הטמעת מודול תקציב ותחזיות ב-ERP',
    description: 'בניית תקציב שנתי ותחזיות מתגלגלות בתוך מערכת ה-ERP, במקום קבצי Excel נפרדים לכל מחלקה.',
    requester: 'maya', budget: 290000, priority: 'high', status: 'in-progress',
    createdInDays: -140, startInDays: -115, endInDays: -14, decidedInDays: -130,
    decisionNote: 'מאושר. היעד: עבודה במודול לקראת תקציב השנה הבאה.',
  },
  {
    title: 'פורטל ספקים לניהול הצעות מחיר',
    description: 'פורטל שבו ספקים מגישים הצעות מחיר ומסמכים, ומחלקת הרכש משווה ומאשרת במקום אחד.',
    requester: 'daniel', budget: 175000, priority: 'medium', status: 'in-progress',
    createdInDays: -70, startInDays: -50, endInDays: 70, decidedInDays: -64,
    decisionNote: 'מאושר. לתאם את הדרישות מול יוסי ממחלקת הרכש.',
  },
  {
    title: 'אופטימיזציה של מסלולי הפצה',
    description: 'תכנון מסלולים אוטומטי לנהגי ההפצה לפי חלונות זמן ועומסי תנועה, להפחתת עלויות דלק.',
    requester: 'avi', budget: 98000, priority: 'medium', status: 'in-progress',
    createdInDays: -45, startInDays: -30, endInDays: 40, decidedInDays: -40,
    decisionNote: 'מאושר כפיילוט באזור המרכז.',
  },

  // Completed
  {
    title: 'מעבר שרתי הקבצים לענן',
    description: 'העברת שרתי הקבצים המקומיים לאחסון ענן מנוהל, כולל הרשאות, גיבוי וסנכרון.',
    requester: 'noa', budget: 230000, priority: 'high', status: 'completed',
    createdInDays: -300, startInDays: -270, endInDays: -150, decidedInDays: -292,
    decisionNote: 'מאושר.',
  },
  {
    title: 'שדרוג גרסת מסד הנתונים בייצור',
    description: 'שדרוג מסד הנתונים לגרסה נתמכת, בדיקות תאימות וחלון תחזוקה מתוכנן.',
    requester: 'tamar', budget: 60000, priority: 'high', status: 'completed',
    createdInDays: -210, startInDays: -190, endInDays: -160, decidedInDays: -205,
    decisionNote: 'מאושר. לבצע בסוף שבוע עם תוכנית חזרה לאחור.',
  },
  {
    title: 'הטמעת מערכת MDM לניהול מכשירים ניידים',
    description: 'ניהול מרכזי של טלפונים ומחשבים ניידים: מדיניות אבטחה, התקנת אפליקציות ונעילה מרחוק.',
    requester: 'itay', budget: 85000, priority: 'medium', status: 'completed',
    createdInDays: -260, startInDays: -240, endInDays: -190, decidedInDays: -251,
    decisionNote: 'מאושר.',
  },
  {
    title: 'סקר שביעות רצון אוטומטי לאחר כל פנייה',
    description: 'שליחת סקר קצר אוטומטית לאחר סגירת פנייה, ודוח חודשי לפי נציג וסוג פנייה.',
    requester: 'liat', budget: 32000, priority: 'low', status: 'completed',
    createdInDays: -230, startInDays: -210, endInDays: -185, decidedInDays: -224,
    decisionNote: 'מאושר.',
  },
  {
    title: 'דיגיטציה של תהליך החזרי הוצאות',
    description: 'הגשת החזרי הוצאות מהנייד עם צילום קבלה, אישור מנהל ותשלום אוטומטי במשכורת.',
    requester: 'maya', budget: 54000, priority: 'medium', status: 'completed',
    createdInDays: -330, startInDays: -300, endInDays: -240, decidedInDays: -322,
    decisionNote: 'מאושר.',
  },
  {
    title: 'מערכת לניהול לידים',
    description: 'קליטת לידים מכל ערוצי השיווק, ניקוד אוטומטי והעברה לאנשי המכירות.',
    requester: 'gal', budget: 120000, priority: 'medium', status: 'completed',
    createdInDays: -280, startInDays: -255, endInDays: -175, decidedInDays: -270,
    decisionNote: 'מאושר.',
  },
  {
    title: 'מעבר לליקוט קולי במחסן המרכזי',
    description: 'ליקוט מבוסס הנחיות קוליות לעובדי המחסן, לשיפור הדיוק ולהאצת הכנת ההזמנות.',
    requester: 'avi', budget: 195000, priority: 'high', status: 'completed',
    createdInDays: -360, startInDays: -330, endInDays: -220, decidedInDays: -350,
    decisionNote: 'מאושר.',
  },
  {
    title: 'קטלוג רכש דיגיטלי למחלקות',
    description: 'קטלוג פריטים מאושרים עם מחירי מסגרת, כך שמחלקות מזמינות ישירות בלי הצעת מחיר בכל פעם.',
    requester: 'yossi', budget: 48000, priority: 'low', status: 'completed',
    createdInDays: -190, startInDays: -170, endInDays: -120, decidedInDays: -184,
    decisionNote: 'מאושר.',
  },
  {
    title: 'הדרכת מודעות לאבטחת מידע לכלל העובדים',
    description: 'לומדה מקוונת, תרגול פישינג מבוקר ומדידת שיפור לאורך הרבעון.',
    requester: 'omer', budget: 40000, priority: 'medium', status: 'completed',
    createdInDays: -170, startInDays: -150, endInDays: -110, decidedInDays: -165,
    decisionNote: 'מאושר.',
  },

  // Rejected
  {
    title: 'החלפת מערכת ניהול הקוד',
    description: 'מעבר לפלטפורמה אחרת לניהול קוד ו-CI, כולל הסבת כל המאגרים וההרשאות.',
    requester: 'tamar', budget: 90000, priority: 'low', status: 'rejected',
    createdInDays: -60, startInDays: 20, endInDays: 90, decidedInDays: -55,
    decisionNote: 'הפלטפורמה הנוכחית עונה על הצורך. נחזור לנושא אחרי השלמת פרויקט ה-CI/CD.',
  },
  {
    title: 'הפקת סרט תדמית',
    description: 'הפקת סרט תדמית לאתר ולרשתות החברתיות, כולל צילומים באתרי החברה.',
    requester: 'gal', budget: 180000, priority: 'low', status: 'rejected',
    createdInDays: -40, startInDays: 30, endInDays: 90, decidedInDays: -36,
    decisionNote: 'לא בעדיפות לרבעון הקרוב. להגיש מחדש לאחר השקת האתר החדש.',
  },
  {
    title: 'רכישת מלגזות אוטונומיות',
    description: 'שתי מלגזות אוטונומיות לשינוע משטחים בין אזורי הקליטה והאחסון.',
    requester: 'avi', budget: 620000, priority: 'medium', status: 'rejected',
    createdInDays: -100, startInDays: -60, endInDays: 120, decidedInDays: -95,
    decisionNote: 'ההשקעה גבוהה ביחס לחיסכון הצפוי. לבחון חלופת ליסינג.',
  },
  {
    title: 'מוקד שירות במיקור חוץ בשעות הלילה',
    description: 'מענה טלפוני ללקוחות בשעות הלילה באמצעות ספק חיצוני, בהתאם לנהלי השירות של החברה.',
    requester: 'liat', budget: 260000, priority: 'medium', status: 'rejected',
    createdInDays: -130, startInDays: -100, endInDays: 260, decidedInDays: -124,
    decisionNote: "נעדיף לבחון קודם את הצ'אטבוט כמענה לשעות הלילה.",
  },
  {
    title: 'סביבת פיתוח מבוססת ענן לכל המפתחים',
    description: 'סביבות פיתוח מוכנות מראש בענן, כדי לקצר את זמן ההקמה של מפתח חדש ולאחד גרסאות.',
    requester: 'daniel', budget: 150000, priority: 'medium', status: 'rejected',
    createdInDays: -12, startInDays: 20, endInDays: 100, decidedInDays: -9,
    decisionNote: 'רעיון טוב, אבל מוקדם מדי. להתחיל בפיילוט קטן לצוות אחד ולהגיש מחדש עם תוצאות.',
  },
];
