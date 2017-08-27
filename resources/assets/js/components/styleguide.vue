<template>
<div class="styleguide pa4">
  <h3 class="green lh-copy measure-wide f4 fw4">Introduction</h3>
  <p class="dark-gray lh-copy measure-wide f4 bb b--light-silver pb2">Nebula is a CSS framework for all of Astral's user interface. Nebula provides guidelines for the aesthetic, function, and form to provide a consistent experience for our users. This is a living document and is under constant iteration.</p>

  <h3 class="green lh-copy measure-wide f4 fw4">Buttons</h3>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Primary Button</span>
      <p class="gray ma0">To call attention to primary actions</p>
    </div>
    <button class="nb-btn--primary">View on GitHub</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Danger Button</span>
      <p class="gray ma0">For destructive actions</p>
    </div>
    <button class="nb-btn--danger">Are you sure?</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Warning Button</span>
      <p class="gray ma0">For potentially problematic situations</p>
    </div>
    <button class="nb-btn--warning">Warning</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Info Button</span>
      <p class="gray ma0">For informational situations</p>
    </div>
    <button class="nb-btn--info">Info</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Primary Outline Button</span>
      <p class="gray ma0">To call attention to primary actions</p>
    </div>
    <button class="nb-btn-outline--primary">Click Me</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Danger Outline Button</span>
      <p class="gray ma0">For destructive actions</p>
    </div>
    <button class="nb-btn-outline--danger">Click Me</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Warning Outline Button</span>
      <p class="gray ma0">For potentially problematic situations</p>
    </div>
    <button class="nb-btn-outline--warning">Click Me</button>
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Info Outline Button</span>
      <p class="gray ma0">For informational situations</p>
    </div>
    <button class="nb-btn-outline--info">Click Me</button>
  </div>

  <h3 class="green lh-copy measure-wide f4 fw4">Inputs</h3>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Standard</span>
      <p class="gray ma0">Standard text input</p>
    </div>
    <input class="nb-input" type="text" placeholder="Lorem ipsum" />
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Read-only Input</span>
      <p class="gray ma0">For uneditable text inputs</p>
    </div>
    <input class="nb-input" type="text" placeholder="Lorem ipsum" value="Read-only field" readonly />
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Disabled Input</span>
      <p class="gray ma0">For fully disabled text inputs</p>
    </div>
    <input class="nb-input" type="text" placeholder="Lorem ipsum" value="Disabled field" disabled />
  </div>

  <div class="mt3 flex w-50 bb b--light-silver items-center">
    <div class="flex-auto mb2">
      <span class="b dark-gray mb1 dib">Textareas</span>
      <p class="gray ma0">For larger bodies of text</p>
    </div>
    <textarea class="nb-input" placeholder="Lorem ipsum" value="Enter a comment..."></textarea>
  </div>
</div>
</template>

<script>
export default {

  name: 'Styleguide',

  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
