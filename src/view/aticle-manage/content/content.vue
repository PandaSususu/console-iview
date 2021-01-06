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
  </div>
</template>

<script>
import moment from 'dayjs'

import Tables from '_c/tables'
import { getList, deletePost } from '@/api/post'

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
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
          title: '标题',
          key: 'title',
          width: 300,
          tooltip: true
        },
        {
          title: '发帖时间',
          key: 'created',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('span', moment(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '作者',
          key: 'user',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.user.name)
          }
        },
        {
          title: '类型',
          key: 'catalog',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', this.catalogs[params.row.catalog])
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 60,
          align: 'center'
        },
        {
          title: '结贴',
          key: 'isEnd',
          align: 'center',
          width: 60,
          render: (h, params) => {
            return h('span', params.row.isEnd === '0' ? '未结' : '已结 ')
          }
        },
        {
          title: '阅读数',
          key: 'reads',
          width: 100,
          align: 'center'
        },
        {
          title: '评论数',
          key: 'answer',
          align: 'center',
          width: 100
        },
        {
          title: '状态',
          key: 'status',
          width: 70,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.status === '0' ? 'success' : 'error'
              },
              domProps: {
                innerHTML: params.row.status === '0' ? 'on' : 'off'
              }
            })
          }
        },
        {
          title: '置顶',
          key: 'isTop',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              props: {
                type: params.row.isTop === '0' ? 'md-close' : 'md-checkmark',
                color: params.row.isTop === '0' ? '#F79709' : '#19be6b',
                size: 20
              }
            })
          }
        },
        {
          title: '标签',
          key: 'tags',
          width: 100,
          align: 'center',
          tooltip: true,
          render: (h, params) => {
            return h('span', params.row.tags.map(item => item.name).join('，'))
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
              h('Icon', {
                props: {
                  type: 'md-trash',
                  size: 20
                },
                on: {
                  click: () => {
                    this.handleRemove(params.row, params.index)
                  }
                }
              }, 'Delete')
            ])
          }
        }
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      catalogs: {
        index: '全部',
        ask: '提问',
        advise: '建议',
        discuss: '交流',
        share: '分享',
        news: '动态'
      }
    }
  },
  methods: {
    handleEdit (row, index) {
      console.log(row, index)
    },
    handleRemove (row, index) {
      const postIndex = (this.page - 1) * this.limit + (index + 1)
      this.$Modal.confirm({
        title: '您确定要删除该条帖子吗？',
        content: `第${postIndex}条，“${row.title}”`,
        onOk: () => {
          deletePost({
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
    _getList () {
      getList(
        {
          page: this.page - 1,
          limit: this.limit
        }
      ).then(res => {
        if (res.code === 10000) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    pageChange (page) {
      this.page = page
      this._getList()
    },
    limitChange (limit) {
      this.limit = limit
      this._getList()
    }
  },
  mounted () {
    this._getList()
  }
}
</script>

<style></style>
