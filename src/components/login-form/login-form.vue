<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="email">
      <Input v-model="form.email" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code" class="code">
      <Input v-model="form.code" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-image"></Icon>
        </span>
        <span slot="append" v-html="svgCode" class="code-svg" @click="_getCode()"></span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import mixinCode from '@/mixin/code'

export default {
  name: 'LoginForm',
  props: {
    emailRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: ['change', 'blur'] }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度最小6位', trigger: ['change', 'blur'] },
          { type: 'string', max: 16, message: '密码长度最大16位', trigger: ['change', 'blur'] }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '请输入4位验证码', trigger: ['change', 'blur'] },
          { type: 'string', max: 4, message: '请输入4位验证码', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  mixins: [mixinCode],
  data () {
    return {
      form: {
        email: '1271250334@qq.com',
        password: '',
        code: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        email: this.emailRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            email: this.form.email,
            password: this.form.password,
            code: this.form.code,
            sid: this.sid
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.code {
  .ivu-input-group-append {
    padding: 0;
  }

  input {
    margin-top: 1px;
  }
  .code-svg {
    display: inline-block;
    svg {
      height: 30px;
    }
  }
}
</style>
