import React from 'react';
import {AbsoluteFill} from 'remotion';
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
import {AcUnit, Burst, ShieldCheck, Star, Sun} from '../../components/Props';
import {EndCard} from '../../components/EndCard';

const lines: Line[] = layoutLines(timingJson as Timing);
export const acScamDuration = totalFrames(lines);

const Woman: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={COLORS.dark} accessory={COLORS.accent} speaking={speaking} {...p} />;
};
const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} mustache speaking={speaking} {...p} />;
};

export const AcScam: React.FC = () => {
  const s = (i: number) => sceneStart(lines, i);
  const e = (i: number) => sceneEnd(lines, i, acScamDuration);
  return (
    <VideoShell lines={lines} total={acScamDuration}>
      {/* 0 — الخطّاف: تكييف باظ */}
      <Scene from={s(0)} to={e(0)}>
        <Backdrop tone="rays" />
        <HookTitle text="التكييف باظ؟!" hot={[1]} top={210} fontSize={190} />
        <Sun left={770} top={640} size={250} delay={4} />
        <AcUnit broken left={30} top={640} size={400} delay={8} rotate={-4} />
        <div style={{position: 'absolute', left: 300, top: 700}}>
          <Woman mood="shocked" gesture="handsUp" width={480} delay={6} />
        </div>
      </Scene>

      {/* 1 — الخوف من النصب */}
      <Scene from={s(1)} to={e(1)}>
        <Backdrop tone="light" />
        <Sfx name="pop" at={8} />
        <div style={{position: 'absolute', left: 40, top: 640}}>
          <Woman mood="worried" width={470} delay={2} />
        </div>
        <div style={{position: 'absolute', left: 580, top: 690}}>
          <Tech mood="angry" flip width={430} delay={14} color={COLORS.dark} />
        </div>
        <SpeechBubble text="ادفع بس!" left={600} top={470} width={400} variant="primary" delay={20} tail="bottom-right" fontSize={72} />
        <SpeechBubble text="نصب؟!" left={50} top={470} width={340} variant="accent" delay={10} tail="bottom-left" fontSize={72} rotate={-4} />
      </Scene>

      {/* 2 — متوثقين */}
      <Scene from={s(2)} to={e(2)}>
        <Backdrop tone="light" />
        <Sfx name="ding" at={26} />
        <div style={{position: 'absolute', left: 20, top: 700}}>
          <Tech mood="happy" gesture="point" width={500} delay={2} />
        </div>
        <PhoneMockup src="screens/tech-profile.png" width={460} left={570} top={260} delay={8} highlight={{x: 42, y: 15, w: 32, h: 5, from: 30}} />
        <ShieldCheck left={470} top={470} size={190} delay={24} rotate={-8} />
        <SpeechBubble text="متوثق بالبطاقة" left={30} top={470} width={460} variant="dark" delay={14} tail="bottom-left" fontSize={62} />
      </Scene>

      {/* 3 — العروض */}
      <Scene from={s(3)} to={e(3)}>
        <Backdrop tone="light" />
        <Sfx name="pop" at={40} />
        <Sfx name="pop" at={52} />
        <Sfx name="pop" at={64} />
        <PhoneMockup src="screens/offers.png" width={560} left={260} top={290} delay={0} scrollFrom={0} scrollTo={0.55} scrollDuration={110} scrollDelay={30} />
        <SpeechBubble text="٣ عروض!" left={20} top={330} width={330} variant="primary" delay={12} tail="right" fontSize={80} rotate={-6} />
        <Star left={40} top={620} size={140} delay={40} rotate={-12} />
        <Star left={120} top={780} size={100} delay={52} rotate={10} />
        <Star left={30} top={900} size={80} delay={64} rotate={-5} />
      </Scene>

      {/* 4 — اختاري */}
      <Scene from={s(4)} to={e(4)}>
        <Backdrop tone="dark" />
        <PhoneMockup src="screens/offers.png" width={440} left={40} top={270} delay={4} scrollFrom={0.45} scrollTo={1} scrollDuration={100} scrollDelay={20} />
        <div style={{position: 'absolute', left: 500, top: 720}}>
          <Tech mood="happy" gesture="point" flip width={540} delay={2} />
        </div>
        <SpeechBubble text="الأرخص" left={540} top={330} width={400} variant="accent" delay={12} tail="bottom" fontSize={74} rotate={4} />
        <SpeechBubble text="الأعلى تقييم" left={520} top={540} width={500} variant="light" delay={28} tail="bottom-left" fontSize={66} rotate={-3} />
        <Star left={880} top={250} size={120} delay={34} rotate={12} />
      </Scene>

      {/* 5 — التكييف رجع */}
      <Scene from={s(5)} to={e(5)}>
        <Backdrop tone="rays" />
        <Sfx name="ding" at={6} />
        <AcUnit left={190} top={240} size={700} delay={2} />
        <Burst left={30} top={330} size={210} delay={10} />
        <Burst left={850} top={330} size={190} delay={14} />
        <div style={{position: 'absolute', left: 290, top: 760}}>
          <Woman mood="happy" gesture="wave" width={500} delay={8} />
        </div>
      </Scene>

      {/* 6 — كارت الختام (فيه سطر الـ CTA) */}
      <Scene from={s(6)} to={e(6)}>
        <EndCard phrase="فني متوثق وسعر واضح قبل ما يبدأ" />
      </Scene>
    </VideoShell>
  );
};
