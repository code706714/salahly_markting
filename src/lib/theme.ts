import {loadFont} from '@remotion/google-fonts/IBMPlexSansArabic';

export const COLORS = {
  primary: '#B8492C',
  dark: '#2F3B2A',
  accent: '#D69A2D',
  background: '#F7F2EA',
  white: '#FFFFFF',
} as const;

// ألوان طبيعية للبشرة والشعر فقط (مفيش أزرق)
export const SKINS = {
  light: '#EFC09A',
  medium: '#D9A06F',
  tan: '#BD7F4E',
} as const;
export const HAIR = '#3A2A1E';

const {fontFamily} = loadFont('normal', {weights: ['400', '700'], subsets: ['arabic', 'latin']});
export const FONT = fontFamily;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const baseText: React.CSSProperties = {
  fontFamily: FONT,
  direction: 'rtl',
  fontWeight: 700,
};
