import React from 'react';
import {COLORS, baseText} from '../lib/theme';

/**
 * شارة جوجل بلاي (رسم بسيط بألوان البراند عشان ملهاش أزرق).
 * لو عايز الشارة الرسمية: نزّلها من Google Play Badges وبدّل المكوّن ده بـ <Img>.
 */
export const GooglePlayBadge: React.FC<{width?: number}> = ({width = 560}) => (
  <div
    style={{
      ...baseText,
      width,
      height: width * 0.3,
      background: COLORS.dark,
      border: `6px solid ${COLORS.white}`,
      borderRadius: width * 0.07,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: width * 0.05,
      boxSizing: 'border-box',
      color: COLORS.white,
    }}
  >
    <svg viewBox="0 0 100 100" width={width * 0.16} height={width * 0.16}>
      <path d="M14 6 L88 50 L14 94 Z" fill={COLORS.accent} stroke={COLORS.white} strokeWidth={6} strokeLinejoin="round" />
      <path d="M14 6 L58 50 L14 94 Z" fill={COLORS.primary} />
      <path d="M58 50 L88 50 L14 94 Z" fill={COLORS.white} opacity={0.85} />
    </svg>
    <div style={{textAlign: 'right', lineHeight: 1.05}}>
      <div style={{fontSize: width * 0.07, fontWeight: 400, opacity: 0.9}}>متاح على</div>
      <div style={{fontSize: width * 0.115, fontWeight: 700, direction: 'ltr'}}>Google Play</div>
    </div>
  </div>
);
