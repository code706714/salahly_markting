import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {WashingStory} from '../_hero/story';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 60 ثانية بالظبط. حدود المشاهد (بالثواني): 0 3 8 13 19 27 32 36 41 46 51 55 60 */
export const heroWashingMachineDuration = 1800;
const BOUNDS = [0, 3, 8, 13, 19, 27, 32, 36, 41, 46, 51, 55, 60].map((s) => s * 30);

export const HeroWashingMachine: React.FC = () => <WashingStory lines={lines} total={heroWashingMachineDuration} bounds={BOUNDS} />;
