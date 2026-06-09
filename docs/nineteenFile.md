---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/nineteenFile.vue'
// import exampleSource from '../docs/components/nineteenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <button @click="steatGC" style="position: absolute;right: 0;top: 0;">{{ tf ? 'pause' : 'play' }}</button>
  <p ref="gc" style="position: absolute;left: 0;bottom: 0;color: #ffffff;text-align: center;width: 100%;"></p>
</template>

<script setup>
const gc = ref(null)
const tf = ref(false)

const listener = new THREE.AudioListener()
const audio = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()

let duration = 0
audioLoader.load('hxd.mp3', e => {
  console.log(e);
  audio.setBuffer(e)
  audio.setLoop(true);
  audio.setVolume(0.5);
  duration = e.duration
})

// 渲染元素，启用动画
let resizefn = null
let animationId
// 渲染元素，启用动画
onMounted(() => {
  playAudio()
})



const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)
// const boxHelper = new THREE.BoxHelper(cube, 0xffff00);
// scene.add(boxHelper);

let t = null
let gclist

function playAudio() {
  axios('/threeProjectDocs/Oops! （《请吃红小豆吧!》第二季op）-红小豆.lrc').then(res => {
    console.log(res);
    gclist = createLrcObj(res.data)
    console.log(gclist)
  }).catch(err => {
    console.log(err);
  })
}
audio.onEnded = () => {
  console.log('end!')
  gclist.offset = 0
  clearInterval(t)
  t = null
  steatGC()
}

function steatGC() {
  tf.value = !tf.value
  if (tf.value) {
    console.log('开始啦~')
    audio.play()
    t = setInterval(() => {
      let index = gclist.ms.findIndex(item => (item.t - 0) > gclist.offset)
      console.log(index)
      if (index < 0) { index = gclist.ms.length }
      gc.value.innerHTML = gclist.ms[index - 1].c
      gclist.offset += 0.5
      if (gclist.offset > duration) { gclist.offset = 0 }
    }, 500);
  } else {
    audio.pause()
    clearInterval(t)
    t = null
  }
}
function createLrcObj(lrc) {
  var oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
  };

  if (lrc.length == 0) return;
  var lrcs = lrc.split('\n');//用回车拆分成数组
  for (var i in lrcs) {//遍历歌词数组
    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
    var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
    var s = t.split(":");//分离:前后文字
    if (isNaN(parseInt(s[0]))) { //不是数值
      for (var i in oLRC) {
        if (i != "ms" && i == s[0].toLowerCase()) {
          oLRC[i] = s[1];
        }
      }
    } else { //是数值
      var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
      var start = 0;
      for (var k in arr) {
        start += arr[k].length; //计算歌词位置
      }
      var content = lrcs[i].substring(start);//获取歌词内容
      for (var k in arr) {
        var t = arr[k].substring(1, arr[k].length - 1);//取[]间的内容
        var s = t.split(":");//分离:前后文字
        oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
          t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
          c: content
        });
      }
    }
  }
  oLRC.ms.sort(function (a, b) {//按时间顺序排序
    return a.t - b.t;
  });
  return oLRC
}
</script>

```

