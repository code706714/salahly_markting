import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, H, W} from '../lib/theme';

/** خلفية flat متحركة. tone=rays للخطّاف (أشعة بتلف)، light للمشاهد العادية، dark للمشاهد التقيلة. */
export const Backdrop: React.FC<{tone?: 'light' | 'rays' | 'dark' | 'primary'}> = ({tone = 'light'}) => {
  const frame = useCurrentFrame();
  if (tone === 'rays' || tone === 'primary') {
    const n = 18;
    const cx = W / 2;
    const cy = 760;
    const R = 2000;
    const rot = frame * (tone === 'rays' ? 1.6 : 0.5);
    return (
      <AbsoluteFill style={{background: COLORS.primary}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <g transform={`rotate(${rot} ${cx} ${cy})`}>
            {Array.from({length: n}).map((_, i) => {
              const a0 = (i / n) * Math.PI * 2;
              const a1 = ((i + 0.5) / n) * Math.PI * 2;
              return (
                <path
                  key={i}
                  d={`M${cx} ${cy} L${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} Z`}
                  fill={COLORS.accent}
                  opacity={tone === 'rays' ? 0.28 : 0.14}
                />
              );
            })}
          </g>
        </svg>
      </AbsoluteFill>
    );
  }
  const bg = tone === 'dark' ? COLORS.dark : COLORS.background;
  const blob = tone === 'dark' ? COLORS.accent : COLORS.primary;
  return (
    <AbsoluteFill style={{background: bg}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <circle cx={W - 120 + Math.sin(frame * 0.03) * 30} cy={360 + Math.cos(frame * 0.04) * 24} r={330} fill={blob} opacity={0.1} />
        <circle cx={80 + Math.cos(frame * 0.035) * 30} cy={1050 + Math.sin(frame * 0.03) * 30} r={280} fill={COLORS.accent} opacity={0.14} />
        <rect x={0} y={1500} width={W} height={420} fill={tone === 'dark' ? '#26301f' : '#EDE4D3'} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={(i * 211 + frame * 0.6) % (W + 80) - 40} cy={200 + i * 150} r={10 + (i % 3) * 5} fill={COLORS.accent} opacity={0.35} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
