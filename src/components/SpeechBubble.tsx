import React from 'react';
import {COLORS, baseText} from '../lib/theme';
import {useBounce} from '../lib/stage';

export type BubbleProps = {
  text: string;
  /** مكان الفقاعة (بكسل، من الزاوية العلوية الشمال للشاشة) */
  left: number;
  top: number;
  width?: number;
  fontSize?: number;
  /** الديل بيشاور على فين */
  tail?: 'bottom-left' | 'bottom-right' | 'bottom' | 'left' | 'right';
  variant?: 'light' | 'dark' | 'primary' | 'accent';
  delay?: number;
  rotate?: number;
};

const VARIANTS = {
  light: {bg: COLORS.white, fg: COLORS.dark},
  dark: {bg: COLORS.dark, fg: COLORS.white},
  primary: {bg: COLORS.primary, fg: COLORS.white},
  accent: {bg: COLORS.accent, fg: COLORS.dark},
} as const;

export const SpeechBubble: React.FC<BubbleProps> = ({
  text,
  left,
  top,
  width = 520,
  fontSize = 64,
  tail = 'bottom',
  variant = 'light',
  delay = 0,
  rotate = 0,
}) => {
  const pop = useBounce(delay, 8, 170);
  const {bg, fg} = VARIANTS[variant];
  const tailPos: React.CSSProperties = {
    'bottom': {bottom: -22, left: '50%', marginLeft: -20},
    'bottom-left': {bottom: -22, left: 70},
    'bottom-right': {bottom: -22, right: 70},
    'left': {left: -22, top: '50%', marginTop: -20},
    'right': {right: -22, top: '50%', marginTop: -20},
  }[tail];
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        transform: `scale(${pop}) rotate(${rotate}deg)`,
        transformOrigin: tail.startsWith('bottom') ? '50% 100%' : '50% 50%',
        opacity: Math.min(1, pop * 2.5),
      }}
    >
      <div
        style={{
          ...baseText,
          position: 'relative',
          background: bg,
          color: fg,
          fontSize,
          lineHeight: 1.25,
          textAlign: 'center',
          padding: '26px 34px',
          borderRadius: 44,
          border: `7px solid ${COLORS.dark}`,
          boxShadow: `0 10px 0 ${COLORS.dark}`,
        }}
      >
        {text}
        <div
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            background: bg,
            borderRight: `7px solid ${COLORS.dark}`,
            borderBottom: `7px solid ${COLORS.dark}`,
            transform: 'rotate(45deg)',
            ...tailPos,
          }}
        />
      </div>
    </div>
  );
};
