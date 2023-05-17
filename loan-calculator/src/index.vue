<template>
  <h-single-layout mode="middle" :width="800">
    <a-form v-show="!he3.renderOnSearch" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="margin-left: 10%;">  
      <a-form-item :label="t('LoanPrincipal')">
        <h-input 
          v-model:value="loanAmount"
          :min="0"
          :max="100000000"
          :precision="0"
          :step="1000"
          size="default"
          style="width: 200px"
          :save-options="{autoSave:true,key:'user-input'}"
        />
      </a-form-item>
      <a-form-item :label="t('LatestLPR')">
        <h-input
          v-model:value="latestLPR"
          :min="0"
          :max="100"
          :precision="2"
          :step="0.01"
          size="default"
          style="width: 200px"
          :onchange="calculateInterestRate()"
        />
      </a-form-item>
      <a-form-item :label="t('LPRPlusValue')">
        <h-input
          v-model:value="LPRPlusValue"
          :min="0"
          :max="100"
          :precision="2"
          :step="0.01"
          size="default"
          style="width: 200px"
          :onchange="calculateInterestRate()"
        />
      </a-form-item>
      <a-form-item :label="t('AnnualInterestRate')">
        <span class="interestDisplay">{{ interestRate.toFixed(2) }}</span>
        <!-- <h-singleline :value="interestRate" /> -->
        <!-- <h-input
          v-model:value="interestRate"
          :min="0"
          :max="100"
          :precision="2"
          :step="0.01"
          size="default"
          style="width: 200px"
        /> -->
      </a-form-item>
      <a-form-item :label="t('LoanTerm')">
        <h-input
          v-model:value="loanTerm"
          :min="1"
          :max="360"
          :precision="0"
          :step="1"
          size="default"
          style="width: 200px"
        />
      </a-form-item>
      <a-form-item :label="t('CalcMethod')">
        <h-select v-model:value="repaymentType" :save-options="{autoSave: true, value: 'repaymentType'}" style="width: 200px">
          <a-select-option :value="0">{{ t('EqualLoan') }}</a-select-option>
          <a-select-option :value="1">{{ t('EqualPrincipal') }}</a-select-option>
        </h-select>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" @click="calculate">
          {{ t('Calculate') }}
        </a-button>
      </a-form-item>
    </a-form>
    

    <h2>{{ t('TotalInterest') }} {{ totalInterestNum.toFixed(2) }}</h2>
    <h2>{{ t('TotalPayment') }} {{ totalPayNum.toFixed(2) }}</h2>
    <h2>{{ t('MonthlyRepaymentDetail') }}</h2>
    <table style="width: 100%;">
      <caption>{{ t('Description') }}</caption>
      <thead>
        <tr>
          <th scope="col">{{ t('TermNO') }}</th>
          <th scope="col" class="th0">{{ t('RepayAmount') }}</th>
          <th scope="col">{{ t('RepayInterest') }}</th>
          <th scope="col" class="th0">{{ t('RepayPrincipal') }}</th>
          <th scope="col">{{ t('RemainingPrincipal') }}</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in monthlyPaymentDetail">
        <tr>
          <th scope="col" class="th1">{{ index+1 }}</th>
          <th scope="col" class="th2">{{ item[0].toFixed(2) }}</th>
          <th scope="col" class="th1">{{ item[1].toFixed(2) }}</th>
          <th scope="col" class="th2">{{ item[2].toFixed(2) }}</th>
          <th scope="col" class="th1">{{ item[3].toFixed(2) }}</th>
        </tr>
      </tbody>
    </table>
    <a-form-item :wrapper-col="{ offset: 0, span: 16 }">
      <a-button type="primary" html-type="submit" @click="exportTableToCSV('Repayment_Detail_Data.csv')">
        {{ t('Export') }}
      </a-button>
    </a-form-item>
  </h-single-layout>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import messages from './lang.json';
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const he3 = window.$he3;

const loanAmount = ref<number>(0);
const latestLPR = ref<number>(4.6);
const LPRPlusValue = ref<number>(0);
const interestRate = ref<number>(0);
const loanTerm = ref<number>(0);
const repaymentType = ref<number>(0);
var monthlyPaymentDetail = ref<number[][]>([])
var totalPayNum = ref<number>(0);
var totalInterestNum = ref<number>(0);

function calculateInterestRate() {
  interestRate.value = Number(latestLPR.value) + 0.01*Number(LPRPlusValue.value);
}

function monthlyInterestRate() {
  // 计算月利率
  return interestRate.value / 12 / 100;
}

function monthlyPayment() {
  let res: number[][] = []
  // 计算每月还款额
  if (repaymentType.value==0) {
    if (loanAmount.value === 0 || interestRate.value === 0 || loanTerm.value === 0) {
      console.log('Returning 0')
      // res.push(ref<number>(0).value);
      return res;
    }
    console.log('Not returning 0')
    const n = loanTerm.value; // 总期数
    const mir = monthlyInterestRate(); // 月利率
    const pow = Math.pow(1 + mir, n); // (1+i)^n
    const monthlyPaymentAmount = (loanAmount.value * mir * pow) / (pow - 1)
    var leftLoanAmount = Number(loanAmount.value);
    for (let i=0;i<n;i++){
      leftLoanAmount -= monthlyPaymentAmount - leftLoanAmount*mir;
      if (leftLoanAmount<0) leftLoanAmount = 0;
      var temp = [monthlyPaymentAmount, leftLoanAmount*mir, monthlyPaymentAmount-leftLoanAmount*mir, leftLoanAmount]
      res.push(temp);
    }
  } else if (repaymentType.value==1) {
    if (loanAmount.value === 0 || interestRate.value === 0 || loanTerm.value === 0) {
      console.log('Returning 0')
      // res.push(ref<number>(0).value);
      return res;
    }
    console.log('Not returning 0')
    const n = loanTerm.value; // 总期数
    const mir = monthlyInterestRate(); // 月利率
    var leftLoanAmount = Number(loanAmount.value);
    for (let i=0;i<n;i++){
      leftLoanAmount = leftLoanAmount - loanAmount.value/n;
      if (leftLoanAmount<0) leftLoanAmount = 0;
      var temp = [leftLoanAmount*mir + loanAmount.value/n, leftLoanAmount*mir, loanAmount.value/n, leftLoanAmount]
      res.push(temp)
    }
  } else {
    return [[0,0,0,0]]
  }
  console.log(res);
  return res;
}

function totalPay() {
  var sum = 0;
  const monthlyPaymentList = monthlyPayment()
  for (let i=0;i<monthlyPaymentList.length;i++){
    sum+=monthlyPaymentList[i][0];
  }  
  console.log(sum)
  return sum;
}

function totalInterest() {
  // 计算总利息
  const totalInterestNum = totalPay();
  if (totalInterestNum===0) {
    return 0;
  } else {
    return totalInterestNum - loanAmount.value;
  }
}

function calculate() {
  monthlyPaymentDetail.value = monthlyPayment();
  totalPayNum.value = totalPay();
  totalInterestNum.value = totalInterest();
}

function downloadCSV(csv, filename) {  
    var csvFile;  
    var downloadLink;  
     
    //define the file type to text/csv  
    csvFile = new Blob([csv], {type: 'text/csv'});  
    downloadLink = document.createElement("a");  
    downloadLink.download = filename;  
    downloadLink.href = window.URL.createObjectURL(csvFile);  
    downloadLink.style.display = "none";  
  
    document.body.appendChild(downloadLink);  
    downloadLink.click();  
    console.log(csv);
}
  

//user-defined function to export the data to CSV file format  
function exportTableToCSV(filename) {  
  //declare a JavaScript variable of array type  
  // console.log(filename);
  var csv = [];  
  var rows = document.querySelectorAll("table tr");  
   
  //merge the whole data in tabular form   
  for(var i=0; i<rows.length; i++) {  
    var row = [], cols = rows[i].querySelectorAll("td, th");  
    for( var j=0; j<cols.length; j++)
      row.push(cols[j].innerText);
    csv.push(row.join(","));
  }
  console.log(csv);
  //call the function to download the CSV file  
  downloadCSV(csv.join("\n"), filename);
}

</script>

<style scoped>
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: separate;
    border: 2px solid purple;
    border-spacing: 0;
    border-radius: 10px;
  }

  thead th:nth-child(1) {
    width: 15%;
  }

  thead th:nth-child(2) {
    width: 20%;
  }

  thead th:nth-child(3) {
    width: 20%;
  }

  thead th:nth-child(4) {
    width: 20%;
  }

  thead th:nth-child(5) {
    width: 25%;
  }

  th, td {
    padding: 20px;
  }

  .th0 {
    background-color: var(--primary-bg-color); 
  }
  
  .th1 {
    border-top: 1px solid purple;
  }

  .th2 {
    background-color: var(--primary-bg-color); 
    border-top: 1px solid purple;
  }

  .interestDisplay {
    font-size: large;
  }
</style>