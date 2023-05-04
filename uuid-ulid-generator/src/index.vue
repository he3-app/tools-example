<template>
  <h-horizontal-layout mode="left" :width="300" >
    <template #left>
      <div class="wrapper" >
        <!-- UUID -->
        <a-form :label-col="{ span: 9 }" :wrapper-col="{ span: 16 }" size="small">
          <a-form-item label="Type: ">
            <h-radio v-model:value="showUuid" :options="fun" size="small" option-type="button"
              :save-options="{ autoSave: true, key: 'fun' }" />
          </a-form-item>
          <a-form-item v-show="
            showUuid === 'UUID' &&
            uuidVersion !== 'v3' &&
            uuidVersion !== 'v5'
          " label="Number: ">
            <h-number-input v-model:value="uuidNumber" size="small" min="1" max="20"
              :save-options="{ autoSave: true, key: 'uuidNumber-1' }" @change="generator(Type.UUID)" />
          </a-form-item>
          <a-form-item v-show="
            (uuidVersion === 'v3' || uuidVersion === 'v5') &&
            showUuid !== fun[1]
          " label="Name: ">
            <h-input v-model:value="name" size="small" min="1" max="20" placeholder="Hello, World!"
              @change="generator(Type.UUID)" />
          </a-form-item>
          <a-form-item v-show="
            (uuidVersion === 'v3' || uuidVersion === 'v5') &&
            showUuid !== fun[1]
          " label="NameSpace: ">
            <h-input v-model:value="nameSpace" size="small" min="1" max="20"
              placeholder="1b671a64-40d5-491e-99b0-da01ff1f3341" @change="generator(Type.UUID)" />
          </a-form-item>
          <a-form-item v-show="showUuid === 'UUID'" label="Version: ">
            <h-radio v-model:value="uuidVersion" :options="UUIDVersion" option-type="button" size="small"
              :save-options="{ autoSave: true, key: 'UUIDVersion' }" @change="generator(Type.UUID)" />
          </a-form-item>

          <a-form-item v-show="showUuid === 'UUID'" label="With Dash: ">
            <a-switch v-model:checked="dashShow" />
          </a-form-item>

          <a-form-item v-show="showUuid == 'ULID'" label="Number: ">
            <h-number-input v-model:value="ulidNumber" size="small" min="1" max="20"
              :save-options="{ autoSave: true, key: 'uuidNumber-2' }" @change="generator(Type.ULID)" />
          </a-form-item>
          <a-form-item v-show="showUuid == 'NANOID'" label="Number: ">
            <h-number-input v-model:value="nanoidNumber" size="small" min="1" max="20" @change="generator(Type.NANOID)" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 16, offset: 12 }">
            <a-button id="generate" type="primary" size="middle"
              @click="generator(type)">
              {{ t("generateBtn") }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </template>
    <template #right>
      <div>
        <h-multiline v-show="showUuid === 'UUID'" v-model:value="uuid" :title="`${t('result')}`" />
        <h-multiline v-show="showUuid === 'ULID'" v-model:value="ulid" :title="`${t('result')}`" />
        <h-multiline v-show="showUuid === 'NANOID'" v-model:value="nanoidValue" :title="`${t('result')}`" />
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { ulid as ulidGenerator } from "ulid";
import random from "random";
import * as UUID from "uuid";
import { v3 as uuidv3 } from "uuid";
import { v5 as uuidv5 } from "uuid";
import randomStringGen, { Type as TypeOption } from "random-string-generator";
import { useI18n } from "vue-i18n";
import messages from "./lang.json";
import { nanoid } from 'nanoid'

const $he3 = window.$he3;
const { t } = useI18n({
  locale: $he3.lang,
  messages,
});

enum Type {
  UUID = "uuid",
  ULID = "ulid",
  NANOID = "nanoid",
  RANDOM_NUMBER = "Random Number",
  RANDOM_STRING = "Random String",
}

type Version = "v1" | "v3" | "v4" | "v5";

const TypeOption: Array<TypeOption> = [
  "alphanumeric",
  "numeric",
  "upper",
  "lower",
  "uppernumeric",
  "lowernumeric",
  "scoped",
];

const uuid = ref("");
const ulid = ref("");
const nanoidValue = ref("");
const name = ref("Hello, World!");
const nameSpace = ref("1b671a64-40d5-491e-99b0-da01ff1f3341");
const dashShow = ref<boolean>(false);
const uuidNumber = ref(5);
const ulidNumber = ref(5);
const nanoidNumber = ref(5);
const randomNumber = ref({
  val: 0,
  min: 0,
  max: 99,
});
const randomString = ref<{
  val: string;
  length: number;
  typeOption?: TypeOption;
  scoped?: string;
}>({
  val: "",
  length: 12,
});

const UUIDVersion: Version[] = ["v1", "v3", "v4", "v5"];
const fun = ["UUID", "ULID", "NANOID"];
const uuidVersion = ref<Version>(UUIDVersion[0]);
const showUuid = ref(fun[0]);
const type = computed(() => {
  switch(showUuid.value){
    case fun[0]:
      return Type.UUID
    case fun[1]:
      return Type.ULID
    case fun[2]:
      return Type.NANOID
    default:
      return Type.UUID
  }
})
watch(dashShow, () => {
  generator(Type.UUID);
});
const generator = (type: Type) => {
  switch (type) {
    case Type.UUID:
      generatUuid();
      break;
    case Type.ULID:
      generatUlid();
      break;
    case Type.NANOID:
      generatNANOid();
    case Type.RANDOM_NUMBER:
      const max = +randomNumber.value.max;
      const min = +randomNumber.value.min;
      if (max < min) {
        $he3.message.error("Max value must be greater than min value");
        return;
      }
      randomNumber.value.val = random.int(min, max);
      break;
    case Type.RANDOM_STRING:
      const length = +randomString.value.length;
      const typeOption = randomString.value.typeOption;
      const scoped = randomString.value.scoped;

      if (!typeOption) {
        randomString.value.val = randomStringGen(length);
      } else if (typeOption === "scoped") {
        if (!scoped || scoped?.length <= 0) {
          $he3.message.error("Scoped value is required");
          return;
        }
        randomString.value.val = randomStringGen(length, `scoped:${scoped}`);
      } else {
        randomString.value.val = randomStringGen(length, typeOption);
      }

      break;
  }
};

function generatUlid() {
  let res = "";
  for (let i = 0; i < ulidNumber.value; i++) {
    res += `${ulidGenerator()}\n`;
  }
  ulid.value = res;
};
function generatNANOid() {
  let res = "";
  for (let i = 0; i < nanoidNumber.value; i++) {
    res += `${nanoid()}\n`;
  }
  nanoidValue.value = res;
};
function generatUuid() {
  switch (uuidVersion.value) {
    case "v3":
      let v3Value = uuidv3(name.value, nameSpace.value);
      if (!dashShow.value) {
        v3Value = v3Value.replace(/-/g, "");
      }
      uuid.value = v3Value
      break;
    case "v5":
      let v5Value = uuidv5(name.value, nameSpace.value);
      if (!dashShow.value) {
        v5Value = v5Value.replace(/-/g, "");
      }
      uuid.value = v5Value
      break;
    default:
      const fn = UUID[uuidVersion.value];
      let res = "";
      for (let i = 0; i < uuidNumber.value; i++) {
        res += `${fn()}\n`;
      }
      if (!dashShow.value) {
        res = res.replace(/-/g, "");
      }
      uuid.value = res;
      break;
  }

};

onMounted(() => {
  generator(Type.UUID);
  generator(Type.ULID);
  generator(Type.NANOID);
});
</script>

<style scoped lang="less">
.wrapper {
  padding: 2vh 0.5vw;

  .number-limit {
    width: 150px;
  }

  .random-string-wrap {
    display: grid;
    grid-template-columns: auto auto auto;

    &>input:last-child {
      grid-column: span 3;
    }
  }
}

// :deep .output {
//   margin-top: 0;
// }
:deep(.output) {
  margin-top: 0;
}
</style>
