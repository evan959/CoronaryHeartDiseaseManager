<template>
  <div>
    <van-tabs @click="onClick($event)">
      <van-tab title="心率">
        <div class = "wrap">
          <mpvue-echarts v-if="!heartRate.showDialog" :echarts="echarts" :onInit="initHearRateChart" canvasId="demo-canvas" />
        </div>
        <div>
          <van-button  type="primary" size="large" @click="heartRate.showDialog = true">添加记录</van-button>
        </div>
      </van-tab>
      <van-tab title="血压">
        <div class = "wrap">
          <mpvue-echarts  v-if="!bp.showDialog" lazyLoad :echarts="echarts" :onInit="initBPChart" canvasId="bp-canvas" ref="bpEcharts"/>
        </div>
        <div>
          <van-button type="primary" size="large" @click="bp.showDialog = true">添加记录</van-button>
        </div>
      </van-tab>
      <van-tab title="疼痛部位">
        <div>
          <van-button type="primary" size="large" @click="angina.showDialog = true">添加记录</van-button>
        </div>

        <van-collapse :value="activeNames" accordion @change="onChange">

          <van-collapse-item  v-for="(item,index) in anginaData"  :key="index" :title="item.angina.part" :name="index">
            {{item.angina.part}}
          </van-collapse-item>
        </van-collapse>

      </van-tab>
    </van-tabs>


    <van-dialog
      use-slot
      async-close
      :show="heartRate.showDialog"
      show-cancel-button
      @close="heartRate.showDialog = false"
      @confirm ="updateHeartRate"
      z-index = "9999"
    >
      <van-field
        type="number"
        :value="heartRate.count"
        label="心率"
        placeholder="请输入心率"
      />
    </van-dialog>
    <van-dialog
      use-slot
      async-close
      :show="bp.showDialog"
      show-cancel-button
      @close="closeBPdialog"
      @confirm ="updateBP"
    >
      <van-field
        type="digit"
        :value="bp.count"
        @change="inputChange($event,'bp','count')"
        label="血压"
        placeholder="请输入血压"
      />
    </van-dialog>

    <van-dialog
      use-slot
      async-close
      :show="angina.showDialog"
      show-cancel-button
      @close="angina.showDialog=false"
      @confirm ="updateAngina"
    >
      <!--<van-picker :columns="angina.partArr" bind:change="onChange" />-->
      <van-field type="digit" @change="inputChange($event,'angina','part')"  label="疼痛部位" placeholder="请输入疼痛部位" />
      <van-field type="digit" @change="inputChange($event,'angina','duration')" label="时长" placeholder="请输入时长" />

    </van-dialog>
  </div>
</template>

<script>
  import {formatDate} from '@/utils/index'
  import card from '@/components/card'
  import echarts from 'echarts/dist/echarts.simple.min'
  import mpvueEcharts from 'mpvue-echarts'

  let heartRateChart = null;
  let BPChart = null;

  function initHearRateChart(canvas, width, height) {
    // if(height === 0){
    //   height = 320
    // }
    heartRateChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(heartRateChart);

    var option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    }

    heartRateChart.setOption(option);

    return heartRateChart; // 返回 chart 后可以自动绑定触摸操作
  }

  function initBPChart(canvas, width, height) {
    // if(height === 0){
    //   height = 320
    // }
    BPChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(BPChart);

    var option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    }

    BPChart.setOption(option);

    return BPChart; // 返回 chart 后可以自动绑定触摸操作
  }

  export default {
    components: {
      mpvueEcharts
    },

    data() {
      return {
        echarts,
        initHearRateChart,
        initBPChart,
        activeNames:null,
        heartRate:{
          showDialog:false,
          count:null,
        },
        bp:{
          showDialog:false,
          count:null,
        },
        angina:{
          showDialog:false,
          part:"",
          duration:"",
        },
        anginaData:null,
        HRData:null,
        BPData:null
      }
    },
    mounted(){
      let xAxis = []
      let series = []
      this.anginaData = wx.getStorageSync('angiaData')
      this.HRData = wx.getStorageSync('HRData')

      // this.BPData = wx.getStorageSync('BPData')
      let bpEchartsData =  this.handleEchartsData(wx.getStorageSync('BPData'))
      this.reloadEcharts(bpEchartsData.xAxis,bpEchartsData.series,'bpEcharts')
    },
    methods:{
      onClick(event){
        if(event.mp._relatedInfo.anchorTargetText === '血压'){
          this.$refs.bpEcharts.init()
        }
      },
      updateHeartRate(){
        this.heartRate.showDialog = false
      },
      updateBP(){
        // debugger
        this.bp.showDialog = false

        let data = this.saveBPData()
        let chartsData = this.handleEchartsData(data)
        debugger
        this.$nextTick(() => {
          this.reloadEcharts(chartsData.xAxis,chartsData.series,'bpEcharts')
        })
      },
      closeBPdialog(){
        this.bp.showDialog = false
        this.$nextTick(() => {
          this.$refs.bpEcharts.init()

        })
      },
      handleEchartsData(data){
        let xAxis = []
        let series = []
        data.forEach(item => {
          xAxis.push([item.date])
          series.push([item.count])
        })
        return {xAxis,series}
      },
      reloadEcharts(xAxis,series,echarts){
        let instace = this.$refs[echarts].init().setOption({
          xAxis: {
            type: 'category',
            data: xAxis
          },
          series: [{
            data: series,
            type: 'line'
          }]
        })
        // this.$refs[echarts].setOption({
        //   xAxis: {
        //     type: 'category',
        //     data: xAxis
        //   },
        //   series: [{
        //     data: series,
        //     type: 'line'
        //   }]
        // })
      },
      updateAngina(){
        this.angina.showDialog = false
        this.anginaData = this.saveAngiaData()
      },
      onChange(e){
        console.log(e.mp.detail)
        this.activeNames = e.mp.detail
      },
      saveAngiaData(){
        const key = 'angiaData'
        let value = wx.getStorageSync(key)
        let date = formatDate(new Date())
        let angina = this.angina
        if(value){
          value.push({date,angina})
        }else{
          value = []
          value.push({date,angina})
        }
        if(value.length > 7){
          value.unshift()
        }
        wx.setStorageSync(key,value)
        return value
      },
      saveHRData(){
        const key = 'angiaData'
        let value = wx.getStorageSync(key)
        let date = formatDate(new Date())
        let angina = this.angina
        if(value){
          value.push({date,angina})
        }else{
          value = []
          value.push({date,angina})
        }
        if(value.length > 7){
          value.unshift()
        }
        wx.setStorageSync(key,value)
        return value
      },
      saveBPData(){
        const key = 'BPData'
        let value = wx.getStorageSync(key)
        let date = formatDate(new Date())
        let count = this.bp.count
        if(value){
          value.push({date,count})
        }else{
          value = []
          value.push({date,count})
        }
        if(value.length > 7){
          value.unshift()
        }
        wx.setStorageSync(key,value)
        return value
      },
      inputChange(event,field1,field2){
        this[field1][field2] = event.mp.detail
      }
    }

  }
</script>

<style>
  .wrap {
    width: 100%;
    height: 300px;
    z-index:-9999
  }
</style>
