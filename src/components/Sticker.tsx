import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, W, baseText} from '../lib/theme';
import {useBounce} from '../lib/stage';

/** شريط ستيكر بيطلع فوق الشاشة (فريمات محلية في الـ Scene): أيقونة + نص. */
export const Sticker: React.FC<{from: number; to: number; text: string; children: React.ReactNode; top?: number; fontSize?: number}> = ({from, to, text, children, top = 40, fontSize = 64}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(from, 8, 190);
  const out = interpolate(frame, [to - 6, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute', left: 70, top, width: W - 140, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
        background: COLORS.white, border: `7px solid ${COLORS.dark}`, borderRadius: 75, boxShadow: `0 10px 0 ${COLORS.dark}`,
        transform: `scale(${pop * out}) rotate(${(1 - pop) * -6}deg)`, opacity: out, zIndex: 20,
      }}
    >
      <div style={{width: 110, height: 110, flex: 'none'}}>{children}</div>
      <span style={{...baseText, fontSize, color: COLORS.dark}}>{text}</span>
    </div>
  );
};
