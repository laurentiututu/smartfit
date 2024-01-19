<template>
  <div class="a-logo">
  	<img src="@/assets/logos/white_logo_minimal.png" @click="$router.push('/')">
  </div>
</template>
<script>
	
</script>
<style lang="scss" scoped>
.a-logo {
  position: relative;
  width: 3.35rem;
  height: auto;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
}
</style>