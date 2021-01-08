<template>
  <Modal
    v-model="isShow"
    :title="'正在编辑→' + editData.title"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <Form :model="editData" :label-width="80">
      <FormItem label="标题">
        <Input v-model="editData.title" placeholder="请输入文章标题"></Input>
      </FormItem>
      <FormItem label="分类">
        <Select v-model="editData.catalog">
          <Option value="index">全部</Option>
          <Option value="ask">提问</Option>
          <Option value="advise">建议</Option>
          <Option value="discuss">交流</Option>
          <Option value="share">分享</Option>
          <Option value="news">动态</Option>
        </Select>
      </FormItem>
      <FormItem label="是否结贴">
        <RadioGroup v-model="editData.isEnd">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="回复状态">
        <RadioGroup v-model="editData.status">
          <Radio label="0">打开回复</Radio>
          <Radio label="1">关闭回复</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="是否置顶">
        <RadioGroup v-model="editData.isTop">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="悬赏积分">
        <Slider
          v-model="favs"
          :min="10"
          :max="100"
          :step="10"
          :show-stops="true"
        ></Slider>
      </FormItem>
      <FormItem label="标签">
        <Select v-model="tag" multiple>
          <Option v-for="item in tags" :value="item.class" :key="item.class">{{
            item.name
          }}</Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { getTags } from '@/api/tag'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {
          catalog: '',
          fav: '10',
          isEnd: '',
          isTop: '',
          status: '',
          title: '',
          tags: []
        }
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(value) {}
    },
    favs: {
      get() {
        return parseInt(this.editData.fav)
      },
      set(value) {
        this.editData.fav = value + ''
      }
    },
    editData: {
      get() {
        return Object.assign({}, this.item)
      },
      set() {}
    },
    tag: {
      get() {
        if (this.editData.tags) {
          return this.editData.tags.map(item => {
            return item.class
          })
        }
      },
      set(value) {
        this.editData.tags = value.map(item => {
          return {
            name: this.tagObj[item],
            class: item
          }
        })
      }
    }
  },
  data() {
    return {
      tags: [],
      tagObj: {}
    }
  },
  methods: {
    ok() {
      this.editData.fav = this.editData.fav + ''
      this.$emit('okModel', this.editData)
    },
    cancel() {
      this.$emit('cancelModel')
    }
  },
  mounted() {
    getTags({
      limit: 10000
    }).then(res => {
      if (res.code === 10000) {
        this.tags = res.data
        this.tags.forEach(item => {
          Reflect.set(this.tagObj, item.class, item.name)
        })
        console.log(this.tagObj)
      } else {
        this.$Message.error(res.message)
      }
    })
  }
}
</script>
