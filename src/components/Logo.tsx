import React from 'react';
import {COLORS} from '../lib/theme';

/** شعار صلحلي: مربع مدوّر + مفتاح صنايعي + علامة توثيق. */
export const Logo: React.FC<{size?: number}> = ({size = 300}) => (
  <svg viewBox="0 0 300 300" width={size} height={size}>
    <rect x={10} y={10} width={280} height={280} rx={70} fill={COLORS.white} stroke={COLORS.dark} strokeWidth={10} />
    <rect x={34} y={34} width={232} height={232} rx={52} fill={COLORS.primary} />
    <g transform="translate(62 58) scale(0.88)">
      <path
        d="M150 18 a42 42 0 0 0 -52 52 L22 146 a16 16 0 0 0 22 22 L120 92 a42 42 0 0 0 52 -52 l-26 26 -26 -8 -8 -26 Z"
        fill={COLORS.white}
        stroke={COLORS.dark}
        strokeWidth={9}
        strokeLinejoin="round"
      />
    </g>
    <circle cx={214} cy={214} r={44} fill={COLORS.accent} stroke={COLORS.dark} strokeWidth={9} />
    <path d="M194 214 l14 15 l26 -30" stroke={COLORS.dark} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
