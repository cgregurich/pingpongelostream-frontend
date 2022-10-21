<template>
  <Suspense>
    <!-- <template #default><ArticleInfo /></template> -->
    <template #default>{{ article }} </template>
    <template #fallback> Loading article... </template></Suspense
  >
</template>

<script setup>
import ArticleInfo from "./ArticleInfo.vue";
async function getArticle() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const article = {
    title: "New articlen",
    author: 'Bob Smith'
  };
  return article;
}

const article = await getArticle();
</script>