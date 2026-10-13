export interface QuickLoginAccount {
  email: string;
  name: string;
  roleLabel: string;
}

export const config = {
  quickLogin: {
    enabled: import.meta.env.VITE_QUICK_LOGIN === 'true',
    password: import.meta.env.VITE_QUICK_LOGIN_PASSWORD ?? '',
    accounts: [
      { email: 'daniel.mizrahi@telvora.co.il', name: 'דניאל מזרחי', roleLabel: 'עובד' },
      { email: 'ori.cohen@telvora.co.il', name: 'אורי כהן', roleLabel: 'מנהל מחלקה' },
      { email: 'michal.levi@telvora.co.il', name: 'מיכל לוי', roleLabel: 'PMO' },
    ] satisfies QuickLoginAccount[],
  },
};

export default config;
