import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useBounce, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W, baseText} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {SpeechBubble} from '../../components/SpeechBubble';
import {Burst, Wrench} from '../../components/Props';
import {IdCardIcon, Jitter} from '../PickYourPrice/parts';
import {SupportIcon} from '../_hero/parts';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 25 ثانية بالظبط. الصوت على أوقات ثابتة (at في script.json). */
export const momFoundOutDuration = 750;

const S2 = 90; // 3ث
const S3 = 240; // 8ث
const S4 = 540; // 18ث
const S5 = 630; // 21ث

const D = COLORS.dark;

const Mom: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  // إسدال: طرحة طويلة بلون داكن
  return <Character outfit="hijab" skin={SKINS.light} color={D} accessory="#4a5a42" speaking={speaking} {...p} />;
};
const Son: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="shirt" skin={SKINS.medium} color={COLORS.primary} speaking={speaking} {...p} />;
};

/** ستيكر بيطلع فوق الموبايل: أيقونة + نص. */
const Sticker: React.FC<{from: number; to: number; text: string; children: React.ReactNode}> = ({from, to, text, children}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(from, 8, 190);
  const out = interpolate(frame, [to - 6, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < from || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute', left: 90, top: 40, width: W - 180, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22,
        background: COLORS.white, border: `7px solid ${D}`, borderRadius: 75, boxShadow: `0 10px 0 ${D}`,
        transform: `scale(${pop * out}) rotate(${(1 - pop) * -6}deg)`, opacity: out,
      }}
    >
      <div style={{width: 110, height: 110}}>{children}</div>
      <span style={{...baseText, fontSize: 68, color: D}}>{text}</span>
    </div>
  );
};

const StarsIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%">
    <circle cx={100} cy={100} r={88} fill={COLORS.accent} stroke={D} strokeWidth={9} />
    <path d="M100 38 L120 82 L168 86 L132 118 L143 164 L100 140 L57 164 L68 118 L32 86 L80 82 Z" fill={COLORS.white} stroke={D} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** الأم بتقرّب من الموبايل وتعبيرها بيتحول من angry لـ happy. */
const MomNearPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [50, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ease = 1 - Math.pow(1 - t, 3);
  return (
    <div style={{position: 'absolute', left: -110, top: 700, transformOrigin: '50% 100%', transform: `translateX(${ease * 45}px) scale(${1 + ease * 0.12})`}}>
      <Mom mood={frame < 100 ? 'angry' : 'happy'} width={460} delay={0} />
    </div>
  );
};

export const MomFoundOut: React.FC = () => (
  <VideoShell lines={lines} total={momFoundOutDuration} cuts={[S2, S3, S4, S5]}>
    {/* ===== مشهد 1 (0–3ث): الأم + الخطّاف ===== */}
    <Scene from={0} to={S2}>
      <Backdrop tone="rays" />
      <Sfx name="buzzer" at={2} volume={0.8} />
      <Jitter amp={0.8}>
        <HookTitle text="إنت جايب واحد معرفوش يدخل البيت؟!" hot={[3]} top={70} fontSize={118} />
      </Jitter>
      <div style={{position: 'absolute', left: 240, top: 600}}>
        <Mom mood="angry" gesture="hips" width={600} delay={2} />
      </div>
      <Burst left={30} top={760} size={180} delay={12} />
      <Burst left={W - 220} top={800} size={160} delay={18} />
    </Scene>

    {/* ===== مشهد 2 (3–8ث): الابن متوتر + الأم ===== */}
    <Scene from={S2} to={S3}>
      <Backdrop tone="light" />
      <SpeechBubble text="رقمه من الجروب" left={30} top={330} width={470} fontSize={56} tail="bottom" delay={6} rotate={-3} />
      <SpeechBubble text="والجروب ده هيرجعلك فلوسك؟" left={590} top={300} width={470} fontSize={54} tail="bottom" delay={64} variant="primary" rotate={3} />
      <div style={{position: 'absolute', left: 10, top: 640}}>
        <Son mood="worried" width={470} delay={0} />
      </div>
      <div style={{position: 'absolute', left: 590, top: 640}}>
        <Mom mood="angry" flip width={470} delay={4} />
      </div>
    </Scene>

    {/* ===== مشهد 3 (8–18ث): صلحلي على الموبايل ===== */}
    <Scene from={S3} to={S4}>
      <Backdrop tone="light" />
      <Sticker from={18} to={90} text="متوثق بالبطاقة">
        <IdCardIcon />
      </Sticker>
      <Sticker from={94} to={122} text="تقييمات زباين قبله">
        <StarsIcon />
      </Sticker>
      <Sticker from={124} to={300} text="شكوى ومتابعة وتقييم">
        <SupportIcon />
      </Sticker>
      <Sfx name="pop" at={18} />
      <Sfx name="pop" at={94} />
      <Sfx name="ding" at={124} volume={0.6} />
      <PhoneMockup
        src="screens/tech-profile.png"
        width={500}
        left={330}
        top={215}
        delay={4}
        scrollFrom={0}
        scrollTo={1}
        scrollDelay={80}
        scrollDuration={40}
        highlight={{x: 4, y: 41, w: 92, h: 34, from: 128}}
      />
      <div style={{position: 'absolute', left: 790, top: 800}}>
        <Son mood="happy" flip gesture="point" width={340} delay={0} />
      </div>
      <MomNearPhone />
    </Scene>

    {/* ===== مشهد 4 (18–21ث): احجز نفس الفني تاني ===== */}
    <Scene from={S4} to={S5}>
      <Backdrop tone="light" />
      <PhoneMockup
        src="screens/tech-profile.png"
        width={480}
        left={500}
        top={215}
        delay={0}
        scrollFrom={1}
        scrollTo={1}
        highlight={{x: 4, y: 89.5, w: 92, h: 8.5, from: 20}}
      />
      <div style={{position: 'absolute', left: -90, top: 700}}>
        <Mom mood="happy" width={470} delay={2} />
      </div>
      <Sfx name="ding" at={44} volume={0.6} />
      <MaintenanceToast from={44} />
    </Scene>

    {/* ===== مشهد 5 (21–25ث): كارت الختام ===== */}
    <Scene from={S5} to={momFoundOutDuration}>
      <EndCard phrase="أول طلبين مجانًا، وكل ٣ شغلانات طلب هدية" phraseSize={52} />
    </Scene>
  </VideoShell>
);

/** إشعار تذكير بالصيانة. */
const MaintenanceToast: React.FC<{from: number}> = ({from}) => {
  const pop = useBounce(from, 9, 170);
  return (
    <div
      style={{
        position: 'absolute', left: 60, top: 50, width: W - 120, height: 130, display: 'flex', alignItems: 'center', gap: 24, padding: '0 36px', boxSizing: 'border-box',
        background: COLORS.dark, border: `6px solid ${COLORS.accent}`, borderRadius: 40, boxShadow: '0 12px 0 rgba(47,59,42,0.35)',
        transform: `translateY(${(1 - pop) * -240}px) scale(${0.9 + 0.1 * pop})`, opacity: Math.min(1, pop * 2.5),
      }}
    >
      <Wrench size={80} fill={COLORS.accent} />
      <span style={{...baseText, fontSize: 52, color: COLORS.white, flex: 1, textAlign: 'right', lineHeight: 1.2}}>تذكير: ميعاد صيانة التلاجة</span>
    </div>
  );
};
