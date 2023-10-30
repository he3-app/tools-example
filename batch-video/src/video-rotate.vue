<template>
  <!-- <div class="text-center">
    <h3>{{ t('videoRotate.title') }}</h3>
  </div> -->
  <VideoComponents @upload="upload" :result="result" :clear-data="clearData" :load="loading">
    <div class="tab">
      <div class="parseint">
        <svg
          t="1686555608352"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6264"
          width="40"
          height="40"
          @click="rotateLeftSvg"
        >
          <path
            d="M541.226667 66.517333L393.045333 217.685333a21.333333 21.333333 0 0 0 0 29.866667l147.84 150.826667a21.333333 21.333333 0 0 0 28.16 2.090666l2.346667-2.090666 27.050667-27.605334a21.333333 21.333333 0 0 0 0-29.866666l-69.888-71.338667a304.64 304.64 0 1 1-318.421334 352.682667l-1.024-6.826667a176.554667 176.554667 0 0 1-0.64-5.632 21.333333 21.333333 0 0 0-22.314666-19.114667l-42.666667 2.261334a21.333333 21.333333 0 0 0-20.224 22.4l0.085333 1.024 1.194667 10.496A389.973333 389.973333 0 1 0 539.178667 184.746667l59.306666-60.458667a21.333333 21.333333 0 0 0 0-29.866667l-27.093333-27.605333a21.333333 21.333333 0 0 0-30.165333-0.298667z"
            fill="#858EBD"
            p-id="6265"
          ></path>
        </svg>
        <svg
          t="1685936130403"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2974"
          width="40"
          height="40"
          @click="rotateSvg"
        >
          <path
            d="M482.773333 66.517333l148.181334 151.168a21.333333 21.333333 0 0 1 0 29.866667l-147.84 150.826667a21.333333 21.333333 0 0 1-28.16 2.090666l-2.346667-2.090666-27.050667-27.605334a21.333333 21.333333 0 0 1 0-29.866666l69.888-71.338667a304.64 304.64 0 1 0 318.421334 352.682667l1.024-6.826667c0.170667-1.408 0.426667-3.285333 0.64-5.632a21.333333 21.333333 0 0 1 22.314666-19.114667l42.666667 2.261334a21.333333 21.333333 0 0 1 20.224 22.4l-0.085333 1.024-1.194667 10.496A389.973333 389.973333 0 1 1 484.821333 184.746667l-59.306666-60.458667a21.333333 21.333333 0 0 1 0-29.866667l27.093333-27.605333a21.333333 21.333333 0 0 1 30.165333-0.298667z"
            fill="#858EBD"
            p-id="2975"
          ></path>
        </svg>
      </div>
      <div class="textTip">
        <a-typography-text>
          <span>
            {{
              angle == 0
                ? t('videoRotate.rotateTip')
                : t('videoRotate.rotate') + angle + t('videoRotate.degree')
            }}
          </span>
        </a-typography-text>
      </div>
      <a-button type="primary" :loading="loading" @click="convertFunction" class="download">
        {{ loading == true ? t('videoRotate.convert') : t('videoRotate.start') }}
      </a-button>
      <a-progress
        :percent="progress"
        :stroke-color="'#6c00b4'"
        v-if="loading"
        style="margin-top: 20px"
      ></a-progress>
      <a-button type="primary" :disabled="disable" @click="handleDownload" class="download">
        {{ t('download') }}
      </a-button>
    </div>
  </VideoComponents>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import VideoComponents from './UploadVideoComponents.vue';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useI18n } from 'vue-i18n';
import messages from './lang/lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const progress = ref(0);
const disable = ref(true);
const ffmpeg = createFFmpeg({ log: true });
const angle = ref(0);
const video = ref(null);
const flag = ref(0);
const upload = (file) => {
  video.value = file;
};

onMounted(async () => {
  await ffmpeg.load();
  console.log('done');
});
const clearData = () => {
  video.value = null;
  result.url = null;
  disable.value = true;
};
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = 'output.mp4';
  // 触发下载
  link.click();
};
const result = reactive({
  url: '',
  type: 'video',
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loading = ref(false);

//gif to video
const convertFunction = async () => {
  loading.value = true;
  disable.value = true;
  if (angle.value == 0 && flag.value == 0) {
    window.$he3.message.warn(t('videoRotate.zeroWarn'));
    flag.value++;
    return false;
  }
  const { name } = video.value;

  ffmpeg.setProgress(({ ratio }) => {
    // 计算当前进度百分比
    const currentProgress = Math.round(ratio * 100);
    console.log(`Conversion progress: ${currentProgress}%`);
    // 更新进度条
    progress.value = currentProgress;
  });
  // Run the FFMpeg command
  if (flag.value !== 0) {
    ffmpeg.FS('writeFile', name, await fetchFile(video.value));
    await ffmpeg.run(
      '-i',
      name,
      '-vf',
      `rotate=${angle.value}*PI/180:fillcolor=black@0`,
      '-c:a',
      'copy',
      'output.mp4'
    );
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/mp4' }));
    result.url = url;
    disable.value = false;
    window.$he3.message.success(t('success'));
  }
  loading.value = false;
  flag.value++;

  // Read the result
};

const rotateSvg = () => {
  angle.value += 90;
  if (angle.value >= 360) {
    angle.value = angle.value % 360;
  }
};

const rotateLeftSvg = () => {
  angle.value -= 90;
  if (angle.value < 0) {
    angle.value = 360 - (Math.abs(angle.value) % 360);
  }
};
</script>
<style scoped lang="less">
.text-center {
  display: flex;
  margin-top: 10px;
  justify-content: center;
}

.tab {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
}

.textTip {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.parseint {
  display: flex;
  justify-content: center;

  .icon {
    display: flex;
    /* 添加灰色边框 */
    padding: 5px;
    /* 添加内边距 */
  }

  .icon:hover {
    background-color: #f5f5f5;
    /* 鼠标悬停时高亮 */
    cursor: pointer;
    /* 鼠标悬停时显示手型光标 */
  }

  .icon:active {
    background-color: #a4a8ca;
    /* 点击时橙色背景色 */
    color: #fff;
  }
}

.download {
  margin-top: 20px;
}
</style>
