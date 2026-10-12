import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {COLORS, W, baseText} from '../../lib/theme';
import {Scene, Sfx, useBounce} from '../../lib/stage';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {Burst} from '../../components/Props';
import {Jitter} from '../PickYourPrice/parts';
import {TeaGlass} from '../TechGroups/parts';
import {Bubble, D, FeatureTag, Hl, Shot, Tech, WhatsAppCard, arDigits, fade} from '../_hero/parts';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 60 ثانية بالظبط. حدود المشاهد (بالثواني): 0 4 13 20 29 37 44 55 60 */
export const heroTechnicianDuration = 1800;
const BOUNDS = [0, 4, 13, 20, 29, 37, 44, 55, 60].map((s) => s * 30);
const b = (d: number, f: number) => Math.round(d * f);

/* ---------------- 1: الطلب بيرن على القهوة ---------------- */
const RingingPhone: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 14 && f < 70 ? Math.sin(f * 2.6) * 5 : -6;
  return <PhoneMockup src="screens/tech-notifications.png" width={330} left={640} top={880} delay={6} rotate={shake} highlight={{x: 3, y: 11, w: 94, h: 12, from: 24}} />;
};
const T1: React.FC<{d: number}> = () => (
  <>
    <Backdrop tone="rays" />
    <Sfx name="ring" at={14} volume={0.8} />
    <Jitter amp={0.7}>
      <HookTitle text="الطلب جالك وانت على القهوة!" hot={[4]} top={70} fontSize={108} />
    </Jitter>
    <div style={{position: 'absolute', left: 30, top: 640}}>
      <Tech mood="happy" width={540} delay={2} />
    </div>
    <RingingPhone />
    <div style={{position: 'absolute', left: 0, top: 1210, width: W, height: 40, background: COLORS.primary, borderTop: `8px solid ${D}`}} />
    <div style={{position: 'absolute', left: 0, top: 1250, width: W, height: 120, background: D, opacity: 0.9}} />
    <TeaGlass left={150} top={1090} />
  </>
);

/* ---------------- 2: عرض وتفاوض ---------------- */
const NegoFlow: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const pos = interpolate(f, [b(d, 0.3), b(d, 0.42)], [0, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/tech-new-job.png" pos={pos} />
      <Hl x={8} y={53} w={86} h={8} from={b(d, 0.08)} to={b(d, 0.3)} />
      <Hl x={10} y={60} w={84} h={9} from={b(d, 0.46)} />
    </div>
  );
};
const T2: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const fin = b(d, 0.8);
  const s = useBounce(fin, 8, 190);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="قدّم عرضك وتفاوض بنفسك" top={60} fontSize={48} delay={3} />
      <PhoneMockup width={500} left={290} top={215} delay={0}>
        <NegoFlow d={d} />
      </PhoneMockup>
      <Bubble text="ينفع ٣٢٠؟" left={770} top={560} width={290} fontSize={50} delay={b(d, 0.58)} to={fin + 30} tailSide="left" />
      <Bubble text="تمام، ٣٢٠" left={10} top={430} width={280} fontSize={50} delay={b(d, 0.68)} to={fin + 30} variant="accent" tailSide="right" />
      {f >= fin && (
        <div style={{...baseText, position: 'absolute', left: 190, top: 1090, width: 700, textAlign: 'center', fontSize: 52, color: COLORS.white, background: COLORS.primary, border: `7px solid ${D}`, borderRadius: 50, padding: '12px 0 18px', boxShadow: `0 10px 0 ${D}`, transform: `scale(${s})`, zIndex: 15}}>
          <Sfx name="ding" at={fin} volume={0.6} />
          اتفقنا: {arDigits(320)} ج.م
        </div>
      )}
      <div style={{position: 'absolute', left: -110, top: 880}}>
        <Tech mood="happy" width={420} delay={2} />
      </div>
    </>
  );
};

/* ---------------- 3: قرّبت أوصل ---------------- */
const OnMyWay: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const at = b(d, 0.14);
  const press = b(d, 0.42);
  const s = useBounce(at, 8, 180);
  const pressed = f >= press;
  const k = pressed ? (f < press + 6 ? 0.94 : 1) : 1;
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/tech-job.png" />
      <div style={{...baseText, position: 'absolute', left: 22, right: 22, top: '70%', textAlign: 'center', fontSize: 44, color: COLORS.white, background: pressed ? '#2E7D4F' : COLORS.primary, border: `5px solid ${D}`, borderRadius: 34, padding: '14px 0 20px', transform: `scale(${s * k})`, boxShadow: pressed ? '0 0 0 12px rgba(46,125,79,0.25)' : `0 8px 0 ${D}`}}>
        {pressed ? 'اتبلّغت العميلة ✓' : 'قرّبت أوصل'}
      </div>
    </div>
  );
};
const T3: React.FC<{d: number}> = ({d}) => (
  <>
    <Backdrop tone="light" />
    <FeatureTag text="قرّبت أوصل" top={60} fontSize={54} delay={3} />
    <PhoneMockup width={500} left={290} top={215} delay={0}>
      <OnMyWay d={d} />
    </PhoneMockup>
    <Sfx name="pop" at={b(d, 0.42)} />
    <WhatsAppCard left={680} top={420} from={b(d, 0.5)} text="الفني قرّب يوصل" sub="اتبعت للعميلة" />
    <div style={{position: 'absolute', left: -110, top: 880}}>
      <Tech mood="happy" gesture="point" width={420} delay={2} />
    </div>
  </>
);

/* ---------------- 4: قبل وبعد + الفاتورة ---------------- */
const PhotosInvoice: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const sw = b(d, 0.42);
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/tech-job.png" pos={0.45} opacity={1 - fade(f, sw, sw + 6)} />
      <Hl x={3} y={40} w={94} h={26} from={b(d, 0.1)} to={sw} />
      <Shot src="screens/tech-invoice.png" pos={0.8} opacity={fade(f, sw, sw + 6)} />
      <Hl x={4} y={57} w={92} h={7} from={sw + 14} />
    </div>
  );
};
const T4: React.FC<{d: number}> = ({d}) => {
  const sw = b(d, 0.42);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="صور قبل وبعد" top={60} fontSize={54} delay={3} to={sw} />
      <FeatureTag text="فاتورة PDF على الواتساب" top={60} fontSize={48} delay={sw + 4} />
      <PhoneMockup width={500} left={290} top={215} delay={0}>
        <PhotosInvoice d={d} />
      </PhoneMockup>
      <WhatsAppCard left={690} top={760} from={b(d, 0.72)} text="فاتورة رقم ١٢٧" sub="PDF · ١٬٤٥٠ ج.م" />
      <div style={{position: 'absolute', left: -110, top: 880}}>
        <Tech mood="happy" width={420} delay={2} />
      </div>
    </>
  );
};

/* ---------------- 5: فكّره ---------------- */
const MoneyList: React.FC<{d: number}> = ({d}) => {
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/tech-money-full.png" pos={0.35} />
      <Hl x={8} y={40} w={32} h={8.5} from={b(d, 0.1)} />
    </div>
  );
};
const T5: React.FC<{d: number}> = ({d}) => {
  const at = b(d, 0.42);
  const s = useBounce(at, 9, 170);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="دوس «فكّره»" top={60} fontSize={56} delay={3} />
      <PhoneMockup width={500} left={290} top={215} delay={0}>
        <MoneyList d={d} />
      </PhoneMockup>
      <div style={{...baseText, position: 'absolute', left: 60, top: 920, width: 960, transform: `translateY(${(1 - s) * 400}px) scale(${0.9 + 0.1 * s})`, opacity: Math.min(1, s * 3), zIndex: 15}}>
        <Sfx name="ding" at={at} volume={0.6} />
        <div style={{background: '#25D366', color: D, border: `7px solid ${D}`, borderRadius: 40, boxShadow: `0 10px 0 ${D}`, padding: '20px 30px 26px', fontSize: 40, lineHeight: 1.35}}>
          <div style={{fontSize: 30, marginBottom: 6}}>رسالة جاهزة · واتساب</div>
          أهلاً مدام سهير، تفكير بسيط بالمبلغ المتبقي {arDigits('1,400')} ج.م، ولينك الفاتورة تحت. شكرًا لثقتك.
        </div>
      </div>
      <div style={{position: 'absolute', left: -110, top: 880}}>
        <Tech mood="happy" width={420} delay={2} />
      </div>
    </>
  );
};

/* ---------------- 6: دخل الشهر ---------------- */
const T6: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [b(d, 0.12), b(d, 0.55)], [0, 18400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="دخل الشهر ومين عليه فلوس" top={30} fontSize={44} delay={3} />
      <div style={{...baseText, position: 'absolute', left: 0, top: 130, width: W, textAlign: 'center', fontSize: 84, color: COLORS.primary, WebkitTextStroke: `8px ${D}`, paintOrder: 'stroke fill', textShadow: `0 6px 0 ${D}`}}>
        {arDigits(n.toLocaleString('en-US'))} ج.م
      </div>
      <PhoneMockup width={500} left={290} top={265} delay={0}>
        <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
          <Shot src="screens/tech-money-full.png" />
          <Hl x={4} y={9} w={92} h={27} from={b(d, 0.1)} />
        </div>
      </PhoneMockup>
      <Sfx name="ding" at={b(d, 0.55)} volume={0.6} />
      <Burst left={20} top={560} size={170} delay={b(d, 0.5)} />
      <Burst left={W - 200} top={700} size={150} delay={b(d, 0.56)} />
    </>
  );
};

/* ---------------- 7: البدروم من غير نت ---------------- */
const WifiIcon: React.FC<{left: number; top: number; size: number; on: boolean}> = ({left, top, size, on}) => {
  const f = useCurrentFrame();
  const col = on ? '#2E7D4F' : COLORS.primary;
  const wob = on ? 1 + Math.sin(f * 0.4) * 0.03 : 1;
  return (
    <svg viewBox="0 0 200 200" width={size} style={{position: 'absolute', left, top, transform: `scale(${wob})`, overflow: 'visible'}}>
      <circle cx={100} cy={100} r={92} fill={COLORS.white} stroke={D} strokeWidth={8} />
      <g stroke={col} strokeWidth={13} strokeLinecap="round" fill="none">
        <path d="M44 84 Q100 36 156 84" opacity={on ? 1 : 0.35} />
        <path d="M64 108 Q100 78 136 108" opacity={on ? 1 : 0.35} />
      </g>
      <circle cx={100} cy={134} r={12} fill={col} />
      {!on && <path d="M42 42 L158 158" stroke={COLORS.primary} strokeWidth={15} strokeLinecap="round" />}
    </svg>
  );
};
const Bulb: React.FC = () => {
  const f = useCurrentFrame();
  const sw = Math.sin(f * 0.08) * 6;
  return (
    <svg viewBox="0 0 100 200" width={110} style={{position: 'absolute', left: 485, top: 0, transform: `rotate(${sw}deg)`, transformOrigin: '50% 0%', overflow: 'visible'}}>
      <path d="M50 0 V90" stroke="#0d120b" strokeWidth={5} />
      <circle cx={50} cy={118} r={26} fill="#F6D98B" stroke="#0d120b" strokeWidth={5} />
      <rect x={38} y={88} width={24} height={14} rx={4} fill="#0d120b" />
    </svg>
  );
};
const T7: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const back = b(d, 0.58);
  const online = f >= back;
  const saved = b(d, 0.34);
  const sv = useBounce(saved, 8, 190);
  const tg = useBounce(back, 8, 190);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, #1f281c 0%, #2F3B2A 100%)`}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 4px, transparent 4px 70px), repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 4px, transparent 4px 140px)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 280, height: 420, background: 'rgba(0,0,0,0.25)', clipPath: 'polygon(0 0, 100% 0, 0 100%)'}} />
      <Bulb />
      <FeatureTag text="شغال حتى من غير نت" top={40} fontSize={46} delay={3} to={back} />
      {online && <FeatureTag text="هتتبعت لوحدها لما النت يرجع" top={40} fontSize={42} delay={back + 2} />}
      <WifiIcon left={90} top={230} size={330} on={online} />
      <div style={{...baseText, position: 'absolute', left: 60, top: 590, width: 380, textAlign: 'center', fontSize: 52, color: online ? '#9BD08A' : COLORS.white}}>{online ? 'النت رجع' : 'النت قاطع'}</div>
      <PhoneMockup src="screens/tech-today.png" width={420} left={560} top={270} delay={2} highlight={{x: 6, y: 11, w: 88, h: 8, from: b(d, 0.12)}} />
      {f >= saved && (
        <div style={{...baseText, position: 'absolute', left: 520, top: 1010, width: 520, textAlign: 'center', fontSize: 44, color: D, background: COLORS.accent, border: `6px solid ${D}`, borderRadius: 40, padding: '8px 0 14px', transform: `scale(${sv})`, zIndex: 12}}>
          <Sfx name="pop" at={saved} />
          الشغلانة اتحفظت ✓
        </div>
      )}
      {online && (
        <div style={{position: 'absolute', left: 140, top: 700, transform: `scale(${tg}) rotate(${f * 6}deg)`}}>
          <Sfx name="ding" at={back} volume={0.6} />
          <svg viewBox="0 0 100 100" width={120}><path d="M50 12 A38 38 0 1 1 14 62" stroke="#9BD08A" strokeWidth={12} strokeLinecap="round" fill="none" /><path d="M14 40 V66 H40" stroke="#9BD08A" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        </div>
      )}
      <div style={{position: 'absolute', left: -60, top: 840}}>
        <Tech mood={online ? 'happy' : 'worried'} width={470} delay={0} />
      </div>
    </>
  );
};

export const HeroTechnician: React.FC = () => {
  const scenes: Array<React.FC<{d: number}>> = [T1, T2, T3, T4, T5, T6, T7];
  return (
    <VideoShell lines={lines} total={heroTechnicianDuration} cuts={BOUNDS.slice(1, 8)}>
      {scenes.map((C, i) => (
        <Scene key={i} from={BOUNDS[i]} to={BOUNDS[i + 1]}>
          <C d={BOUNDS[i + 1] - BOUNDS[i]} />
        </Scene>
      ))}
      <Scene from={BOUNDS[7]} to={BOUNDS[8]}>
        <EndCard phrase="أول شغلانتين من التطبيق مجانًا · والزبون اللي رجعلك تاني من غير رسوم" phraseSize={46} />
      </Scene>
    </VideoShell>
  );
};
