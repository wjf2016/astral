<template>
  <li class="dashboard-list-item flex items-center pv2 f5 fw6 silver" >
    <feather-icon
      :type="icon"
      :height="iconSize"
      class="mr1 pe-n stroke-silver"
    >
    </feather-icon>
    <span class="dashboard-list-item-name grow-1 overflow-hidden nowrap t-overflow-ellipsis pe-n">{{ title }}</span>
    <span class="dashboard-list-item-badge white bg-white-10 br-pill dib f7 lh-solid fw6 pe-n ml1 pe-n" v-if="!!badge">{{ badge }}</span>
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
  transition: transform 250ms ease, opacity 250ms ease, color 250ms ease, background 250ms ease;
  cursor: pointer;
  &-badge {
    transition: background-color 250ms ease;
    padding: 0.3rem 0.7rem;
  }
  svg {
    transition: stroke 250ms ease;
  }
  &:hover {
    color: $white;
    &-badge {
      background: $white-20;
    }
    svg { stroke: $white; }
  }
  &.selected {
    color: $green;
    .dashboard-list-item-badge {
      background: $green;
    }
    svg { stroke: $green; }
  }
  &.dragging {
    background: $green;
    color: $white;
    .dashboard-list-item-badge {
      background: $white;
      color: $green;
    }
    svg { stroke: $white; }
  }
  &.gu-mirror, &.gu-transit { transition: none!important; }
}
</style>
