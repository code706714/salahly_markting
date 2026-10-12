import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {AcScam, acScamDuration} from './videos/ac-scam';
import {Verified, verifiedDuration} from './videos/verified';
import {AcTech, acTechDuration} from './videos/ac-tech';

// id الـ Composition = اسم فولدر الفيديو في src/videos (render.sh بيعتمد على كده)
export const Root: React.FC = () => (
  <>
    <Composition id="ac-scam" component={AcScam} durationInFrames={acScamDuration} fps={FPS} width={W} height={H} />
    <Composition id="verified" component={Verified} durationInFrames={verifiedDuration} fps={FPS} width={W} height={H} />
    <Composition id="ac-tech" component={AcTech} durationInFrames={acTechDuration} fps={FPS} width={W} height={H} />
  </>
);
