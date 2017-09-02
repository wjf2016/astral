<template>
  <div class="sidebar-header flex items-center h2 mv3 relative">
    <h3 class="sidebar-header-text dib m0 mid-gray grow-1 f6 fw6 ttu">{{ title }}</h3>
    <div class="sidebar-header-control">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SidebarHeader',
    props: ['title']
  }
</script>
