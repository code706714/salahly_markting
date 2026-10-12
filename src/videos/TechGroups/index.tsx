import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {Sticker} from '../../components/Sticker';
import {Burst} from '../../components/Props';
import {Jitter} from '../PickYourPrice/parts';
import {AcceptToast, Feed, FloodCounter, OrderFlow, PinIcon, PostFlood, QuoteIcon, TeaGlass, ZeroFeeIcon} from './parts';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 30 ثانية بالظبط. الصوت على أوقات ثابتة (at في script.json). */
export const techGroupsDuration = 900;

const S2 = 90; // 3ث
const S3 = 300; // 10ث
const S4 = 660; // 22ث
const S5 = 780; // 26ث

const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} color={COLORS.dark} accessory="#6b6f66" mustache speaking={speaking} {...p} />;
};

/** موبايل بيرن: بيتهز لحد ما الإشعار يخلص. */
const RingingPhone: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f < 46 ? Math.sin(f * 2.4) * 4 * (1 - f / 60) : 0;
  return (
    <PhoneMockup width={500} left={290} top={215} delay={0} rotate={shake}>
      <OrderFlow />
    </PhoneMockup>
  );
};

export const TechGroups: React.FC = () => (
  <VideoShell lines={lines} total={techGroupsDuration} cuts={[S2, S3, S4, S5]}>
    {/* ===== مشهد 1 (0–3ث): فني على القهوة بيزهق ===== */}
    <Scene from={0} to={S2}>
      <Backdrop tone="rays" />
      <Sfx name="buzzer" at={2} volume={0.7} />
      <Jitter amp={0.7}>
        <HookTitle text="لسه بتستنى حد يسأل في الجروب؟" hot={[3]} top={80} fontSize={116} />
      </Jitter>
      <div style={{position: 'absolute', left: 40, top: 640}}>
        <Tech mood="worried" width={560} delay={2} />
      </div>
      <PhoneMockup width={300} left={610} top={900} delay={6} rotate={-7}>
        <Feed />
      </PhoneMockup>
      {/* ترابيزة القهوة */}
      <div style={{position: 'absolute', left: 0, top: 1210, width: W, height: 40, background: COLORS.primary, borderTop: `8px solid ${COLORS.dark}`}} />
      <div style={{position: 'absolute', left: 0, top: 1250, width: W, height: 120, background: COLORS.dark, opacity: 0.9}} />
      <TeaGlass left={150} top={1090} />
    </Scene>

    {/* ===== مشهد 2 (3–10ث): كومنت وسط ٥٠ كومنت ===== */}
    <Scene from={S2} to={S3}>
      <Backdrop tone="light" />
      <FloodCounter />
      <PhoneMockup width={520} left={520} top={190} delay={0}>
        <PostFlood />
      </PhoneMockup>
      <div style={{position: 'absolute', left: -70, top: 640}}>
        <Tech mood="angry" width={560} delay={4} />
      </div>
    </Scene>

    {/* ===== مشهد 3 (10–22ث): صلحلي: طلب ← عرض ← قبول ===== */}
    <Scene from={S3} to={S4}>
      <Backdrop tone="light" />
      <Sfx name="ring" at={0} volume={0.8} />
      <Sfx name="pop" at={48} />
      <Sfx name="pop" at={160} />
      <Sfx name="ding" at={206} volume={0.7} />
      <Sfx name="pop" at={264} />
      <Burst left={20} top={560} size={170} delay={6} />
      <Burst left={W - 200} top={720} size={150} delay={14} />
      <RingingPhone />
      <Sticker from={48} to={124} text="طلبات منطقتك وتخصصك" fontSize={56}>
        <PinIcon />
      </Sticker>
      <Sticker from={160} to={204} text="قدّم عرضك بنفسك" fontSize={60}>
        <QuoteIcon />
      </Sticker>
      <AcceptToast from={206} to={262} />
      <Sticker from={264} to={358} text="زبونك الراجع: من غير رسوم" fontSize={54}>
        <ZeroFeeIcon />
      </Sticker>
    </Scene>

    {/* ===== مشهد 4 (22–26ث): الفاتورة والمواعيد ===== */}
    <Scene from={S4} to={S5}>
      <Backdrop tone="light" />
      <PhoneMockup src="screens/tech-invoice.png" width={470} left={50} top={170} delay={0} />
      <PhoneMockup src="screens/tech-today.png" width={470} left={560} top={170} delay={6} highlight={{x: 6, y: 11, w: 88, h: 8, from: 70}} />
      <Sfx name="pop" at={4} />
      <Sfx name="ding" at={72} volume={0.6} />
    </Scene>

    {/* ===== مشهد 5 (26–30ث): كارت الختام ===== */}
    <Scene from={S5} to={techGroupsDuration}>
      <EndCard phrase="أول شغلانتين من التطبيق مجانًا، سجّل ببطاقتك واشتغل" phraseSize={52} />
    </Scene>
  </VideoShell>
);
