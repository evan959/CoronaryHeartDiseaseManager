<template>
  <div class="container" @click="clickHandle('test click', $event)">
    <!--<van-cell title="定时提醒" size="large" is-link clickable/>-->
    <!--<van-cell title="用药禁忌提醒" size="large" is-link clickable/>-->
    <!--<van-cell title="生命体征管理" size="large" is-link clickable/>-->
    <!--<van-cell title="个人中心管理" size="large" is-link clickable/>-->
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    change(){
      wx.redirectTo({url:"../logs/main"})
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>

</style>
