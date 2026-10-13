import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, W, baseText} from '../../lib/theme';
import {Scene, Sfx, useBounce} from '../../lib/stage';
import {Line} from '../../lib/timing';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {Burst} from '../../components/Props';
import {Jitter} from '../PickYourPrice/parts';
import {
  Bubble, CategoryGrid, CoughPuff, D, DoorScene, FeatureTag, Foam, FreeBadge, GiftBox, Heba, Hl, IdSelfie, LaundryPile, OffersScreen, Shot,
  Stamp, Tech, ThoughtCloud, ThoughtTail, ThreeCounter, WashingMachine, WhatsAppCard, arDigits, fade,
} from './parts';

const b = (d: number, f: number) => Math.round(d * f);

/* ---------------- 1: الخطّاف ---------------- */
const S1: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, d], [0.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Backdrop tone="rays" />
      <Sfx name="buzzer" at={2} volume={0.7} />
      <Sfx name="buzzer" at={b(d, 0.5)} volume={0.7} />
      <LaundryPile left={600} top={1040} width={440} delay={6} />
      <WashingMachine left={270} top={560} width={540} state="broken" shake={0.8 + p * 1.8} />
      <Foam p={p} originX={540} originY={640} />
      <div style={{position: 'absolute', left: 10, top: 880}}>
        <Heba mood="shocked" gesture="handsUp" width={430} delay={4} />
      </div>
      <Jitter amp={0.7}>
        <HookTitle text="الغسالة باظت والغسيل لسقف البيت؟" hot={[1]} top={60} fontSize={104} />
      </Jitter>
    </>
  );
};

/* ---------------- 2: فلاش باك ---------------- */
const CalendarChip: React.FC<{left: number; top: number; at: number}> = ({left, top, at}) => {
  const s = useBounce(at, 8, 190);
  return (
    <div style={{...baseText, position: 'absolute', left, top, transform: `scale(${s})`, background: COLORS.white, border: `6px solid ${D}`, borderRadius: 26, padding: '8px 22px 12px', fontSize: 44, boxShadow: `0 7px 0 ${D}`, display: 'flex', alignItems: 'center', gap: 12, color: D}}>
      <svg viewBox="0 0 100 100" width={48} height={48}><rect x={10} y={18} width={80} height={72} rx={10} fill={COLORS.white} stroke={D} strokeWidth={7} /><rect x={10} y={18} width={80} height={24} rx={10} fill={COLORS.primary} stroke={D} strokeWidth={7} /><path d="M32 8 V26 M68 8 V26" stroke={D} strokeWidth={8} strokeLinecap="round" /></svg>
      بعد يومين
    </div>
  );
};

const S2: React.FC<{d: number}> = ({d}) => {
  const popAt = b(d, 0.88);
  const stampAt = b(d, 0.62);
  const f = useCurrentFrame();
  return (
    <>
      <Backdrop tone="light" />
      <ThoughtCloud left={70} top={70} width={940} delay={0} popAt={popAt}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0}} />
      </ThoughtCloud>
      {f < popAt + 6 && (
        <div style={{opacity: 1 - fade(f, popAt, popAt + 6)}}>
          <div style={{position: 'absolute', left: 120, top: 250}}>
            <Tech mood="happy" width={250} delay={b(d, 0.04)} />
          </div>
          <FeatureTag text="فني من الجروب" top={150} left={80} width={420} fontSize={36} delay={b(d, 0.06)} to={stampAt} />
          <Bubble text="السعر؟ لما أشوف" left={400} top={215} width={430} fontSize={48} delay={b(d, 0.1)} />
          <CalendarChip left={470} top={455} at={b(d, 0.36)} />
          <WashingMachine left={690} top={400} width={175} state="broken" shake={0.5} delay={b(d, 0.4)} />
        </div>
      )}
      <ThoughtTail points={[[560, 785, 30], [535, 840, 21], [518, 885, 13]]} delay={4} popAt={popAt} />
      <Stamp text="لأ تاني لأ" left={110} top={330} width={860} from={stampAt} />
      {f >= popAt && <Sfx name="pop" at={popAt} volume={0.8} />}
      {f >= popAt && (
        <>
          <Burst left={150} top={200} size={230} delay={popAt} />
          <Burst left={W - 400} top={300} size={260} delay={popAt + 2} />
          <Burst left={430} top={520} size={200} delay={popAt + 4} color={COLORS.primary} />
        </>
      )}
      <div style={{position: 'absolute', left: 270, top: 790}}>
        <Heba mood={f < stampAt ? 'worried' : 'angry'} width={540} delay={0} />
      </div>
    </>
  );
};

/* ---------------- 3: الدخول ---------------- */
const LoginFlow: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const sw = b(d, 0.46);
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/login-phone.png" opacity={1 - fade(f, sw, sw + 6)} />
      <Shot src="screens/login-code.png" opacity={fade(f, sw, sw + 6)} />
      <Hl x={2} y={37} w={96} h={10} from={b(d, 0.12)} to={sw} />
    </div>
  );
};
const S3: React.FC<{d: number}> = ({d}) => (
  <>
    <Backdrop tone="light" />
    <FeatureTag text="دخول بالواتساب · من غير باسورد" top={60} fontSize={46} delay={4} />
    <PhoneMockup width={500} left={290} top={215} delay={0}>
      <LoginFlow d={d} />
    </PhoneMockup>
    <WhatsAppCard left={680} top={560} from={b(d, 0.4)} text="كودك: ٤٨٢٧٦٣" sub="صلحلي" />
    <FreeBadge left={W - 360} top={880} from={b(d, 0.7)} size={300} />
    <div style={{position: 'absolute', left: -100, top: 800}}>
      <Heba mood="happy" gesture="point" width={420} delay={2} />
    </div>
  </>
);

/* ---------------- 4: الأقسام + الطلب ---------------- */
const RequestFlow: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const sw = b(d, 0.8);
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/request-problem.png" opacity={1 - fade(f, sw, sw + 6)} />
      <Shot src="screens/request-address.png" opacity={fade(f, sw, sw + 6)} />
      <Hl x={4} y={33} w={92} h={14} from={b(d, 0.62)} to={sw} />
      <Hl x={4} y={17} w={92} h={12} from={sw + 8} />
    </div>
  );
};
const S4: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const exitAt = b(d, 0.46);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="اختاري التخصص" top={70} fontSize={54} delay={2} to={exitAt + 4} />
      <CategoryGrid top={200} selected="غسالات" selectAt={b(d, 0.34)} exitAt={exitAt} step={Math.max(2, Math.round(d * 0.018))} />
      {f >= exitAt && (
        <>
          <FeatureTag text="اكتبي المشكلة وحددي العنوان" top={60} fontSize={44} delay={exitAt + 6} />
          <PhoneMockup width={500} left={290} top={215} delay={exitAt + 2}>
            <RequestFlow d={d - exitAt} />
          </PhoneMockup>
        </>
      )}
    </>
  );
};

/* ---------------- 5: العروض ---------------- */
const S5: React.FC<{d: number}> = ({d}) => {
  const hag = b(d, 0.58);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="لحد ٥ عروض · الأسعار قدامك" top={50} fontSize={48} delay={3} left={160} width={W - 160} />
      <PhoneMockup width={640} left={400} top={150} delay={0}>
        <OffersScreen d={d} />
      </PhoneMockup>
      <Bubble text="ينفع ٣٠٠؟" left={10} top={640} width={330} fontSize={56} delay={hag - 4} to={hag + 75} tailSide="right" />
      <Bubble text="ماشي، ٣٠٠" left={20} top={470} width={340} fontSize={52} delay={hag + 14} to={hag + 95} variant="accent" tailSide="right" />
      <div style={{position: 'absolute', left: -110, top: 860}}>
        <Heba mood="happy" gesture="point" width={430} delay={2} />
      </div>
    </>
  );
};

/* ---------------- 6: البروفايل ---------------- */
const S6: React.FC<{d: number}> = ({d}) => (
  <>
    <Backdrop tone="light" />
    <FeatureTag text="بروفايل الفني" top={60} fontSize={52} delay={3} />
    <IdSelfie left={20} top={300} width={470} from={b(d, 0.05)} />
    <FeatureTag text="موثّق بالبطاقة وصورته ماسكها" top={800} fontSize={34} left={10} width={500} delay={b(d, 0.2)} />
    <PhoneMockup src="screens/tech-profile.png" width={500} left={540} top={190} delay={2} scrollFrom={0} scrollTo={1} scrollDelay={b(d, 0.42)} scrollDuration={b(d, 0.28)} highlight={{x: 4, y: 41, w: 92, h: 34, from: b(d, 0.74)}} />
    <Sfx name="ding" at={b(d, 0.74)} volume={0.5} />
  </>
);

/* ---------------- 7: الفني قرّب يوصل ---------------- */
const NotifToast: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const s = useBounce(at, 9, 170);
  return (
    <div style={{...baseText, position: 'absolute', left: 20, top: 150, width: 470, transform: `translateY(${(1 - s) * -300}px) scale(${0.92 + 0.08 * s})`, opacity: Math.min(1, s * 3), background: D, border: `6px solid ${COLORS.accent}`, borderRadius: 36, padding: '16px 24px 20px', color: COLORS.white, boxShadow: '0 12px 0 rgba(47,59,42,0.35)', zIndex: 15}}>
      <Sfx name="ding" at={at} volume={0.7} />
      <div style={{fontSize: 24, fontWeight: 400, opacity: 0.8}}>صلحلي · دلوقتي</div>
      <div style={{fontSize: 46, lineHeight: 1.15}}>الفني قرّب يوصل</div>
      <div style={{position: 'absolute', left: 14, top: 14, width: 18, height: 18, borderRadius: 9, background: COLORS.primary, opacity: f % 20 < 12 ? 1 : 0.4}} />
    </div>
  );
};
const S7: React.FC<{d: number}> = ({d}) => {
  const openAt = b(d, 0.56);
  return (
    <>
      <Backdrop tone="light" />
      <PhoneMockup src="screens/client-notifications.png" width={420} left={40} top={80} delay={0} highlight={{x: 3, y: 25, w: 94, h: 9, from: b(d, 0.1)}} />
      <NotifToast at={b(d, 0.06)} />
      <DoorScene left={600} top={400} width={400} openAt={openAt}>
        <div style={{position: 'absolute', left: 30, top: 240}}>
          {d > openAt ? <Tech mood="happy" gesture="wave" width={340} delay={openAt + 2} /> : null}
        </div>
      </DoorScene>
      <div style={{position: 'absolute', left: -20, top: 700}}>
        <Heba mood="happy" gesture="adjust" width={480} delay={0} />
      </div>
      <Sfx name="doorbell" at={openAt - 8} volume={0.7} />
    </>
  );
};

/* ---------------- 8: الغسالة شغالة + تقييم ---------------- */
const Stars5: React.FC<{from: number; top: number}> = ({from, top}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, top, width: 560, display: 'flex', justifyContent: 'center', gap: 8, direction: 'rtl', zIndex: 10}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const at = from + i * 5;
        const s = useBounce(at, 7, 220);
        return (
          <React.Fragment key={i}>
            {f >= at && <Sfx name="pop" at={at} volume={0.4} />}
            <svg viewBox="-100 -100 200 200" width={96} height={96} style={{transform: `scale(${s}) rotate(${(1 - s) * 40}deg)`}}>
              <path d="M0 -90 L26 -30 L90 -26 L40 16 L56 80 L0 46 L-56 80 L-40 16 L-90 -26 L-26 -30 Z" fill={COLORS.accent} stroke={D} strokeWidth={10} strokeLinejoin="round" />
            </svg>
          </React.Fragment>
        );
      })}
    </div>
  );
};
const S8: React.FC<{d: number}> = ({d}) => (
  <>
    <Backdrop tone="rays" />
    <WashingMachine left={20} top={330} width={560} state="happy" delay={0} />
    <Burst left={30} top={220} size={170} delay={6} />
    <Stars5 from={b(d, 0.42)} top={190} />
    <PhoneMockup src="screens/review.png" width={420} left={600} top={150} delay={b(d, 0.3)} highlight={{x: 8, y: 58, w: 84, h: 11, from: b(d, 0.5)}} />
    <FeatureTag text="قيّمي الفني" top={30} left={540} width={540} fontSize={40} delay={b(d, 0.32)} />
  </>
);

/* ---------------- 9: شكوى + متابعة + تقييم ---------------- */
const SupportFlow: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const a = b(d, 0.4);
  const c = b(d, 0.72);
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.background}}>
      <Shot src="screens/complaint.png" pos={1} opacity={1 - fade(f, a, a + 6)} />
      <Hl x={4} y={90} w={92} h={8} from={b(d, 0.12)} to={a} />
      <Shot src="screens/tracking.png" opacity={fade(f, a, a + 6) * (1 - fade(f, c, c + 6))} />
      <Hl x={4} y={23} w={92} h={44} from={a + 10} to={c} />
      <Shot src="screens/review.png" opacity={fade(f, c, c + 6)} />
      <Hl x={8} y={58} w={84} h={11} from={c + 10} />
    </div>
  );
};
const S9: React.FC<{d: number}> = ({d}) => {
  const a = b(d, 0.4);
  const c = b(d, 0.72);
  return (
    <>
      <Backdrop tone="light" />
      <FeatureTag text="ابعت شكوى · فريقنا يكلمك واتساب" top={40} left={0} width={W} fontSize={42} delay={b(d, 0.04)} to={a} />
      <FeatureTag text="تابع طلبك خطوة بخطوة" top={40} left={0} width={W} fontSize={50} delay={a + 4} from={a} to={c} />
      <FeatureTag text="قيّم الفني بعد الشغل" top={40} left={0} width={W} fontSize={50} delay={c + 4} from={c} />
      <WashingMachine left={30} top={190} width={330} state="cough" delay={0} />
      <CoughPuff left={250} top={170} from={4} />
      <WhatsAppCard left={40} top={640} from={b(d, 0.16)} text="فريقنا بيكلمك" sub="على الواتساب" />
      <PhoneMockup width={520} left={520} top={200} delay={0}>
        <SupportFlow d={d} />
      </PhoneMockup>
      <div style={{position: 'absolute', left: -90, top: 860}}>
        <Heba mood="happy" width={420} delay={2} />
      </div>
    </>
  );
};

/* ---------------- 10: عداد ٣ + هدية + صيانة ---------------- */
const S10: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const swap = b(d, 0.56);
  const leave = interpolate(f, [swap - 6, swap + 4], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const t1 = b(d, 0.06), t2 = b(d, 0.16), t3 = b(d, 0.26);
  return (
    <>
      <Backdrop tone="rays" />
      {f < swap + 6 && (
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1920, opacity: leave, transform: `translateY(${(1 - leave) * -200}px)`}}>
          <ThreeCounter top={110} times={[t1, t2, t3]} />
          <GiftBox left={310} top={520} size={460} openAt={b(d, 0.34)} />
          <FeatureTag text="كل ٣ شغلانات، طلب هدية" top={1090} fontSize={46} delay={b(d, 0.3)} />
        </div>
      )}
      {f >= swap && (
        <>
          <FeatureTag text="تذكير بالصيانة" top={40} fontSize={46} delay={swap + 2} />
          <PhoneMockup src="screens/client-orders.png" width={500} left={290} top={280} delay={swap} highlight={{x: 52, y: 47, w: 44, h: 6.5, from: swap + 26}} />
          <div style={{...baseText, position: 'absolute', left: 190, top: 170, width: 700, zIndex: 15}}>
            <MaintenanceToast at={swap + 8} />
          </div>
          <BookAgain at={swap + 30} />
        </>
      )}
    </>
  );
};
const MaintenanceToast: React.FC<{at: number}> = ({at}) => {
  const s = useBounce(at, 9, 170);
  return (
    <div style={{...baseText, background: D, border: `6px solid ${COLORS.accent}`, borderRadius: 34, padding: '14px 26px 18px', color: COLORS.white, fontSize: 44, textAlign: 'center', transform: `translateY(${(1 - s) * -260}px)`, opacity: Math.min(1, s * 3), boxShadow: '0 10px 0 rgba(47,59,42,0.35)'}}>
      <Sfx name="ding" at={at} volume={0.6} />
      معاد صيانة التكييف
    </div>
  );
};
const BookAgain: React.FC<{at: number}> = ({at}) => {
  const s = useBounce(at, 8, 180);
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f * 0.35) * 0.03;
  return (
    <div style={{...baseText, position: 'absolute', left: 190, top: 1080, width: 700, textAlign: 'center', fontSize: 52, color: COLORS.white, background: COLORS.primary, border: `7px solid ${D}`, borderRadius: 50, padding: '14px 0 20px', boxShadow: `0 10px 0 ${D}`, transform: `scale(${s * pulse})`, zIndex: 15}}>
      احجز نفس الفني تاني
    </div>
  );
};

/* ---------------- 11: هبة للكاميرا ---------------- */
const Pot: React.FC<{left: number; top: number; delay: number}> = ({left, top, delay}) => {
  const f = useCurrentFrame();
  const s = useBounce(delay, 9, 150);
  return (
    <svg viewBox="0 0 300 260" width={300} style={{position: 'absolute', left, top, transform: `scale(${s})`, overflow: 'visible'}}>
      {[80, 150, 220].map((x, i) => (
        <path key={i} d={`M${x} 60 q-16 -26 0 -50`} stroke={D} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.45} transform={`translate(0 ${-((f * 1.5 + i * 18) % 40)})`} />
      ))}
      <path d="M30 90 H270 V200 Q270 240 230 240 H70 Q30 240 30 200 Z" fill={COLORS.accent} stroke={D} strokeWidth={8} strokeLinejoin="round" />
      <rect x={14} y={72} width={272} height={28} rx={12} fill={COLORS.primary} stroke={D} strokeWidth={8} />
      <rect x={120} y={46} width={60} height={30} rx={14} fill={D} />
      <path d="M30 140 H270" stroke={D} strokeWidth={5} opacity={0.3} />
    </svg>
  );
};
const S11: React.FC<{d: number}> = ({d}) => (
  <>
    <Backdrop tone="light" />
    <Burst left={20} top={230} size={170} delay={4} />
    <Pot left={740} top={470} delay={b(d, 0.2)} />
    <FeatureTag text="وصفات ست البيت" top={250} left={600} width={440} fontSize={38} delay={b(d, 0.3)} />
    <div style={{position: 'absolute', left: 160, top: 360}}>
      <Heba mood="happy" gesture="none" width={700} delay={0} />
    </div>
  </>
);

/* ---------------- تركيب الفيديو ---------------- */
export const WashingStory: React.FC<{lines: Line[]; total: number; bounds: number[]}> = ({lines, total, bounds}) => {
  const scenes: Array<React.FC<{d: number}>> = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];
  return (
    <VideoShell lines={lines} total={total} cuts={bounds.slice(1, 12)}>
      {scenes.map((C, i) => (
        <Scene key={i} from={bounds[i]} to={bounds[i + 1]}>
          <C d={bounds[i + 1] - bounds[i]} />
        </Scene>
      ))}
      <Scene from={bounds[11]} to={bounds[12]}>
        <EndCard phrase="متابعة لطلبك · شكوى على الواتساب · تقييم بعد الشغل" phraseSize={46}>
          <div style={{...baseText, position: 'absolute', left: 0, top: 1275, width: W, textAlign: 'center', fontSize: 38, color: D, background: COLORS.accent, padding: '12px 0 16px', borderTop: `6px solid ${D}`, borderBottom: `6px solid ${D}`}}>
            فنيين موثّقين · سعرك قبل ما ييجي · أول طلبين مجانًا
          </div>
        </EndCard>
      </Scene>
    </VideoShell>
  );
};
