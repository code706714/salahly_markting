import React from 'react';
import {COLORS, W, baseText} from '../../lib/theme';
import {Sfx, useBounce} from '../../lib/stage';
import {Backdrop} from '../../components/Backdrop';
import {PhoneMockup, PhoneProps} from '../../components/PhoneMockup';

/** شارة ميزة بتتخبط فوق الموبايل. */
export const Chip: React.FC<{text: string; delay: number; top: number; tone?: 'primary' | 'dark' | 'accent'}> = ({text, delay, top, tone = 'dark'}) => {
  const pop = useBounce(delay, 8, 180);
  const bg = tone === 'primary' ? COLORS.primary : tone === 'accent' ? COLORS.accent : COLORS.dark;
  const fg = tone === 'accent' ? COLORS.dark : COLORS.white;
  return (
    <>
      <Sfx name="pop" at={delay} volume={0.5} />
      <div style={{position: 'absolute', top, left: 0, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${pop})`, opacity: Math.min(1, pop * 3)}}>
        <div style={{...baseText, background: bg, color: fg, fontSize: 60, padding: '6px 44px 14px', borderRadius: 60, border: `6px solid ${COLORS.dark}`, boxShadow: `0 8px 0 ${COLORS.dark}`}}>{text}</div>
      </div>
    </>
  );
};

/** مشهد "شاشة حقيقية من التطبيق" بشارة فوقها. */
export const PhoneScene: React.FC<{
  src: string;
  chip: string;
  chip2?: {text: string; delay: number};
  tone?: 'light' | 'dark';
  scrollTo?: number;
  scrollDuration?: number;
  scrollDelay?: number;
  phone?: Partial<PhoneProps>;
}> = ({src, chip, chip2, tone = 'light', scrollTo = 0, scrollDuration = 90, scrollDelay = 20, phone}) => (
  <>
    <Backdrop tone={tone} />
    <Chip text={chip} delay={4} top={90} tone="primary" />
    {chip2 ? <Chip text={chip2.text} delay={chip2.delay} top={1670} tone="accent" /> : null}
    <PhoneMockup src={src} width={560} left={260} top={230} delay={0} scrollTo={scrollTo} scrollDuration={scrollDuration} scrollDelay={scrollDelay} {...phone} />
  </>
);
