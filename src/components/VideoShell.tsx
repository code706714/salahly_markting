import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONT} from '../lib/theme';
import {Caption} from './Caption';
import {LineAudio, LinesProvider, Music, Wipe} from '../lib/stage';
import {Line, sceneStart} from '../lib/timing';

/** غلاف الفيديو: الصوت + الموسيقى + الترجمة + الـ transitions. المشاهد (Scene) بتتحط children. */
export const VideoShell: React.FC<{lines: Line[]; total: number; children: React.ReactNode}> = ({lines, total, children}) => (
  <LinesProvider lines={lines}>
    <AbsoluteFill style={{background: COLORS.background, direction: 'rtl', fontFamily: FONT}}>
      {children}
      {lines.slice(1).map((_, i) => (
        <Wipe key={i} at={sceneStart(lines, i + 1)} />
      ))}
      <Caption lines={lines} />
      <LineAudio lines={lines} />
      <Music total={total} />
    </AbsoluteFill>
  </LinesProvider>
);
