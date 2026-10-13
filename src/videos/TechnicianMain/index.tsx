import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {Scene, Sfx, useSpeaker} from '../../lib/stage';
import {COLORS, SKINS, W, baseText} from '../../lib/theme';
import {VideoShell} from '../../components/VideoShell';
import {Backdrop} from '../../components/Backdrop';
import {Character} from '../../components/Character';
import {EndCard} from '../../components/EndCard';
import {HookTitle} from '../../components/HookTitle';
import {Burst} from '../../components/Props';
import {CommentBubbles} from '../GroupTechnician/parts';
import {FeatureRow, GiftIcon} from '../PickYourPrice/parts';
import {PhoneScene} from '../shared/PhoneScene';

const lines: Line[] = layoutLines(timingJson as Timing);

/** دقيقة بالظبط (٦٠ث). الصوت على أوقات ثابتة (at في script.json). */
export const technicianMainDuration = 1800;

const s = (sec: number) => Math.round(sec * 30);
const CUTS = [8, 13.5, 20, 27.5, 33.5, 41, 47, 52.5].map(s);
const [C1, C2, C3, C4, C5, C6, C7, C8] = CUTS;

const Tech: React.FC<React.ComponentProps<typeof Character>> = (p) => {
  const speaking = useSpeaker() === 'man';
  return <Character outfit="technician" skin={SKINS.medium} color={COLORS.dark} accessory="#6b6f66" mustache speaking={speaking} {...p} />;
};

export const TechnicianMain: React.FC = () => (
  <VideoShell lines={lines} total={technicianMainDuration} cuts={CUTS}>
    {/* 0–8ث: الخطّاف — الجروب والكومنتات */}
    <Scene from={0} to={C1}>
      <Backdrop tone="rays" />
      <HookTitle text="واحد بس بياخد الشغلانة" hot={[2]} top={120} fontSize={92} />
      <CommentBubbles start={20} />
      <div style={{position: 'absolute', left: 270, top: 860}}>
        <Tech mood="angry" gesture="handsUp" width={520} delay={4} />
      </div>
      <Burst left={20} top={760} size={190} delay={30} />
    </Scene>

    {/* 8–13.5: اختار إنك فني */}
    <Scene from={C1} to={C2}>
      <PhoneScene src="screens/role.png" chip="سجّل كفني برقمك" />
    </Scene>

    {/* 13.5–20: التوثيق ببطاقة */}
    <Scene from={C2} to={C3}>
      <PhoneScene src="screens/verification.png" chip="موثّق ببطاقتك" scrollTo={0.3} scrollDuration={110} />
    </Scene>

    {/* 20–27.5: الطلبات */}
    <Scene from={C3} to={C4}>
      <PhoneScene src="screens/tech-new-job.png" chip="طلبات في تخصصك" chip2={{text: 'تفاوض بنفسك', delay: 100}} scrollTo={0.6} scrollDuration={150} scrollDelay={50} />
    </Scene>

    {/* 27.5–33.5: المواعيد */}
    <Scene from={C4} to={C5}>
      <PhoneScene src="screens/tech-today.png" chip="مواعيدك منظمة" />
    </Scene>

    {/* 33.5–41: عرض السعر والفاتورة */}
    <Scene from={C5} to={C6}>
      <PhoneScene src="screens/tech-quote.png" chip="عرض سعر وفاتورة PDF" chip2={{text: 'بتتبعت على الواتساب', delay: 110}} scrollTo={0.7} scrollDuration={160} scrollDelay={50} />
    </Scene>

    {/* 41–47: الفلوس + بدون نت */}
    <Scene from={C6} to={C7}>
      <PhoneScene src="screens/tech-money.png" chip="مين عليه فلوس" chip2={{text: 'شغال من غير نت', delay: 80}} />
    </Scene>

    {/* 47–52.5: هدية */}
    <Scene from={C7} to={C8}>
      <Backdrop tone="dark" />
      <div style={{...baseText, position: 'absolute', top: 120, width: W, textAlign: 'center', fontSize: 100, color: COLORS.white, WebkitTextStroke: `9px ${COLORS.dark}`, paintOrder: 'stroke fill', textShadow: `0 8px 0 ${COLORS.dark}`}}>سجّل واشتغل</div>
      <FeatureRow top={300} delay={8} text="أول شغلانتين هدية">
        <GiftIcon />
      </FeatureRow>
      <Sfx name="ding" at={50} />
      <div style={{position: 'absolute', left: 290, top: 640}}>
        <Tech mood="happy" gesture="wave" width={500} delay={20} />
      </div>
    </Scene>

    {/* 52.5–60: الختام */}
    <Scene from={C8} to={technicianMainDuration}>
      <EndCard phrase="سجّل ببطاقتك واشتغل" phraseSize={66} />
    </Scene>
  </VideoShell>
);
