import {Config} from '@remotion/cli/config';

// مجلد الـ assets هو الـ public dir (الصور، الصوت، الموسيقى)
Config.setPublicDir('assets');
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(18);
Config.setOverwriteOutput(true);
