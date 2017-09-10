<template>
<div class="dashboard-star-info-header bb b--light-gray bg-white flex items-center ph4">
  <div class="ml-auto">
    <label for="cloneUrl" class="mr1 cur-p f5 fw6">Clone:</label>
    <input
      :value="star.ssh_url"
      @focus="highlightUrl"
      ref="cloneUrl"
      id="cloneUrl"
      class="star-clone-url f5 br2 ba b--light-gray pa2"
      type="text"
      readonly
    />
  </div>
</div>
</template>

<script>
export default {
  name: 'StarInfoHeader',
  props: ['star'],
  methods: {
    highlightUrl () {
      setTimeout(() => {
        this.$refs.cloneUrl.select()
      }, 0)
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/nebula/scss/colors";
.dashboard-star-info-header {
  height: 70px;
  .star-clone-url {
    transition: border 250ms ease, box-shadow 250ms ease;
    background-clip: padding-box;
    box-shadow: 0 0 0 3px rgba($silver, 0);
    user-select: all;
    width: 280px;
    &::-webkit-input-placeholder {
      color: $silver;
    }
    &:focus {
      border: 1px solid $silver;
      box-shadow: 0 0 0 3px $near-white;
      outline: none;
      + .search-icon { color: $silver; }
    }
  }
}
</style>
