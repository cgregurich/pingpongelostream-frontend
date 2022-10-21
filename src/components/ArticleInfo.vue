<template>
  {{ article }}
</template>

<script setup>
async function getArticleInfo() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const article = {
    title: "My Vue 3 Article",
    author: "Colin Gregurich",
  };
  return article;
}
const article = await getArticleInfo();
// export default {
//   async setup() {
//     const article = await getArticleInfo();
//     return {
//       article,
//     };
//   },
// };
</script>
