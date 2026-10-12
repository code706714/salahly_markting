import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W, baseText} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {PhoneMockup} from '../../components/PhoneMockup';
import {EndCard} from '../../components/EndCard';
import {Logo} from '../../components/Logo';
import {HookTitle} from '../../components/HookTitle';
import {Burst} from '../../components/Props';
import {FeatureRow, GiftIcon, IdCardIcon, Jitter, PickScreen, ShieldIcon} from './parts';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 20 ثانية بالظبط. الصوت على أوقات ثابتة (at في script.json). */
export const pickYourPriceDuration = 600;

const S2 = 60; // 2ث
const S3 = 360; // 12ث
const S4 = 480; // 16ث

const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} color={COLORS.dark} accessory="#6b6f66" mustache speaking={speaking} {...p} />;
};

export const PickYourPrice: React.FC = () => (
  <VideoShell lines={lines} total={pickYourPriceDuration} cuts={[S2, S3, S4]}>
    {/* ===== مشهد 1 (0–2ث): الخطّاف — نص ضخم بيتهز + buzzer ===== */}
    <Scene from={0} to={S2}>
      <Backdrop tone="rays" />
      <Sfx name="buzzer" at={2} volume={0.85} />
      <Sfx name="buzzer" at={32} volume={0.85} />
      <Jitter amp={1.2}>
        <HookTitle text="الفني قالك: لما آجي أشوف؟" hot={[4]} top={150} fontSize={158} />
      </Jitter>
      <div style={{position: 'absolute', left: 270, top: 1090}}>
        <Tech mood="angry" gesture="handsUp" width={540} delay={4} />
      </div>
      <Burst left={30} top={900} size={190} delay={10} />
      <Burst left={W - 230} top={940} size={170} delay={16} />
    </Scene>

    {/* ===== مشهد 2 (2–12ث): اطلب ← عروض ← اختار ===== */}
    <Scene from={S2} to={S3}>
      <Backdrop tone="light" />
      <PhoneMockup width={520} left={280} top={140} delay={0}>
        <PickScreen />
      </PhoneMockup>
    </Scene>

    {/* ===== مشهد 3 (12–16ث): ٣ أيقونات ===== */}
    <Scene from={S3} to={S4}>
      <Backdrop tone="dark" />
      <div style={{position: 'absolute', left: 0, top: 80, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        <Logo size={120} />
        <span style={{...baseText, fontSize: 104, color: COLORS.white, WebkitTextStroke: `9px ${COLORS.dark}`, paintOrder: 'stroke fill', textShadow: `0 8px 0 ${COLORS.dark}`}}>صلحلي</span>
      </div>
      <FeatureRow top={270} delay={4} text="ضمان ١٤ يوم">
        <ShieldIcon />
      </FeatureRow>
      <FeatureRow top={650} delay={34} text="مسجل ببطاقته">
        <IdCardIcon />
      </FeatureRow>
      <FeatureRow top={1030} delay={64} text="كل ٣ شغلانات طلب ببلاش">
        <GiftIcon />
      </FeatureRow>
    </Scene>

    {/* ===== مشهد 4 (16–20ث): كارت الختام ===== */}
    <Scene from={S4} to={pickYourPriceDuration}>
      <EndCard phrase="أول طلبين مجانًا، نزّله دلوقتي" phraseSize={66} />
    </Scene>
  </VideoShell>
);
