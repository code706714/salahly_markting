import React, {createContext, useContext} from 'react';
import {Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Line, Speaker} from './timing';
import {COLORS, W, H} from './theme';

const OffsetCtx = createContext(0);
const LinesCtx = createContext<Line[]>([]);

/** بيدّي كل المشاهد والـ components الوصول للأسطر (عشان الفم يتحرك وقت الكلام). */
export const LinesProvider: React.FC<{lines: Line[]; children: React.ReactNode}> = ({lines, children}) => (
  <LinesCtx.Provider value={lines}>{children}</LinesCtx.Provider>
);

/** مشهد: جواه useCurrentFrame محلي، و useGlobalFrame بيرجّع الفريم المطلق. */
export const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} name={`scene@${from}`}>
    <OffsetCtx.Provider value={from}>{children}</OffsetCtx.Provider>
  </Sequence>
);

export const useGlobalFrame = () => useCurrentFrame() + useContext(OffsetCtx);

/** مين بيتكلم دلوقتي؟ */
export const useSpeaker = (): Speaker | null => {
  const g = useGlobalFrame();
  const lines = useContext(LinesCtx);
  const l = lines.find((x) => g >= x.from && g <= x.to);
  return l ? l.speaker : null;
};

export const useSpeaking = (who: Speaker) => useSpeaker() === who;

/** spring جاهز bouncy. delay بالفريمات المحلية. */
export const useBounce = (delay = 0, damping = 9, stiffness = 150) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.8}});
};

export const useShake = (frame: number, until = 12, amp = 14) =>
  frame < until ? Math.sin(frame * 3.1) * amp * (1 - frame / until) : 0;

/** صوت السطر على التايم لاين. */
export const LineAudio: React.FC<{lines: Line[]}> = ({lines}) => (
  <>
    {lines.map((l) => (
      <Sequence key={l.id} from={l.from} durationInFrames={l.to - l.from + 30} name={`voice:${l.id}`}>
        <Audio src={staticFile(l.file)} />
      </Sequence>
    ))}
  </>
);

export type SfxName = 'whoosh' | 'pop' | 'ding';

/** sound effect عند فريم مطلق (استخدمه جوه Scene بفريم محلي، أو برا بفريم مطلق). */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume = 0.6}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} name={`sfx:${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** موسيقى خلفية 15% — بدّل assets/music.mp3 بمزيكاك. بتعمل fade في الآخر. */
export const Music: React.FC<{total: number}> = ({total}) => (
  <Audio
    src={staticFile('music.mp3')}
    loop
    volume={(f) => 0.15 * interpolate(f, [0, 15, total - 30, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
  />
);

/** Transition: ٣ شرايط ملونة بتعدّي على الشاشة عند حدود المشاهد (+ whoosh). */
export const Wipe: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const t = frame - (at - 10);
  const panel = (delay: number, color: string, z: number) => {
    const x = interpolate(t - delay, [0, 9, 11, 20], [W, 0, 0, -W], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    });
    return (
      <div
        key={color}
        style={{position: 'absolute', top: -20, bottom: -20, left: 0, width: W, background: color, transform: `translateX(${x}px) skewX(-8deg)`, zIndex: z}}
      />
    );
  };
  return (
    <>
      <Sfx name="whoosh" at={at - 12} volume={0.5} />
      {t >= 0 && t <= 26 ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', zIndex: 50, pointerEvents: 'none'}}>
          {panel(0, COLORS.accent, 1)}
          {panel(2, COLORS.primary, 2)}
          {panel(4, COLORS.dark, 3)}
        </div>
      ) : null}
    </>
  );
};
