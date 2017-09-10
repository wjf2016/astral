<template>
<button class="refresh-stars bg-transparent pa0" :class="{ 'active': active }">
  <feather-icon
    type="refresh-cw"
    height="24"
    class="stroke-mid-gray"
  >
  </feather-icon>
</button>
</template>

<script>
export default {
  name: 'refresh-button',
  props: ['active']
}
</script>

<style lang="scss">
@import "../../../sass/nebula/scss/colors";
.refresh-stars {
  appearance: none;
  background: rgba(#fff, 0);
  border: none;
  cursor: pointer;
  outline: none;
  width: 20px; height: 20px;
  svg {
    transition: stroke 250ms ease;
    width: 20px; height: 20px;
  }
  &:hover {
    svg { stroke: $silver; }
  }
  &.active {
    animation: spin 750ms linear 0s infinite;
    opacity: 0.75;
    pointer-events: none;
  }
}
</style>
