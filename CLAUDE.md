# CLAUDE.md — إعلانات "صلحلي" (Remotion)

**اقرا الأول: [`docs/NEXT_CHAT_PROMPT.md`](docs/NEXT_CHAT_PROMPT.md)** (شرح كامل لطريقة الشغل والـ pipeline والمشاكل المعروفة)، وبعدها `README.md`.

أهم القواعد:
- فيديوهات 1080×1920 @30fps، كارتون SVG، RTL، خط IBM Plex Sans Arabic. الألوان: `#B8492C` `#2F3B2A` `#D69A2D` `#F7F2EA` وأبيض. **ممنوع أزرق.**
- كل فيديو = فولدر `src/videos/<CompositionId>/` (script.json + timing.json + index.tsx) ومسجّل في `src/Root.tsx`. الـ id = اسم الفولدر.
- الصوت: Speko MCP (`Samir` راجل، `Mariam` ست، مصري) ← `scripts/save_speko_audio.py` ← `scripts/generate_voice.py <Id> --provider local`. (edge-tts واقع حالياً.)
- معاينة: `scripts/preview_frames.sh`. رندر: `npm run render -- <Id>` (في الخلفية، ~2 دقيقة).
- الخطّاف في أول ثانيتين. الترجمة السفلية بتشغل y≈1245–1620.
- بعد كل تسليم: commit + push على `claude/zen-dijkstra-k0uf0a` (من غير PR إلا لو طُلب). متكتبش مفاتيح في الملفات.
- رد على المستخدم بالعامية المصرية، وبصراحة عن أي ادعاء مش متأيد من التطبيق.
