# صلحلي — إعلانات قصيرة (Remotion)

إعلانات عمودية 1080×1920 بـ 30fps لتطبيق **صلحلي**، كارتون 2D flat مرسوم بـ SVG، عربي RTL بخط IBM Plex Sans Arabic.

## الفيديوهات

| ID | الفكرة | الجمهور |
|---|---|---|
| `ac-scam` | "التكييف باظ؟!" — الخوف من النصب ← فنيين متوثقين + ٣ عروض | عملاء |
| `verified` | "مين ده؟!" — فني مجهول داخل البيت ← توثيق + تقييمات + متابعة | عملاء |
| `ac-tech` | "الشغل قليل؟!" — الطلبات بتوصلك ← عرض سعر + واتساب + الفلوس | فنيين |

## التشغيل

المتطلبات: Node 18+، Python 3.9+، ffmpeg.

```bash
npm install
pip install -r requirements.txt

# 1) الصوت: يولّد mp3 لكل سطر + timing.json (محتاج إنترنت)
python3 scripts/generate_voice.py            # كل الفيديوهات
python3 scripts/generate_voice.py ac-scam    # فيديو واحد

# 2) (اختياري) إعادة توليد الـ sfx والموسيقى الـ placeholder
python3 scripts/generate_sfx.py              # sfx + موسيقى
python3 scripts/generate_sfx.py --no-music   # لو حطيت مزيكاك في assets/music.mp3

# 3) معاينة وتعديل
npm run dev                                  # Remotion Studio على http://localhost:3000

# 4) الرندر لـ out/*.mp4
./render.sh                                  # الكل
./render.sh verified                         # فيديو واحد
```

> **مهم:** ملفات `timing.json` اللي في الريبو متولّدة بـ `--offline` (صوت صامت وتوقيت تقديري) عشان المشروع يشتغل من أول مرة.
> لازم تشغّل `generate_voice.py` من غير `--offline` قبل الرندر النهائي عشان يبقى فيه صوت حقيقي.

## على ويندوز (PowerShell)

```powershell
# 1) سطّب Python من https://www.python.org/downloads/ وعلّم على "Add python.exe to PATH"
#    (بعدها اقفل PowerShell وافتحه تاني)
npm install
py -m pip install -r requirements.txt
py scripts/generate_voice.py
npm run dev               # معاينة
npm run render            # بدل ./render.sh (ده bash ومش بيشتغل على PowerShell)
npm run render -- ac-scam # فيديو واحد
```

لو الـ Studio طلّع خطأ من `chrome-extension://...` فده من إضافة في المتصفح، مش من المشروع.
افتح `http://localhost:3000` في نافذة Incognito أو اقفل الإضافة دي.

## لو edge-tts طلّع 403 (عطل من مايكروسوفت من حوالي 10 أكتوبر 2026)

الخطأ `WSServerHandshakeError: 403` مش مشكلة عندك — شوف https://github.com/rany2/edge-tts/issues/490. الحلول:

1. `pip install -U edge-tts` وجرّب تاني بعد شوية (لما ينزل إصلاح).
2. VPN بخروج أمريكي، أو `$env:HTTPS_PROXY="http://host:port"` في PowerShell (السكريبت بيمرّره لـ edge-tts).
3. **Azure Speech** (الخدمة الرسمية، نفس الأصوات ar-EG-ShakirNeural / ar-EG-SalmaNeural، وفيه free tier):
   1. اعمل Speech resource في https://portal.azure.com، وخد الـ Key والـ Region (مثلاً `westeurope`).
   2. PowerShell:
      ```powershell
      $env:AZURE_SPEECH_KEY="xxxxxxxx"
      $env:AZURE_SPEECH_REGION="westeurope"
      py scripts/generate_voice.py --provider azure
      ```
   توقيت الكلمات مع Azure بيتوزّع حسب عدد الحروف (REST مفيهوش word timing)، فالترجمة تقريبية جوه السطر لكن توقيت السطر نفسه مظبوط على الصوت.

4. **ملفات صوت جاهزة (من غير أي خدمة):** سجّل الجمل بصوتك أو صوت حد (موبايل، Audacity)، أو ولّدها من أي موقع TTS، وحطها كـ mp3 أو wav في `assets/audio/<video>/<line-id>.mp3`:
   ```powershell
   py scripts/generate_voice.py ac-tech --provider local   # لو ناقص ملفات بيطبعلك أسماءهم والنص بتاعهم
   ```
   السكريبت بيقيس مدة كل ملف ويظبط الفيديو عليها. اقطع الصمت من أول وآخر كل ملف عشان التوقيت يبقى مظبوط.
   لو هتستخدم موقع TTS، اتأكد إن ترخيصه بيسمح باستخدام تجاري (إعلانات).

## مستوى الصوت

- الكلام متظبط على حوالي **-17 LUFS** (عالي زي إعلانات السوشيال).
- الموسيقى بتشتغل على **15%** من الملف، وملف `assets/music.mp3` الـ placeholder متظبط على **-12 LUFS** عشان الـ 15% دي تبقى مسموعة (حوالي 12 ديسيبل تحت الكلام).
- لو حطيت مزيكا من عندك وطلعت خافتة، ارفع مستواها (أو غيّر `0.15` في `src/lib/stage.tsx` داخل `Music`).

## تعديل النص

كل فيديو له `src/videos/<id>/script.json`:

```json
{ "id": "hook", "speaker": "woman", "text": "التكييف باظ في عز الحر؟!" }
```

- `speaker`: `man` (ar-EG-ShakirNeural) أو `woman` (ar-EG-SalmaNeural).
- `rate` اختياري لكل سطر (مثلاً `"+10%"`). الافتراضي `+5%` (`--rate` من سطر الأوامر).
- بعد أي تعديل شغّل `generate_voice.py`. الفيديو بيقرا `timing.json`، فبيتظبط تلقائي: طول كل مشهد، توقيت الترجمة كلمة بكلمة، حركة الفم، والمدة الكلية.
- المشهد رقم *i* في `index.tsx` مربوط بالسطر رقم *i*. لو زوّدت سطر، زوّد له `<Scene>`.

## الهيكل

```
assets/                 ← public dir (remotion.config.ts)
  screens/*.png         ← نسخ بأسماء إنجليزي من شاشات التطبيق
  audio/<video>/*.mp3   ← متولّد
  sfx/{whoosh,pop,ding}.wav  ← متولّد بالكود (من غير مشاكل ترخيص)
  music.mp3             ← placeholder — بدّله بمزيكاك (صوتها 15%)
scripts/
  generate_voice.py     ← edge-tts ← mp3 + timing.json
  generate_sfx.py       ← sfx + موسيقى placeholder
src/
  components/
    Character.tsx       ← outfit / color / mood (happy|angry|shocked|worried) / speaking / gesture
    SpeechBubble.tsx
    PhoneMockup.tsx     ← بيعرض صورة من assets/ + scroll + highlight
    Caption.tsx         ← ترجمة كلمة بكلمة على شريط #2F3B2A شفاف
    EndCard.tsx         ← شعار + "نزّله من Google Play" + جملة حافز + شارة
    HookTitle.tsx       ← النص الكبير اللي بيتخبط في أول ثانيتين
    Backdrop.tsx, Props.tsx (تكييف/شمس/درع/نجمة/عملة…), Logo.tsx, GooglePlayBadge.tsx, VideoShell.tsx
  lib/theme.ts          ← الألوان + الخط
  lib/timing.ts         ← timing.json ← فريمات
  lib/stage.tsx         ← Scene, Sfx, Music, Wipe, useSpeaker…
  videos/<id>/          ← script.json + timing.json + index.tsx
render.sh
```

## ملاحظات

- **الألوان:** primary `#B8492C`، dark `#2F3B2A`، accent `#D69A2D`، background `#F7F2EA`، أبيض. البشرة والشعر بس هما اللي بألوان طبيعية. مفيش أزرق.
- **شارة جوجل بلاي:** مرسومة بألوان البراند لأن الشارة الرسمية فيها أزرق. لو محتاجها رسمية، نزّلها من Google Play badges وبدّل `GooglePlayBadge.tsx` بـ `<Img>`.
- **الخط** بيتحمّل من Google Fonts وقت الرندر، فمحتاج إنترنت.
- لو Remotion معرفش ينزّل Chrome، استخدم كروم عندك: `BROWSER_EXECUTABLE=/path/to/chrome ./render.sh`.
