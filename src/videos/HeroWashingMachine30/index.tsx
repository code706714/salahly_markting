import React from 'react';
import timingJson from './timing.json';
import {Line, Timing, layoutLines} from '../../lib/timing';
import {WashingStory} from '../_hero/story';

const lines: Line[] = layoutLines(timingJson as Timing);

/** 30 ثانية: نفس المشاهد بإيقاع أسرع (٤ و٦ و٩ أقصر حاجة). */
export const heroWashingMachine30Duration = 900;
const BOUNDS = [0, 2.0, 4.5, 6.95, 9.25, 13.1, 15.2, 16.3, 17.5, 22.6, 24.0, 26.4, 30].map((s) => Math.round(s * 30));

export const HeroWashingMachine30: React.FC = () => <WashingStory lines={lines} total={heroWashingMachine30Duration} bounds={BOUNDS} />;
