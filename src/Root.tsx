import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './lib/theme';
import {AcScam, acScamDuration} from './videos/ac-scam';
import {Verified, verifiedDuration} from './videos/verified';
import {AcTech, acTechDuration} from './videos/ac-tech';
import {GroupTechnician, groupTechnicianDuration} from './videos/GroupTechnician';
import {PickYourPrice, pickYourPriceDuration} from './videos/PickYourPrice';
import {MomFoundOut, momFoundOutDuration} from './videos/MomFoundOut';
import {TechGroups, techGroupsDuration} from './videos/TechGroups';
import {HeroWashingMachine, heroWashingMachineDuration} from './videos/HeroWashingMachine';
import {HeroTechnician, heroTechnicianDuration} from './videos/HeroTechnician';
import {HeroWashingMachine30, heroWashingMachine30Duration} from './videos/HeroWashingMachine30';

// id الـ Composition = اسم فولدر الفيديو في src/videos (render.sh بيعتمد على كده)
export const Root: React.FC = () => (
  <>
    <Composition id="ac-scam" component={AcScam} durationInFrames={acScamDuration} fps={FPS} width={W} height={H} />
    <Composition id="verified" component={Verified} durationInFrames={verifiedDuration} fps={FPS} width={W} height={H} />
    <Composition id="ac-tech" component={AcTech} durationInFrames={acTechDuration} fps={FPS} width={W} height={H} />
    <Composition id="GroupTechnician" component={GroupTechnician} durationInFrames={groupTechnicianDuration} fps={FPS} width={W} height={H} />
    <Composition id="PickYourPrice" component={PickYourPrice} durationInFrames={pickYourPriceDuration} fps={FPS} width={W} height={H} />
    <Composition id="MomFoundOut" component={MomFoundOut} durationInFrames={momFoundOutDuration} fps={FPS} width={W} height={H} />
    <Composition id="TechGroups" component={TechGroups} durationInFrames={techGroupsDuration} fps={FPS} width={W} height={H} />
    <Composition id="HeroWashingMachine" component={HeroWashingMachine} durationInFrames={heroWashingMachineDuration} fps={FPS} width={W} height={H} />
    <Composition id="HeroWashingMachine30" component={HeroWashingMachine30} durationInFrames={heroWashingMachine30Duration} fps={FPS} width={W} height={H} />
    <Composition id="HeroTechnician" component={HeroTechnician} durationInFrames={heroTechnicianDuration} fps={FPS} width={W} height={H} />
  </>
);
