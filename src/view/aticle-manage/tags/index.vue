<template>
  <div>
    <Card>
      <tables ref="tables" editable v-model="tableData" :columns="columns" />
      <Button type="primary" @click="addTag" style="margin: 10px 0"
        >添加标签</Button
      >
      <Page
        :total="total"
        :current="page"
        :page-size="limit"
        @on-change="pageChange"
        @on-page-size-change="limitChange"
        show-sizer
      />
    </Card>
    <EditModel
      :show="isShow"
      :type="type"
      :tagForm="tagForm"
      @cancelModel="cancelModel"
      @okModel="okModel"
    ></EditModel>
  </div>
</template>
<script>
import Tables from '_c/tables'
import EditModel from './model'
import { addTag, getTags, deteleTag, updateTag } from '@/api/tag'

export default {
  name: 'tag_table',
  components: {
    Tables,
    EditModel
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('span', (this.page - 1) * this.limit + (params.index + 1))
          }
        },
        {
          title: '名称',
          key: 'name',
          width: 100
        },
        {
          title: '类名',
          key: 'class',
          align: 'center'
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
      total: 100,
      page: 1,
      limit: 10,
      isShow: false,
      tagForm: {
        name: '',
        class: ''
      },
      type: ''
    }
  },
  methods: {
    getList() {
      getTags({
        page: this.page - 1,
        limit: this.limit
      }).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    handleEdit(row, index) {
      this.type = 'edit'
      this.isShow = true
      this.tagForm = row
    },
    handleRemove(row, index) {
      this.$Modal.confirm({
        title: '您确定要删除该条标签吗？',
        content: ``,
        onOk: () => {
          deteleTag({
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
    pageChange(page) {
      this.page = page
      this.getList()
    },
    limitChange(limit) {
      this.limit = limit
      this.getList()
    },
    cancelModel() {
      this.isShow = false
    },
    okModel(data) {
      if (this.type === 'add') {
        addTag(data).then(res => {
          if (res.code === 10000) {
            this.tableData.push(data)
            this.$Message.success(res.message)
            this.isShow = false
          } else {
            this.$Message.error(res.message)
          }
        })
      } else {
        updateTag(data).then(res => {
          if (res.code === 10000) {
            const index = this.tableData.findIndex(item => {
              return item._id === data._id
            })
            this.tableData.splice(index, 1, data)
            this.$Message.success(res.message)
            this.isShow = false
          } else {
            this.$Message.error(res.message)
          }
        })
      }
    },
    addTag() {
      this.type = 'add'
      this.isShow = true
      this.tagForm = {
        name: '',
        class: ''
      }
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
