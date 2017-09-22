<template>
  <li class="repo relative bb b--light-gray ma0 pa4 bg-white cur-p" @dragstart="starDragged">
    <h3 class="repo-name f4 green mt0 mb2 fw6" v-once>{{ repo.full_name }}</h3>
    <div class="repo-description f5 dark-grey" v-once>{{ repo.description }}</div>
    <star-tags :repo="repo" :tags="starTagList"></star-tags>
    <div class="repo-stats flex mt2">
      <div class="repo-stat stars f6 mid-gray mr2">
        <i class="fa fa-star"></i>
        <span v-once>{{ repo.stargazers_count }}</span>
      </div>
      <div class="repo-stat forks f6 mid-gray mr2">
        <i class="fa fa-code-fork"></i>
        <span v-once>{{ repo.forks_count }}</span>
      </div>
      <div class="repo-stat link f6 mid-gray mr2">
        <a class="repo-github-link mid-gray" :href="repo.html_url" target="_blank" rel="noopener" @click.stop>View on GitHub</a>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import StarTags from './star-tags.vue'
export default {
  name: 'Star',
  components: {
    'star-tags': StarTags
  },
  props: ['repo'],
  computed: {
    ...mapGetters([
      'tags'
    ]),
    starTagList() {
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
    setTag(tag) {
      this.$router.push(`/dashboard/tag/${tag.slug}`)
    },
    starDragged (e) {
      const data = JSON.stringify(this.repo)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', data)
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/nebula/scss/colors";
.repo {
  transition: background-color 250ms ease;
  &::before {
    transition: transform 250ms ease;
    transform: translate3d(-4px, 0, 0);
    background: $green;
    content: '';
    width: 4px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
  &:hover {
    background-color: $white-70;
  }
  &.active {
    background-color: $white-70;
    box-shadow: inset 0 1px 2px rgba(#000, 0.03);
    &::before {
      transform: translate3d(0, 0, 0);
    }
  }
}

.repo-tag {
  transition: background-color 250ms ease;
  &:hover {
    background-color: $mid-gray;
  }
}

.repo-github-link {
  &:hover {
    text-decoration: none;
  }
}
</style>
