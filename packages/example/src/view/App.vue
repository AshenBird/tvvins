<script setup lang="ts">
// import { ref } from "vue";
import {test} from "../api/index"
(async ()=>{
  const r = await test("1","aaa")
  console.debug(r)
})();

</script>
<template>
  <div>aaa</div>
</template>
