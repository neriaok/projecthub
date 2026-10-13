import { createLightTheme } from '@fluentui/react-components';
import type { BrandVariants, Theme } from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#02060d',
  20: '#0a1a30',
  30: '#0e2747',
  40: '#11325c',
  50: '#143e72',
  60: '#174a89',
  70: '#1a56a0',
  80: '#1f63b8',
  90: '#3a76c4',
  100: '#5589cf',
  110: '#6f9cd9',
  120: '#8ab0e2',
  130: '#a5c3ea',
  140: '#c0d7f2',
  150: '#dceaf8',
  160: '#f1f6fd',
};

const fontFamily = "'Assistant', 'Segoe UI', system-ui, sans-serif";

export const appTheme: Theme = {
  ...createLightTheme(brand),
  fontFamilyBase: fontFamily,
  fontFamilyNumeric: fontFamily,
  borderRadiusMedium: '8px',
  borderRadiusLarge: '12px',
  borderRadiusXLarge: '16px',
};
