<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card
          shadow
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
        >
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie
            style="height: 300px;"
            :value="pieData"
            text="帖子分类统计/比例"
            :key="timerPieData"
            name="统计"
          ></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar
            style="height: 300px;"
            :value="barData"
            :key="timerbarData"
            text="近半年发帖量统计"
          />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <column style="height: 400px;" :key="timerCountData" :value="weenkCount" />
      </Card>
    </Row>
  </div>
</template>

<script>
import moment from 'dayjs'

import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Column from './column.vue'

import { homeCount } from '@/api/count'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Column
  },
  data() {
    return {
      inforCardData: [
        {
          title: '注册用户',
          icon: 'md-person-add',
          count: 0,
          color: '#2d8cf0'
        },
        {
          title: '本周新增',
          icon: 'md-person-add',
          count: 0,
          color: '#2d8cf0'
        },
        { title: '累积发帖', icon: 'md-locate', count: 0, color: '#19be6b' },
        {
          title: '本周发帖',
          icon: 'md-help-circle',
          count: 0,
          color: '#ff9900'
        },
        {
          title: '本周评论',
          icon: 'md-chatbubbles',
          count: 0,
          color: '#E46CBB'
        },
        { title: '本周签到', icon: 'md-share', count: 0, color: '#ed3f14' }
      ],
      pieData: [
        { value: 0, name: '全部' },
        { value: 0, name: '提问' },
        { value: 0, name: '建议' },
        { value: 0, name: '交流' },
        { value: 0, name: '分享' },
        { value: 0, name: '动态' }
      ],
      barData: {},
      weenkCount: {},
      timerPieData: 0,
      timerbarData: 0,
      timerCountData: 0
    }
  },
  mounted() {
    for (let i = 0; i <= 5; i++) {
      const month = moment()
        .subtract(5 - i, 'M')
        .format('YYYY-MM')
      this.barData[month] = 0
    }
    homeCount().then(res => {
      if (res.code === 10000) {
        const data = res.data
        if (data.inforCardData) {
          this.inforCardData.forEach((item, index) => {
            this.$set(item, 'count', data.inforCardData[index])
          })
        }
        if (data.pieData) {
          const arr = []
          arr.push({ name: '全部', value: data.pieData.index || 0 })
          arr.push({ name: '提问', value: data.pieData.ask || 0 })
          arr.push({ name: '建议', value: data.pieData.advise || 0 })
          arr.push({ name: '交流', value: data.pieData.discuss || 0 })
          arr.push({ name: '分享', value: data.pieData.share || 0 })
          arr.push({ name: '动态', value: data.pieData.news || 0 })
          this.pieData = arr
          this.timerPieData = new Date().getTime()
        }
        if (data.barData) {
          for (let key in data.barData) {
            this.$set(this.barData, key, data.barData[key] || 0)
          }
          this.timerbarData = new Date().getTime()
        }
        if (data.countData) {
          this.weenkCount = data.countData
          this.timerCountData = new Date().getTime()
        }
      } else {
        this.$Message.error(res.message)
      }
    })
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
