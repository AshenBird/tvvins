<script setup lang="ts">
import { ref } from "vue";
import { test } from "../apis/test"
const value = ref("")
test("success").then((res=>{
  value.value = res
}))
</script>

<template>
  <div>{{ value }}</div>
</template>

