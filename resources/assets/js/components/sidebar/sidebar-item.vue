<template>
  <li class="dashboard-list-item flex items-center pv2 f5 fw6 silver" >
    <i class="material-icons mr2 pe-n" :class="'f' + iconSize">{{ icon }}</i>
    <span class="dashboard-list-item-name grow-1">{{ title }}</span>
    <span class="dashboard-list-item-badge white bg-white-10 br-pill dib f7 lh-solid fw6 pe-n" v-if="!!badge">{{ badge }}</span>
  </li>
</template>
<script>
  export default {
    name: 'SidebarItem',
    props: {
      title: String,
      icon: String,
      iconSize: {
        type: [String, Number],
        default: 4
      },
      badge: {
        type: [String, Number],
        default: 0
      }
    }
  }
</script>
<style lang="scss">
@import "../../../sass/nebula/scss/colors";
.dashboard-list-item {
  transition: transform 250ms ease, opacity 250ms ease, color 250ms ease;
  cursor: pointer;
  &-badge {
    transition: background-color 250ms ease;
    padding: 0.3rem 0.7rem;
  }
  &:hover {
    color: $white;
    &-badge {
      background: $white-20;
    }
  }
  &.selected {
    color: $green;
    .dashboard-list-item-badge {
      background: $green;
    }
  }
  &.dragging {
    background: $green;
    color: $white;
  }
  &.gu-mirror, &.gu-transit { transition: none!important; }
}
</style>
