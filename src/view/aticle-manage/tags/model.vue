<template>
  <Modal
    v-model="isShow"
    :title="type === 'add' ? '添加标签' : '编辑标签'"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <Form :label-width="80">
      <FormItem v-model="formData" label="名称">
        <Input v-model="formData.name" placeholder="请输入标签名称"></Input>
      </FormItem>
      <FormItem label="样式">
        <Select v-model="formData.class" style="width:200px">
          <Option
            v-for="item in classList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    tagForm: {
      type: Object,
      default: () => {
        return {
          name: '',
          class: ''
        }
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set() {}
    },
    formData: {
      get() {
        return Object.assign({}, this.tagForm)
      },
      set(value) {}
    }
  },
  data() {
    return {
      classList: [
        {
          value: 'layui-bg-red',
          label: '赤色'
        },
        {
          value: 'layui-bg-orange',
          label: '橙色'
        },
        {
          value: 'layui-bg-green',
          label: '绿色'
        },
        {
          value: 'layui-bg-cyan',
          label: '青色'
        },
        {
          value: 'layui-bg-blue',
          label: '蓝色'
        },
        {
          value: 'layui-bg-black',
          label: '黑色'
        },
        {
          value: 'layui-bg-gray',
          label: '灰色'
        }
      ]
    }
  },
  methods: {
    ok() {
      this.$emit('okModel', this.formData)
    },
    cancel() {
      this.$emit('cancelModel')
    }
  }
}
</script>
