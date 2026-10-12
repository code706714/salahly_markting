import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines, sceneEnd, sceneStart, totalFrames} from '../../lib/timing';
import {Scene, Sfx, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {HookTitle} from '../../components/HookTitle';
import {Character} from '../../components/Character';
import {SpeechBubble} from '../../components/SpeechBubble';
import {PhoneMockup} from '../../components/PhoneMockup';
import {Burst, ShieldCheck, Star} from '../../components/Props';
import {EndCard} from '../../components/EndCard';

const lines: Line[] = layoutLines(timingJson as Timing);
export const verifiedDuration = totalFrames(lines);

const Man: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="shirt" skin={SKINS.tan} color={COLORS.dark} speaking={speaking} {...p} />;
};
const Woman: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={COLORS.dark} accessory={COLORS.accent} speaking={speaking} {...p} />;
};
const Stranger: React.FC<React.ComponentProps<typeof Character>> = (p) => (
  <Character outfit="technician" skin={SKINS.medium} color={COLORS.primary} accessory={COLORS.dark} mustache mood="worried" {...p} />
);

export const Verified: React.FC = () => {
  const s = (i: number) => sceneStart(lines, i);
  const e = (i: number) => sceneEnd(lines, i, verifiedDuration);
  return (
    <VideoShell lines={lines} total={verifiedDuration}>
      {/* 0 — الخطّاف */}
      <Scene from={s(0)} to={e(0)}>
        <Backdrop tone="rays" />
        <HookTitle text="مين ده؟!" hot={[0]} top={230} fontSize={230} />
        <div style={{position: 'absolute', left: 60, top: 780}}>
          <Man mood="shocked" gesture="handsUp" width={470} delay={4} />
        </div>
        <div style={{position: 'absolute', left: 600, top: 800}}>
          <Stranger flip width={420} delay={10} />
        </div>
        <SpeechBubble text="؟؟؟" left={650} top={620} width={300} variant="accent" delay={14} tail="bottom" fontSize={90} rotate={5} />
      </Scene>

      {/* 1 — مش عارفة */}
      <Scene from={s(1)} to={e(1)}>
        <Backdrop tone="light" />
        <div style={{position: 'absolute', left: 560, top: 680}}>
          <Woman mood="worried" flip width={480} delay={2} />
        </div>
        <div style={{position: 'absolute', left: 20, top: 760}}>
          <Stranger width={420} delay={10} />
        </div>
        <SpeechBubble text="مش عارفة…" left={560} top={470} width={430} variant="light" delay={8} tail="bottom" fontSize={66} />
      </Scene>

      {/* 2 — غضب */}
      <Scene from={s(2)} to={e(2)}>
        <Backdrop tone="light" />
        <div style={{position: 'absolute', left: 260, top: 650}}>
          <Man mood="angry" gesture="point" width={520} delay={2} />
        </div>
        <SpeechBubble text="هنلاقيه فين؟!" left={200} top={380} width={640} variant="primary" delay={10} tail="bottom" fontSize={84} rotate={-3} />
      </Scene>

      {/* 3 — متوثق */}
      <Scene from={s(3)} to={e(3)}>
        <Backdrop tone="light" />
        <Sfx name="ding" at={28} />
        <PhoneMockup src="screens/tech-profile.png" width={520} left={50} top={250} delay={0} highlight={{x: 42, y: 15, w: 32, h: 5, from: 24}} />
        <ShieldCheck left={640} top={300} size={300} delay={26} rotate={8} />
        <div style={{position: 'absolute', left: 580, top: 740}}>
          <Woman mood="happy" gesture="wave" width={470} delay={6} />
        </div>
        <SpeechBubble text="موثّق بالبطاقة" left={590} top={160} width={430} variant="dark" delay={20} tail="bottom" fontSize={58} />
      </Scene>

      {/* 4 — التقييمات */}
      <Scene from={s(4)} to={e(4)}>
        <Backdrop tone="light" />
        <PhoneMockup src="screens/tech-profile.png" width={520} left={500} top={250} delay={0} scrollFrom={0.2} scrollTo={0.7} scrollDuration={110} scrollDelay={14} />
        <Star left={60} top={300} size={200} delay={12} rotate={-10} />
        <Star left={250} top={420} size={150} delay={22} rotate={12} />
        <Star left={50} top={560} size={120} delay={32} rotate={-4} />
        <div style={{position: 'absolute', left: 0, top: 780}}>
          <Man mood="happy" width={480} delay={4} />
        </div>
        <SpeechBubble text="تقييمات حقيقية" left={20} top={150} width={460} variant="accent" delay={10} tail="bottom-right" fontSize={58} rotate={-4} />
      </Scene>

      {/* 5 — متابعة الطلب */}
      <Scene from={s(5)} to={e(5)}>
        <Backdrop tone="light" />
        <Sfx name="pop" at={40} />
        <PhoneMockup src="screens/tracking.png" width={540} left={270} top={230} delay={0} highlight={{x: 3, y: 45, w: 94, h: 8.5, from: 30}} />
        <Burst left={20} top={400} size={200} delay={14} />
        <div style={{position: 'absolute', left: 0, top: 800, display: 'none'}} />
      </Scene>

      {/* 6 — الختام */}
      <Scene from={s(6)} to={e(6)}>
        <EndCard phrase="فني متوثق على بابك" />
      </Scene>
    </VideoShell>
  );
};
