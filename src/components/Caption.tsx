import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, baseText} from '../lib/theme';
import {Line} from '../lib/timing';

/** ترجمة كبيرة تحت: كلمة كلمة مع الصوت. حطها على مستوى الفيديو كله (برا المشاهد). */
export const Caption: React.FC<{lines: Line[]; bottom?: number}> = ({lines, bottom = 300}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = lines.find((l) => !l.noCaption && frame >= l.from - 2 && frame <= l.to + 8);
  if (!line) return null;

  const enter = interpolate(frame, [line.from - 2, line.from + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = interpolate(frame, [line.to + 2, line.to + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        padding: '34px 56px 40px',
        background: 'rgba(47,59,42,0.88)',
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 40}px)`,
        zIndex: 40,
      }}
    >
      <div
        style={{
          ...baseText,
          color: COLORS.white,
          fontSize: 72,
          lineHeight: 1.4,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: 20,
        }}
      >
        {line.words.map((w, i) => {
          const s = spring({frame: frame - w.from, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
          const active = frame >= w.from && (i === line.words.length - 1 || frame < line.words[i + 1].from);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: frame >= w.from ? 1 : 0, // الكلمة بتظهر وقت ما تتقال (المكان محجوز عشان السطر ميتنططش)
                transform: `scale(${frame >= w.from ? 0.7 + 0.3 * s : 0.7})`,
                color: active ? COLORS.accent : COLORS.white,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
      {line.note ? (
        <div style={{...baseText, fontWeight: 400, color: COLORS.background, fontSize: 38, lineHeight: 1.3, textAlign: 'center', marginTop: 6, opacity: interpolate(frame, [line.from + 6, line.from + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          {line.note}
        </div>
      ) : null}
    </div>
  );
};
