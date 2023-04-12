<template>
  <h-single-layout :max-width="800">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="t('timestamp')">
        <h-number-input
          v-model:value="timestamp"
          select-all-on-mount
          :controls="false"
          @change="formatTimestamp"
        >
          <template #addonAfter>
            <h-select v-model:value="timestampFormat" @change="formatTimestamp">
              <a-select-option title="s" value="s" />
              <a-select-option title="ms" value="ms" />
              <a-select-option title="us" value="us" />
              <a-select-option title="ns" value="ns" />
            </h-select>
          </template>
        </h-number-input>
      </a-form-item>

      <a-form-item v-show="!props.renderOnSearch" :label="t('inputTimezone')">
        <a-select
          v-model:value="inputTimezone"
          show-search
          @change="formatTimestamp"
        >
          <a-select-option
            v-for="item in timezoneList"
            :key="item.tzCode"
            :title="item.tzCode"
            :value="item.tzCode"
            show-search
          />
        </a-select>
      </a-form-item>
      <a-form-item v-show="!props.renderOnSearch" :label="t('outputTimezone')">
        <a-select
          v-model:value="outputTimezone"
          show-search
          @change="formatTimestamp"
        >
          <a-select-option
            v-for="item in timezoneList"
            :key="item.tzCode"
            :title="item.tzCode"
            :value="item.tzCode"
          />
        </a-select>
      </a-form-item>
      <a-form-item v-show="!props.renderOnSearch" :label="t('enableUTC')">
        <a-switch v-model:checked="enableUtc" @change="formatTimestamp" />
      </a-form-item>
    </a-form>

    <h-kv :value="result" mode="list" :disable-mode-switch="true" />
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useI18n } from "vue-i18n";
import timezonesData from "../data/timezones.json";
import { DateFormatEnum } from "./enums";
import messages from "./lang.json";

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneList = timezonesData.sort((a, b) => {
  return a.tzCode.localeCompare(b.tzCode);
});

const props = defineProps({
  defaultTimestampFormat: {
    type: String,
    default: "s",
  },
  enableUTC: {
    type: Boolean,
    default: false,
  },
  clipboardValue: {
    default: undefined,
  },
  renderOnSearch: {
    type: Boolean,
    default: false,
  },
});

function isNumber(str: string) {
  try {
    return !isNaN(Number.parseInt(str));
  } catch {
    return false;
  }
}

onMounted(() => {
  $he3.getLastClipboard().then((res) => {
    if (isNumber(res)) {
      const clipboardValue = Number.parseInt(res);
      const maxDate = dayjs("2080-12-31 23:59:59", "YYYY-MM-DD HH:mm:ss");
      const minDate = dayjs("1980-01-01 00:00:00", "YYYY-MM-DD HH:mm:ss");
      if (
        clipboardValue >= minDate.unix() &&
        clipboardValue <= maxDate.unix()
      ) {
        timestamp.value = clipboardValue;
        timestampFormat.value = "s";
      } else if (
        clipboardValue >= minDate.valueOf() &&
        clipboardValue <= maxDate.valueOf()
      ) {
        timestamp.value = clipboardValue;
        timestampFormat.value = "ms";
      } else if (
        clipboardValue >= minDate.valueOf() * 1000 &&
        clipboardValue <= maxDate.valueOf() * 1000
      ) {
        timestamp.value = clipboardValue;
        timestampFormat.value = "us";
      } else if (
        clipboardValue >= minDate.valueOf() * 1000000 &&
        clipboardValue <= maxDate.valueOf() * 1000000
      ) {
        timestamp.value = clipboardValue;
        timestampFormat.value = "ns";
      }
    }
    formatTimestamp();
    $he3.onUseClipboardValue();
  });
});

const timestamp = ref(dayjs().unix());
const timestampFormat = ref(props.defaultTimestampFormat);
const enableUtc = ref(props.enableUTC);
const inputTimezone = ref(dayjs.tz.guess());
const outputTimezone = ref(dayjs.tz.guess());
const result = ref({});
const format = ref(DateFormatEnum.RFC2822);
const formatOptions: { label: string; value: string }[] = [];
if (props.renderOnSearch) {
  formatOptions.push(
    {
      label: "RFC2822",
      value: DateFormatEnum.RFC2822,
    },
    {
      label: "ISO8601",
      value: DateFormatEnum.ISO8601,
    }
  );
} else {
  const keys = Object.keys(DateFormatEnum);
  keys.forEach((key) => {
    formatOptions.push({
      label: key,
      value: DateFormatEnum[key as keyof typeof DateFormatEnum],
    });
  });
}

function formatTimestamp() {
  if (!timestamp.value) {
    return;
  }

  let formatTimestamp = dayjs(timestamp.value).tz(inputTimezone.value);
  if (timestampFormat.value === "s") {
    formatTimestamp = dayjs.unix(timestamp.value).tz(inputTimezone.value);
  } else if (timestampFormat.value === "us") {
    formatTimestamp = dayjs(timestamp.value / 1000).tz(inputTimezone.value);
  } else if (timestampFormat.value === "ns") {
    formatTimestamp = dayjs(timestamp.value / 1000000).tz(inputTimezone.value);
  }

  let outputFormatTimestamp = dayjs.tz(formatTimestamp, outputTimezone.value);
  if (enableUtc.value) {
    formatTimestamp = formatTimestamp.utc();
    outputFormatTimestamp = outputFormatTimestamp.utc();
  }

  result.value = {};
  formatOptions.forEach((item) => {
    const key = `${item.label} (${outputTimezone.value})`;
    result.value = {
      ...result.value,
      [key]: outputFormatTimestamp.format(item.value),
    };
  });
  if (!props.renderOnSearch) {
    // add user local timezone
    const localKey = `Local (${dayjs.tz.guess()})`;
    result.value = {
      ...result.value,
      [localKey]: formatTimestamp.format(DateFormatEnum.RFC2822),
    };
  }
}
</script>

<style scoped lang="less"></style>
