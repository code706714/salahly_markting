# برومت تسليم للشات الجاي — مشروع إعلانات "صلحلي" (Remotion)

> انت بتكمّل شغل متعمل في الريبو `code706714/salahly_markting`، فرع **`claude/zen-dijkstra-k0uf0a`**.
> اقرا الملف ده كله قبل أي حاجة، وبعدها `README.md`، وبعدين ابدأ. المستخدم مصري، بيتكلم بالعامية، وبيطلب مننا إعلانات فيديو قصيرة (9:16) للتطبيق. الرد عليه بالعامية المصرية، مختصر ومباشر، وبصراحة تامة عن أي حاجة مش متأكد منها.

---

## 1) إيه هو المشروع؟

**صلحلي** = تطبيق مصري بيوصّل الناس بفنيين صيانة **متوثقين** (تكييف، سباكة، كهربا، غسالات وتلاجات).
- **العميل:** بيكتب المشكلة ← بيوصله لحد **٥ عروض** من فنيين قريبين ← بيختار السعر **قبل** ما الفني ييجي ← بيتابع الطلب ← فاتورة وتقييم.
- **الفني:** بيستقبل الطلبات على موبايله ← يبعت عرض سعر (+ PDF + واتساب) ← فلوسه متسجلة.
- التوثيق: **بالبطاقة ورقم الموبايل**.

المطلوب منك: تعمل **Compositions** (إعلانات فيديو 1080×1920، 30fps) بـ **Remotion (React + TypeScript)** — كارتون 2D flat بـ SVG، صوت مصري، ترجمة كلمة بكلمة، موسيقى خفيفة، ومعاينة لقطات + رندر MP4 (h264).

## 2) قواعد الهوية (ممنوع تكسرها)

- **الألوان فقط:** primary `#B8492C`، dark `#2F3B2A`، accent `#D69A2D` (دهبي/نحاسي)، background `#F7F2EA`، وأبيض. **ممنوع أي أزرق.** (استثناء: ألوان البشرة والشعر الطبيعية، وصور شاشات التطبيق الحقيقية فيها أخضر/بمبي — دي من التطبيق نفسه.)
- الخط: **IBM Plex Sans Arabic** (400 و700) عن طريق `@remotion/google-fonts` — موجود في `src/lib/theme.ts`. الاتجاه **RTL**.
- مفيش صور AI ولا ستوك. الرسم كله SVG/CSS، والحركة bouncy بـ `spring`.
- ممنوع تقلّد براند حقيقي (مثلاً فيسبوك): بنعمل شكل بوست/جروب محايد من غير شعار ولا أزرق.
- **أول ثانيتين في كل فيديو:** حركة قوية + نص كبير (الخطّاف). استخدم `HookTitle` (بيتخبط كلمة كلمة) وممكن تلفّه في `Jitter` لو عايز اهتزاز مستمر.
- مناطق الأمان: الترجمة السفلية بتاخد تقريباً **y = 1245 → 1620**. خلّي أي محتوى مهم **فوق y≈1240**. الشخصيات بتخفت من تحت (mask) فبتدخل ورا الترجمة كويس.
- الإيموجي مش بيتعرض صح في كل بيئة → **ارسمه SVG** (زي 🙏 في `GroupTechnician/parts.tsx`).

## 3) الستاك والهيكل

```
Remotion 4.0.535 + React 18 + TypeScript   (public dir = assets/  عن طريق remotion.config.ts)
assets/
  screens/*.png        صور شاشات التطبيق الحقيقية (أسماء إنجليزي): home, offers, request, tech-profile,
                       tracking, review, verification, tech-new-job, tech-quote, tech-money, tech-today,
                       role, waiting, problem
  تصميم واجهات التطبيق-png/   الأصول الأصلية (أسماء عربي) — لو محتاج شاشة تانية انسخها لـ screens/ باسم إنجليزي
  audio/<Video>/<id>.mp3     أصوات الجمل (متولّدة)
  sfx/{whoosh,pop,ding,doorbell,ring,buzzer}.wav   متولّدة بالكود (مفيش مشاكل ترخيص)
  music.mp3            موسيقى placeholder (loop) — بتشتغل على 15%
scripts/
  generate_voice.py    script.json ← timing.json (وبيولّد صوت edge/azure لو اتاح، أو بيقرا ملفات جاهزة بـ --provider local)
  save_speko_audio.py  بيحفظ صوت Speko: قص صمت + -17 LUFS + mp3
  generate_sfx.py      الـ sfx والموسيقى (استخدم --no-music عشان متكتبش فوق music.mp3)
  preview_frames.sh    لقطات من Composition في صورة واحدة للمراجعة
  render.mjs           الرندر (npm run render) — شغّال على ويندوز/ماك/لينكس
src/
  Root.tsx             تسجيل الـ Compositions (id = اسم الفولدر في src/videos)
  lib/theme.ts timing.ts stage.tsx
  components/          Character, SpeechBubble, PhoneMockup, Caption, EndCard, HookTitle, Backdrop,
                       Props (AcUnit, Sun, ShieldCheck, Star, Wrench, Coin, Burst), Logo,
                       GooglePlayBadge, VideoShell
  videos/<CompId>/     script.json + timing.json + index.tsx (+ parts.tsx للمكوّنات الخاصة بالفيديو)
```

### الـ Compositions الموجودة
| Id | المدة | الفكرة | نوع التوقيت |
|---|---|---|---|
| `ac-scam` | ~24ث | التكييف باظ ← خوف من النصب ← متوثقين + ٣ عروض | الصوت بيحدد المدة |
| `verified` | ~23ث | فني مجهول ← توثيق + تقييمات + متابعة | الصوت بيحدد المدة |
| `ac-tech` | ~19ث | للفنيين: الطلبات بتوصلك + عرض سعر + فلوس | الصوت بيحدد المدة |
| `GroupTechnician` | 30ث | سألت في الجروب؟ ← فاتورة طويلة ← صلحلي (متوثق/٥ عروض/ضمان) | **مدة ثابتة + `at`** |
| `PickYourPrice` | 20ث | اطلب ← كروت عروض ← اختار السعر (إعلان ممول سريع) | **مدة ثابتة + `at`** |

اسم الـ Composition = اسم الفولدر بالظبط (`render.mjs` و `generate_voice.py` بيعتمدوا على كده). لو المستخدم حدد اسم (زي `PickYourPrice`) استخدمه **حرفياً** كاسم فولدر وكـ id.

## 4) الـ pipeline بالترتيب (من الفكرة للـ MP4)

### أ) المواصفات
المستخدم بيبعت **مشهد-مشهد بالثواني** (مثلاً "المشهد 2 (3-9ث): …") ومعاه الحوار ومين بيقوله. نفّذ بالظبط. أي حاجة مش مذكورة (زي جملة CTA صوتية) **متضيفهاش** — اذكرها في الآخر كاقتراح.

### ب) `src/videos/<Id>/script.json`
```json
{ "id": "PickYourPrice", "title": "...", "lines": [
  { "id": "pa", "speaker": "man", "text": "…", "at": 2.4 },
  { "id": "s1cap", "speaker": "none", "text": "ترجمة من غير صوت", "at": 0.4, "dur": 2.3 },
  { "id": "operator", "speaker": "operator", "text": "…", "at": 11.5, "noCaption": true }
]}
```
- `speaker`: `man` | `woman` | `operator` (رسالة آلية، مفيش شخصية بتحرك فمها) | `none` (ترجمة صامتة، لازم `dur`).
- `at` (ثواني): توقيت ثابت على التايم لاين. من غيره السطر بييجي بعد اللي قبله (للفيديوهات اللي الصوت بيحدد مدتها).
- `noCaption: true`: متعرضش الترجمة السفلية للسطر (مثلاً لما النص ظاهر جوه شاشة الموبايل).
- الجملة اللي بتتقال ممكن تتقسم لأكتر من سطر (مقاطع) عشان تظبط الحركة على كل جزء — بس المقاطع القصيرة جداً بتبان متقطعة.

### ج) توليد الصوت (⚠️ الجزء الأهم)
**edge-tts واقع** (مايكروسوفت بتدّي 403 من حوالي 10 أكتوبر 2026، [rany2/edge-tts#490](https://github.com/rany2/edge-tts/issues/490)). Azure محتاج كارت. الحل الشغّال دلوقتي: **Speko MCP** (connector متوصّل في claude.ai).

- لو أدوات `mcp__Speko__*` مش ظاهرة: دوّر عليها بـ `ToolSearch` ("speko narrate text speech"). لو مش متوصّل، قول للمستخدم يوصّله (claude.ai ← Settings ← Connectors ← Speko) ويفعّله في المحادثة.
- الأداة: `mcp__Speko__audio_synthesize` بالـ body ده:
```json
{ "text": "…", "intent": {"language": "ar-EG", "optimizeFor": "quality"},
  "voice": "Samir", "speed": 1.05,
  "constraints": {"allowedProviders": {"tts": ["hamsa:default"]}} }
```
- الأصوات المصرية (Hamsa): **`Samir`** = راجل مصري (الفني/المعلق)، **`Mariam`** = ست مصرية. للرسالة الآلية الفصحى استخدم `voice: "74a973b1-2af9-42d8-88d7-758816f60147"` (Aseel، MSA) و`language: "ar"`. باقي الأصوات في `mcp__Speko__voices_list`. المعلق بسرعة `1.05–1.1`، الحوار بالسرعة العادية.
- **فخ التوكنز:** الرد الكبير بيتحفظ في ملف (الرسالة بتقول `Output has been saved to …/tool-results/mcp-Speko-audio_synthesize-<رقم>.txt`) — ده كويس، متقراهوش. بس الردود **القصيرة** (أقل من حوالي 1.1 ثانية) بترجع **inline** وبتحرق ~25 ألف توكن. الحل: ادمج الجمل القصيرة جداً مع اللي جنبها، أو استخدم حقل `url` (رابط موقّع 15 دقيقة) وانزّله بـ `curl -o clip.wav "<url>"` (storage.googleapis.com مفتوح).
- ابعت كل الـ calls المستقلة **في نفس الرد (parallel)**، والنتايج بترجع بنفس ترتيب الطلبات → اربط كل ملف بالجملة بالترتيب، وتأكد إن الأطوال منطقية (الجملة الأقصر = الملف الأصغر).
- للتأكد إن الجملة اتقالت كاملة: `mcp__Speko__audio_transcribe` بـ `audio_url` (الـ `url` اللي رجع من التوليد) و`language: "ar-EG"`.
- **انت مبتسمعش الصوت.** اتأكد بالأرقام (المدة، LUFS، التفريغ النصي)، واطلب من المستخدم يحكم على اللهجة والنطق.

### د) حفظ الصوت وتجهيزه
```bash
python3 scripts/save_speko_audio.py '[["/root/.claude/projects/.../tool-results/mcp-Speko-audio_synthesize-123.txt","PickYourPrice","pa"],["/tmp/clip.wav","PickYourPrice","pc"]]'
python3 scripts/generate_voice.py PickYourPrice --provider local     # بيحسب المدد ويكتب timing.json (+at/noCaption)
python3 scripts/generate_voice.py <Id> --list                        # يطبع كل الجمل (للمراجعة)
```
`save_speko_audio.py` بيقص الصمت من الأطراف، ويظبط الصوت على **-17 LUFS** مع limiter، ويطلّع mp3 mono 44.1k. توقيت الكلمات جوه السطر **تقديري** (موزّع على عدد الحروف) لأن Hamsa REST مفيهوش word timestamps؛ توقيت السطر نفسه مظبوط على الملف.

### هـ) كتابة الفيديو
`src/videos/<Id>/index.tsx` (+ `parts.tsx`) وسجّله في `src/Root.tsx`:
```tsx
const lines = layoutLines(timingJson as Timing);
export const myDuration = 600;                   // مدة ثابتة بالفريمات (ثواني×30)
<VideoShell lines={lines} total={myDuration} cuts={[60, 360, 480]}>   {/* cuts = حدود مشاهد فيها Wipe */}
  <Scene from={0} to={60}> … </Scene>
</VideoShell>
```
- للفيديوهات اللي الصوت بيحدد مدتها: `totalFrames(lines)` و`sceneStart/sceneEnd` (شوف `ac-scam/index.tsx`).
- `VideoShell` بيحط لوحده: صوت كل سطر، الموسيقى (15%)، الترجمة (`Caption` كلمة بكلمة)، والـ Wipes. الـ SFX بتحطها إنت بـ `<Sfx name="pop|ding|whoosh|doorbell|ring|buzzer" at={frameمحلي}/>`.
- **المكوّنات (props أساسية):**
  - `Character`: `outfit` (`technician|shirt|hijab`)، `color`، `accessory`، `skin` (`SKINS.*`)، `mood` (`happy|angry|shocked|worried`)، `speaking`، `gesture` (`none|wave|handsUp|point`)، `mustache`، `flip`، `width`، `delay`. الفم بيتحرك لما `speaking` = true → استخدم `useSpeaker()==='man'|'woman'`.
  - `PhoneMockup`: `src` (صورة من `assets/`) **أو** `children` (شاشة مخصوصة)، `scrollFrom/To`, `highlight` (نسب % من الشاشة — **بتتظبط على scroll=0 بس**)، `zoom`، `rotate`.
  - `SpeechBubble`, `HookTitle`, `EndCard` (`phrase`, `phraseSize`, `children`), `Backdrop` (`light|dark|rays|primary`), `Logo`, `GooglePlayBadge`.
  - `lib/stage.tsx`: `Scene`, `useSpeaker`, `useBounce(delay)`, `Sfx`, `Wipe`, `Music`.
- **باترنز اتعملت (استخدمها):** `Muted` (فلتر saturate منخفض لمشاهد "المشكلة") ثم `FlipIn` (rotateY) لألوان صلحلي؛ `FeatureCard` بعلامة ✓ دهبي؛ `PickScreen` (شاشة موبايل مخصوصة بكتابة + كروت عروض)؛ `CommentBubbles`، `Invoice`، `Faucet`، `CallScreen`.

### و) المعاينة (قبل الرندر الكامل)
```bash
npx tsc --noEmit
BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  scripts/preview_frames.sh <Id> sheet1 20 120 300 450     # -> out/preview/sheet1.png
```
افتح الصورة (Read) وراجع: النص مقروء؟ حاجة بتغطي وش الشخصية؟ ترجمة فوق عنصر مهم؟ الألوان؟ كرر لحد ما تبقى كويسة.

### ز) الرندر والقياس والتسليم
```bash
BROWSER_EXECUTABLE=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run render -- <Id>   # -> out/<Id>.mp4
```
- الرندر **~1.5–2.5 دقيقة** → شغّله **في الخلفية** (`run_in_background`) واستنى الإشعار (التيرمنال الأمامي له timeout 2 دقيقة). لو محتاج تنتظر: `until grep -q finished log; do sleep 3; done` في Bash بالخلفية.
- بعد الرندر: `ffprobe` (h264 + aac، 1080×1920، المدة المطلوبة) ومستوى الصوت:
```bash
ffmpeg -hide_banner -nostats -i out/<Id>.mp4 -af "atrim=2.5:5.4,ebur128" -f null - 2>&1 | grep "I:"
```
**المستهدف:** الكلام ≈ -17 LUFS، الموسيقى وحدها ≈ -29 (يعني ~12 ديسيبل تحت الكلام)، الفيديو كله ≈ -14 لـ -17.
- **ابعت الفيديو للمستخدم** بـ `SendUserFile` (`display: "render"`) وقوله القياسات + الملاحظات الصريحة. (`out/` في `.gitignore` — مبتتعملهاش commit.)
- **اعمل commit + push** على نفس الفرع بعد كل تسليم (فيه stop-hook بيطلب كده). **متفتحش PR** إلا لو طلب. حط سطور الـ attribution اللي الـ system بيحددها في آخر رسالة الـ commit. حدّث جدول الفيديوهات في `README.md`.

## 5) البيئة والمشاكل المعروفة (وفّرت عليك ساعات)

- **Chrome والخطوط:** Remotion بيحمّل الخط من Google Fonts وقت الرندر. لو ظهر `net::ERR_CERT_AUTHORITY_INVALID` لـ `fonts.gstatic.com` استورد شهادات الـ proxy في NSS (مرة واحدة في كل container جديد):
  ```bash
  mkdir -p /tmp/ca && cd /tmp/ca && csplit -s -z -f c- /root/.ccr/ca-bundle.crt '/-----BEGIN CERTIFICATE-----/' '{*}'
  for f in c-*; do certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "ccr-$f" -i $f; done
  ```
  واستخدم Chrome اللي في `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (بـ `BROWSER_EXECUTABLE`، السكريبت بيضيف `--chrome-mode=chrome-for-testing`). تحذيرات الذاكرة/CGroup بتاعة Docker عادية.
- **الشبكة:** HuggingFace محجوب. `speech.platform.bing.com` اتفتح بس edge-tts لسه 403. الباقي بيمشي عن طريق الـ proxy.
- **Scene وSequence:** `Scene` بيعمل `Sequence` + context للفريم المطلق (`useSpeaker` بيعتمد عليه). **متحطش `Character` جوه `Sequence` متداخل** (التوقيت هيبوظ) — حطه على مستوى الـ Scene واستخدم `delay` عشان يظهر متأخر.
- **عنصر `position:absolute` جوه `<div>` عادي عليه `transform`** ممكن يختفي → خلّي الـ wrapper نفسه absolute بحجم الشاشة (شوف `Jitter`).
- **ترتيب الـ DOM = ترتيب الطبقات.** اللي عايزه فوق حطه آخر (زي `AfterDays` فوق موبايل الاتصال).
- **شاشات التطبيق** طويلة؛ `PhoneMockup` بيستخدم `object-fit: cover` فالـ scroll بيحرّك الصورة. الـ highlight بالنسب بيتظبط على scroll=0.
- **GooglePlayBadge** مرسومة بألوان البراند لأن الشارة الرسمية فيها أزرق — نبّه المستخدم لو هيحتاج الرسمية.
- **الشعار** (`Logo`) رسمة مؤقتة من عندنا؛ مفيش لوجو حقيقي في `assets/`.
- **المفتاح:** المستخدم بعت مرة مفتاح `sk_live_…` في الشات (وصّيناه يعمل Revoke). **متكتبش مفاتيح في ملفات ولا commits**، وماتستخدمش مفاتيح الشات؛ استخدم الـ MCP connector.

## 6) تفضيلات المستخدم وطريقة الشغل معاه

- بيكتب الطلب كـ **سيناريو بالثواني** ويعتمد إنك تنفّذه حرفياً. اسأله **بس** لو في حاجة مش ممكن تتخمّن، وغير كده اشتغل وافتح الملاحظات في الآخر.
- بيحب يشوف **الفيديو في الشات** (مش مسارات ملفات) — `SendUserFile` + ملخص قصير.
- بيشتغل على **ويندوز PowerShell** وبينزّل الريبو كـ zip. الأوامر عنده: `npm install` ثم `npm run render -- <Id>`، و`py scripts/generate_voice.py …` (ما فيش `bash`). فكّره ينزّل الـ zip من جديد بعد أي تعديل.
- **الصراحة أهم من الإرضاء:** نبّهه دايماً على الادعاءات اللي مش متأيدة من التطبيق (ضمان ١٤ يوم، "أول طلبين مجانًا" مقابل "كل ٣ شغلانات ببلاش" — محتاجين تأكيد إنها سياسة فعلية وإنها مش متعارضة)، وإن الصوت اتقاس بالأرقام بس.
- الأسماء والأسعار في الإعلانات **أمثلة** (ياسر/محمود/أحمد من تصميمات التطبيق، والباقي مخترع).
- شخصيات: الفني = `technician` + شنب (كاب + أخضر غامق)، الست = `hijab` (طرحة accent)، الراجل العميل = `shirt`. التعبيرات حسب الموقف (مصدوم/قلقان/متعصب/فرحان).

## 7) تعريف "خلصت" لأي فيديو جديد

- [ ] فولدر `src/videos/<Id>/` فيه `script.json` و`timing.json` و`index.tsx`، ومسجّل في `Root.tsx`، و`npx tsc --noEmit` نضيف.
- [ ] كل مشهد بالتوقيت المطلوب بالظبط، والخطّاف في أول ثانيتين، ومفيش أزرق.
- [ ] الصوت متحفظ ومتظبط (-17 LUFS)، والموسيقى مسموعة (~-29)، والـ SFX في أماكنها.
- [ ] لقطات المعاينة اتراجعت (مفيش تغطية/قص/نص صغير).
- [ ] MP4 اترندر (h264+aac، 1080×1920، المدة صح) واتبعت للمستخدم.
- [ ] commit + push على `claude/zen-dijkstra-k0uf0a`، و`README.md` اتحدّث.
- [ ] الرد النهائي: ملخص كل مشهد + القياسات + **الحاجات اللي محتاجة قرار/تأكيد** (ادعاءات، أصوات، جملة CTA ناقصة، إلخ).

---
**ابدأ بإنك تقرا:** `README.md`، `src/Root.tsx`، `src/lib/{theme,timing,stage}.ts*`، فيديو مرجعي (`src/videos/PickYourPrice/` للمدة الثابتة، `src/videos/ac-scam/` للمدة اللي الصوت بيحددها)، وبعدين اطلب من المستخدم السيناريو الجديد.
