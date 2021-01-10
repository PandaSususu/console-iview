import Main from '@/components/main'

export default [
  {
    path: '/user_manage',
    name: 'user_manage',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'user_page',
        name: 'user_page',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '用户管理'
        },
        component: () => import('@/view/user-manage/index.vue')
      }
    ]
  }
]
