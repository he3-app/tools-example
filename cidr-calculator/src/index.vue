<template>
  <h-single-layout>
    <a-form ref="formRef" :model="formModel" :rules="rules">
      <a-formItem name="cidr" :label="t('cidrAddress')">
        <a-inputSearch
          v-model:value="formModel.cidr"
          :enter-button="t('calculate')"
          @search="onCalculate"
        />
      </a-formItem>
    </a-form>

    <a-table :columns="columns" :data-source="dataSource" :show-header="false" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'label'">
          <a-typographyText strong>
            {{ `${record.label}:` }}
          </a-typographyText>
        </template>
        <template v-if="column.key === 'value'">
          <a-typographyText>
            {{ record.value }}
          </a-typographyText>
        </template>
        <template v-if="column.key === 'action'">
          <h-text-copy-button v-if="record.value" type="link" :content="record.value" />
        </template>
      </template>
    </a-table>
  </h-single-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRaw } from 'vue';
import IPCIDR, { isValidCIDR } from 'ip-cidr';
import { Address4, Address6 } from 'ip-address';
import { BigInteger } from 'jsbn';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const he3 = window.$he3;
onMounted(() => {
  // auto fill
  he3.getLastClipboard().then((res) => {
    if (isValidCIDR(res)) {
      formModel.value.cidr = res;
      onCalculate();
      window.$he3.onUseClipboardValue();
    }
  });
});

const formModel = ref<{
  cidr: string;
}>({
  cidr: '',
});
const rules: Record<string, Rule[]> = {
  cidr: [
    {
      required: true,
      message: t('inputErrorCidrMsg'),
      whitespace: true,
      validator: (rule, value) => {
        try {
          new IPCIDR(value);
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      },
      trigger: 'change',
    },
  ],
};
const formRef = ref<FormInstance>();

const result = ref<IPCIDR>();
const onCalculate = function () {
  formRef.value
    ?.validate()
    .then(() => {
      result.value = new IPCIDR(formModel.value.cidr);
    })
    .catch(() => {
      // 无需处理 表单有相关校验提醒
    });
};

const columns = [
  {
    title: 'Label',
    dataIndex: 'label',
    key: 'label',
    width: '30%',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    width: '55%',
  },
  {
    title: 'Action',
    key: 'action',
    width: '15%',
  },
];
const dataSource = ref([
  {
    label: t('cidrAddress'),
    value: computed(() => {
      return result.value?.address.address;
    }),
  },
  {
    label: t('netmask'),
    value: computed(() => {
      const address = toRaw(result.value?.address);
      if (!address) {
        return '';
      }
      if (address.v4) {
        return ipv4Netmask(address.subnetMask);
      } else {
        return ipv6Netmask(address.subnetMask);
      }
    }),
  },
  {
    label: t('ipRange'),
    value: computed(() => {
      const startAddress = result.value?.addressStart.address;
      const endAddress = result.value?.addressEnd.address;
      if (!startAddress || !endAddress) {
        return '';
      }
      return `[${startAddress}, ${endAddress}]`;
    }),
  },
  {
    label: t('network'),
    value: computed(() => {
      return result.value?.addressStart.address;
    }),
  },
  {
    label: t('broadcast'),
    value: computed(() => {
      return result.value?.addressEnd.address;
    }),
  },
  {
    label: t('firstAddress'),
    value: computed(() => {
      const startAddress = toRaw(result.value?.addressStart);
      if (!startAddress) {
        return '';
      }

      const firstsAddress = startAddress.bigInteger().add(new BigInteger('1'));
      if (startAddress.v4) {
        const v4Address = Address4.fromBigInteger(firstsAddress);
        return v4Address.isInSubnet(startAddress) ? v4Address.address : '';
      } else {
        const v6Address = Address6.fromBigInteger(firstsAddress);
        return v6Address.isInSubnet(startAddress) ? v6Address.address : '';
      }
    }),
  },
  {
    label: t('lastAddress'),
    value: computed(() => {
      const endAddress = toRaw(result.value?.addressEnd);
      if (!endAddress) {
        return '';
      }

      const lastAddress = endAddress.bigInteger().subtract(new BigInteger('1'));
      if (endAddress.v4) {
        const v4Address = Address4.fromBigInteger(lastAddress);
        return v4Address.isInSubnet(endAddress) ? v4Address.address : '';
      } else {
        const v6Address = Address6.fromBigInteger(lastAddress);
        return v6Address.isInSubnet(endAddress) ? v6Address.address : '';
      }
    }),
  },
]);

const ipv4Netmask = function (mask: number) {
  const maskBin = '1'.repeat(mask) + '0'.repeat(32 - mask);
  const maskArr = [];
  for (let i = 0; i < 4; i++) {
    maskArr.push(Number.parseInt(maskBin.slice(i * 8, i * 8 + 8), 2));
  }
  return maskArr.join('.');
};

const ipv6Netmask = function (mask: number) {
  const maskBin = '1'.repeat(mask) + '0'.repeat(128 - mask);
  const maskArr = [];
  for (let i = 0; i < 8; i++) {
    maskArr.push(Number.parseInt(maskBin.slice(i * 16, i * 16 + 16), 2).toString(16));
  }
  return maskArr.join(':');
};
</script>

<style scoped></style>
