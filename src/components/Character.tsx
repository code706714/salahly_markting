import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, HAIR, SKINS} from '../lib/theme';
import {useBounce} from '../lib/stage';

export type Mood = 'happy' | 'angry' | 'shocked' | 'worried';
export type Outfit = 'technician' | 'shirt' | 'hijab';
export type Gesture = 'none' | 'wave' | 'handsUp' | 'point' | 'hips' | 'adjust';

export type CharacterProps = {
  outfit?: Outfit;
  /** لون اللبس الأساسي */
  color?: string;
  /** لون الطرحة (outfit=hijab) أو الكاب (technician) */
  accessory?: string;
  skin?: string;
  mood?: Mood;
  /** الفم بيتحرك لما true (مرّر useSpeaking('man') مثلاً) */
  speaking?: boolean;
  gesture?: Gesture;
  mustache?: boolean;
  /** يبصّ ناحية اليمين (-1 = يمين الشاشة، 1 = شمال) */
  flip?: boolean;
  /** عرض الشخصية بالبكسل */
  width?: number;
  /** فريمات تأخير ظهور الـ pop */
  delay?: number;
  style?: React.CSSProperties;
};

const D = COLORS.dark;

const mouthSpec = {
  happy: {w: 44, curve: 22, hMax: 36},
  angry: {w: 38, curve: -16, hMax: 26},
  worried: {w: 34, curve: -9, hMax: 22},
  shocked: {w: 0, curve: 0, hMax: 0},
} as const;

export const Character: React.FC<CharacterProps> = ({
  outfit = 'shirt',
  color,
  accessory,
  skin = SKINS.medium,
  mood = 'happy',
  speaking = false,
  gesture = 'none',
  mustache = false,
  flip = false,
  width = 400,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, '');
  const pop = useBounce(delay);
  const bob = Math.sin((frame + delay) * 0.12) * 5;
  const squash = 1 + Math.sin((frame + delay) * 0.12) * 0.012;

  const bodyColor = color ?? (outfit === 'technician' ? D : outfit === 'hijab' ? COLORS.primary : COLORS.primary);
  const acc = accessory ?? (outfit === 'hijab' ? COLORS.accent : COLORS.primary);

  // رمشة كل ~ 3 ثواني
  const blinkPhase = (frame + delay * 3) % 95;
  const blink = blinkPhase < 4 ? 0.1 : 1;

  // حركة الفم: بتتغير بسرعة وقت الكلام
  const talk = speaking
    ? 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.95) * Math.cos(frame * 0.37 + 1))
    : 0;

  const eyeY = 232;
  const eyeRx = mood === 'shocked' ? 24 : 20;
  const eyeRy = (mood === 'shocked' ? 30 : mood === 'happy' ? 22 : 24) * blink;
  const pupilR = mood === 'shocked' ? 6 : mood === 'angry' ? 8 : 9;
  const pupilShift = mood === 'worried' ? Math.sin(frame * 0.1) * 5 : 0;

  // ---- cheeks / brows ----
  const brows = {
    happy: {l: 'M138 190 Q165 174 192 188', r: 'M262 190 Q235 174 208 188'},
    angry: {l: 'M136 176 L194 202', r: 'M264 176 L206 202'},
    shocked: {l: 'M138 178 Q165 158 192 176', r: 'M262 178 Q235 158 208 176'},
    worried: {l: 'M138 204 L194 184', r: 'M262 204 L206 184'},
  }[mood];

  // ---- mouth ----
  const my = 285;
  const spec = mouthSpec[mood];
  const h = spec.hMax * talk;
  let mouth: React.ReactNode;
  if (mood === 'shocked') {
    const ry = 18 + 16 * (speaking ? talk : 0.5);
    mouth = (
      <g>
        <ellipse cx={200} cy={my + 10} rx={22} ry={ry} fill={D} />
        <ellipse cx={200} cy={my + 10 + ry * 0.55} rx={13} ry={ry * 0.4} fill={COLORS.primary} />
      </g>
    );
  } else {
    const {w, curve} = spec;
    const wob = mood === 'worried' ? Math.sin(frame * 0.5) * 2 : 0;
    const topPath = `M${200 - w} ${my} Q200 ${my + 2 * curve + wob} ${200 + w} ${my}`;
    if (h < 3) {
      mouth = <path d={topPath} stroke={D} strokeWidth={9} strokeLinecap="round" fill="none" />;
    } else {
      const bottom = `Q200 ${my + 2 * (curve + h)} ${200 - w} ${my}`;
      const shape = `M${200 - w} ${my} Q200 ${my + 2 * curve} ${200 + w} ${my} ${bottom} Z`;
      mouth = (
        <g>
          <clipPath id={`m${uid}`}>
            <path d={shape} />
          </clipPath>
          <path d={shape} fill={D} />
          <g clipPath={`url(#m${uid})`}>
            <ellipse cx={200} cy={my + curve + h + 4} rx={w * 0.55} ry={h * 0.6} fill={COLORS.primary} />
            {mood === 'happy' && <rect x={200 - w * 0.7} y={my - 8} width={w * 1.4} height={Math.min(12, h)} fill={COLORS.white} />}
          </g>
          <path d={shape} stroke={D} strokeWidth={6} strokeLinejoin="round" fill="none" />
        </g>
      );
    }
  }

  // ---- gestures ----
  const sleeve = bodyColor;
  const handY = frame * 0.4;
  const arm = (d: string, hx: number, hy: number, rot = 0, ox = 0, oy = 0) => (
    <g transform={`rotate(${rot} ${ox} ${oy})`}>
      <path d={d} stroke={sleeve} strokeWidth={62} strokeLinecap="round" fill="none" />
      <path d={d} stroke={D} strokeWidth={0} fill="none" />
      <circle cx={hx} cy={hy} r={32} fill={skin} stroke={D} strokeWidth={6} />
    </g>
  );
  let arms: React.ReactNode = null;
  if (gesture === 'wave') {
    arms = arm('M305 405 Q372 380 360 290', 360, 272, Math.sin(handY) * 14, 305, 405);
  } else if (gesture === 'handsUp') {
    const j = Math.sin(frame * 1.4) * 3;
    arms = (
      <g transform={`translate(0 ${j})`}>
        {arm('M95 410 Q30 350 62 250', 62, 232)}
        {arm('M305 410 Q370 350 338 250', 338, 232)}
      </g>
    );
  } else if (gesture === 'adjust') {
    const k = Math.sin(frame * 0.35) * 4;
    arms = arm('M305 405 Q392 330 332 ' + (232 + k), 330, 214 + k);
  } else if (gesture === 'hips') {
    arms = (
      <g>
        {arm('M95 405 Q4 450 104 536', 108, 538)}
        {arm('M305 405 Q396 450 296 536', 292, 538)}
      </g>
    );
  } else if (gesture === 'point') {
    arms = arm('M305 405 Q360 400 392 340', 392, 322, Math.sin(handY) * 4, 305, 405);
  }

  // ---- torso ----
  const torso = (
    <g>
      <path d="M50 600 L50 450 Q50 372 135 355 L265 355 Q350 372 350 450 L350 600 Z" fill={bodyColor} stroke={D} strokeWidth={6} />
      {outfit === 'technician' && (
        <>
          <path d="M162 358 L200 415 L238 358 Z" fill={COLORS.background} stroke={D} strokeWidth={5} />
          <rect x={50} y={500} width={300} height={22} fill={COLORS.accent} />
          <rect x={222} y={440} width={58} height={48} rx={8} fill="none" stroke={COLORS.background} strokeWidth={5} />
          <circle cx={130} cy={450} r={18} fill={COLORS.accent} stroke={D} strokeWidth={4} />
          <path d="M122 450 l6 7 l12 -14" stroke={D} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {outfit === 'shirt' && (
        <>
          <path d="M165 356 L200 410 L158 420 Z" fill={COLORS.background} stroke={D} strokeWidth={5} strokeLinejoin="round" />
          <path d="M235 356 L200 410 L242 420 Z" fill={COLORS.background} stroke={D} strokeWidth={5} strokeLinejoin="round" />
          {[450, 500, 550].map((y) => (
            <circle key={y} cx={200} cy={y} r={7} fill={COLORS.background} />
          ))}
        </>
      )}
      {outfit === 'hijab' && (
        <path d="M95 360 Q200 430 305 360 L330 520 Q200 560 70 520 Z" fill={acc} stroke={D} strokeWidth={6} strokeLinejoin="round" />
      )}
    </g>
  );

  // ---- head gear ----
  let backHair: React.ReactNode = null;
  let frontGear: React.ReactNode = null;
  if (outfit === 'hijab') {
    backHair = (
      <path d="M92 250 Q88 112 200 106 Q312 112 308 250 Q314 345 268 392 L132 392 Q86 345 92 250 Z" fill={acc} stroke={D} strokeWidth={6} />
    );
    frontGear = (
      <path d="M118 238 Q124 150 200 146 Q276 150 282 238 Q250 166 200 164 Q150 166 118 238 Z" fill={acc} stroke={D} strokeWidth={6} strokeLinejoin="round" />
    );
  } else if (outfit === 'technician') {
    frontGear = (
      <g>
        <path d="M104 160 Q104 82 200 80 Q296 82 296 160 Z" fill={acc} stroke={D} strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={200} cy={158} rx={106} ry={15} fill={D} />
        <circle cx={200} cy={118} r={20} fill={COLORS.background} stroke={D} strokeWidth={4} />
        <path d="M190 118 h20 M200 108 v20" stroke={COLORS.primary} strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  } else {
    frontGear = (
      <path d="M114 232 Q108 128 200 124 Q292 128 286 232 Q272 170 200 166 Q128 170 114 232 Z" fill={HAIR} stroke={D} strokeWidth={6} strokeLinejoin="round" />
    );
  }

  const ears =
    outfit === 'hijab' ? null : (
      <>
        <circle cx={112} cy={240} r={19} fill={skin} stroke={D} strokeWidth={6} />
        <circle cx={288} cy={240} r={19} fill={skin} stroke={D} strokeWidth={6} />
      </>
    );

  const extras = (
    <>
      {mood === 'worried' && (
        <g transform={`translate(0 ${(frame % 30) * 0.8})`} opacity={1 - (frame % 30) / 40}>
          <path d="M300 178 Q318 208 300 222 Q282 208 300 178 Z" fill={COLORS.background} stroke={D} strokeWidth={5} />
        </g>
      )}
      {mood === 'angry' && (
        <g transform={`translate(0 ${Math.sin(frame * 0.7) * 3})`} stroke={COLORS.primary} strokeWidth={7} strokeLinecap="round" fill="none">
          <path d="M290 118 q14 -2 18 -16 M290 118 q-2 -14 -16 -18 M290 118 q14 2 18 16 M290 118 q-2 14 -16 18" />
        </g>
      )}
      {mood === 'shocked' && (
        <g stroke={COLORS.accent} strokeWidth={9} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(frame * 1.2)}>
          <path d="M80 100 l22 20 M200 36 v32 M320 100 l-22 20" />
        </g>
      )}
    </>
  );

  return (
    <div
      style={{
        width,
        height: (width * 600) / 400,
        transform: `translateY(${(1 - pop) * 140 + bob}px) scale(${(0.35 + 0.65 * pop) * (flip ? -1 : 1)}, ${(0.35 + 0.65 * pop) * squash})`,
        transformOrigin: '50% 100%',
        opacity: Math.min(1, pop * 3),
        // الجزء اللي تحت بيخفت عشان يدخل ورا الترجمة من غير حد قاطع
        WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
        ...style,
      }}
    >
      <svg viewBox="0 0 400 600" width="100%" height="100%" style={{overflow: 'visible'}}>
        {backHair}
        {torso}
        {/* رقبة */}
        <rect x={172} y={300} width={56} height={70} fill={skin} stroke={D} strokeWidth={6} />
        {ears}
        {/* راس */}
        <ellipse cx={200} cy={232} rx={90} ry={98} fill={skin} stroke={D} strokeWidth={6} />
        {frontGear}
        {/* خدود */}
        {(mood === 'happy' || mood === 'angry') && (
          <>
            <circle cx={128} cy={268} r={17} fill={COLORS.primary} opacity={mood === 'angry' ? 0.45 : 0.28} />
            <circle cx={272} cy={268} r={17} fill={COLORS.primary} opacity={mood === 'angry' ? 0.45 : 0.28} />
          </>
        )}
        {/* عيون */}
        {[165, 235].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={eyeY} rx={eyeRx} ry={Math.max(2, eyeRy)} fill={COLORS.white} stroke={D} strokeWidth={5} />
            <circle cx={cx + pupilShift} cy={eyeY + (mood === 'angry' ? 4 : 0)} r={pupilR * Math.min(1, blink + 0.2)} fill={D} />
          </g>
        ))}
        {/* حواجب */}
        <path d={brows.l} stroke={D} strokeWidth={11} strokeLinecap="round" fill="none" />
        <path d={brows.r} stroke={D} strokeWidth={11} strokeLinecap="round" fill="none" />
        {/* أنف */}
        <path d="M194 252 Q200 268 207 252" stroke={D} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.55} />
        {mouth}
        {mustache && (
          <path transform="translate(0 -10)" d="M200 270 Q176 258 150 274 Q166 292 200 276 Q234 292 250 274 Q224 258 200 270 Z" fill={HAIR} stroke={D} strokeWidth={4} strokeLinejoin="round" />
        )}
        {extras}
        {arms}
      </svg>
    </div>
  );
};
