---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/example.vue'
import exampleSource from '../docs/components/example.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
  <example></example>
</div>

## code
```vue
pre
<template>

</template>
<script setup>

</script>

```
<!-- <div class="code-block1">
  <pre><code class="language-vue">{{ exampleSource }}</code></pre>
</div> -->
<pre><code class="language-vue">{{ exampleSource }}</code></pre>

<style scoped>
.code-block1 {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow-x: auto;
  padding: 20px;
  margin: 24px 0;
  color: #c9d1d9;
}
.code-block1 pre {
  margin: 0;
  white-space: pre;
  word-break: normal;
}
</style>