<template>
<div class="search-box absolute bg-white bb br b--light-gray flex items-center justify-center ph4">
  <div class="dashboard-searchBar dib w-100">
    <label for="galileo" class="db relative w-100">
      <input type="text" id="galileo" class="dashboard-telescope f5 br2 ba b--light-gray pv2 pr2 w-100" placeholder="Gaze through your telescope" v-model="currentSearchQuery">
      <i class="search-icon material-icons absolute left-1 pe-n light-gray">search</i>
    </label>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'lodash'
export default {
  name: 'search-box',
  computed: {
    ...mapGetters({
      query: 'searchQuery'
    }),
    currentSearchQuery: {
      get () {
        return this.query
      },
      set: debounce(function (newValue) {
        this.setSearchQuery(newValue)
      }, 250)
    }
  },
  methods: mapActions([
    'setSearchQuery'
  ])
}
</script>
<style lang="scss" scoped>
@import "../../sass/nebula/scss/colors";
.search-box {
  top: 80px; left: 280px;
  width: 400px;
  height: 70px;
  .search-icon {
    transition: color 250ms ease;
    top: 8px;
    left: 13px;
  }
  .dashboard-telescope {
    transition: border 250ms ease, box-shadow 250ms ease;
    background-clip: padding-box;
    box-shadow: 0 0 0 3px rgba($silver, 0);
    padding-left: 40px;
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
