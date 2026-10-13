import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, W, baseText} from '../../lib/theme';
import {Sfx, useBounce} from '../../lib/stage';

const D = COLORS.dark;

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const arNum = (n: number) => String(Math.round(n)).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

/** مشاهد المشكلة: ألوان البراند باهتة (الأحمر/الدهبي بيرجعوا لحيويتهم في مشهد صلحلي). */
export const Muted: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{filter: 'saturate(0.38) contrast(0.96)'}}>{children}</AbsoluteFill>
);

/** الشاشة بتتقلب (rotateY) وتدخل بألوان صلحلي. */
export const FlipIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 15, stiffness: 120, mass: 0.9}});
  return (
    <AbsoluteFill style={{perspective: 1800}}>
      <AbsoluteFill style={{transform: `rotateY(${interpolate(s, [0, 1], [-90, 0])}deg)`, backfaceVisibility: 'hidden'}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 🙏 مرسومة (الإيموجي مش بيظهر في كل الأجهزة). */
export const PrayHands: React.FC<{size?: number}> = ({size = 70}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path d="M50 88 C30 86 22 64 27 44 C30 28 40 12 50 8 C46 32 46 62 50 88 Z" fill={COLORS.accent} stroke={D} strokeWidth={4} strokeLinejoin="round" />
    <path d="M50 88 C70 86 78 64 73 44 C70 28 60 12 50 8 C54 32 54 62 50 88 Z" fill="#EBBB62" stroke={D} strokeWidth={4} strokeLinejoin="round" />
    <path d="M36 40 C40 34 44 32 46 30 M34 54 C39 48 43 46 46 45 M64 40 C60 34 56 32 54 30 M66 54 C61 48 57 46 54 45" stroke={D} strokeWidth={3} strokeLinecap="round" fill="none" />
    <rect x={32} y={84} width={36} height={12} rx={4} fill={D} />
    <path d="M14 20 l6 6 M86 20 l-6 6 M50 -2 v6" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** شاشة جروب بسيطة (مش بنقلّد براند حقيقي). */
export const GroupPostScreen: React.FC<{typeFrom?: number}> = ({typeFrom = 14}) => {
  const frame = useCurrentFrame();
  const text = 'حد يعرف سباك كويس؟';
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - typeFrom) / 1.6)));
  const typed = text.slice(0, n);
  const done = n >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  const hands = useBounce(typeFrom + Math.ceil(text.length * 1.6) + 2, 7, 200);
  const react = interpolate(frame, [typeFrom + 34, typeFrom + 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{...baseText, width: '100%', height: '100%', background: '#EEE7DA', display: 'flex', flexDirection: 'column', color: D}}>
      <div style={{background: D, color: COLORS.white, padding: '34px 22px 22px', display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 54, height: 54, borderRadius: 27, background: COLORS.accent, border: `3px solid ${COLORS.white}`}} />
        <div>
          <div style={{fontSize: 30}}>جروب أهالي الحي</div>
          <div style={{fontSize: 21, fontWeight: 400, opacity: 0.8}}>٥٢٠٠ عضو</div>
        </div>
      </div>
      <div style={{margin: 16, marginTop: 20, background: COLORS.white, borderRadius: 22, padding: 22, boxShadow: '0 4px 0 rgba(47,59,42,0.12)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
          <div style={{width: 50, height: 50, borderRadius: 25, background: COLORS.primary}} />
          <div>
            <div style={{fontSize: 26}}>مدام نهى</div>
            <div style={{fontSize: 19, fontWeight: 400, opacity: 0.6}}>الآن</div>
          </div>
        </div>
        <div style={{fontSize: 44, lineHeight: 1.35, minHeight: 120}}>
          {typed}
          {!done && blink ? <span style={{color: COLORS.primary}}>|</span> : null}
          {done ? <span style={{display: 'inline-block', marginRight: 10, transform: `scale(${hands})`, verticalAlign: 'middle'}}><PrayHands size={58} /></span> : null}
        </div>
        <div style={{opacity: react, display: 'flex', justifyContent: 'space-around', marginTop: 18, paddingTop: 14, borderTop: '2px solid #E4DCCB', fontSize: 24, fontWeight: 400}}>
          <span>إعجاب</span>
          <span>تعليق</span>
          <span>مشاركة</span>
        </div>
      </div>
    </div>
  );
};

const COMMENTS = [
  'أنا أعرف واحد كويس', 'ابعتي برايفت', 'جرّبي الأسطى فلان', 'ده غالي!', 'عندي رقم', 'مين اللي عايز؟',
  'سباك شاطر في المنطقة', 'رني عليه', 'هبعتلك الرقم', 'حضرتك فين؟', 'ثلثمية بس', 'خدي رقم المعلم',
  'كان عندي زيك', 'مضمون؟', 'ابعتيلي اللوكيشن', 'أنا جربته', 'متعتمديش عليه', 'فيه أحسن منه',
  'اتصلي بيه الصبح', 'كام السعر؟', '+١', 'متابعة', 'مين فاضي؟', 'ممكن رقمه؟',
  'برايفت', 'ده مش كويس', 'هو كويس', 'استني ردي', 'خدي من عندي', 'دوري في الجروب',
];

/** ٣٠ تعليق بيطيروا بسرعة فوق الشاشة. */
export const CommentBubbles: React.FC<{start?: number}> = ({start = 0}) => {
  const frame = useCurrentFrame();
  const count = Math.max(0, Math.min(30, Math.floor((frame - start) / 1.4) + 1));
  return (
    <>
      {/* العدّاد */}
      <div
        style={{
          ...baseText, position: 'absolute', top: 270, left: 0, width: W, textAlign: 'center',
          fontSize: 96, color: COLORS.primary, textShadow: `0 6px 0 ${D}`, WebkitTextStroke: `7px ${D}`, paintOrder: 'stroke fill',
          transform: `scale(${1 + (frame - start < 60 ? Math.abs(Math.sin(frame * 0.6)) * 0.06 : 0)})`,
        }}
      >
        {arNum(count)} تعليق
      </div>
      {COMMENTS.map((c, i) => {
        const t = frame - (start + i * 1.4);
        if (t < 0 || t > 46) return null;
        const y = interpolate(t, [0, 46], [1180, 430 + (i % 5) * 40], {easing: Easing.out(Easing.cubic)});
        const x = 60 + ((i * 337) % 640) + Math.sin((t + i) * 0.25) * 14;
        const scale = interpolate(t, [0, 6], [0.3, 1], {extrapolateRight: 'clamp'});
        const op = interpolate(t, [0, 4, 36, 46], [0, 1, 1, 0]);
        return (
          <React.Fragment key={i}>
            {i % 4 === 0 ? <Sfx name="pop" at={Math.round(start + i * 1.4)} volume={0.4} /> : null}
            <div
              style={{
                ...baseText, position: 'absolute', left: x, top: y, opacity: op, transform: `scale(${scale}) rotate(${((i % 5) - 2) * 3}deg)`,
                background: COLORS.white, color: D, border: `5px solid ${D}`, borderRadius: 34, padding: '10px 26px 12px', fontSize: 40,
                display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', boxShadow: `0 6px 0 ${D}`,
              }}
            >
              <span style={{width: 40, height: 40, borderRadius: 20, background: i % 2 ? COLORS.accent : COLORS.primary, border: `3px solid ${D}`, flex: 'none'}} />
              {c}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** جرس الباب بيهتز. */
export const Bell: React.FC<{left: number; top: number; size?: number}> = ({left, top, size = 240}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(0, 7, 200);
  const swing = Math.sin(frame * 1.1) * 22 * Math.exp(-frame * 0.035);
  return (
    <svg viewBox="0 0 200 200" width={size} style={{position: 'absolute', left, top, transform: `scale(${pop}) rotate(${swing}deg)`, transformOrigin: '50% 12%', overflow: 'visible'}}>
      <path d="M100 18 C62 18 52 52 52 86 C52 118 40 128 30 142 H170 C160 128 148 118 148 86 C148 52 138 18 100 18 Z" fill={COLORS.accent} stroke={D} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={100} cy={160} r={18} fill={COLORS.primary} stroke={D} strokeWidth={7} />
      <circle cx={100} cy={12} r={9} fill={D} />
      {[0, 1].map((i) => (
        <path key={i} d={i ? 'M186 70 q14 18 0 36' : 'M14 70 q-14 18 0 36'} stroke={D} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.5 + 0.5 * Math.sin(frame * 1.1)} />
      ))}
    </svg>
  );
};

const ITEMS: Array<[string, number]> = [
  ['معاينة', 150], ['فتح الحنفية', 200], ['مواسير', 450], ['وصلات', 120], ['كوع', 60], ['مفتاح ربط', 90], ['مشوار', 100],
  ['أجرة يد', 600], ['نقل', 80], ['ضيافة', 50], ['شريط تفلون', 40], ['جلدة', 35], ['خلاط جديد', 700], ['تركيب', 300],
  ['تنظيف', 120], ['إكراميات', 100], ['ضريبة المعلم', 250], ['فرق سعر', 400], ['بند تاني', 180], ['بند تالت', 220],
  ['مصاريف', 150], ['حاجات صغيرة', 90], ['زيادة', 130], ['ومصاريف تانية', 200],
];

/** فاتورة طويلة بتتفرد لتحت الشاشة. */
export const Invoice: React.FC<{left?: number; top?: number; width?: number}> = ({left = 150, top = 250, width = 780}) => {
  const frame = useCurrentFrame();
  const unroll = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const total = ITEMS.reduce((a, [, p]) => a + p, 0);
  const H_FULL = 2500;
  return (
    <div style={{position: 'absolute', left, top, width, height: H_FULL * unroll, overflow: 'hidden', background: COLORS.white, border: `7px solid ${D}`, borderRadius: 14, boxShadow: `0 10px 0 ${D}`, ...baseText}}>
      <div style={{height: H_FULL, color: D, padding: '26px 34px'}}>
        <div style={{fontSize: 64, textAlign: 'center', borderBottom: `5px dashed ${D}`, paddingBottom: 14, marginBottom: 8}}>فاتورة</div>
        {ITEMS.map(([name, price], i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 42, fontWeight: i % 3 ? 400 : 700, padding: '10px 0', borderBottom: '3px dotted rgba(47,59,42,0.35)'}}>
            <span>{name}</span>
            <span>{arNum(price)} ج.م</span>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 58, color: COLORS.primary, padding: '20px 0'}}>
          <span>الإجمالي</span>
          <span>{arNum(total)} ج.م</span>
        </div>
      </div>
    </div>
  );
};

/** "بعد يومين" */
export const AfterDays: React.FC = () => {
  const pop = useBounce(0, 8, 220);
  return (
    <div style={{position: 'absolute', left: 0, top: 700, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${pop}) rotate(-4deg)`}}>
      <div style={{...baseText, background: D, color: COLORS.white, fontSize: 124, padding: '16px 70px 24px', border: `8px solid ${COLORS.accent}`, borderRadius: 24, boxShadow: '0 12px 0 rgba(0,0,0,0.35)'}}>بعد يومين</div>
    </div>
  );
};

/** حنفية بتنقّط. */
export const Faucet: React.FC<{left: number; top: number; size?: number}> = ({left, top, size = 420}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(0, 9, 150);
  const cycle = (frame % 22) / 22;
  const dropY = 168 + cycle * cycle * 150;
  return (
    <svg viewBox="0 0 400 420" width={size} style={{position: 'absolute', left, top, transform: `scale(${pop})`, overflow: 'visible'}}>
      <rect x={30} y={40} width={150} height={60} rx={14} fill="#B9BDB4" stroke={D} strokeWidth={8} />
      <rect x={150} y={60} width={150} height={44} rx={10} fill="#B9BDB4" stroke={D} strokeWidth={8} />
      <path d="M270 60 H330 V150 H290 V104 H270 Z" fill="#B9BDB4" stroke={D} strokeWidth={8} strokeLinejoin="round" />
      <rect x={96} y={14} width={56} height={30} rx={8} fill={COLORS.primary} stroke={D} strokeWidth={7} />
      <path d={`M310 ${dropY - 24} q-16 24 0 36 q16 -12 0 -36 Z`} fill={COLORS.white} stroke={D} strokeWidth={6} opacity={cycle > 0.9 ? 0 : 1} />
      <ellipse cx={310} cy={348} rx={70 + Math.sin(frame * 0.5) * 6} ry={16} fill={COLORS.white} stroke={D} strokeWidth={6} opacity={0.9} />
      <ellipse cx={310} cy={348} rx={(cycle * 50)} ry={(cycle * 12)} fill="none" stroke={D} strokeWidth={4} opacity={1 - cycle} />
    </svg>
  );
};

/** شاشة اتصال: بتفضل "جاري الاتصال…" ولحد failAt وبعدها الرسالة الآلية. */
export const CallScreen: React.FC<{failAt: number}> = ({failAt}) => {
  const frame = useCurrentFrame();
  const failed = frame >= failAt;
  const dots = '.'.repeat((Math.floor(frame / 8) % 3) + 1);
  const shake = failed && frame < failAt + 10 ? Math.sin(frame * 3) * 8 : 0;
  return (
    <div style={{...baseText, width: '100%', height: '100%', background: failed ? COLORS.primary : D, color: COLORS.white, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 150, transform: `translateX(${shake}px)`}}>
      <div style={{width: 170, height: 170, borderRadius: 85, background: COLORS.accent, border: `7px solid ${COLORS.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: D}}>؟</div>
      <div style={{fontSize: 44, marginTop: 26}}>الفني اللي من الجروب</div>
      <div style={{fontSize: 30, fontWeight: 400, opacity: 0.85, marginTop: 8}}>{failed ? 'تعذّر الاتصال' : `جاري الاتصال${dots}`}</div>
      {failed ? (
        <div style={{margin: '60px 26px 0', padding: '26px 22px', background: 'rgba(0,0,0,0.28)', borderRadius: 24, fontSize: 42, textAlign: 'center', lineHeight: 1.4}}>الرقم الذي طلبته غير متاح</div>
      ) : null}
      <div style={{position: 'absolute', bottom: 28, width: 110, height: 110, borderRadius: 60, background: failed ? D : COLORS.primary, border: `6px solid ${COLORS.white}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg viewBox="0 0 24 24" width={60} height={60}><path d="M5 5 L19 19 M19 5 L5 19" stroke={COLORS.white} strokeWidth={3.2} strokeLinecap="round" /></svg>
      </div>
    </div>
  );
};

/** بطاقة ميزة: علامة ✓ نحاسي + نص. */
export const FeatureCard: React.FC<{text: string; delay: number; top: number; detail?: string}> = ({text, delay, top, detail}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 9, 170);
  const check = useBounce(delay + 8, 6, 260);
  return (
    <>
      <Sfx name="ding" at={delay + 8} volume={0.5} />
      <div
        style={{
          ...baseText, position: 'absolute', left: 545, top, width: 495, minHeight: 190, boxSizing: 'border-box', background: D, color: COLORS.white,
          border: `6px solid ${COLORS.white}`, borderRadius: 36, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 22,
          fontSize: 50, lineHeight: 1.25, transform: `translateX(${(1 - pop) * 160}px) scale(${0.85 + 0.15 * pop})`, opacity: Math.min(1, pop * 2.5),
          boxShadow: '0 10px 0 rgba(0,0,0,0.25)',
        }}
      >
        <svg viewBox="0 0 100 100" width={92} height={92} style={{flex: 'none', transform: `scale(${check}) rotate(${(1 - check) * -30}deg)`}}>
          <circle cx={50} cy={50} r={44} fill={COLORS.accent} stroke={COLORS.white} strokeWidth={6} />
          <path d="M28 52 L44 68 L74 32" stroke={D} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span>
          {text}
          {detail ? <span style={{display: 'block', fontSize: 38, fontWeight: 400, lineHeight: 1.3, marginTop: 6}}>{detail}</span> : null}
        </span>
      </div>
      {frame < 0 ? null : null}
    </>
  );
};
