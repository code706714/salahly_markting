import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../lib/theme';
import {useBounce} from '../lib/stage';

const D = COLORS.dark;

type P = {size?: number; left?: number; top?: number; delay?: number; rotate?: number; style?: React.CSSProperties};

const Wrap: React.FC<P & {children: React.ReactNode; vb: string; wobble?: number}> = ({size = 300, left, top, delay = 0, rotate = 0, style, children, vb, wobble = 0}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 8, 160);
  const abs = left !== undefined && top !== undefined;
  return (
    <svg
      viewBox={vb}
      width={size}
      style={{
        position: abs ? 'absolute' : undefined,
        left,
        top,
        overflow: 'visible',
        transform: `scale(${pop}) rotate(${rotate + Math.sin(frame * 0.5) * wobble}deg)`,
        ...style,
      }}
    >
      {children}
    </svg>
  );
};

/** مكيّف سبليت. broken=true: بيطلع دخان وبيرتعش، ولا: بيطلع تلج. */
export const AcUnit: React.FC<P & {broken?: boolean}> = ({broken = false, ...p}) => {
  const frame = useCurrentFrame();
  return (
    <Wrap {...p} vb="0 0 400 240" wobble={broken ? 2 : 0}>
      <rect x={10} y={10} width={380} height={150} rx={30} fill={COLORS.white} stroke={D} strokeWidth={8} />
      <rect x={34} y={110} width={332} height={26} rx={13} fill={COLORS.background} stroke={D} strokeWidth={6} />
      <circle cx={340} cy={50} r={9} fill={broken ? COLORS.primary : COLORS.accent} />
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame + i * 9) % 40) / 40;
        return broken ? (
          <circle key={i} cx={90 + i * 75} cy={150 - t * 70} r={18 + t * 22} fill={D} opacity={0.5 * (1 - t)} />
        ) : (
          <path
            key={i}
            d="M0 -16 V16 M-14 -8 L14 8 M-14 8 L14 -8"
            stroke={COLORS.accent}
            strokeWidth={7}
            strokeLinecap="round"
            transform={`translate(${90 + i * 75} ${160 + t * 70}) rotate(${t * 120})`}
            opacity={1 - t}
          />
        );
      })}
    </Wrap>
  );
};

export const Sun: React.FC<P> = (p) => {
  const frame = useCurrentFrame();
  return (
    <Wrap {...p} vb="-150 -150 300 300">
      <g transform={`rotate(${frame * 2})`}>
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={-8} y={-140} width={16} height={38} rx={8} fill={COLORS.accent} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r={86} fill={COLORS.accent} stroke={D} strokeWidth={8} />
      <path d="M-34 -6 Q-22 -22 -10 -6 M10 -6 Q22 -22 34 -6" stroke={D} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d="M-30 26 Q0 56 30 26" stroke={D} strokeWidth={8} strokeLinecap="round" fill="none" />
    </Wrap>
  );
};

export const ShieldCheck: React.FC<P> = (p) => (
  <Wrap {...p} vb="0 0 200 240">
    <path d="M100 8 L186 40 V116 Q186 190 100 232 Q14 190 14 116 V40 Z" fill={COLORS.accent} stroke={D} strokeWidth={10} strokeLinejoin="round" />
    <path d="M58 120 L90 154 L146 86" stroke={D} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Wrap>
);

export const Star: React.FC<P> = (p) => (
  <Wrap {...p} vb="-100 -100 200 200">
    <path
      d="M0 -90 L26 -30 L90 -26 L40 16 L56 80 L0 46 L-56 80 L-40 16 L-90 -26 L-26 -30 Z"
      fill={COLORS.accent}
      stroke={D}
      strokeWidth={9}
      strokeLinejoin="round"
    />
  </Wrap>
);

export const Wrench: React.FC<P & {fill?: string}> = ({fill = COLORS.white, ...p}) => (
  <Wrap {...p} vb="0 0 200 200">
    <path
      d="M150 18 a42 42 0 0 0 -52 52 L22 146 a16 16 0 0 0 22 22 L120 92 a42 42 0 0 0 52 -52 l-26 26 -26 -8 -8 -26 Z"
      fill={fill}
      stroke={D}
      strokeWidth={9}
      strokeLinejoin="round"
    />
  </Wrap>
);

export const Coin: React.FC<P & {label?: string}> = ({label = 'ج', ...p}) => (
  <Wrap {...p} vb="-100 -100 200 200">
    <circle r={88} fill={COLORS.accent} stroke={D} strokeWidth={9} />
    <circle r={62} fill="none" stroke={D} strokeWidth={5} strokeDasharray="10 8" />
    <text textAnchor="middle" y={26} fontSize={84} fontWeight={700} fill={D} fontFamily="inherit">
      {label}
    </text>
  </Wrap>
);

export const Burst: React.FC<P & {color?: string}> = ({color = COLORS.accent, ...p}) => {
  const frame = useCurrentFrame();
  return (
    <Wrap {...p} vb="-100 -100 200 200">
      <path
        d={Array.from({length: 24}, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = i % 2 ? 62 : 96;
          return `${i ? 'L' : 'M'}${Math.cos(a) * r} ${Math.sin(a) * r}`;
        }).join(' ') + ' Z'}
        fill={color}
        stroke={D}
        strokeWidth={7}
        strokeLinejoin="round"
        transform={`rotate(${frame * 2})`}
      />
    </Wrap>
  );
};
