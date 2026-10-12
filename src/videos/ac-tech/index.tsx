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
import {Burst, Coin, Wrench} from '../../components/Props';
import {EndCard} from '../../components/EndCard';

const lines: Line[] = layoutLines(timingJson as Timing);
export const acTechDuration = totalFrames(lines);

const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} mustache speaking={speaking} {...p} />;
};
const Customer: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={COLORS.dark} accessory={COLORS.accent} speaking={speaking} {...p} />;
};

export const AcTech: React.FC = () => {
  const s = (i: number) => sceneStart(lines, i);
  const e = (i: number) => sceneEnd(lines, i, acTechDuration);
  return (
    <VideoShell lines={lines} total={acTechDuration}>
      {/* 0 — الخطّاف */}
      <Scene from={s(0)} to={e(0)}>
        <Backdrop tone="rays" />
        <HookTitle text="الشغل قليل؟!" hot={[1]} top={230} fontSize={200} />
        <Coin left={60} top={700} size={220} delay={6} rotate={-10} />
        <Coin left={800} top={760} size={190} delay={10} rotate={12} />
        <div style={{position: 'absolute', left: 290, top: 700}}>
          <Tech mood="worried" gesture="handsUp" width={500} delay={4} />
        </div>
      </Scene>

      {/* 1 — العميلة بتطلب */}
      <Scene from={s(1)} to={e(1)}>
        <Backdrop tone="light" />
        <Sfx name="pop" at={10} />
        <div style={{position: 'absolute', left: 520, top: 660}}>
          <Customer mood="worried" flip gesture="wave" width={500} delay={2} />
        </div>
        <SpeechBubble text="محتاجة فني تكييف!" left={420} top={420} width={600} variant="primary" delay={10} tail="bottom-right" fontSize={68} rotate={3} />
        <Wrench left={40} top={620} size={230} delay={16} rotate={-20} />
      </Scene>

      {/* 2 — الطلب وصل */}
      <Scene from={s(2)} to={e(2)}>
        <Backdrop tone="light" />
        <Sfx name="ding" at={14} />
        <PhoneMockup src="screens/tech-new-job.png" width={500} left={560} top={240} delay={2} highlight={{x: 5, y: 9, w: 90, h: 38, from: 20}} />
        <div style={{position: 'absolute', left: 0, top: 720}}>
          <Tech mood="happy" gesture="point" width={520} delay={6} />
        </div>
        <SpeechBubble text="طلب جديد!" left={30} top={470} width={420} variant="accent" delay={12} tail="bottom-left" fontSize={72} rotate={-5} />
      </Scene>

      {/* 3 — عرض السعر + واتساب */}
      <Scene from={s(3)} to={e(3)}>
        <Backdrop tone="dark" />
        <Sfx name="pop" at={44} />
        <PhoneMockup src="screens/tech-quote.png" width={540} left={270} top={240} delay={0} scrollFrom={0} scrollTo={0.4} scrollDuration={120} scrollDelay={20} />
        <SpeechBubble text="سعرك انت!" left={20} top={300} width={330} variant="accent" delay={14} tail="right" fontSize={64} rotate={-6} />
        <SpeechBubble text="واتساب" left={750} top={640} width={300} variant="light" delay={50} tail="left" fontSize={64} rotate={5} />
      </Scene>

      {/* 4 — الفلوس */}
      <Scene from={s(4)} to={e(4)}>
        <Backdrop tone="light" />
        <Sfx name="ding" at={30} />
        <PhoneMockup src="screens/tech-money.png" width={520} left={60} top={240} delay={0} highlight={{x: 4, y: 8, w: 92, h: 27, from: 18}} />
        <Coin left={640} top={300} size={240} delay={20} rotate={8} />
        <Coin left={800} top={520} size={170} delay={30} rotate={-14} />
        <div style={{position: 'absolute', left: 570, top: 760}}>
          <Customer mood="happy" gesture="wave" width={470} delay={6} />
        </div>
      </Scene>

      {/* 5 — الختام */}
      <Scene from={s(5)} to={e(5)}>
        <EndCard phrase="الشغل بيجيلك لحد موبايلك" />
      </Scene>
    </VideoShell>
  );
};
