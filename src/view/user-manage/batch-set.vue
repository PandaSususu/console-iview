<template>
  <Modal
    v-model="isShow"
    title="批量设置用户信息"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <Form :model="formData" :label-width="80">
      <FormItem label="状态">
        <RadioGroup v-model="formData.status">
          <Radio label>不设置</Radio>
          <Radio label="0">正常</Radio>
          <Radio label="1">禁言</Radio>
          <Radio label="2">冻结</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="会员">
        <RadioGroup v-model="formData.isVip">
          <Radio label>不设置</Radio>
          <Radio label="0">非会员</Radio>
          <Radio label="1">VIP 1</Radio>
          <Radio label="2">VIP 2</Radio>
          <Radio label="3">VIP 3</Radio>
          <Radio label="4">VIP 4</Radio>
          <Radio label="5">VIP 5</Radio>
          <Radio label="6">VIP 6</Radio>
        </RadioGroup>
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
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set() {}
    }
  },
  data() {
    return {
      formData: {
        status: '',
        isVip: ''
      }
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
