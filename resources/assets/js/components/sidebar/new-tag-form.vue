<template>
<div class="dashboard-list-item toggle-new-tag h3 relative ph5">
  <transition name="new-tag-form">
    <div class="toggle-new-tag-button flex items-center f5 fw6 mid-gray h3" @click="showForm" v-show="!formShowing">
      <!-- <i class="material-icons mr2 pe-n f4">add_circle_outline</i> -->
      <feather-icon
      type="plus-circle"
      height="14"
      class="mr1 pe-n stroke-mid-gray"
    >
    </feather-icon>
      <span class="dashboard-list-item-name relative grow-1">Add a tag...</span>
    </div>
  </transition>
  <transition name="new-tag-form">
    <form class="toggle-new-tag-form flex items-center absolute top-0 left-0 w-100" v-show="formShowing" @submit.prevent="formSubmitted">
      <input class="h3 f5 br2 bg-white ph2 bn w-100" type="text" v-model="tagName" @blur="formBlurred" ref="form" placeholder="Enter a tag name...">
    </form>
  </transition>
</div>
</template>

<script>
export default {
  name: 'new-tag-form',
  data () {
    return {
      formShowing: false,
      tagName: ''
    }
  },
  methods: {
    showForm () {
      this.formShowing = true
      setTimeout(() => {
        this.$refs.form.focus()
      }, 0)
    },
    formBlurred () {
      if (this.tagName.trim() === '') {
        this.formShowing = false
      }
    },
    formSubmitted () {
      this.$emit('submit', this.tagName)
      this.tagName = ''
    }
  }
}
</script>
<style lang="scss">
@import "../../../sass/nebula/scss/colors";
.toggle-new-tag-button {
  transition: color 250ms ease;
  svg {
    transition: stroke 250ms ease;
  }
  &:hover {
    color: $silver;
    svg { stroke: $silver; }
  }
}
.new-tag-form-enter-active, .new-tag-form-leave-active {
  transition: opacity 250ms ease;
}
.new-tag-form-enter, .new-tag-form-leave-to {
  opacity: 0;
}
.toggle-new-tag {
  &-form {
    input {
      &:focus { outline: none; }
    }
  }
}
</style>
