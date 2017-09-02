<template>
  <transition name="dashboard-sortTagsDropdownMenu">
    <div class="dashboard-sortTagsDropdownMenu absolute right-0 top-100 bg-white br2" v-show="visible">
      <ul class="dashboard-sortTagsDropdownMenuItems list mv2 pa0">
        <li class="dashboard-sortTagsDropdownMenuItem f7 near-black cur-p db tdn pv2 pl2 pr4" @click="sortTags('ALPHA_ASC')"><i class="fa fa-sort-alpha-asc mr1"></i> Alphabetical (A-Z)</li>
        <li class="dashboard-sortTagsDropdownMenuItem f7 near-black cur-p db tdn pv2 pl2 pr4" @click="sortTags('ALPHA_DESC')"><i class="fa fa-sort-alpha-desc mr1"></i> Alphabetical (Z-A)</li>
        <li class="dashboard-sortTagsDropdownMenuItem f7 near-black cur-p db tdn pv2 pl2 pr4" @click="sortTags('STARS_DESC')"><i class="fa fa-sort-numeric-desc mr1"></i> Most Stars</li>
        <li class="dashboard-sortTagsDropdownMenuItem f7 near-black cur-p db tdn pv2 pl2 pr4" @click="sortTags('STARS_ASC')"><i class="fa fa-sort-numeric-asc mr1"></i> Fewest Stars</li>
      </ul>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'SortTagsDropdown',
  props: ['visible'],
  methods: {
    sortTags (sorter) {
      this.$bus.$emit('TAGS_SORTED', sorter)
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/nebula/scss/colors";
.dashboard-sortTagsDropdownMenu {
  transform: translate3d(0, 5px, 0);
  background-clip: padding-box;
  border: 1px solid rgba($near-black, 0.1);
  box-shadow: 0 1px 1px rgba(#000, 0.08);
  z-index: 999;
  &-enter-active, &-leave-active {
    transition: transform 250ms ease, opacity 250ms ease;
  }
  &-enter, &-leave-to {
    transform: translate3d(0, -5px, 0);
    opacity: 0;
    visibility: hidden;
  }
}

.dashboard-sortTagsDropdownMenuItems {
  line-height: 1;
  .dashboard-sortTagsDropdownMenuItem {
    text-decoration: none;
    &:hover {
      background: $green;
      color: $white;
    }
  }
}

</style>
