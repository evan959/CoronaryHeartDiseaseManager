<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="form.time"
        :value="form.time"
        required
        clearable
        label="用药时间"
        placeholder="请选择时间"
        @click="showPop"
        disabled
      />
    </van-cell-group>
    <van-cell-group>
      <van-field
        v-model="form.number"
        :value="form.number"
        required
        clearable
        label="用量"
        placeholder="请输入用量"
      />
    </van-cell-group>

    <van-radio-group :value="form.after">
      <van-cell-group>
        <van-cell title="饭前服用" clickable data-name="1" @click="radioChange">
          <van-radio name="1" />
        </van-cell>
        <van-cell title="饭后服用" clickable data-name="2" @click="radioChange">
          <van-radio name="2" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-button :loading="loading" @click="onClick" type="primary" size="large" style="margin-top: 100px">添加定时提醒</van-button>
    <van-popup
      :show="show"
      position="bottom"
      :close="onClose"
    >
      <van-datetime-picker
        type="time"
        :value="form.time"
        @confirm="onClose"
        @cancel="onClose"
      />
    </van-popup>
    <van-notify id="van-notify" />
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import card from '@/components/card'


export default {
  components: {
    card
  },

  data () {
    return {
      form:{
        time:'',
        number:0,
        after:"1"
      },
      show:false,
      value:'',
      loading:false
    }
  },

  created () {
    const logs = (wx.getStorageSync('logs') || [])
    this.logs = logs.map(log => formatTime(new Date(log)))
  },
  methods: {
    selectedTime(){

    },
    showPop(){
      this.show = true
    },
    onClose(event){
      this.form.time = event.mp.detail
      this.show = false
    },
    radioChange(event){
      this.form.after = event.currentTarget.dataset.name
    },
    onClick(){
      console.log(1111)
      this.loading = true
      setTimeout(() =>{
        this.$Notify({
          text: '设置成功'
        })
        this.loading = false
      },1000)
    }
  }
}
</script>

<style>

</style>
