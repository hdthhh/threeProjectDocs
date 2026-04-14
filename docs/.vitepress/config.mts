import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Three Project Docs",
  description: "A VitePress Site",
  base:'/threeProjectDocs/',
  themeConfig: {
    logo: '/vite.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hdthhh' }
    ],
    search: {
      provider: "local",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright ©hdt",
    }
  },
    vite: {
      build: {
        rollupOptions: {
          // 使用 external 来排除某些模块（如果需要的话）
          // external 配置用于指定打包时排除的模块，而非文件夹。
          external: [
            'docs/public/maison_doucet_hennessy_house/*',
            'docs/public/lexus_sc_gt500__www.vecarz.com/*',
            'docs/public/2014__bmw_m4_f82_razor/*',
            'docs/public/christmas_tree/*',
            'docs/public/2013_ferrari_458_spider/*'
          ],
          // 使用 output.assetFileNames 来控制输出文件名（可选）
          output: {
            assetFileNames: (assetInfo) => {
              // 获取文件名
              const fileName = assetInfo.name || ''

              // 定义要排除的文件夹路径
              const excludeFolders = [
                'docs/public/maison_doucet_hennessy_house',
                'docs/public/lexus_sc_gt500__www.vecarz.com',
                'docs/public/2014__bmw_m4_f82_razor',
                'docs/public/christmas_tree',
                'docs/public/2013_ferrari_458_spider'
              ]

              // 检查文件是否在排除文件夹中
              const isInExcludeFolder = excludeFolders.some(folder =>
                fileName.startsWith(folder + '/') || fileName.startsWith(folder + '\\')
              )

              // 如果在排除文件夹中，返回空字符串或不处理
              if (isInExcludeFolder) {
                // 可以选择返回空字符串来排除，或者返回特定路径
                return '' // 或者返回 'assets/[name]-[hash].[ext]' 来保留
              }

              // 其他资源的处理逻辑
              if (fileName.endsWith('.css')) {
                return 'css/[name]-[hash].[ext]'
              }

              if (/\.(png|jpe?g|gif|svg|webp)$/.test(fileName)) {
                return 'img/[name]-[hash].[ext]'
              }

              return 'assets/[name]-[hash].[ext]'
            },
          },
          
        },
      },
    },
})
