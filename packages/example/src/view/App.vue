<script setup lang="ts">
// import { ref } from "vue";
import {test} from "../api/index"
const testApi = async ()=>{
  const r = await test("1","aaa")
  console.debug(r)
}
testApi()

</script>
<template>
  <div>aaa</div>
</template>
