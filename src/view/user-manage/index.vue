<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
      />
      <Page
        :total="total"
        :current="page"
        :page-size="limit"
        @on-change="pageChange"
        @on-page-size-change="limitChange"
        show-sizer
      />
    </Card>
    <Model
      :show="isShow"
      :currentData="currentData"
      @cancelModel="cancelModel"
      @okModel="okModel"
    ></Model>
  </div>
</template>

<script>
import moment from 'dayjs'

import Tables from '_c/tables'
import Model from './model'
import { getUsers, deleteUser, updateUser } from '@/api/user'

export default {
  name: 'user_table',
  components: {
    Tables,
    Model
  },
  data() {
    return {
      columns: [
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
          title: '用户名',
          key: 'name',
          width: 100
        },
        {
          title: '邮箱',
          key: 'email',
          width: 200,
          align: 'center'
        },
        {
          title: '注册时间',
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
          title: '积分',
          key: 'favs',
          width: 60,
          align: 'center'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h(
              'span',
              params.row.gender
                ? params.row.gender === '0'
                  ? '男'
                  : '女'
                : '未设置'
            )
          }
        },
        {
          title: '角色',
          key: 'access',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.access.map(item => item).join('，'))
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.status === '0' ? 'success' : 'error'
              },
              domProps: {
                innerHTML: params.row.status === '0' ? '正常' : '异常'
              }
            })
          }
        },
        {
          title: '个性签名',
          key: 'regmark',
          width: 200,
          align: 'center',
          tooltip: true
        },
        {
          title: '所在城市',
          key: 'city',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.location.length ? params.row.location.join('/') : '未设置')
          }
        },
        {
          title: '会员',
          key: 'isVip',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              parseInt(params.row.isVip) ? 'VIP ' + params.row.isVip : '非会员'
            )
          }
        },
        {
          title: '设置',
          key: 'action',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-build',
                  size: 20
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row, params.index)
                  }
                }
              }),
              h(
                'Icon',
                {
                  props: {
                    type: 'md-trash',
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params.row, params.index)
                    }
                  }
                },
                'Delete'
              )
            ])
          }
        }
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      isShow: false,
      currentData: {}
    }
  },
  methods: {
    handleEdit(row, index) {
      this.currentData = { ...row }
      this.isShow = true
    },
    handleRemove(row, index) {
      this.$Modal.confirm({
        title: `您确定要删除“${ row.name }”用户吗？`,
        onOk: () => {
          deleteUser({
            id: row._id
          }).then(res => {
            if (res.code === 10000) {
              this.$Message.success('删除成功')
              this.tableData = this.tableData.filter(item => {
                return item._id !== row._id
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
    },
    cancelModel() {
      this.isShow = false
      this.$Message.info('取消编辑')
    },
    okModel(data) {
      updateUser(data).then(res => {
        if (res.code === 10000) {
          const index = this.tableData.findIndex(item => {
            return item._id === data._id
          })
          this.tableData.splice(index, 1, data)
          this.isShow = false
          this.$Message.success(res.message)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getList() {
      getUsers({
        page: this.page - 1,
        limit: this.limit
      }).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    pageChange(page) {
      this.page = page
      this._getList()
    },
    limitChange(limit) {
      this.limit = limit
      this._getList()
    }
  },
  mounted() {
    this._getList()
  }
}
</script>

<style></style>
