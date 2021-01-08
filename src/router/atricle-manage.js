import Main from '@/components/main'

export default [
  {
    path: '/article_manage',
    name: 'article_manage',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'article_content_page',
        name: 'article_content_page',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '内容管理'
        },
        component: () => import('@/view/aticle-manage/content/index.vue')
      },
      {
        path: 'article_label_page',
        name: 'article_label_page',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '标签管理'
        },
        component: () => import('@/view/aticle-manage/tags/index.vue')
      }
    ]
  }
]
