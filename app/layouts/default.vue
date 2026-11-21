<script setup lang="ts">
const links = useNavLinks()
</script>

<template>
  <div class="min-h-screen">
    <!-- Wide navigation -->
    <AppHeader :links="links" />

    <!-- Context -->
    <UContainer class="sm:border-x border-default">
      <slot />

      <AppFooter />
    </UContainer>
  </div>
</template>
