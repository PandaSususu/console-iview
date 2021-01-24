<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        v-model="tableData"
        :columns="columns"
        @on-selection-change="handleSelected"
      >
      </tables>
      <div class="btn">
        <Button
          @click="handleRemove()"
          :disabled="selected.length ? false : true"
          >删除</Button
        >
      </div>
      <Page
        :total="total"
        :current="page"
        :page-size="limit"
        @on-change="pageChange"
        @on-page-size-change="limitChange"
        show-sizer
      />
    </Card>
  </div>
</template>

<script>
import moment from 'dayjs'

import Tables from '_c/tables'
import { getErrors, delError } from '@/api/admin'

export default {
  name: 'user_table',
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          type: 'expand',
          width: 60,
          key: 'expand',
          render: (h, params) => {
            return h('div', params.row.stack)
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center',
          key: 'selection'
        },
        {
          title: '序号',
          key: 'index',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', (this.page - 1) * this.limit + (params.index + 1))
          }
        },
        {
          title: '错误消息',
          key: 'message',
          width: 400
        },
        {
          title: '错误码',
          key: 'code',
          width: 100,
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          width: 100,
          align: 'center'
        },
        {
          title: '请求路径',
          key: 'path',
          width: 300,
          align: 'center'
        },
        {
          title: '请求参数',
          key: 'params',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('span', params.row.params ? params.row.params : '无')
          }
        },
        {
          title: '时间',
          key: 'created',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              moment(params.row.created).format('YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          title: '用户',
          key: 'username',
          align: 'center'
        }
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      selected: []
    }
  },
  methods: {
    pageChange(page) {
      this.page = page
      this._getList()
    },
    limitChange(limit) {
      this.limit = limit
      this._getList()
    },
    _getList() {
      getErrors({
        page: this.page - 1,
        limit: this.limit
      }).then((res) => {
        if (res.code === 10000) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    handleSelected(values) {
      this.selected = values
    },
    handleRemove() {
      this.$Modal.confirm({
        title: '您确定要删除这些错误信息吗吗？',
        onOk: () => {
          const ids = this.selected.map((item) => item._id)
          delError({
            ids
          }).then((res) => {
            if (res.code === 10000) {
              this.$Message.success('删除成功')
              this.tableData = this.tableData.filter(item => {
                return !ids.includes(item._id)
              })
            } else {
              this.$Message.error(res.message)
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    }
  },
  mounted() {
    this._getList()
  }
}
</script>

<style lang="less" scope>
.btn {
  margin: 10px 0;

  button {
    margin-right: 10px;
  }
}
</style>
