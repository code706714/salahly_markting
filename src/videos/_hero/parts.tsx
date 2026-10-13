import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SKINS, W, baseText} from '../../lib/theme';
import {Sfx, useBounce, useSpeaker} from '../../lib/stage';
import {Character} from '../../components/Character';
import {Star} from '../../components/Props';

export const D = COLORS.dark;
export const LINE = '#E4DCCB';
export const PAPER = '#FFFDF8';
export const arDigits = (n: number | string) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ============ الشخصيات ============ */
export const Heba: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={D} accessory={COLORS.accent} speaking={speaking} {...p} />;
};
export const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} color={D} accessory="#6b6f66" mustache speaking={speaking} {...p} />;
};

/* ============ شارة الميزة (نحاسي) ============ */
export const FeatureTag: React.FC<{text: string; top: number; delay?: number; left?: number; width?: number; fontSize?: number; from?: number; to?: number}> = ({text, top, delay = 0, left = 0, width = W, fontSize = 50, from = 0, to = 99999}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 8, 190);
  const out = interpolate(frame, [to - 6, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < from || frame > to) return null;
  return (
    <div style={{position: 'absolute', left, top, width, display: 'flex', justifyContent: 'center', zIndex: 20, transform: `scale(${pop * out})`, opacity: out}}>
      <div style={{...baseText, display: 'flex', alignItems: 'center', gap: 14, background: COLORS.accent, color: D, fontSize, padding: '10px 34px 14px', borderRadius: 60, border: `6px solid ${D}`, boxShadow: `0 8px 0 ${D}`}}>
        <svg viewBox="0 0 100 100" width={fontSize * 0.8} height={fontSize * 0.8}>
          <path d="M50 8 L62 38 L94 40 L69 60 L78 92 L50 74 L22 92 L31 60 L6 40 L38 38 Z" fill={COLORS.white} stroke={D} strokeWidth={7} strokeLinejoin="round" />
        </svg>
        {text}
      </div>
    </div>
  );
};

/* ============ الغسالة ============ */
export type WMState = 'broken' | 'happy' | 'cough';
export const WashingMachine: React.FC<{left: number; top: number; width?: number; state?: WMState; shake?: number; delay?: number}> = ({left, top, width = 520, state = 'broken', shake = 1, delay = 0}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 8, 160);
  const spin = state === 'happy' ? frame * 9 : frame * 14;
  const sx = state === 'broken' ? Math.sin(frame * 2.7) * 9 * shake : state === 'cough' ? (frame % 40 < 8 ? Math.sin(frame * 3) * 6 : 0) : Math.sin(frame * 0.4) * 2;
  const sy = state === 'broken' ? Math.cos(frame * 3.3) * 6 * shake : 0;
  const rot = state === 'broken' ? Math.sin(frame * 2.1) * 2.2 * shake : 0;
  const blob = (i: number, c: string) => {
    const a = (i / 6) * Math.PI * 2;
    return <ellipse key={i} cx={200 + Math.cos(a) * 52} cy={285 + Math.sin(a) * 52} rx={44} ry={30} transform={`rotate(${(a * 180) / Math.PI} ${200 + Math.cos(a) * 52} ${285 + Math.sin(a) * 52})`} fill={c} stroke={D} strokeWidth={3} />;
  };
  const cols = [COLORS.primary, COLORS.accent, '#F7F2EA', '#8D9A84', COLORS.primary, COLORS.accent];
  return (
    <svg
      viewBox="0 0 400 490"
      width={width}
      style={{position: 'absolute', left, top, overflow: 'visible', transform: `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${pop})`, transformOrigin: '50% 100%'}}
    >
      <rect x={20} y={20} width={360} height={440} rx={34} fill={COLORS.white} stroke={D} strokeWidth={8} />
      <path d="M20 54 Q20 20 54 20 H346 Q380 20 380 54 V108 H20 Z" fill={COLORS.background} stroke={D} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={78} cy={64} r={22} fill={COLORS.accent} stroke={D} strokeWidth={6} />
      <path d="M78 64 V48" stroke={D} strokeWidth={6} strokeLinecap="round" />
      <rect x={170} y={44} width={150} height={40} rx={12} fill={D} />
      <circle cx={196} cy={64} r={7} fill={state === 'happy' ? '#9BD08A' : COLORS.primary} />
      <rect x={216} y={58} width={80} height={12} rx={6} fill={COLORS.background} opacity={0.6} />
      <circle cx={200} cy={285} r={128} fill={COLORS.accent} stroke={D} strokeWidth={8} />
      <circle cx={200} cy={285} r={100} fill={D} stroke={D} strokeWidth={6} />
      <clipPath id="wmglass"><circle cx={200} cy={285} r={96} /></clipPath>
      <g clipPath="url(#wmglass)">
        <g transform={`rotate(${spin} 200 285)`}>{cols.map((c, i) => blob(i, c))}</g>
        <ellipse cx={156} cy={238} rx={46} ry={22} fill="#fff" opacity={0.18} transform="rotate(-35 156 238)" />
      </g>
      {state === 'happy' && (
        <g>
          <circle cx={165} cy={262} r={12} fill={D} stroke={COLORS.white} strokeWidth={5} />
          <circle cx={235} cy={262} r={12} fill={D} stroke={COLORS.white} strokeWidth={5} />
          <path d="M140 300 Q200 372 260 300 Q200 330 140 300 Z" fill={COLORS.white} stroke={D} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={128} cy={296} r={13} fill={COLORS.primary} opacity={0.55} />
          <circle cx={272} cy={296} r={13} fill={COLORS.primary} opacity={0.55} />
        </g>
      )}
      {state === 'broken' && (
        <g stroke={COLORS.white} strokeWidth={9} strokeLinecap="round" fill="none">
          <path d="M148 244 l30 30 M178 244 l-30 30 M222 244 l30 30 M252 244 l-30 30" />
          <path d="M150 326 q12 -18 25 0 q12 -18 25 0 q12 -18 25 0 q12 -18 25 0" />
        </g>
      )}
      {state === 'cough' && (
        <g stroke={COLORS.white} strokeWidth={9} strokeLinecap="round" fill="none">
          <path d="M146 262 q18 -16 36 0 M218 262 q18 -16 36 0" />
          <ellipse cx={200} cy={322} rx={16} ry={20} fill={COLORS.white} stroke="none" />
        </g>
      )}
      <rect x={52} y={460} width={52} height={22} rx={8} fill={D} />
      <rect x={296} y={460} width={52} height={22} rx={8} fill={D} />
    </svg>
  );
};

/** كحّة صغيرة: سحابة دخان + "كح". */
export const CoughPuff: React.FC<{left: number; top: number; from: number}> = ({left, top, from}) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  const loop = ((t % 46) + 46) % 46;
  if (t < 0) return null;
  const s = interpolate(loop, [0, 10, 30, 46], [0.2, 1, 1.3, 1.5]);
  const o = interpolate(loop, [0, 6, 30, 46], [0, 1, 0.7, 0]);
  return (
    <div style={{position: 'absolute', left, top, transform: `scale(${s})`, opacity: o}}>
      <svg viewBox="0 0 200 140" width={220}>
        <circle cx={60} cy={80} r={42} fill={COLORS.white} stroke={D} strokeWidth={6} />
        <circle cx={110} cy={60} r={52} fill={COLORS.white} stroke={D} strokeWidth={6} />
        <circle cx={150} cy={90} r={38} fill={COLORS.white} stroke={D} strokeWidth={6} />
        <rect x={50} y={70} width={110} height={50} fill={COLORS.white} />
        <text x={104} y={100} textAnchor="middle" fontSize={44} fontWeight={700} fill={D} fontFamily="inherit">كح</text>
      </svg>
    </div>
  );
};

/** رغوة بتطلع من الغسالة وتملى الشاشة. p: 0..1 */
export const Foam: React.FC<{p: number; originX: number; originY: number}> = ({p, originX, originY}) => {
  const frame = useCurrentFrame();
  const N = 70;
  return (
    <>
      {Array.from({length: N}).map((_, i) => {
        const start = (i / N) * 0.8;
        if (p < start) return null;
        const k = Math.min(1, (p - start) / 0.25);
        const ang = rnd(i) * Math.PI * 2;
        const dist = (60 + rnd(i + 9) * 760) * Math.min(1, 0.25 + p);
        const x = originX + Math.cos(ang) * dist * 1.1 + Math.sin(frame * 0.1 + i) * 8;
        const y = originY + Math.sin(ang) * dist * 0.95 - 120 * k - Math.abs(Math.sin(frame * 0.07 + i)) * 10;
        const r = (34 + rnd(i + 3) * 70) * (0.4 + 0.6 * k);
        return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff 0%, #F4F7F2 60%, #DDE5DA 100%)', border: `4px solid #C9D3C4`}} />;
      })}
    </>
  );
};

/** كومة غسيل. */
export const LaundryPile: React.FC<{left: number; top: number; width?: number; delay?: number}> = ({left, top, width = 420, delay = 0}) => {
  const pop = useBounce(delay, 9, 150);
  return (
    <svg viewBox="0 0 400 260" width={width} style={{position: 'absolute', left, top, overflow: 'visible', transform: `scale(${pop})`, transformOrigin: '50% 100%'}}>
      <ellipse cx={200} cy={240} rx={190} ry={20} fill={D} opacity={0.15} />
      <path d="M20 230 Q10 120 110 100 Q150 40 230 70 Q330 50 360 140 Q392 200 380 230 Z" fill={COLORS.primary} stroke={D} strokeWidth={7} strokeLinejoin="round" />
      <path d="M60 210 Q70 140 140 130 Q190 90 250 120 Q320 120 340 180 Q350 205 345 224 Z" fill={COLORS.accent} stroke={D} strokeWidth={7} strokeLinejoin="round" />
      <path d="M120 215 Q130 170 190 165 Q240 140 280 175 Q310 190 300 218 Z" fill={COLORS.background} stroke={D} strokeWidth={7} strokeLinejoin="round" />
      <path d="M150 60 q10 -30 40 -20 l-8 38 z" fill="#8D9A84" stroke={D} strokeWidth={6} strokeLinejoin="round" />
      <path d="M300 82 q30 -34 60 -6 l-34 26 z" fill={COLORS.white} stroke={D} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};

/* ============ سحابة التفكير ============ */
export const ThoughtCloud: React.FC<{left: number; top: number; width: number; delay?: number; popAt?: number; children?: React.ReactNode}> = ({left, top, width, delay = 0, popAt = 99999, children}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 9, 150);
  const burst = interpolate(frame, [popAt, popAt + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = pop * (1 + burst * 0.55);
  const op = 1 - burst;
  const h = (width * 420) / 600;
  return (
    <div style={{position: 'absolute', left, top, width, height: h, transform: `scale(${scale})`, opacity: op, transformOrigin: '50% 80%'}}>
      <svg viewBox="0 0 600 420" width={width} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path
          d="M170 330 C95 335 50 285 80 235 C32 200 62 120 135 128 C150 52 258 38 306 98 C372 56 472 90 466 168 C542 180 552 280 488 314 C508 380 420 410 368 376 C326 418 232 412 202 360 C190 352 178 344 170 330 Z"
          fill={COLORS.white}
          stroke={D}
          strokeWidth={9}
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </div>
  );
};
export const ThoughtTail: React.FC<{points: Array<[number, number, number]>; delay?: number; popAt?: number}> = ({points, delay = 0, popAt = 99999}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [popAt, popAt + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      {points.map(([x, y, r], i) => {
        const s = spring({frame: frame - delay - i * 4, fps: 30, config: {damping: 9, stiffness: 190}});
        return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: COLORS.white, border: `7px solid ${D}`, boxSizing: 'border-box', transform: `scale(${s})`, opacity: op}} />;
      })}
    </>
  );
};

/** ختم أحمر بيخبط. */
export const Stamp: React.FC<{text: string; left: number; top: number; width: number; from: number; fontSize?: number; rotate?: number}> = ({text, left, top, width, from, fontSize = 112, rotate = -9}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - from, fps: 30, config: {damping: 7, stiffness: 260, mass: 0.7}});
  if (frame < from) return null;
  const scale = interpolate(s, [0, 1], [3.4, 1]);
  return (
    <>
      <Sfx name="buzzer" at={from} volume={0.7} />
      <div style={{position: 'absolute', left, top, width, display: 'flex', justifyContent: 'center', transform: `scale(${scale}) rotate(${rotate}deg)`, opacity: Math.min(1, s * 3)}}>
        <div style={{...baseText, fontSize, lineHeight: 1.1, color: COLORS.primary, border: `14px solid ${COLORS.primary}`, borderRadius: 30, padding: '8px 36px 14px', background: 'rgba(255,255,255,0.9)', boxShadow: `0 0 0 6px rgba(184,73,44,0.18)`}}>{text}</div>
      </div>
    </>
  );
};

/* ============ أقسام الخدمات ============ */
const CAT_ICONS: Record<string, React.ReactNode> = {
  'تكييف': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><g stroke={COLORS.primary} strokeWidth={8} strokeLinecap="round"><path d="M50 12 V88 M17 31 L83 69 M83 31 L17 69" /></g><circle cx={50} cy={50} r={9} fill={COLORS.primary} /></svg>
  ),
  'سباكة': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 10 C50 10 20 46 20 64 C20 82 34 92 50 92 C66 92 80 82 80 64 C80 46 50 10 50 10 Z" fill={COLORS.accent} stroke={D} strokeWidth={6} strokeLinejoin="round" /><path d="M36 64 q2 12 14 14" stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" fill="none" /></svg>
  ),
  'كهربا': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M58 8 L24 56 H46 L38 92 L76 40 H54 Z" fill={COLORS.accent} stroke={D} strokeWidth={6} strokeLinejoin="round" /></svg>
  ),
  'غسالات': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><rect x={14} y={8} width={72} height={84} rx={12} fill={COLORS.white} stroke={D} strokeWidth={6} /><circle cx={50} cy={58} r={24} fill={COLORS.accent} stroke={D} strokeWidth={6} /><circle cx={50} cy={58} r={14} fill={D} /><circle cx={30} cy={22} r={5} fill={COLORS.primary} /></svg>
  ),
  'تلاجات': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><rect x={24} y={6} width={52} height={88} rx={10} fill={COLORS.white} stroke={D} strokeWidth={6} /><path d="M24 38 H76" stroke={D} strokeWidth={6} /><path d="M34 20 V30 M34 48 V64" stroke={D} strokeWidth={6} strokeLinecap="round" /></svg>
  ),
  'نجارة': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><rect x={42} y={30} width={14} height={62} rx={5} fill={COLORS.primary} stroke={D} strokeWidth={5} transform="rotate(-25 49 61)" /><path d="M20 24 H70 Q78 24 78 32 V38 H26 Q18 38 18 30 Z" fill={COLORS.accent} stroke={D} strokeWidth={5} strokeLinejoin="round" transform="rotate(-25 49 31)" /></svg>
  ),
  'دش': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M16 56 A40 40 0 0 1 56 16 Z" fill={COLORS.white} stroke={D} strokeWidth={6} strokeLinejoin="round" /><path d="M16 56 Q50 70 56 16" fill={COLORS.accent} stroke={D} strokeWidth={6} /><path d="M36 38 L62 62 M62 62 V90 M46 92 H78" stroke={D} strokeWidth={7} strokeLinecap="round" fill="none" /><circle cx={64} cy={36} r={6} fill={COLORS.primary} /></svg>
  ),
  'ألوميتال': (
    <svg viewBox="0 0 100 100" width="100%" height="100%"><rect x={14} y={14} width={72} height={72} rx={6} fill="#EFE6D2" stroke={D} strokeWidth={6} /><path d="M50 14 V86 M14 50 H86" stroke={D} strokeWidth={6} /><path d="M24 24 L40 40" stroke={COLORS.white} strokeWidth={5} strokeLinecap="round" /></svg>
  ),
};
export const CATEGORIES = ['تكييف', 'سباكة', 'كهربا', 'غسالات', 'تلاجات', 'نجارة', 'دش', 'ألوميتال'];

export const CategoryGrid: React.FC<{top: number; selected: string; selectAt: number; exitAt: number; step?: number}> = ({top, selected, selectAt, exitAt, step = 4}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [exitAt, exitAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const picked = frame >= selectAt;
  return (
    <div style={{position: 'absolute', left: 52, top: top - exit * 700, width: W - 104, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, direction: 'rtl', opacity: 1 - exit * 0.6}}>
      {CATEGORIES.map((c, i) => {
        const s = spring({frame: frame - (2 + i * step), fps: 30, config: {damping: 8, stiffness: 190}});
        const isSel = c === selected;
        const hot = isSel && picked;
        const dim = picked && !isSel;
        const ss = hot ? 1.1 + Math.sin(frame * 0.5) * 0.02 : 1;
        return (
          <React.Fragment key={c}>
            <Sfx name="pop" at={2 + i * step} volume={0.35} />
            <div style={{...baseText, height: 270, borderRadius: 40, background: hot ? COLORS.accent : COLORS.white, border: `7px solid ${D}`, boxShadow: `0 10px 0 ${D}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: D, fontSize: 46, transform: `scale(${s * ss})`, opacity: dim ? 0.4 : Math.min(1, s * 3), position: 'relative', zIndex: hot ? 2 : 1}}>
              <div style={{width: 130, height: 130}}>{CAT_ICONS[c]}</div>
              {c}
              {hot && (
                <svg viewBox="0 0 100 100" width={70} height={70} style={{position: 'absolute', top: -26, left: -20}}>
                  <circle cx={50} cy={50} r={44} fill={COLORS.primary} stroke={D} strokeWidth={7} />
                  <path d="M28 52 L44 68 L74 34" stroke={COLORS.white} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ============ شاشات حقيقية جوه موبايل ============ */
export const Shot: React.FC<{src: string; pos?: number; opacity?: number}> = ({src, pos = 0, opacity = 1}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${pos * 100}%`, opacity}} />
);

export const Hl: React.FC<{x: number; y: number; w: number; h: number; from: number; to?: number}> = ({x, y, w, h, from, to = 99999}) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  if (t < 0 || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, border: `7px solid ${COLORS.accent}`, borderRadius: 26,
        boxShadow: `0 0 0 ${6 + Math.abs(Math.sin(t * 0.25)) * 14}px rgba(214,154,45,0.35)`,
        transform: `scale(${interpolate(t, [0, 6, 10], [1.4, 0.97, 1], {extrapolateRight: 'clamp'})})`, opacity: Math.min(1, t / 4),
      }}
    />
  );
};

export const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** كارت واتساب بيطير. */
export const WhatsAppCard: React.FC<{left: number; top: number; from: number; text: string; sub?: string}> = ({left, top, from, text, sub}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - from, fps: 30, config: {damping: 9, stiffness: 150}});
  if (frame < from) return null;
  return (
    <div style={{...baseText, position: 'absolute', left, top, width: 380, transform: `translateX(${(1 - s) * 500}px) rotate(${(1 - s) * 8}deg)`, opacity: Math.min(1, s * 3), zIndex: 10}}>
      <Sfx name="ding" at={from} volume={0.55} />
      <div style={{background: '#25D366', color: D, borderRadius: 30, border: `6px solid ${D}`, boxShadow: `0 8px 0 ${D}`, padding: '16px 22px', fontSize: 34, lineHeight: 1.25}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, marginBottom: 6}}>
          <svg viewBox="0 0 100 100" width={34} height={34}><path d="M50 8 C26 8 8 26 8 50 c0 8 2 15 6 21 L8 92 l22 -6 c6 4 13 6 20 6 24 0 42 -18 42 -42 S74 8 50 8 Z" fill={COLORS.white} stroke={D} strokeWidth={6} strokeLinejoin="round" /></svg>
          واتساب
        </div>
        {text}
        {sub ? <div style={{fontSize: 26, fontWeight: 400, marginTop: 4}}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** ختم/شارة "أول طلبين مجانًا". */
export const FreeBadge: React.FC<{left: number; top: number; from: number; size?: number; text?: string}> = ({left, top, from, size = 300, text = 'أول طلبين مجانًا'}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - from, fps: 30, config: {damping: 7, stiffness: 170}});
  if (frame < from) return null;
  const pts = Array.from({length: 24}).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 78 : 96;
    return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <div style={{position: 'absolute', left, top, width: size, height: size, transform: `scale(${s}) rotate(${-10 + Math.sin(frame * 0.12) * 3}deg)`, zIndex: 12}}>
      <Sfx name="pop" at={from} volume={0.6} />
      <svg viewBox="0 0 200 200" width={size} height={size} style={{position: 'absolute', inset: 0}}>
        <polygon points={pts} fill={COLORS.accent} stroke={D} strokeWidth={7} strokeLinejoin="round" />
      </svg>
      <div style={{...baseText, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: size * 0.17, lineHeight: 1.15, color: D, padding: size * 0.18}}>{text}</div>
    </div>
  );
};

/* ============ شاشة العروض ============ */
type Offer = {name: string; initials: string; rating: number; price: number};
const OFFERS: Offer[] = [
  {name: 'ياسر عبد الحميد', initials: 'ي ع', rating: 4.9, price: 400},
  {name: 'محمود السيد', initials: 'م س', rating: 4.8, price: 350},
  {name: 'أحمد رمضان', initials: 'أ ر', rating: 4.6, price: 300},
  {name: 'سامح فتحي', initials: 'س ف', rating: 4.7, price: 380},
  {name: 'هاني جمال', initials: 'ه ج', rating: 4.9, price: 320},
];
export const OffersScreen: React.FC<{d: number}> = ({d}) => {
  const frame = useCurrentFrame();
  const hag = Math.round(d * 0.58);
  const price1 = Math.round(interpolate(frame, [hag, hag + 16], [350, 300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const hot = frame >= hag;
  return (
    <div style={{...baseText, width: '100%', height: '100%', background: COLORS.background, color: D, position: 'relative', overflow: 'hidden'}}>
      <div style={{padding: '34px 22px 10px', fontSize: 34}}>العروض على طلبك</div>
      <div style={{padding: '0 22px 14px', fontSize: 24, fontWeight: 400, opacity: 0.7}}>غسالة باظت · بكره ١٢ لـ ٣</div>
      {OFFERS.map((o, i) => {
        const appear = Math.round(d * (0.05 + i * 0.07));
        const s = spring({frame: frame - appear, fps: 30, config: {damping: 8, stiffness: 160}});
        const isHot = i === 1 && hot;
        const price = i === 1 ? price1 : o.price;
        return (
          <div key={i} style={{margin: '0 14px 12px', height: 166, boxSizing: 'border-box', background: isHot ? '#F6E1D9' : PAPER, border: `${isHot ? 5 : 2}px solid ${isHot ? COLORS.primary : LINE}`, borderRadius: 26, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', transform: `translateY(${(1 - s) * -420}px) scale(${isHot ? 1.03 : 1})`, opacity: Math.min(1, s * 2.5)}}>
            <Sfx name="pop" at={appear} volume={0.4} />
            <div style={{width: 76, height: 76, borderRadius: 38, background: '#E3E6DC', border: `4px solid ${COLORS.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flex: 'none'}}>{o.initials}</div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 31, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{o.name}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 3, marginTop: 6}}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <svg key={k} viewBox="-100 -100 200 200" width={22} height={22} style={{opacity: k < Math.floor(o.rating) ? 1 : 0.3}}>
                    <path d="M0 -90 L26 -30 L90 -26 L40 16 L56 80 L0 46 L-56 80 L-40 16 L-90 -26 L-26 -30 Z" fill={COLORS.accent} stroke={D} strokeWidth={10} strokeLinejoin="round" />
                  </svg>
                ))}
                <span style={{fontSize: 22, fontWeight: 400, marginRight: 6}}>{arDigits(o.rating)}</span>
              </div>
              <div style={{marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F3E3BC', border: `2px solid ${COLORS.accent}`, borderRadius: 16, padding: '1px 12px 3px', fontSize: 20}}>
                <svg viewBox="0 0 100 100" width={18} height={18}><path d="M50 8 L86 22 V54 Q86 82 50 94 Q14 82 14 54 V22 Z" fill={COLORS.accent} stroke={D} strokeWidth={8} strokeLinejoin="round" /></svg>
                موثّق بالبطاقة
              </div>
            </div>
            <div style={{textAlign: 'center', minWidth: 118}}>
              {isHot && <div style={{fontSize: 24, textDecoration: 'line-through', color: COLORS.primary, lineHeight: 1}}>{arDigits(350)}</div>}
              <div style={{fontSize: 44, lineHeight: 1.1, color: isHot ? COLORS.primary : D}}>{arDigits(price)}</div>
              <div style={{fontSize: 20, fontWeight: 400}}>ج.م</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============ البطاقة + السيلفي ============ */
export const IdSelfie: React.FC<{left: number; top: number; width?: number; from?: number}> = ({left, top, width = 460, from = 0}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - from, fps: 30, config: {damping: 8, stiffness: 150}});
  if (frame < from) return null;
  return (
    <div style={{position: 'absolute', left, top, width, transform: `scale(${s}) rotate(${(1 - s) * -12}deg)`}}>
      <Sfx name="pop" at={from} volume={0.5} />
      <svg viewBox="0 0 400 460" width={width}>
        <rect x={20} y={20} width={360} height={420} rx={36} fill={COLORS.white} stroke={D} strokeWidth={8} />
        {/* وش الفني */}
        <circle cx={200} cy={150} r={80} fill={SKINS.medium} stroke={D} strokeWidth={7} />
        <path d="M120 128 Q124 76 200 72 Q276 76 280 128 Q266 98 200 96 Q134 98 120 128 Z" fill="#6b6f66" stroke={D} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={170} cy={152} r={11} fill={D} /><circle cx={230} cy={152} r={11} fill={D} />
        <path d="M168 190 Q200 214 232 190" stroke={D} strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M200 176 Q176 168 154 180 Q170 196 200 184 Q230 196 246 180 Q224 168 200 176 Z" fill="#3A2A1E" transform="translate(0 -6)" />
        <path d="M80 250 Q200 214 320 250 V300 H80 Z" fill={D} />
        {/* البطاقة */}
        <g transform="rotate(-6 200 340)">
          <rect x={90} y={290} width={220} height={130} rx={16} fill={COLORS.background} stroke={D} strokeWidth={6} />
          <rect x={90} y={290} width={220} height={34} rx={16} fill={COLORS.primary} stroke={D} strokeWidth={6} />
          <circle cx={134} cy={364} r={26} fill={SKINS.medium} stroke={D} strokeWidth={5} />
          <path d="M184 350 H290 M184 376 H270 M184 400 H250" stroke={D} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
        </g>
        <circle cx={96} cy={372} r={24} fill={SKINS.medium} stroke={D} strokeWidth={6} />
        <circle cx={304} cy={376} r={24} fill={SKINS.medium} stroke={D} strokeWidth={6} />
      </svg>
    </div>
  );
};

/* ============ الباب ============ */
export const DoorScene: React.FC<{left: number; top: number; openAt: number; width?: number; children?: React.ReactNode}> = ({left, top, openAt, width = 400, children}) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [openAt, openAt + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const h = width * 1.7;
  return (
    <div style={{position: 'absolute', left, top, width, height: h, perspective: 1400}}>
      <div style={{position: 'absolute', inset: -18, background: D, borderRadius: 24}} />
      <div style={{position: 'absolute', inset: 0, background: '#E9DFC8', overflow: 'hidden'}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, background: COLORS.primary, border: `8px solid ${D}`, boxSizing: 'border-box', transformOrigin: '0% 50%', transform: `rotateY(${-open * 105}deg)`, backfaceVisibility: 'hidden'}}>
        <div style={{position: 'absolute', left: '14%', top: '10%', width: '72%', height: '36%', border: `7px solid ${D}`, borderRadius: 14, background: 'rgba(0,0,0,0.12)'}} />
        <div style={{position: 'absolute', left: '14%', top: '54%', width: '72%', height: '34%', border: `7px solid ${D}`, borderRadius: 14, background: 'rgba(0,0,0,0.12)'}} />
        <div style={{position: 'absolute', right: '10%', top: '47%', width: 34, height: 34, borderRadius: 17, background: COLORS.accent, border: `6px solid ${D}`}} />
      </div>
    </div>
  );
};

/* ============ عداد + هدية ============ */
export const GiftBox: React.FC<{left: number; top: number; size?: number; openAt: number}> = ({left, top, size = 460, openAt}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(0, 8, 150);
  const t = frame - openAt;
  const lift = interpolate(t, [0, 12, 40], [0, -150, -170], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lrot = interpolate(t, [0, 12], [0, -18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const jiggle = t < 0 ? Math.sin(frame * 1.6) * 2.5 * Math.min(1, Math.max(0, (frame - (openAt - 18)) / 18)) : 0;
  const glow = interpolate(t, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left, top, width: size, height: size * 1.1, transform: `scale(${pop}) rotate(${jiggle}deg)`}}>
      {t >= 0 && <Sfx name="ding" at={openAt} volume={0.7} />}
      {t >= 0 && (
        <>
          {Array.from({length: 18}).map((_, i) => {
            const a = -Math.PI / 2 + (rnd(i) - 0.5) * 2.4;
            const sp = 150 + rnd(i + 5) * 330;
            const k = Math.min(1, t / 36);
            const x = size / 2 + Math.cos(a) * sp * k;
            const y = size * 0.5 + Math.sin(a) * sp * k + 260 * k * k;
            const col = [COLORS.primary, COLORS.accent, COLORS.white, '#8D9A84'][i % 4];
            return <div key={i} style={{position: 'absolute', left: x, top: y, width: 26, height: 14, background: col, border: `3px solid ${D}`, borderRadius: 3, transform: `rotate(${t * (6 + i)}deg)`, opacity: 1 - Math.max(0, (t - 28) / 20)}} />;
          })}
          <div style={{position: 'absolute', left: size * 0.2, top: size * 0.1, width: size * 0.6, height: size * 0.6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,154,45,0.75), rgba(214,154,45,0))', opacity: glow}} />
        </>
      )}
      <svg viewBox="0 0 400 440" width={size} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={50} y={190} width={300} height={220} rx={16} fill={COLORS.primary} stroke={D} strokeWidth={8} />
        <rect x={176} y={190} width={48} height={220} fill={COLORS.accent} stroke={D} strokeWidth={6} />
        <g transform={`translate(0 ${lift}) rotate(${lrot} 60 190)`}>
          <rect x={34} y={128} width={332} height={72} rx={16} fill={COLORS.accent} stroke={D} strokeWidth={8} />
          <rect x={176} y={128} width={48} height={72} fill={COLORS.primary} stroke={D} strokeWidth={6} />
          <path d="M200 128 C150 60 90 70 120 110 C140 130 180 128 200 128 Z M200 128 C250 60 310 70 280 110 C260 130 220 128 200 128 Z" fill={COLORS.primary} stroke={D} strokeWidth={7} strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};

export const ThreeCounter: React.FC<{top: number; times: [number, number, number]}> = ({top, times}) => {
  const frame = useCurrentFrame();
  const full = frame >= times[2];
  return (
    <div style={{position: 'absolute', left: 0, top, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
      <div style={{display: 'flex', gap: 30, direction: 'rtl'}}>
        {times.map((tm, i) => {
          const s = spring({frame: frame - tm, fps: 30, config: {damping: 7, stiffness: 220}});
          const on = frame >= tm;
          return (
            <div key={i} style={{width: 150, height: 150, borderRadius: 75, background: on ? COLORS.accent : COLORS.white, border: `8px solid ${D}`, boxShadow: `0 8px 0 ${D}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.7 + 0.3 * s : 1})`}}>
              {on && <Sfx name="pop" at={tm} volume={0.5} />}
              {on ? (
                <svg viewBox="0 0 100 100" width={90} height={90}><path d="M24 52 L44 72 L78 30" stroke={D} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              ) : (
                <span style={{...baseText, fontSize: 70, color: D, opacity: 0.35}}>{arDigits(i + 1)}</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{...baseText, fontSize: 104, color: full ? COLORS.primary : D, textShadow: `0 6px 0 ${D}`, WebkitTextStroke: `7px ${D}`, paintOrder: 'stroke fill'}}>
        <span style={{color: full ? COLORS.accent : COLORS.white}}>{arDigits(frame >= times[2] ? 3 : frame >= times[1] ? 2 : frame >= times[0] ? 1 : 0)} من ٣</span>
      </div>
    </div>
  );
};

/** أيقونة دعم: فقاعة شات + علامة صح. */
export const SupportIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <path d="M30 40 Q30 20 52 20 H148 Q170 20 170 40 V120 Q170 140 148 140 H92 L56 176 V140 H52 Q30 140 30 120 Z" fill={COLORS.white} stroke={D} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={100} cy={80} r={34} fill={COLORS.accent} stroke={D} strokeWidth={7} />
    <path d="M82 82 L96 96 L120 66" stroke={D} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const Bubble: React.FC<{text: string; left: number; top: number; delay: number; to?: number; width?: number; fontSize?: number; variant?: 'light' | 'primary' | 'accent'; tailSide?: 'left' | 'right'}> = ({text, left, top, delay, to = 99999, width = 340, fontSize = 52, variant = 'light', tailSide = 'left'}) => {
  const frame = useCurrentFrame();
  const s = spring({frame: frame - delay, fps: 30, config: {damping: 8, stiffness: 190}});
  const out = interpolate(frame, [to - 5, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < delay || frame > to) return null;
  const bg = variant === 'primary' ? COLORS.primary : variant === 'accent' ? COLORS.accent : COLORS.white;
  const fg = variant === 'primary' ? COLORS.white : D;
  return (
    <div style={{position: 'absolute', left, top, width, transform: `scale(${s * out})`, opacity: out, zIndex: 8}}>
      <div style={{...baseText, position: 'relative', background: bg, color: fg, fontSize, lineHeight: 1.2, textAlign: 'center', padding: '16px 24px 20px', borderRadius: 38, border: `7px solid ${D}`, boxShadow: `0 8px 0 ${D}`}}>
        {text}
        <div style={{position: 'absolute', bottom: -22, [tailSide]: 50, width: 34, height: 34, background: bg, borderRight: `7px solid ${D}`, borderBottom: `7px solid ${D}`, transform: 'rotate(45deg)'}} />
      </div>
    </div>
  );
};

export {Star};
