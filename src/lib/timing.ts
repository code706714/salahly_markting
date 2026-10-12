import {FPS} from './theme';

// man/woman = شخصيات بتتكلم (الفم بيتحرك). operator = صوت رسالة آلية (مفيش شخصية). none = ترجمة من غير صوت.
export type Speaker = 'man' | 'woman' | 'operator' | 'none';

export type RawWord = {text: string; start: number; end: number};
export type RawLine = {
  id: string;
  speaker: Speaker;
  text: string;
  /** null = سطر صامت (ترجمة بس) */
  file: string | null;
  duration: number;
  words: RawWord[];
  /** بداية السطر بالثواني على التايم لاين (لو مش موجودة، السطر بيجي بعد اللي قبله) */
  at?: number;
  /** ما تعرضش الترجمة السفلية للسطر ده */
  noCaption?: boolean;
};
export type Timing = {video: string; synthetic?: boolean; lines: RawLine[]};

export type Word = {text: string; from: number; to: number};
export type Line = Omit<RawLine, 'words'> & {
  from: number; // أول فريم للصوت
  to: number; // آخر فريم للصوت
  words: Word[]; // توقيت الكلمات بالفريمات (مطلق على الفيديو كله)
};

const LEAD_IN = 6; // فريمات قبل أول سطر
const GAP = 10; // فريمات بين الأسطر
const TAIL = 40; // فريمات بعد آخر سطر

/** بيحوّل timing.json (ثواني) لفريمات مطلقة، بتتظبط تلقائي على مدة كل ملف صوت. */
export const layoutLines = (timing: Timing): Line[] => {
  let cursor = LEAD_IN;
  return timing.lines.map((l) => {
    const from = l.at !== undefined ? Math.round(l.at * FPS) : cursor;
    const frames = Math.max(1, Math.ceil(l.duration * FPS));
    const to = from + frames;
    cursor = Math.max(cursor, to + GAP);
    return {
      ...l,
      from,
      to,
      words: l.words.map((w) => ({
        text: w.text,
        from: from + Math.round(w.start * FPS),
        to: from + Math.round(w.end * FPS),
      })),
    };
  });
};

export const totalFrames = (lines: Line[]) => lines[lines.length - 1].to + TAIL;

/** فريم بداية المشهد لكل سطر (المشهد الأول بيبدأ من 0، والباقي قبل الصوت بشوية عشان الـ wipe). */
export const sceneStart = (lines: Line[], i: number) => (i === 0 ? 0 : lines[i].from - 6);
export const sceneEnd = (lines: Line[], i: number, total: number) =>
  i === lines.length - 1 ? total : sceneStart(lines, i + 1);
