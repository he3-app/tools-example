<template>
  <h-single-layout :max-width="800">
    <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 24 }">
      <a-form-item :label="t('amount')" style="width: 80%">
        <h-number-input
          v-model:value="amount"
          select-all-on-mount
          :controls="false"
        >
          <template #addonAfter>
            <h-select
              v-model:value="fromCurrency"
              show-search
              optionFilterProp="label"
              style="width: 200px"
            >
              <a-select-option
                v-for="[key, value] in Object.entries(currencies)"
                :key="key"
                :value="key"
                :label="t(value)"
                show-search
              >
                {{ t(value) }}
              </a-select-option>
            </h-select>
          </template>
        </h-number-input>
      </a-form-item>

      <a-form-item
        :label="`${t('toCurrency')} ${index + 1}`"
        style="width: 80%"
        v-for="(item, index) in toCurrencies"
        :key="index"
      >
        <h-select
          v-model:value="toCurrencies[index]"
          show-search
          optionFilterProp="label"
        >
          <a-select-option
            v-for="[key, value] in Object.entries(currencies)"
            :key="key"
            :value="key"
            :label="t(value)"
            show-search
          >
            {{ t(value) }}
          </a-select-option>
        </h-select>
      </a-form-item>

      <a-form-item style="width: 80%; margin-left: 26.5%">
        <a-button @click="addToCurrency">
          {{ t("AddCurrency") }}
        </a-button>
      </a-form-item>

      <a-form-item style="width: 80%; margin-left: 26.5%">
        <a-button @click="convertCurrency" type="primary">{{
          t("Convert")
        }}</a-button>
      </a-form-item>
    </a-form>
    <h2>
      {{ t("convertedResult") }}
    </h2>
    <a-spin :spinning="loading" size="large">
      <h-kv :value="result" mode="list" :disable-mode-switch="true" />
    </a-spin>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import messages from "./lang.json";
import { useI18n } from "vue-i18n";
import currencies from "./currency.json";

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

const amount = ref(100);
const fromCurrency = ref("USD");
const toCurrencies = ref(["AUD"]);
const result = ref({});
const loading = ref(false);

function addToCurrency() {
  toCurrencies.value.push("EUR");
}

async function convertCurrency() {
  try {
    loading.value = true;
    result.value = {};
    for (const item of toCurrencies.value) {
      if (fromCurrency.value === item) {
        if (amount.value != 0) {
          result.value = {
            ...result.value,
            [`${t(item)} / ${item}`]: amount.value,
          };
        }
      } else {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount.value}&from=${fromCurrency.value}&to=${item}`
        );
        if (!response.ok) {
          $he3.message.error(t("requestErr"));
          loading.value = false;
          result.value = {};
          return;
        }

        const output = await response.json();
        const key = `${Object.keys(output["rates"])[0]}`;
        const keyName = `${t(currencies[Object.keys(output["rates"])[0]])} / ${
          Object.keys(output["rates"])[0]
        }`;
        result.value = {
          ...result.value,
          [keyName]: output["rates"][key],
        };
      }
    }
    loading.value = false;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
  }
}
</script>

<style scoped lang="less"></style>
