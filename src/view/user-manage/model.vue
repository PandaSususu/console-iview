<template>
  <Modal
    v-model="isShow"
    title="修改用户信息"
    :loading="loading"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <Form
      ref="formValidate"
      :model="formData"
      :rules="ruleValidate"
      :label-width="80"
    >
      <FormItem label="用户名" prop="name">
        <Input v-model="formData.name" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="formData.email" placeholder="请输入登录邮箱"></Input>
      </FormItem>
      <!-- <FormItem label="密码" prop="name">
        <Input v-model="data.password" placeholder="请输入密码"></Input>
      </FormItem> -->
      <FormItem label="状态">
        <RadioGroup v-model="formData.status">
          <Radio label="0">正常</Radio>
          <Radio label="1">禁言</Radio>
          <Radio label="2">冻结</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="会员">
        <RadioGroup v-model="formData.isVip">
          <Radio label="0">非会员</Radio>
          <Radio label="1">VIP 1</Radio>
          <Radio label="2">VIP 2</Radio>
          <Radio label="3">VIP 3</Radio>
          <Radio label="4">VIP 4</Radio>
          <Radio label="5">VIP 5</Radio>
          <Radio label="6">VIP 6</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="积分" prop="favs">
        <Input
          v-model="formData.favs"
          type="number"
          placeholder="请输入用户积分"
          :number="true"
        ></Input>
      </FormItem>
      <FormItem label="性别">
        <RadioGroup v-model="formData.gender">
          <Radio label="">不设置</Radio>
          <Radio label="0">男</Radio>
          <Radio label="1">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="城市">
        <Cascader :data="cityList" v-model="formData.location"></Cascader>
      </FormItem>
      <FormItem label="个性签名">
        <Input
          v-model="formData.regmark"
          type="textarea"
          placeholder="请输入个性签名"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { checkName, checkEmail } from '@/api/user'

// 校验积分格式
const favPassCheck = (rule, value, callback) => {
  if (!value && value !== 0) {
    return callback(new Error('积分数不能为空'))
  }
  if ((value % 10 === 0 && /^[1-9]\d/.test(value)) || value === 0) {
    return callback()
  } else {
    return callback(new Error('请输入可以被10整除的数'))
  }
}

// 校验修改后的用户名是否存在
const checkUserName = (rule, value, callback, vm) => {
  if (value === vm.currentData.name) {
    return callback()
  }
  checkName(value).then(res => {
    if (!res.data) {
      return callback()
    } else {
      return callback(new Error('用户名已存在，请重新修改'))
    }
  })
}

// 校验修改后的邮箱是否存在
const checkUserEmail = (rule, value, callback, vm) => {
  if (value === vm.currentData.email) {
    return callback()
  }
  checkEmail(value).then(res => {
    if (!res.data) {
      return callback()
    } else {
      return callback(new Error('邮箱已存在，请重新修改'))
    }
  })
}

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => {}
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
  watch: {
    currentData(newValu, oldVal) {
      this.formData = Object.assign({}, newValu)
    }
  },
  data() {
    return {
      cityList: [
        {
          value: '北京',
          label: '北京',
          children: [
            {
              value: '故宫',
              label: '故宫'
            },
            {
              value: '天坛',
              label: '天坛'
            },
            {
              value: '王府井',
              label: '王府井'
            }
          ]
        },
        {
          value: '江苏',
          label: '江苏',
          children: [
            {
              value: '南京',
              label: '南京',
              children: [
                {
                  value: '夫子庙',
                  label: '夫子庙'
                }
              ]
            },
            {
              value: '苏州',
              label: '苏州',
              children: [
                {
                  value: '拙政园',
                  label: '拙政园'
                },
                {
                  value: '狮子林',
                  label: '狮子林'
                }
              ]
            }
          ]
        }
      ],
      formData: {},
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 4,
            message: '用户名必须至少有4个字符',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 8,
            message: '用户名不能超过8个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              checkUserName(rule, value, callback, this)
            },
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '登录邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              checkUserEmail(rule, value, callback, this)
            },
            trigger: 'blur'
          }
        ],
        favs: [{ validator: favPassCheck, trigger: 'blur' }]
      },
      loading: true
    }
  },
  methods: {
    ok() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.loading = false
          this.$emit('okModel', this.formData)
        } else {
          this.$Message.error('请检查输入数据')
          this.loading = false
          this.$nextTick(() => (this.loading = true))
        }
      })
    },
    cancel() {
      this.$refs.formValidate.resetFields()
      this.$emit('cancelModel')
    }
  }
}
</script>
