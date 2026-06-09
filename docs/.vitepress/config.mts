import { defineConfig } from 'vitepress'
// import vue from '@vitejs/plugin-vue'
// import path from 'path';
import vitePluginGlsl from 'vite-plugin-glsl'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Three Project Docs",
  description: "A VitePress Site",
  base: '/threeProjectDocs/',
  lang: 'zh-CN',
  themeConfig: {
    logo: '/vite.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/example' }
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' },
      //   ]
      // },
      {
        text: '简单示例',
        items: [
          { text: 'example', link: '/example' },
          { text: '简单图形', link: '/oneFile' },
          { text: '立方体和线', link: '/twoFile' },
          { text: '立方体轮廓', link: '/threeFile' },
          { text: 'gui简单示例', link: '/fourFile' },
          { text: '平面和文字', link: '/fiveFile' },
          { text: '球性映射背景', link: '/sixFile' },
          { text: '雾', link: '/sevenFile' },
          { text: '光线投射', link: '/eightFile' },
          { text: 'tween动画', link: '/nineFile' },
          { text: '车模型导入', link: '/tenFile' },
          // { text: '发光着色器', link: '/shaderFile' },
          // { text: '地形着色器', link: '/terrainShader' },
          // { text: '渐变色着色器', link: '/gradientShader' },
          // { text: '雾着色器', link: '/fogShader' },
          // { text: '鬼屋场景', link: '/hauntedHouse' },
          // { text: '星系', link: '/galaxy' },
          // { text: '咖啡杯烟雾', link: '/coffeeCup' },
          // { text: '粒子着色器', link: '/particleShader' },
          { text: '太阳系', link: '/ElevenFile' },
          { text: '地月环绕', link: '/twelveFile' },
          { text: '指针锁定控制', link: '/thirteenFile' },
          { text: '变换控制器', link: '/fourteenFile' },
          { text: '拖拽控制', link: '/fifteenFile' },
          { text: '动画基础', link: '/sixteenFile' },
          { text: '阴影和光照', link: '/seventeenFile' },
          { text: '天空动画', link: '/eighteenFile' },
          { text: 'HTML音频', link: '/nineteenFile' },
          { text: '复合几何体', link: '/twentiethFile' },
          { text: '光照阴影', link: '/twentyoneFile' },
          { text: '多光源场景', link: '/twentytwoFile' },
          { text: '模型加载', link: '/twentythreeFile' },
          { text: '房间模拟', link: '/twentyfourFile' },
          { text: '茶壶()', link: '/twentyfiveFile' },
          { text: '精灵动画', link: '/twentysixFile' },
          { text: '精灵和下雪模拟', link: '/twentysevenFile' },
          { text: '波浪动画模拟', link: '/twentyeightFile' },
          { text: '魔方模拟（fail）', link: '/twentynineFile' },
          { text: '车辆碰撞监测（err）', link: '/thirtyFile' },
          { text: '房间场景映射', link: '/thirtyoneFile' },
          { text: '圣诞节雪景效果', link: '/thirtytwoFile' },
          { text: 'state性能监测', link: '/thirtythreeFile' },
          { text: '一杯水', link: '/thirtyfourFile' },
          { text: '水面和天空', link: '/thirtyfiveFile' },
          { text: '球形粒子', link: '/thirtysixFile' },
          { text: '场景光影', link: '/thirtysevenFile' },
          { text: '着色器点云粒子', link: '/thirtyeightFile' },
          { text: '物理模拟', link: '/thirtynineFile' },
          { text: '太阳系', link: '/fortyFile' },
          { text: '第一人称pointerLockControl（fail）', link: '/fortyoneFile' },
          { text: '蛋糕模拟', link: '/fortytwoFile' },
          { text: '物理场景模拟', link: '/fortythreeFile' },
          { text: '物理场景模拟2', link: '/fortyfourFile' },
          { text: '车辆加载', link: '/fortyfiveFile' },
          { text: '场景光照渲染', link: '/fortysixFile' },
          { text: '场景和光照的模型渲染', link: '/fortysevenFile' },
          { text: '着色器基础', link: '/fortyeightFile' },
          { text: '着色器基础图形示例', link: '/fortynineFile' },
          { text: '狂暴海面', link: '/fiftyFile' },
          { text: '烟雾着色器', link: '/fiftyoneFile' },
          { text: '全息图着色器', link: '/fiftytwoFile' },
          { text: '烟花着色器', link: '/fiftythreeFile' },
          { text: '灯光着色器', link: '/fiftyfourFile' },
          { text: '狂暴海面着色器', link: '/fiftyfiveFile' },
          { text: '半色调着色器', link: '/fiftysixFile' },
          { text: '地球着色器', link: '/fiftysevenFile' },
          { text: '粒子光标动画（狗）', link: '/fiftyeightFile' },
          { text: '变形动画', link: '/fiftynineFile' },
          { text: 'gpgpu流场粒子场景', link: '/sixtyoneFile' },
          { text: '摇晃流体', link: '/sixtytwoFile' },
          { text: '切片模型', link: '/sixtythreeFile' },
          { text: '程序化地形场景', link: '/sixtyfourFile' },
          { text: '泛光后期处理', link: '/sixtyfiveFile' },
          { text: '实例化渲染', link: '/sixtysixFile' },
          { text: '加载进度和着色光影', link: '/sixtysevenFile' },
          { text: '加载进度和着色光影和点介绍', link: '/sixtyeightFile' },
          { text: '银河系', link: '/sixtynineFile' },
          { text: '星空粒子', link: '/seventyFile' },
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
    plugins: [ vitePluginGlsl()],
    // resolve: {
    //   alias: { '@': path.resolve(__dirname, './src') }
    // },
  },
})
