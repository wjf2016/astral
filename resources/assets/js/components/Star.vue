<template>
<li class="repo" draggable="true" @click="starClicked()" :class="{ 'active': currentStar.id == repo.id }" ref="repo">
  <h3 class="repo-name" v-once>{{ repo.full_name }}</h3>
  <div class="repo-description" v-once="">{{ repo.description }}</div>
    <star-tags :refId="repo.id" :tags="starTagList"></star-tags>
  <div class="repo-stats">
    <div class="repo-stat stars"><i class="fa fa-star"></i> <span v-once>{{ repo.stargazers_count }}</span></div>
    <div class="repo-stat forks"><i class="fa fa-code-fork"></i> <span v-once>{{ repo.forks_count }}</span></div>
    <div class="repo-stat link"><a :href="repo.html_url" target="_blank" rel="noopener" @click.stop>View on GitHub</a></div>
  </div>
</li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StarTags from './star-tags'
export default {
  name: 'Star',
  components: {
    'star-tags': StarTags
  },
  props: ['repo'],
  computed: {
    ...mapGetters([
      'currentStar',
      'tags'
    ]),
    starTagList () {
      if (this.repo.tags.length === 0) { return this.tags }

      return this.tags.map((tag) => {
        var isSelected = false
        isSelected = this.repo.tags.map((starTag) => {
          return starTag.id
        }).indexOf(tag.id) > -1
        return {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          selected: isSelected
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'setCurrentStar'
    ]),
    starClicked () {
      if (this.repo.id === this.currentStar.id) {
        return false
      }
      this.setCurrentStar(this.repo)
      this.$bus.$emit('STAR_CHANGED')
    }
  }
}
</script>

<style>

</style>
