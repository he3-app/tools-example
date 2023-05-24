<template>
  <h-horizontal-layout mode="left" :width="200">
    <template #left>
      <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item style="justify-content: center">
          <h-file-upload-button accept="image/*" size="middle" @after-selected="handleFileSelected">
            {{ t('choose') }}
          </h-file-upload-button>
        </a-form-item>
        <a-form-item :label="t('height')">
          <a-input-number v-model:value="imageMessage.height" />
        </a-form-item>
        <a-form-item :label="t('width')">
          <a-input-number v-model:value="imageMessage.width" />
        </a-form-item>
        <a-form-item :label="t('zoom')">
          <a-input-number v-model:value="imageMessage.zoom" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 12 }">
          <a-slider v-model:value="imageMessage.zoom" :min="1" :max="300" />
        </a-form-item>
        <a-form-item label="X">
          <a-input-number v-model:value="imageMessage.x" />
        </a-form-item>
        <a-form-item label="Y">
          <a-input-number v-model:value="imageMessage.y" />
        </a-form-item>
        <a-form-item :label="t('rotate')">
          <a-input-number v-model:value="imageMessage.rotate" max="360" min="-360" />
        </a-form-item>
        <a-form-item style="padding-left: 20px">
          <a-space>
            <a-popover>
              <template #content>
                {{ t('rotateLeft') }}
              </template>
              <a-button type="primary" shape="circle" size="small" @click="rotateLeft">
                <UndoOutlined />
              </a-button>
            </a-popover>
            <a-popover>
              <template #content>
                {{ t('rotateRight') }}
              </template>
              <a-button type="primary" shape="circle" size="small" @click="rotateRight">
                <RedoOutlined />
              </a-button>
            </a-popover>
            <a-popover>
              <template #content>
                {{ t('scaleLeftNRight') }}
              </template>
              <a-button type="primary" shape="circle" size="small" @click="scaleLeftNRight">
                <ColumnWidthOutlined />
              </a-button>
            </a-popover>
            <a-popover>
              <template #content>
                {{ t('scaleUpNDown') }}
              </template>
              <a-button type="primary" shape="circle" size="small" @click="scaleUpNDown">
                <ColumnHeightOutlined />
              </a-button>
            </a-popover>
            <a-popover>
              <template #content>
                {{ $t('reset') }}
              </template>
              <a-button shape="circle" size="small" type="danger" @click="resetImg">
                <SyncOutlined />
              </a-button>
            </a-popover>
          </a-space>
        </a-form-item>
      </a-form>
      <a-button type="primary" block @click="handleDownload">
        {{ t('save') }}
      </a-button>
    </template>
    <template #right>
      <a-upload-dragger v-if="!img" accept="image/*" max-count="1" :before-upload="beforeUpload" :show-upload-list="false"
        list-type="picture">
        <div class="upload-area">
          <p>{{ t('upload') }}</p>
        </div>
      </a-upload-dragger>
      <img v-show="img" ref="imageRef" />
    </template>
  </h-horizontal-layout>
</template>
<script lang="ts" setup>
import ColumnHeightOutlined from '@ant-design/icons-vue/ColumnHeightOutlined';
import ColumnWidthOutlined from '@ant-design/icons-vue/ColumnWidthOutlined';
import RedoOutlined from '@ant-design/icons-vue/RedoOutlined';
import SyncOutlined from '@ant-design/icons-vue/SyncOutlined';
import UndoOutlined from '@ant-design/icons-vue/UndoOutlined';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import { isElectron } from './is'

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const type = ref('image/png');
const imageRef = ref<null | HTMLImageElement>(null);
const cropper = ref();
// 初始化裁剪
onMounted(() => {
  cropper.value = new Cropper(imageRef?.value, {
    viewMode: 1,
    dragMode: 'crop',
    preview: '.before',
    background: false,
    zoomOnWheel: true,
  });
  // 移动crop
  imageRef.value?.addEventListener('cropend', () => {
    const data = cropper.value.getData();
    imageMessage.height = Math.trunc(data.height);
    imageMessage.width = Math.trunc(data.width);
    imageMessage.x = Math.trunc(data.x);
    imageMessage.y = Math.trunc(data.y);
  });
  // 图片加载完毕
  imageRef.value?.addEventListener('ready', () => {
    const image = cropper.value.getImageData();
    const { width, height, naturalWidth, naturalHeight } = image;
    imageMessage.zoom = Math.floor(
      (Math.min(width, height) / Math.min(naturalWidth, naturalHeight)) * 100
    );
  });
});
onUnmounted(() => {
  imageRef.value?.removeEventListener('cropend', () => { });
  imageRef.value?.removeEventListener('ready', () => { });
});
// 信息操作面板
const imageMessage = reactive({
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  rotate: 0,
  zoom: 1,
});
watch([imageMessage], () => {
  cropper.value.setData({
    width: imageMessage.width,
    height: imageMessage.height,
    x: imageMessage.x,
    y: imageMessage.y,
    rotate: imageMessage.rotate,
  });
});
// 编辑图像
const rotateLeft = () => {
  cropper.value.rotate(-90);
  const data = cropper.value.getData();
  imageMessage.rotate = data.rotate;
};
const rotateRight = () => {
  cropper.value.rotate(90);
  const data = cropper.value.getData();
  imageMessage.rotate = data.rotate;
};
let mirrorUD = false;
let mirrorLR = false;
const scaleUpNDown = () => {
  if (mirrorUD) {
    cropper.value.scaleY(1);
    mirrorUD = false;
  } else {
    cropper.value.scaleY(-1);
    mirrorUD = true;
  }
};
const scaleLeftNRight = () => {
  if (mirrorLR) {
    cropper.value.scaleX(1);
    mirrorLR = false;
  } else {
    cropper.value.scaleX(-1);
    mirrorLR = true;
  }
};
watch(
  () => imageMessage.zoom,
  () => {
    cropper.value.zoomTo(imageMessage.zoom / 100);
  }
);

const resetImg = () => {
  cropper.value.reset();
  const data = cropper.value.getData();
  imageMessage.height = Math.trunc(data.height);
  imageMessage.width = Math.trunc(data.width);
  imageMessage.x = Math.trunc(data.x);
  imageMessage.y = Math.trunc(data.y);
  imageMessage.rotate = data.rotate;
  imageMessage.zoom = 1;
  const image = cropper.value.getImageData();
  const { width, height, naturalWidth, naturalHeight } = image;
  imageMessage.zoom = Math.floor(
    (Math.min(width, height) / Math.min(naturalWidth, naturalHeight)) * 100
  );
};

// 功能区
const handleDownload = () => {
  window.$he3.downloadByUrl(
    cropper.value
      .getCroppedCanvas({
        imageSmoothingQuality: 'high',
      })
      .toDataURL(`${type.value}`)
  );
};

// 加载图像
const img = ref(false);
async function handleFileSelected(file: any) {
  type.value = file.type;
  img.value = true;
  if (isElectron) {
    cropper.value.replace(`file://${file.path}`);
  } else {
    const urlPath = URL.createObjectURL(file)
    cropper.value.replace(urlPath);
  }
}

const beforeUpload = async (file: any) => {
  if (isElectron) {
    cropper.value.replace(`file://${file.path}`);
  } else {
    const urlPath = URL.createObjectURL(file)
    cropper.value.replace(urlPath);
  }
  img.value = true;
};
</script>

<style scoped>
.upload-area {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
