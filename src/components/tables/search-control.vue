<template>
  <div>
    <template v-if="data.type === 'input'">
      <Input
        v-model="searchValue"
        placeholder="请输入关键字"
        @on-change="handleChange"
        style="width: 200px"
      />
    </template>

    <template v-else-if="data.type === 'date'">
      <DatePicker
        v-model="searchValue"
        type="daterange"
        placement="bottom-end"
        placeholder="请选择日期时间段"
        style="width: 200px"
        @on-change="handleChange"
      ></DatePicker>
    </template>

    <template v-else-if="data.type === 'radio'">
      <RadioGroup v-model="searchValue" @on-change="handleChange">
        <Radio
          v-for="(item, index) in data.options"
          :key="'radio' + index"
          :label="item.label"
          >{{ item.title }}</Radio
        >
      </RadioGroup>
    </template>

    <template v-else-if="data.type === 'select'">
      <Select
        multiple
        v-model="searchValue"
        @on-change="handleChange"
        style="width: 300px"
      >
        <Option
          v-for="item in data.options"
          :value="item.key"
          :key="item.key"
          >{{ item.label }}</Option
        >
      </Select>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Array],
      default: ''
    }
  },
  computed: {
    searchValue: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  methods: {
    handleChange(value) {
      if (this.data.type === 'input') {
        value = value.target.value
      }
      this.$emit('changeEvent', value)
    }
  }
}
</script>
