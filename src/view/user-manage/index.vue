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
        @on-selection-change="handleSelected"
      >
        <template v-slot:add-user>
          <Button class="search-btn" type="primary" @click="addShow = true"
            ><Icon type="md-person-add" size="14" />&nbsp;&nbsp;添加用户</Button
          >
        </template>
      </tables>
      <div class="btn">
        <Button
          @click="handleRemove()"
          :disabled="selected.length ? false : true"
          >批量删除</Button
        >
        <Button
          @click="batchShow = true"
          :disabled="selected.length ? false : true"
          >批量设置</Button
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
    <edit-model
      :show="editShow"
      :currentData="currentData"
      @cancelModel="editCancelModel"
      @okModel="editOkModel"
    ></edit-model>
    <add-model
      :show="addShow"
      @cancelModel="addCancelModel"
      @okModel="addOkModel"
    ></add-model>
    <batch-model
      :show="batchShow"
      @cancelModel="batchCancelModel"
      @okModel="batchOkModel"
    ></batch-model>
    <Modal v-model="isDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>此操作请您三思</span>
      </p>
      <div style="text-align:center">
        <p>以下用户删除后，该用户发表的帖子也随即删除。</p>
        <p>是否继续删除“{{ delNames }}”用户？</p>
      </div>
      <div slot="footer">
        <Button
          type="error"
          size="large"
          long
          :loading="delete_loading"
          @click="deleteUser"
          >确认删除</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import moment from 'dayjs'

import Tables from '_c/tables'
import EditModel from './edit'
import AddModel from './add'
import BatchModel from './batch-set'
import { getUsers, deleteUser, updateUser, addUser } from '@/api/user'

export default {
  name: 'user_table',
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchModel
  },
  data() {
    return {
      columns: [
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
            return h(
              'span',
              params.row.location.length
                ? params.row.location.join('/')
                : '未设置'
            )
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
                      this.handleRemove(params.row)
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
      editShow: false,
      addShow: false,
      batchShow: false,
      currentData: {},
      selected: [],
      isDelete: false,
      delete_loading: false,
      delNames: '',
      delIds: []
    }
  },
  methods: {
    handleEdit(row, index) {
      this.currentData = { ...row }
      this.editShow = true
    },
    handleRemove(row) {
      this.delIds = []
      if (row) {
        this.delNames = row.name
        this.delIds.push(row._id)
      } else {
        this.delNames = this.selected.map(item => item.name).join('，')
        this.delIds = this.selected.map(item => item._id)
      }
      this.isDelete = true
    },
    editCancelModel() {
      this.editShow = false
      this.$Message.info('取消编辑')
    },
    editOkModel(data) {
      updateUser({
        ids: data._id,
        options: data
      }).then(res => {
        if (res.code === 10000) {
          const index = this.tableData.findIndex(item => item._id === data._id)
          this.tableData.splice(index, 1, data)
          this.editShow = false
          this.$Message.success(res.message)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    addCancelModel() {
      this.addShow = false
      this.$Message.info('取消编辑')
    },
    addOkModel(data) {
      addUser(data).then(res => {
        if (res.code === 10000) {
          const userItem = Object.assign({}, data)
          userItem.created = moment().format('YYYY-MM-DD HH:mm:ss')
          userItem.access = ['user']
          this.tableData.unshift(userItem)
          this.addShow = false
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
    },
    handleSelected(values) {
      this.selected = values
    },
    deleteUser() {
      this.delete_loading = true
      deleteUser({
        ids: this.delIds
      }).then(res => {
        this.delete_loading = false
        if (res.code === 10000) {
          this.$Message.success(res.message)
          this.tableData = this.tableData.filter(item => {
            return !this.delIds.includes(item._id)
          })
          this.isDelete = false
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    batchCancelModel() {
      this.batchShow = false
      this.$Message.info('取消操作')
    },
    batchOkModel(data) {
      let flag = false
      for (let key in data) {
        if (data[key]) {
          flag = true
        }
      }
      if (flag) {
        let content = ''
        if (data.status) {
          switch (data.status) {
            case '0':
              content += '<p>状态 → 正常</p><br />'
              break
            case '1':
              content += '<p>状态 → 禁言</p><br />'
              break
            case '2':
              content += '<p>状态 → 冻结</p><br />'
              break
          }
        } else {
          delete data.status
        }
        if (data.isVip) {
          switch (data.status) {
            case '0':
              content += '<p>会员 → 非会员</p>'
              break
            default:
              content += `<p>会员 → VIP${data.isVip}</p>`
          }
        } else {
          delete data.isVip
        }
        const names = this.selected.map(item => item.name).join('，')
        const ids = this.selected.map(item => item._id)
        this.$Modal.confirm({
          title: `您确定要批量设置“${names}”的信息为以下内容吗？`,
          content,
          onOk: () => {
            updateUser({
              ids,
              options: data
            }).then(res => {
              if (res.code === 10000) {
                for (let item of this.tableData) {
                  if (ids.includes(item._id)) {
                    for (let key in data) {
                      item[key] = data[key]
                    }
                  }
                }
                this.batchShow = false
                this.$Message.success(res.message)
              } else {
                this.$Message.error(res.message)
              }
            })
          },
          onCancel: () => {
            this.$Message.info('取消操作')
          }
        })
      } else {
        this.$Message.info('您没有设置任何内容')
        this.batchShow = false
      }
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
