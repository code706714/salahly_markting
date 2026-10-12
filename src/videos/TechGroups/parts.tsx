import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, W, baseText} from '../../lib/theme';
import {Sfx, useBounce} from '../../lib/stage';
import {arNum} from '../GroupTechnician/parts';
import {Logo} from '../../components/Logo';

const D = COLORS.dark;
const LINE = '#E4DCCB';

/* ---------- أيقونات ---------- */
export const PhoneHandset: React.FC<{size?: number; color?: string}> = ({size = 36, color = COLORS.primary}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path d="M24 12 L38 10 L46 30 L36 38 C42 52 52 62 64 68 L72 58 L92 66 L90 80 C88 88 80 92 72 90 C44 84 14 54 10 26 C8 18 14 14 24 12 Z" fill={color} stroke={D} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);
export const PinIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <path d="M100 14 C62 14 40 42 40 76 C40 118 100 188 100 188 C100 188 160 118 160 76 C160 42 138 14 100 14 Z" fill={COLORS.primary} stroke={D} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={100} cy={76} r={26} fill={COLORS.white} stroke={D} strokeWidth={7} />
  </svg>
);
export const QuoteIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x={30} y={18} width={140} height={164} rx={18} fill={COLORS.white} stroke={D} strokeWidth={9} />
    <path d="M56 62 H144 M56 94 H144 M56 126 H108" stroke={D} strokeWidth={9} strokeLinecap="round" opacity={0.5} />
    <circle cx={146} cy={146} r={30} fill={COLORS.accent} stroke={D} strokeWidth={8} />
    <text x={146} y={158} textAnchor="middle" fontSize={40} fontWeight={700} fill={D} fontFamily="inherit">ج</text>
  </svg>
);
export const ZeroFeeIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <circle cx={100} cy={100} r={88} fill={COLORS.accent} stroke={D} strokeWidth={9} />
    <text x={100} y={128} textAnchor="middle" fontSize={96} fontWeight={700} fill={D} fontFamily="inherit">٠</text>
    <text x={100} y={168} textAnchor="middle" fontSize={32} fontWeight={700} fill={D} fontFamily="inherit">رسوم</text>
  </svg>
);

/* ---------- مشهد 1: القهوة ---------- */
export const Feed: React.FC = () => {
  const frame = useCurrentFrame();
  const y = (frame * 5) % 330;
  return (
    <div style={{width: '100%', height: '100%', background: '#EEE7DA', overflow: 'hidden', position: 'relative'}}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', left: 14, right: 14, top: i * 330 - y, height: 300, background: COLORS.white, borderRadius: 22, padding: 18, boxSizing: 'border-box'}}>
          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <div style={{width: 46, height: 46, borderRadius: 23, background: i % 2 ? COLORS.accent : COLORS.primary}} />
            <div style={{width: 150, height: 18, borderRadius: 9, background: LINE}} />
          </div>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{marginTop: 22, height: 16, borderRadius: 8, background: LINE, width: `${92 - r * 22}%`, marginRight: 0}} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const TeaGlass: React.FC<{left: number; top: number; size?: number}> = ({left, top, size = 130}) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 100 130" width={size} style={{position: 'absolute', left, top, overflow: 'visible'}}>
      <path d="M30 6 q-8 -10 0 -22 M50 6 q-8 -10 0 -22 M70 6 q-8 -10 0 -22" transform={`translate(0 ${Math.sin(frame * 0.15) * 3})`} stroke={D} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.35} />
      <path d="M18 20 L82 20 L74 118 Q73 126 65 126 L35 126 Q27 126 26 118 Z" fill="#EBC27A" stroke={D} strokeWidth={6} strokeLinejoin="round" />
      <path d="M22 44 L78 44" stroke={D} strokeWidth={4} opacity={0.3} />
      <ellipse cx={50} cy={20} rx={32} ry={7} fill="#F7E3B9" stroke={D} strokeWidth={5} />
    </svg>
  );
};

/* ---------- مشهد 2: بوست + طوفان كومنتات ---------- */
const NAMES = ['م. أحمد', 'الأسطى سيد', 'فني حسن', 'م. كريم', 'الأسطى عادل', 'فني مصطفى', 'م. إيهاب', 'الأسطى رضا', 'فني وليد', 'م. ياسر'];

const CommentRow: React.FC<{name: string; color: string; mine?: boolean}> = ({name, color, mine}) => (
  <div style={{margin: '0 14px 10px', padding: '10px 14px', background: mine ? '#F6E1D9' : COLORS.white, border: mine ? `3px solid ${COLORS.primary}` : `2px solid ${LINE}`, borderRadius: 22, display: 'flex', alignItems: 'center', gap: 12, height: 72, boxSizing: 'border-box'}}>
    <div style={{width: 44, height: 44, borderRadius: 22, background: color, flex: 'none', border: `3px solid ${D}`}} />
    <div style={{flex: 1}}>
      <div style={{fontSize: 20, opacity: 0.7, lineHeight: 1}}>{name}</div>
      <div style={{fontSize: 28, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: 8}}>
        أنا متاح <PhoneHandset size={28} />
      </div>
    </div>
  </div>
);

const MINE_AT = 36; // فريم ظهور كومنت الفني
const FLOOD_FROM = 78;
const FLOOD_COUNT = 50;
const FLOOD_STEP = 1.5;

/** شاشة البوست: كومنت الفني بيتكتب، وبعدها ٥٠ كومنت بنفس الكلام بيدفنوه. */
export const PostFlood: React.FC = () => {
  const frame = useCurrentFrame();
  const text = 'أنا متاح';
  const typed = text.slice(0, Math.max(0, Math.min(text.length, Math.floor((frame - 12) / 2.2))));
  const n = Math.max(0, Math.min(FLOOD_COUNT, Math.floor((frame - FLOOD_FROM) / FLOOD_STEP) + 1));
  const mine = frame >= MINE_AT;
  return (
    <div style={{...baseText, width: '100%', height: '100%', background: '#EEE7DA', color: D, position: 'relative', overflow: 'hidden'}}>
      <div style={{background: D, color: COLORS.white, padding: '30px 20px 18px', fontSize: 28}}>جروب أهالي الحي</div>
      <div style={{margin: '14px 14px 10px', background: COLORS.white, borderRadius: 22, padding: 18}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
          <div style={{width: 44, height: 44, borderRadius: 22, background: COLORS.primary}} />
          <div style={{fontSize: 24}}>مدام نهى</div>
        </div>
        <div style={{fontSize: 34, lineHeight: 1.3}}>حد يعرف فني تلاجات كويس؟</div>
      </div>
      {/* خانة الكتابة */}
      {!mine && (
        <div style={{margin: '0 14px', height: 64, borderRadius: 32, background: COLORS.white, border: `2px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 28, gap: 8}}>
          {typed}
          {typed.length >= text.length ? <PhoneHandset size={28} /> : null}
          <span style={{color: COLORS.primary, opacity: Math.floor(frame / 8) % 2 ? 0 : 1}}>|</span>
        </div>
      )}
      {/* الكومنتات: الأحدث فوق، فبتدفن كومنت الفني */}
      <div style={{marginTop: mine ? 4 : 12}}>
        {Array.from({length: n}).map((_, k) => {
          const i = n - 1 - k; // الأحدث الأول
          return <CommentRow key={i} name={NAMES[i % NAMES.length]} color={i % 2 ? COLORS.accent : '#8D9A84'} />;
        })}
        {mine && <CommentRow name="أنا" color={COLORS.primary} mine />}
      </div>
    </div>
  );
};

export const FloodCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(FLOOD_COUNT, Math.floor((frame - FLOOD_FROM) / FLOOD_STEP) + 1));
  if (n <= 0) return null;
  const pulse = 1 + (n < FLOOD_COUNT ? Math.abs(Math.sin(frame * 0.6)) * 0.06 : 0);
  return (
    <>
      {Array.from({length: 12}).map((_, i) => (
        <Sfx key={i} name="pop" at={Math.round(FLOOD_FROM + i * 6)} volume={0.35} />
      ))}
      <div
        style={{
          ...baseText, position: 'absolute', top: 30, left: 0, width: W, textAlign: 'center', fontSize: 100, color: COLORS.primary, textShadow: `0 6px 0 ${D}`,
          WebkitTextStroke: `7px ${D}`, paintOrder: 'stroke fill', transform: `scale(${pulse})`,
        }}
      >
        {arNum(n)} تعليق نفس الكلام
      </div>
    </>
  );
};

/* ---------- مشهد 3: شاشات التطبيق ---------- */
const Hl: React.FC<{x: number; y: number; w: number; h: number; from: number; to?: number}> = ({x, y, w, h, from, to = 9999}) => {
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

const Shot: React.FC<{src: string; pos: number; opacity: number}> = ({src, pos, opacity}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${pos * 100}%`, opacity}} />
);

/** شاشة قفل بإشعار صلحلي. */
const LockScreen: React.FC = () => {
  const pop = useBounce(4, 8, 190);
  return (
    <div style={{...baseText, position: 'absolute', inset: 0, background: `linear-gradient(170deg, ${D} 0%, #1f281c 100%)`, color: COLORS.white}}>
      <div style={{textAlign: 'center', marginTop: 150, fontSize: 130, lineHeight: 1}}>١٢:٣٠</div>
      <div style={{textAlign: 'center', fontSize: 34, fontWeight: 400, opacity: 0.8, marginTop: 8}}>السبت</div>
      <div style={{margin: '120px 22px 0', background: COLORS.white, color: D, borderRadius: 30, padding: '22px 24px', transform: `scale(${pop})`, boxShadow: '0 12px 0 rgba(0,0,0,0.25)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
          <Logo size={50} />
          <span style={{fontSize: 28, opacity: 0.7}}>صلحلي · دلوقتي</span>
        </div>
        <div style={{fontSize: 38, lineHeight: 1.25}}>طلب جديد قريب منك</div>
        <div style={{fontSize: 34, fontWeight: 400, lineHeight: 1.25, marginTop: 4}}>تلاجة مش بتبرّد</div>
      </div>
    </div>
  );
};

/** رحلة الطلب جوه موبايل واحد: إشعار ← الطلب ← عرض السعر. (فريمات محلية) */
export const OrderFlow: React.FC = () => {
  const f = useCurrentFrame();
  const fade = (a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scroll = interpolate(f, [96, 122], [0, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const jobOp = fade(44, 52) * (1 - fade(166, 171));
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/tech-new-job.png" pos={scroll} opacity={jobOp} />
      <Hl x={8} y={53} w={86} h={8} from={56} to={94} />
      <Hl x={10} y={60} w={84} h={9} from={126} to={164} />
      <Shot src="screens/tech-quote.png" pos={0.3} opacity={fade(166, 171)} />
      {f < 52 && <div style={{position: 'absolute', inset: 0, opacity: 1 - fade(44, 52)}}><LockScreen /></div>}
    </div>
  );
};

/** إشعار "الزبون وافق" بيتنزل من فوق. */
export const AcceptToast: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(from, 9, 170);
  const out = interpolate(frame, [to - 6, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute', left: 70, top: 40, width: W - 140, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, background: COLORS.dark,
        border: `7px solid ${COLORS.accent}`, borderRadius: 75, transform: `translateY(${(1 - pop) * -240}px) scale(${out})`, opacity: out, zIndex: 20,
      }}
    >
      <svg viewBox="0 0 100 100" width={96} height={96}>
        <circle cx={50} cy={50} r={44} fill={COLORS.accent} stroke={COLORS.white} strokeWidth={6} />
        <path d="M28 52 L44 68 L74 34" stroke={D} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span style={{...baseText, fontSize: 62, color: COLORS.white}}>الزبون وافق على عرضك</span>
    </div>
  );
};
