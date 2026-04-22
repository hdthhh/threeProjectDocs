// 在.vitepress/theme/index.ts文件
import DefaultTheme from 'vitepress/theme';
import './custom.css';
// import './style.css'

export default {
  ...DefaultTheme,
  // async enhanceApp({ app }) {
  //   if (typeof window !== 'undefined') {
  //     // 仅在浏览器环境加载第三方库或配置
  //     // const module = await import('your-client-only-lib')
  //     // app.use(module.default)
  //   }
  // }
  // enhanceApp: async (ctx) => {
  //   let { app } = ctx;
  //   DefaultTheme.enhanceApp(ctx);
  //   app.mixin({
  //     async mounted() {//你自己的插件地址
  //       // import('../../src/index.js').then(module => {
  //       //   Vue.use(module.default);
  //       // })
  //     }

  //   })
  // }
}
