import React from 'react';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useBounce, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W, baseText} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {Logo} from '../../components/Logo';
import {Burst} from '../../components/Props';
import {HookTitle} from '../../components/HookTitle';
import {AfterDays, Bell, CallScreen, CommentBubbles, Faucet, FeatureCard, FlipIn, GroupPostScreen, Invoice, Muted} from './parts';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 30 ثانية بالظبط (الصوت بيتحط على أوقات ثابتة في script.json عن طريق at). */
export const groupTechnicianDuration = 900;

// حدود المشاهد بالفريمات (30fps)
const S2 = 90; // 3ث
const S3 = 270; // 9ث
const S4 = 450; // 15ث
const S5 = 795; // 26.5ث (جملة الضمان الكاملة بتخلص قبل كارت الختام)

const Woman: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={COLORS.dark} accessory={COLORS.accent} speaking={speaking} {...p} />;
};
const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} color={COLORS.dark} accessory="#6b6f66" mustache speaking={speaking} {...p} />;
};

/** دخول الفني من اليمين. */
const SlideIn: React.FC<{from: number; children: React.ReactNode; style?: React.CSSProperties}> = ({from, children, style}) => {
  const s = useBounce(from, 11, 120);
  return <div style={{position: 'absolute', transform: `translateX(${(1 - s) * 620}px)`, ...style}}>{children}</div>;
};

export const GroupTechnician: React.FC = () => (
  <VideoShell lines={lines} total={groupTechnicianDuration} cuts={[S2, S3, S5]}>
    {/* ===== مشهد 1 (0–3ث): السؤال في الجروب ===== */}
    <Scene from={0} to={S2}>
      <Muted>
        <Backdrop tone="light" />
        <Sfx name="pop" at={4} />
        {/* كنبة */}
        <div style={{position: 'absolute', left: 90, top: 900, width: 900, height: 700, borderRadius: 120, background: COLORS.dark, opacity: 0.14}} />
        {/* الترجمة الكبيرة (الخطّاف): "سألت في الجروب؟" */}
        <HookTitle text="سألت في الجروب؟" hot={[2]} top={110} fontSize={150} />
        <div style={{position: 'absolute', left: 280, top: 440}}>
          <Woman mood="worried" width={520} delay={0} />
        </div>
        <PhoneMockup width={500} left={290} top={900} delay={2} rotate={-3}>
          <GroupPostScreen typeFrom={14} />
        </PhoneMockup>
      </Muted>
    </Scene>

    {/* ===== مشهد 2 (3–9ث): ٣٠ تعليق، الجرس، الفني ===== */}
    <Scene from={S2} to={S3}>
      <Muted>
        <Backdrop tone="light" />
        <CommentBubbles start={0} />
        <Sequence from={36}>
          <Sfx name="doorbell" at={0} volume={0.8} />
          <Bell left={780} top={480} size={230} />
        </Sequence>
        <div style={{position: 'absolute', left: 10, top: 700}}>
          <Woman mood="worried" width={500} delay={30} />
        </div>
        <SlideIn from={52} style={{left: 540, top: 690}}>
          <Tech mood="angry" flip width={500} delay={52} />
        </SlideIn>
      </Muted>
    </Scene>

    {/* ===== مشهد 3 (9–15ث): الفاتورة، بعد يومين، الرقم مش متاح ===== */}
    <Scene from={S3} to={S4 + 22}>
      <Muted>
        <Backdrop tone="dark" />
        <Sequence from={0} durationInFrames={58}>
          <Sfx name="whoosh" at={0} volume={0.45} />
          <Invoice />
        </Sequence>
        <Sequence from={56}>
          <Sfx name="ring" at={0} volume={0.7} />
          <Faucet left={30} top={330} size={440} />
          <PhoneMockup width={440} left={580} top={300} delay={0}>
            <CallScreen failAt={19} />
          </PhoneMockup>
        </Sequence>
        {/* الشخصية برا الـ Sequence المتداخل عشان توقيت الكلام (useSpeaker) يفضل صح */}
        <ShockedWoman />
        {/* آخر حاجة في الترتيب عشان تفضل فوق موبايل الاتصال */}
        <Sequence from={46} durationInFrames={30}>
          <AfterDays />
        </Sequence>
      </Muted>
    </Scene>

    {/* ===== مشهد 4 (15–25ث): الشاشة تتقلب لألوان صلحلي + مميزات ===== */}
    <Sfx name="whoosh" at={S4 - 6} volume={0.7} />
    <Scene from={S4} to={S5}>
      <FlipIn>
        <Backdrop tone="rays" />
        {/* شعار صلحلي فوق */}
        <div style={{position: 'absolute', left: 0, top: 70, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
          <Logo size={120} />
          <span style={{...baseText, fontSize: 104, color: COLORS.white, WebkitTextStroke: `9px ${COLORS.dark}`, paintOrder: 'stroke fill', textShadow: `0 8px 0 ${COLORS.dark}`}}>صلحلي</span>
        </div>
        <Burst left={W - 160} top={150} size={150} delay={14} />

        {/* الموبايل بيبدّل الشاشة مع كل ميزة (صور التطبيق الحقيقية) */}
        <Sequence from={14} durationInFrames={90}>
          <FadeOut at={80}>
            <PhoneMockup src="screens/tech-profile.png" width={470} left={40} top={250} delay={0} highlight={{x: 42, y: 15, w: 32, h: 5, from: 18}} />
          </FadeOut>
        </Sequence>
        <Sequence from={98} durationInFrames={110}>
          <FadeOut at={100}>
            <PhoneMockup src="screens/offers.png" width={470} left={40} top={250} delay={0} scrollFrom={0} scrollTo={0.3} scrollDuration={80} scrollDelay={14} />
          </FadeOut>
        </Sequence>
        <Sequence from={200}>
          <PhoneMockup src="screens/problem.png" width={470} left={40} top={250} delay={0} scrollFrom={0} scrollTo={0.25} scrollDuration={70} scrollDelay={20} />
        </Sequence>

        <FeatureCard text="فني متسجل ببطاقته" delay={16} top={380} />
        <FeatureCard text="٥ عروض والسعر قبل ما ييجي" delay={100} top={620} />
        <FeatureCard text="ضمان ١٤ يوم:" sub="الفني يرجعلك يكشف ببلاش، وقطع الغيار لو اتغيرت بتتدفع" delay={202} top={885} />
      </FlipIn>
    </Scene>

    {/* ===== مشهد 5 (25–30ث): كارت الختام ===== */}
    <Scene from={S5} to={groupTechnicianDuration}>
      <EndCard phrase="أول طلبين عليك مجانًا" phraseSize={80}>
        <div style={{position: 'absolute', left: 20, top: 1290}}>
          <Woman mood="happy" gesture="point" width={440} delay={34} />
        </div>
        <PhoneMockup src="screens/home.png" width={340} left={610} top={1300} delay={26} rotate={-5} />
      </EndCard>
    </Scene>
  </VideoShell>
);

/** الست مصدومة وهي بتتصل. */
const ShockedWoman: React.FC = () => (
  <div style={{position: 'absolute', left: 10, top: 760}}>
    <Woman mood="shocked" gesture="handsUp" width={500} delay={58} />
  </div>
);

/** بيخفّي المحتوى (opacity) عند فريم محلي معيّن. */
const FadeOut: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{opacity: o}}>{children}</div>;
};
