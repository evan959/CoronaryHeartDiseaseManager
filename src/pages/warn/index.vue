<template>
  <div>
    <van-search :value="value" placeholder="请输入搜索关键词" show-action/>
    <van-cell-group>
      <van-cell title="复方丹参片" label="口服，一次3片或一日3次。" url="../remind/main">
      </van-cell>
      <van-cell title="复方丹参丸" label="口服，一次3片或一日3次。" url="../remind/main">
      </van-cell>
    </van-cell-group>
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
      value:''
    }
  },

  created () {
    const logs = (wx.getStorageSync('logs') || [])
    this.logs = logs.map(log => formatTime(new Date(log)))
  }
}
</script>

<style>

</style>
