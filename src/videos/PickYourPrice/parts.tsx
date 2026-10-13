import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, W, baseText} from '../../lib/theme';
import {Sfx, useBounce} from '../../lib/stage';

const D = COLORS.dark;
const LINE = '#E4DCCB';
const PAPER = '#FFFDF8';

const AR = '٠١٢٣٤٥٦٧٨٩';
export const ar = (n: number | string) => String(n).replace(/\d/g, (d) => AR[Number(d)]);

/** اهتزاز مستمر (للنص الضخم). */
export const Jitter: React.FC<{amp?: number; children: React.ReactNode}> = ({amp = 1, children}) => {
  const f = useCurrentFrame();
  const x = (Math.sin(f * 2.9) * 9 + Math.sin(f * 7.3) * 4) * amp;
  const y = (Math.cos(f * 3.7) * 7 + Math.sin(f * 6.1) * 3) * amp;
  const r = Math.sin(f * 2.3) * 1.4 * amp;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, transform: `translate(${x}px, ${y}px) rotate(${r}deg)`}}>{children}</div>;
};

const Star: React.FC<{size?: number}> = ({size = 22}) => (
  <svg viewBox="-100 -100 200 200" width={size} height={size}>
    <path d="M0 -90 L26 -30 L90 -26 L40 16 L56 80 L0 46 L-56 80 L-40 16 L-90 -26 L-26 -30 Z" fill={COLORS.accent} stroke={D} strokeWidth={10} strokeLinejoin="round" />
  </svg>
);

type Offer = {name: string; initials: string; rating: number; price: number; tag?: string};
const OFFERS: Offer[] = [
  {name: 'ياسر عبد الحميد', initials: 'ي ع', rating: 4.9, price: 350},
  {name: 'محمود السيد', initials: 'م س', rating: 4.8, price: 300},
  {name: 'أحمد رمضان', initials: 'أ ر', rating: 4.6, price: 280, tag: 'الأرخص'},
  {name: 'سامح فتحي', initials: 'س ف', rating: 4.7, price: 400},
  {name: 'هاني جمال', initials: 'ه ج', rating: 4.9, price: 320},
];
const CHOSEN = 1;
const HOPS = [0, 2, 3, 4, 0, CHOSEN]; // الكارت اللي الإطار بيعدّي عليه وقت "فاصل"

const OfferCard: React.FC<{o: Offer; appear: number; ring: boolean; dim: boolean; chosen: boolean}> = ({o, appear, ring, dim, chosen}) => {
  const pop = useBounce(appear, 8, 190);
  const full = Math.floor(o.rating);
  return (
    <div
      style={{
        ...baseText, position: 'relative', margin: '0 16px 14px', height: 150, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
        background: chosen ? '#F6E1D9' : PAPER, color: D, borderRadius: 26,
        border: `${ring || chosen ? 5 : 2}px solid ${chosen ? COLORS.primary : ring ? COLORS.accent : LINE}`,
        boxShadow: ring ? `0 0 0 8px rgba(214,154,45,0.35)` : '0 3px 0 rgba(47,59,42,0.08)',
        transform: `translateX(${(1 - pop) * 260}px) scale(${(0.9 + 0.1 * pop) * (chosen ? 1.035 : dim ? 0.97 : 1)})`,
        opacity: Math.min(1, pop * 2.5) * (dim ? 0.38 : 1),
      }}
    >
      <div style={{width: 80, height: 80, borderRadius: 40, background: '#E3E6DC', border: `4px solid ${COLORS.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flex: 'none'}}>{o.initials}</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 32, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{o.name}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, marginTop: 6}}>
          {[0, 1, 2, 3, 4].map((s) => (
            <span key={s} style={{opacity: s < full ? 1 : 0.35}}>
              <Star />
            </span>
          ))}
          <span style={{fontSize: 22, fontWeight: 400, marginRight: 6}}>{ar(o.rating)}</span>
        </div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: COLORS.accent, borderRadius: 14, padding: '2px 12px 4px', fontSize: 20}}>
          <svg viewBox="0 0 24 24" width={18} height={18}>
            <path d="M12 2 L21 6 V12 C21 17 17 21 12 23 C7 21 3 17 3 12 V6 Z" fill={D} />
            <path d="M8 12.5 L11 15.5 L16.5 9" stroke={COLORS.accent} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          موثّق
        </div>
      </div>
      <div style={{textAlign: 'center', flex: 'none', minWidth: 120}}>
        <div style={{fontSize: 54, lineHeight: 1}}>{ar(o.price)}</div>
        <div style={{fontSize: 22, fontWeight: 400}}>ج.م</div>
      </div>
      {o.tag ? (
        <div style={{position: 'absolute', top: -14, left: 18, background: COLORS.primary, color: COLORS.white, borderRadius: 12, padding: '0 14px 3px', fontSize: 20, border: `3px solid ${D}`}}>{o.tag}</div>
      ) : null}
    </div>
  );
};

/** شاشة التطبيق: كتابة الطلب ← العروض بتوصل ← اختيار. الفريمات هنا محلية للمشهد. */
export const PickScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const text = 'غسالة مش بتعصر';
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - 8) / 2.2)));
  const blink = Math.floor(frame / 8) % 2 === 0;
  const tap = interpolate(frame, [42, 46, 52], [1, 0.93, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sent = frame >= 46;
  const slide = interpolate(frame, [52, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const APPEAR = 66;
  const STEP = 11;
  const hop = frame >= 118 ? Math.min(HOPS.length - 1, Math.floor((frame - 118) / 8)) : -1;
  const picked = frame >= 166;
  const confirm = interpolate(frame, [196, 212], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const count = Math.min(5, Math.max(0, Math.floor((frame - APPEAR) / STEP) + 1));
  return (
    <div style={{...baseText, position: 'absolute', inset: 0, background: COLORS.background, color: D, overflow: 'hidden'}}>
      {/* شاشة الطلب */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-slide * 105}%)`}}>
        <div style={{padding: '40px 26px 18px', fontSize: 36, borderBottom: `2px solid ${LINE}`}}>اطلب فني</div>
        <div style={{padding: '28px 26px 0', fontSize: 46}}>إيه المشكلة؟</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, padding: '22px 26px 0'}}>
          {['غسالات وتلاجات', 'تكييف', 'سباكة', 'كهربا'].map((c, i) => (
            <span key={c} style={{fontSize: 26, padding: '8px 20px 12px', borderRadius: 24, background: i === 0 ? COLORS.primary : PAPER, color: i === 0 ? COLORS.white : D, border: `2px solid ${i === 0 ? COLORS.primary : LINE}`}}>{c}</span>
          ))}
        </div>
        <div style={{margin: '26px 26px 0', background: COLORS.white, border: `2px solid ${LINE}`, borderRadius: 24, minHeight: 190, padding: '22px 24px', fontSize: 48, lineHeight: 1.3}}>
          {text.slice(0, n)}
          {n < text.length && blink ? <span style={{color: COLORS.primary}}>|</span> : null}
        </div>
        <div style={{position: 'absolute', left: 26, right: 26, bottom: 36, height: 104, borderRadius: 28, background: sent ? D : COLORS.primary, color: COLORS.white, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tap})`}}>
          {sent ? 'اتبعت ✓' : 'ابعتي الطلب'}
        </div>
      </div>

      {/* شاشة العروض */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - slide) * 105}%)`}}>
        <div style={{padding: '36px 26px 14px'}}>
          <div style={{fontSize: 42}}>وصلك {ar(count)} عروض</div>
          <div style={{fontSize: 24, fontWeight: 400, opacity: 0.7, marginTop: 4}}>على طلبك: غسالة مش بتعصر</div>
        </div>
        {OFFERS.map((o, i) => (
          <React.Fragment key={i}>
            <Sfx name="pop" at={APPEAR + i * STEP} volume={0.55} />
            <OfferCard o={o} appear={APPEAR + i * STEP} ring={hop >= 0 && !picked && HOPS[hop] === i} dim={picked && i !== CHOSEN} chosen={picked && i === CHOSEN} />
          </React.Fragment>
        ))}
        {HOPS.map((_, k) => (k <= 4 ? <Sfx key={k} name="pop" at={118 + k * 8} volume={0.3} /> : null))}
        <Sfx name="ding" at={166} volume={0.6} />
        <div
          style={{
            position: 'absolute', left: 20, right: 20, bottom: 26, height: 96, borderRadius: 26, background: COLORS.primary, color: COLORS.white, fontSize: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `translateY(${(1 - confirm) * 160}px)`, opacity: confirm,
            boxShadow: '0 -4px 0 rgba(47,59,42,0.15)',
          }}
        >
          <svg viewBox="0 0 100 100" width={44} height={44}><circle cx={50} cy={50} r={46} fill={COLORS.accent} /><path d="M28 52 L44 68 L74 32" stroke={D} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
          اتحجز · محمود · {ar(OFFERS[CHOSEN].price)} ج.م
        </div>
      </div>
    </div>
  );
};

/* ---------- أيقونات المشهد 3 ---------- */
export const ShieldIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <path d="M100 10 L176 40 V108 Q176 168 100 192 Q24 168 24 108 V40 Z" fill={COLORS.accent} stroke={D} strokeWidth={9} strokeLinejoin="round" />
    <path d="M100 26 L162 50 V108 Q162 156 100 177 Q38 156 38 108 V50 Z" fill="none" stroke={D} strokeWidth={4} opacity={0.35} />
    <text x={100} y={112} textAnchor="middle" fontSize={78} fontWeight={700} fill={D} fontFamily="inherit">{ar(14)}</text>
    <text x={100} y={152} textAnchor="middle" fontSize={34} fontWeight={700} fill={D} fontFamily="inherit">يوم</text>
  </svg>
);

export const IdCardIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x={14} y={40} width={172} height={124} rx={20} fill={COLORS.white} stroke={D} strokeWidth={9} />
    <path d="M14 60 a20 20 0 0 1 20 -20 H166 a20 20 0 0 1 20 20 V74 H14 Z" fill={COLORS.primary} stroke={D} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={146} cy={116} r={22} fill={COLORS.accent} stroke={D} strokeWidth={7} />
    <path d="M136 156 q10 -22 20 0" stroke={D} strokeWidth={0} fill={COLORS.accent} />
    <rect x={40} y={98} width={64} height={10} rx={5} fill={D} opacity={0.75} />
    <rect x={40} y={118} width={50} height={10} rx={5} fill={D} opacity={0.45} />
    <rect x={40} y={138} width={58} height={10} rx={5} fill={D} opacity={0.45} />
    <circle cx={168} cy={160} r={26} fill={COLORS.accent} stroke={D} strokeWidth={7} />
    <path d="M155 160 l9 10 l17 -20" stroke={D} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const GiftIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <rect x={32} y={92} width={136} height={90} rx={10} fill={COLORS.primary} stroke={D} strokeWidth={9} />
    <rect x={20} y={64} width={160} height={36} rx={10} fill={COLORS.accent} stroke={D} strokeWidth={9} />
    <rect x={91} y={64} width={18} height={118} fill={COLORS.white} stroke={D} strokeWidth={6} />
    <path d="M100 62 C70 20 36 40 56 60 C70 70 92 66 100 62 Z" fill={COLORS.white} stroke={D} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100 62 C130 20 164 40 144 60 C130 70 108 66 100 62 Z" fill={COLORS.white} stroke={D} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={100} cy={62} r={11} fill={COLORS.accent} stroke={D} strokeWidth={6} />
  </svg>
);

export const FeatureRow: React.FC<{top: number; delay: number; text: string; children: React.ReactNode}> = ({top, delay, text, children}) => {
  const pop = useBounce(delay, 8, 170);
  const icon = useBounce(delay + 3, 6, 240);
  return (
    <>
      <Sfx name="ding" at={delay + 4} volume={0.55} />
      <div
        style={{
          ...baseText, position: 'absolute', left: 60, top, width: W - 120, height: 300, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px',
          background: 'rgba(247,242,234,0.10)', border: `6px solid ${COLORS.accent}`, borderRadius: 48, color: COLORS.white,
          transform: `translateX(${(1 - pop) * -700}px)`, opacity: Math.min(1, pop * 2.5),
        }}
      >
        <div style={{width: 230, height: 230, flex: 'none', transform: `scale(${icon}) rotate(${(1 - icon) * -40}deg)`}}>{children}</div>
        <div style={{fontSize: 76, lineHeight: 1.2, textShadow: `0 6px 0 rgba(0,0,0,0.35)`}}>{text}</div>
      </div>
    </>
  );
};
