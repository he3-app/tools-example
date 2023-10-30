<template>
  <VideoComponents @upload='upload' @remove='remove' :loading='loading'>
    <h-card-box text='Setting'>
      <div class='itemOption'>
        <span class='title'>{{ t('extractAudioFromVideo.ExtractedAudioFormat') }}</span>
        <h-select v-model:value='paddingType'>
          <a-select-option :value='CipherType.MP3'>
            {{ CipherType.MP3 }}
          </a-select-option>
          <a-select-option :value='CipherType.WAV'>
            {{ CipherType.WAV }}
          </a-select-option>
          <a-select-option :value='CipherType.FLAC'>
            {{ CipherType.FLAC }}
          </a-select-option>
          <a-select-option :value='CipherType.OGG'>
            {{ CipherType.OGG }}
          </a-select-option>
          <a-select-option :value='CipherType.WMA'>
            {{ CipherType.WMA }}
          </a-select-option>
          <a-select-option :value='CipherType.M4A'>
            {{ CipherType.M4A }}
          </a-select-option>
          <a-select-option :value='CipherType.DTS'>
            {{ CipherType.DTS }}
          </a-select-option>
          <a-select-option :value='CipherType.AMR'>
            {{ CipherType.AMR }}
          </a-select-option>
          <a-select-option :value='CipherType.AAC'>
            {{ CipherType.AAC }}
          </a-select-option>
        </h-select>
      </div>
    </h-card-box>
    <div class='options'>
      <div class='contentOption'>
        <audio :src='result.audioUrl' style='margin-bottom: 15px' controls v-if='saveFlag' />
        <a-button type='primary' :loading='loading' @click='startFunction'>
          <span>{{ loading ? t('extractAudioFromVideo.extracting') : t('extractAudioFromVideo.start') }}</span>
        </a-button>
        <a-button type='primary' @click='handleDownload' v-if='saveFlag'>
          {{ t('download') }}
        </a-button>
      </div>
    </div>
  </VideoComponents>
</template>

<script setup lang='ts'>
import { onMounted, ref, reactive, watch } from 'vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import VideoComponents from './UploadVideoComponents.vue';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';

const loading = ref(false);
const saveFlag = ref(false);//是否显示保存按钮
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const ffmpeg = createFFmpeg({ log: true });
const paddingType = ref(CipherType.MP3);
const video = ref(null);
onMounted(async () => {
  await ffmpeg.load();
});
const upload = (file) => {
  video.value = file;
};
const remove = () => {
  saveFlag.value = false;
  loading.value = false;
};
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.downUrl;
  link.download = `output.${paddingType.value}`;
  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'video',
  downUrl: '',
  audioUrl: '',
});

const enum CipherType {
  MP3 = 'mp3',
  AAC = 'acc',
  WAV = 'wav',
  FLAC = 'flac',
  OGG = 'ogg',
  WMA = 'wma',
  M4A = 'm4a',
  DTS = 'dts',
  AMR = 'amr',
}

const sound = {
  mp3: 'audio/mpeg',
  acc: 'audio/aac',
  wav: 'audio/wav',
  flac: 'audio/flac',
  ogg: 'audio/ogg',
  wma: 'audio/x-ms-wma',
  m4a: 'audio/mp4',
  dts: 'audio/vnd.dts',
  amr: 'audio/amr',
};
const startFunction = async () => {
  loading.value = true;
  const { name } = video.value;
  try {
    ffmpeg.FS('writeFile', name, await fetchFile(video.value));
    // Check if video contains audio
    await ffmpeg.run('-i', name);
    // Run the FFMpeg command
    paddingType.value == 'mp3'
      ? await ffmpeg.run(
        '-i',
        name,
        '-vn',
        '-acodec',
        'libmp3lame',
        '-ab',
        '192k',
        '-ar',
        '44100',
        '-f',
        'mp3',
        `output.mp3`,
      )
      : paddingType.value == 'acc'
        ? await ffmpeg.run(
          '-i',
          name,
          '-vn',
          '-acodec',
          'aac',
          '-b:a',
          '192k',
          '-ar',
          '44100',
          '-f',
          'mp4',
          `output.aac`,
        )
        : paddingType.value == 'wav'
          ? await ffmpeg.run(
            '-i',
            name,
            '-vn',
            '-acodec',
            'pcm_s16le',
            '-ar',
            '44100',
            '-f',
            'wav',
            `output.wav`,
          )
          : paddingType.value == 'flac'
            ? await ffmpeg.run(
              '-i',
              name,
              '-vn',
              '-acodec',
              'flac',
              '-compression_level',
              '8',
              '-ar',
              '44100',
              '-f',
              'flac',
              `output.flac`,
            )
            : paddingType.value == 'ogg'
              ? await ffmpeg.run(
                '-i',
                name,
                '-vn',
                '-acodec',
                'libvorbis',
                '-qscale:a',
                '6',
                '-ar',
                '44100',
                '-f',
                'ogg',
                `output.ogg`,
              )
              : paddingType.value == 'wma'
                ? await ffmpeg.run(
                  '-i',
                  name,
                  '-vn',
                  '-acodec',
                  'wmav2',
                  '-b:a',
                  '128k',
                  '-ar',
                  '44100',
                  '-f',
                  'asf',
                  `output.wma`,
                )
                : paddingType.value == 'm4a'
                  ? await ffmpeg.run(
                    '-i',
                    name,
                    '-vn',
                    '-acodec',
                    'aac',
                    '-b:a',
                    '192k',
                    '-ar',
                    '44100',
                    '-f',
                    'mp4',
                    '-movflags',
                    '+faststart',
                    `output.m4a`,
                  )
                  : paddingType.value == 'dts'
                    ? await ffmpeg.run(
                      '-i',
                      name,
                      '-vn',
                      '-acodec',
                      'dts',
                      '-b:a',
                      '1536k',
                      '-ar',
                      '48000',
                      '-f',
                      'dts',
                      `output.dts`,
                    )
                    : await ffmpeg.run(
                      '-i',
                      name,
                      '-vn',
                      '-acodec',
                      'amr_nb',
                      '-ar',
                      '8000',
                      '-f',
                      'amr',
                      `output.amr`,
                    );
    // Read the result
    const data = ffmpeg.FS('readFile', `output.${paddingType.value}`);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: `${sound[paddingType.value]}` }));
    window.$he3.message.success(t('success'));
    result.downUrl = url;
    result.audioUrl = url;
    saveFlag.value = true;
    loading.value = false;
  } catch (error) {
    window.$he3.message.warn(t('extractAudioFromVideo.no'));
  }
};


</script>
<style scoped lang='less'>
.itemOption {
  margin: 15px 0 23px;
  min-height: 54px;
  min-width: 250px;
  width: 35%;

  .title {
    display: block;
    margin-bottom: 6px;
  }
}

.itemOption:nth-last-child(2) {
  margin-bottom: 35px;
}

.options {
  width: 100%;

  .contentOption {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  :deep(.ant-btn) {
    margin-left: 2%;
    padding: 12px 24px 35px;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.2px;
  }
}

</style>
