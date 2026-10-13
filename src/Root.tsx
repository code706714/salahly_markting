import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {AcScam, acScamDuration} from './videos/ac-scam';
import {Verified, verifiedDuration} from './videos/verified';
import {AcTech, acTechDuration} from './videos/ac-tech';
import {GroupTechnician, groupTechnicianDuration} from './videos/GroupTechnician';
import {PickYourPrice, pickYourPriceDuration} from './videos/PickYourPrice';
import {TechnicianMain, technicianMainDuration} from './videos/TechnicianMain';
import {ConsumerMain, consumerMainDuration} from './videos/ConsumerMain';

// id الـ Composition = اسم فولدر الفيديو في src/videos (render.sh بيعتمد على كده)
export const Root: React.FC = () => (
  <>
    <Composition id="ac-scam" component={AcScam} durationInFrames={acScamDuration} fps={FPS} width={W} height={H} />
    <Composition id="verified" component={Verified} durationInFrames={verifiedDuration} fps={FPS} width={W} height={H} />
    <Composition id="ac-tech" component={AcTech} durationInFrames={acTechDuration} fps={FPS} width={W} height={H} />
    <Composition id="GroupTechnician" component={GroupTechnician} durationInFrames={groupTechnicianDuration} fps={FPS} width={W} height={H} />
    <Composition id="PickYourPrice" component={PickYourPrice} durationInFrames={pickYourPriceDuration} fps={FPS} width={W} height={H} />
    <Composition id="TechnicianMain" component={TechnicianMain} durationInFrames={technicianMainDuration} fps={FPS} width={W} height={H} />
    <Composition id="ConsumerMain" component={ConsumerMain} durationInFrames={consumerMainDuration} fps={FPS} width={W} height={H} />
  </>
);
