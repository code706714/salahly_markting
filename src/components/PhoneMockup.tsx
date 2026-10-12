import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../lib/theme';
import {useBounce} from '../lib/stage';

export type PhoneProps = {
  /** مسار الصورة جوه assets/ مثلاً 'screens/offers.png' (مش لازم لو بتبعت children) */
  src?: string;
  /** محتوى مخصص للشاشة بدل الصورة */
  children?: React.ReactNode;
  width?: number;
  left: number;
  top: number;
  /** 0..1 — الشاشة بتسكرول من فوق لتحت */
  scrollFrom?: number;
  scrollTo?: number;
  scrollDuration?: number;
  scrollDelay?: number;
  /** تكبير على نقطة (نسب مئوية من الشاشة) */
  zoom?: {x: number; y: number; scale: number; from: number; to: number};
  /** إطار مميّز حوالين جزء من الشاشة (نسب مئوية) */
  highlight?: {x: number; y: number; w: number; h: number; from: number};
  delay?: number;
  rotate?: number;
};

export const PhoneMockup: React.FC<PhoneProps> = ({
  src,
  children,
  width = 560,
  left,
  top,
  scrollFrom = 0,
  scrollTo = 0,
  scrollDuration = 60,
  scrollDelay = 10,
  zoom,
  highlight,
  delay = 0,
  rotate = 0,
}) => {
  const frame = useCurrentFrame();
  const pop = useBounce(delay, 10, 120);
  const bezel = Math.round(width * 0.03);
  const screenW = width - bezel * 2;
  const screenH = Math.round(screenW * 2.1);
  const scroll = interpolate(frame - scrollDelay, [0, scrollDuration], [scrollFrom, scrollTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const z = zoom
    ? interpolate(frame, [zoom.from, zoom.to], [1, zoom.scale], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const float = Math.sin((frame + delay) * 0.08) * 8;

  const hl = highlight ? frame - highlight.from : -1;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: screenH + bezel * 2,
        transform: `translateY(${(1 - pop) * 300 + float}px) rotate(${rotate}deg) scale(${0.6 + 0.4 * pop})`,
        opacity: Math.min(1, pop * 3),
        background: COLORS.dark,
        borderRadius: width * 0.12,
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: '0 40px 70px rgba(47,59,42,0.38)',
      }}
    >
      <div style={{position: 'relative', width: screenW, height: screenH, borderRadius: width * 0.095, overflow: 'hidden', background: COLORS.background}}>
        {children ? (
          <div style={{position: 'absolute', inset: 0}}>{children}</div>
        ) : (
        <Img
          src={staticFile(src!)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `50% ${scroll * 100}%`,
            transform: `scale(${z})`,
            transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : '50% 50%',
          }}
        />
        )}
        {highlight && hl >= 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${highlight.x}%`,
              top: `${highlight.y}%`,
              width: `${highlight.w}%`,
              height: `${highlight.h}%`,
              border: `7px solid ${COLORS.accent}`,
              borderRadius: 28,
              boxShadow: `0 0 0 ${6 + Math.abs(Math.sin(hl * 0.25)) * 14}px rgba(214,154,45,0.35)`,
              transform: `scale(${interpolate(hl, [0, 6, 10], [1.4, 0.97, 1], {extrapolateRight: 'clamp'})})`,
              opacity: Math.min(1, hl / 4),
            }}
          />
        )}
      </div>
      {/* كاميرا */}
      <div style={{position: 'absolute', top: bezel + 14, left: '50%', marginLeft: -9, width: 18, height: 18, borderRadius: 9, background: COLORS.dark, border: `3px solid #4a5844`}} />
    </div>
  );
};
