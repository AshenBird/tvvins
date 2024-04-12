<script setup lang="ts">
import { ref } from "vue";
import { test } from "../apis"
const value = ref("")
test({
  result:"value"
}).then((res=>{
  value.value = res.result
}))
</script>

<template>
  <div>{{ value }}</div>
</template>
