import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, W, baseText} from '../lib/theme';
import {Sfx, useBounce} from '../lib/stage';
import {Backdrop} from './Backdrop';
import {Logo} from './Logo';
import {GooglePlayBadge} from './GooglePlayBadge';
import {Burst} from './Props';

/** كارت الختام: الشعار + "نزّله من Google Play" + جملة حافز + شارة جوجل بلاي. */
export const EndCard: React.FC<{phrase: string; phraseSize?: number; children?: React.ReactNode}> = ({phrase, phraseSize = 62, children}) => {
  const frame = useCurrentFrame();
  const logo = useBounce(2, 7, 140);
  const name = useBounce(10);
  const motiv = useBounce(16);
  const dl = useBounce(22, 8, 170);
  const badge = useBounce(28, 8, 150);
  const pulse = 1 + Math.sin(frame * 0.3) * 0.035;
  return (
    <AbsoluteFill>
      <Backdrop tone="primary" />
      <Sfx name="ding" at={6} volume={0.55} />
      <Burst left={-90} top={160} size={300} color={COLORS.accent} delay={6} />
      <Burst left={W - 230} top={290} size={200} color={COLORS.background} delay={10} />
      <div style={{position: 'absolute', top: 190, left: 0, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-25, 0])}deg)`}}>
        <Logo size={270} />
      </div>
      <div style={{...baseText, position: 'absolute', top: 470, width: W, textAlign: 'center', fontSize: 170, color: COLORS.white, textShadow: `0 10px 0 ${COLORS.dark}`, WebkitTextStroke: `10px ${COLORS.dark}`, paintOrder: 'stroke fill', transform: `scale(${name})`}}>
        صلحلي
      </div>
      <div style={{...baseText, position: 'absolute', top: 790, width: W - 120, left: 60, textAlign: 'center', fontSize: phraseSize, color: COLORS.background, fontWeight: 700, transform: `scale(${motiv})`, lineHeight: 1.25}}>
        {phrase}
      </div>
      <div style={{...baseText, position: 'absolute', top: 940, width: W, textAlign: 'center', fontSize: 84, color: COLORS.accent, textShadow: `0 6px 0 ${COLORS.dark}`, transform: `scale(${dl})`}}>
        نزّله من Google Play
      </div>
      <div style={{position: 'absolute', top: 1075, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${badge * pulse})`}}>
        <GooglePlayBadge width={600} />
      </div>
      {children}
    </AbsoluteFill>
  );
};
