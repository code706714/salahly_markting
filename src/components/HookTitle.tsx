import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, baseText, W} from '../lib/theme';
import {Sfx, useShake} from '../lib/stage';

/** نص كبير بيتخبط على الشاشة كلمة كلمة — للثانيتين الأولانين. */
export const HookTitle: React.FC<{
  text: string;
  top?: number;
  fontSize?: number;
  color?: string;
  /** الكلمات اللي تتلوّن accent (index) */
  hot?: number[];
}> = ({text, top = 250, fontSize = 168, color = COLORS.white, hot = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const shake = useShake(frame, 14, 16);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 40,
        width: W - 80,
        ...baseText,
        fontSize,
        lineHeight: 1.12,
        textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 34,
        transform: `translate(${shake}px, ${shake * 0.6}px)`,
      }}
    >
      {words.map((w, i) => {
        const d = 2 + i * 5;
        const s = spring({frame: frame - d, fps, config: {damping: 7, stiffness: 240, mass: 0.7}});
        const scale = interpolate(s, [0, 1], [3.2, 1]);
        return (
          <React.Fragment key={i}>
            <Sfx name="pop" at={d} volume={0.7} />
            <span
              style={{
                display: 'inline-block',
                color: hot.includes(i) ? COLORS.accent : color,
                opacity: frame >= d ? 1 : 0,
                transform: `scale(${scale}) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg)`,
                textShadow: `0 10px 0 ${COLORS.dark}, 0 0 0 ${COLORS.dark}`,
                WebkitTextStroke: `10px ${COLORS.dark}`,
                paintOrder: 'stroke fill',
              }}
            >
              {w}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
