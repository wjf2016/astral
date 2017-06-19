<template>
<li class="repo" draggable="true" @click="starClicked()" :class="{ 'active': isActive }" ref="repo">
  <h3 class="repo-name" v-once>{{ repo.full_name }}</h3>
  <div class="repo-description" v-once="">{{ repo.description }}</div>
  <!--<ul class="repo-tags">
    <li v-for="tag in repo.tags" :key="tag.slug" @click.stop="setTag(tag)">
      {{ tag.name }}
    </li>
  </ul>-->
    <star-tags :repo="repo" :tags="starTagList"></star-tags>
  <div class="repo-stats">
    <div class="repo-stat stars"><i class="fa fa-star"></i> <span v-once>{{ repo.stargazers_count }}</span></div>
    <div class="repo-stat forks"><i class="fa fa-code-fork"></i> <span v-once>{{ repo.forks_count }}</span></div>
    <div class="repo-stat link"><a :href="repo.html_url" target="_blank" rel="noopener" @click.stop>View on GitHub</a></div>
  </div>
</li>
</template>

<script>
import StarTags from './star-tags'
export default {
  name: 'Star',
  components: {
    'star-tags': StarTags
  },
  props: [
    'repo',
    'tags',
    'isActive'
  ],
  computed: {
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
    starClicked () {
      this.$emit('click', this.repo)
    }
  }
}
</script>

<style>

</style>
