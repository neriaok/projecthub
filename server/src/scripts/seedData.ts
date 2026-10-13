import { UserRole } from '../models/User';
import { RequestPriority, RequestStatus } from '../models/ProjectRequest';

export type SeedUserKey = 'michal' | 'ori' | 'ronit' | 'daniel' | 'noa' | 'yossi';

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
  { key: 'michal', name: 'מיכל לוי', email: 'michal.levi@telvora.co.il', role: 'pmo', department: 'PMO', manager: null },
  { key: 'ori', name: 'אורי כהן', email: 'ori.cohen@telvora.co.il', role: 'manager', department: 'פיתוח', manager: 'michal' },
  { key: 'ronit', name: 'רונית אברהם', email: 'ronit.avraham@telvora.co.il', role: 'manager', department: 'תפעול', manager: 'michal' },
  { key: 'daniel', name: 'דניאל מזרחי', email: 'daniel.mizrahi@telvora.co.il', role: 'employee', department: 'פיתוח', manager: 'ori' },
  { key: 'noa', name: 'נועה פרץ', email: 'noa.peretz@telvora.co.il', role: 'employee', department: 'מערכות מידע', manager: 'ori' },
  { key: 'yossi', name: 'יוסי ביטון', email: 'yossi.biton@telvora.co.il', role: 'employee', department: 'רכש', manager: 'ronit' },
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
];
