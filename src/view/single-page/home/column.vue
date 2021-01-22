<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import moment from 'dayjs'

import { on, off } from '@/libs/tools'

const labelOption = {
  show: true,
  position: 'top',
  distance: 10,
  align: 'center',
  verticalAlign: 'middle',
  formatter: '{c}',
  fontSize: 14,
  rich: {
    name: {
      textBorderColor: '#fff'
    }
  }
}
export default {
  name: 'serviceRequests',
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    xValue() {
      const arr = []
      for (let i = 0; i <= 6; i++) {
        arr.push(moment().subtract(6 - i, 'day').format('YYYY-MM-DD'))
      }
      return arr
    }
  },
  data() {
    return {
      dom: null
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    }
  },
  mounted() {
    const option = {
      title: {
        text: '近7天数据统计'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['新增用户', '签到总数', '发帖总数', '回复总数']
      },
      grid: {
        top: '10%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.xValue
        }
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 1
        }
      ],
      series: [
        {
          name: '新增用户',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          areaStyle: {
            normal: {
              color: '#2d8cf0'
            }
          },
          data: this.value.newUser || []
        },
        {
          name: '签到总数',
          type: 'bar',
          label: labelOption,
          areaStyle: {
            normal: {
              color: '#10A6FF'
            }
          },
          data: this.value.newSign || []
        },
        {
          name: '发帖总数',
          type: 'bar',
          label: labelOption,
          areaStyle: {
            normal: {
              color: '#0C17A6'
            }
          },
          data: this.value.newPost || []
        },
        {
          name: '回复总数',
          type: 'bar',
          label: labelOption,
          areaStyle: {
            normal: {
              color: '#4608A6'
            }
          },
          data: this.value.newComment || []
        }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  }
}
</script>
