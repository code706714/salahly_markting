import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {AcUnit, Burst} from '../../components/Props';
import {FeatureRow, GiftIcon} from '../PickYourPrice/parts';
import {PhoneScene} from '../shared/PhoneScene';

const lines: Line[] = layoutLines(timingJson as Timing);

/** دقيقة بالظبط (٦٠ث). الصوت على أوقات ثابتة (at في script.json). */
export const consumerMainDuration = 1800;

const s = (sec: number) => Math.round(sec * 30);
const CUTS = [5.5, 12, 15.5, 18.5, 26.5, 33, 38, 45, 50.5].map(s);
const [C1, C2, C3, C4, C5, C6, C7, C8, C9] = CUTS;

const Woman: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'woman';
  return <Character outfit="hijab" skin={SKINS.light} color={COLORS.dark} accessory={COLORS.accent} speaking={speaking} {...p} />;
};

export const ConsumerMain: React.FC = () => (
  <VideoShell lines={lines} total={consumerMainDuration} cuts={CUTS}>
    {/* 0–5.5ث: الخطّاف — التكييف باظ */}
    <Scene from={0} to={C1}>
      <Backdrop tone="rays" />
      <HookTitle text="التكييف باظ!" hot={[1]} top={100} fontSize={150} />
      <AcUnit broken left={200} top={470} size={680} delay={4} />
      <div style={{position: 'absolute', left: 280, top: 830}}>
        <Woman mood="worried" width={520} delay={6} />
      </div>
      <Burst left={W - 230} top={620} size={170} delay={16} />
    </Scene>

    {/* 5.5–12: التسجيل */}
    <Scene from={C1} to={C2}>
      <PhoneScene src="screens/role.png" chip="سجّلي برقمك" chip2={{text: 'أول طلبين مجانًا', delay: 90}} />
    </Scene>

    {/* 12–15.5: المشكلة */}
    <Scene from={C2} to={C3}>
      <PhoneScene src="screens/problem.png" chip="اكتبي المشكلة" />
    </Scene>

    {/* 15.5–18.5: أو بالصوت */}
    <Scene from={C3} to={C4}>
      <PhoneScene src="screens/request.png" chip="أو سجّليها بالصوت" />
    </Scene>

    {/* 18.5–26.5: العروض */}
    <Scene from={C4} to={C5}>
      <PhoneScene src="screens/offers.png" chip="لحد ٥ عروض" chip2={{text: 'السعر قبل ما حد يخطي بيتك', delay: 140}} scrollTo={0.75} scrollDuration={170} scrollDelay={60} />
    </Scene>

    {/* 26.5–33: الفني وتقييماته */}
    <Scene from={C5} to={C6}>
      <PhoneScene src="screens/tech-profile.png" chip="فني موثّق ببطاقته" scrollTo={0.7} scrollDuration={150} scrollDelay={40} />
    </Scene>

    {/* 33–38: التتبع */}
    <Scene from={C6} to={C7}>
      <PhoneScene src="screens/tracking.png" chip="تابعيه لحد ما يوصل" />
    </Scene>

    {/* 38–45: التقييم */}
    <Scene from={C7} to={C8}>
      <PhoneScene src="screens/review.png" chip="قيّميه بعد الشغلانة" chip2={{text: 'أي مشكلة؟ بلّغنا من التطبيق', delay: 110}} scrollTo={0.4} scrollDuration={150} scrollDelay={50} />
    </Scene>

    {/* 45–50.5: هدية */}
    <Scene from={C8} to={C9}>
      <Backdrop tone="dark" />
      <FeatureRow top={200} delay={8} text="كل ٣ شغلانات طلب هدية">
        <GiftIcon />
      </FeatureRow>
      <Sfx name="ding" at={50} />
      <div style={{position: 'absolute', left: 280, top: 600}}>
        <Woman mood="happy" gesture="wave" width={520} delay={20} />
      </div>
    </Scene>

    {/* 50.5–60: الختام */}
    <Scene from={C9} to={consumerMainDuration}>
      <EndCard phrase="أول طلبين مجانًا" phraseSize={72} />
    </Scene>
  </VideoShell>
);
