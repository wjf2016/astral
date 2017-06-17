<template>
  <div class="dashboard-star-container">
    <div class="dashboard-repos">
      <ul class="repos">
        <star v-for="(repo, index) in starsList" :key="repo.id" :repo="repo"></star>
      </ul>
    </div>
    <div>
      <star-info></star-info>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Star from './star'
import StarInfo from './star-info.vue'
import galileo from './../filters/galileo.js'

export default {
  name: 'StarList',
  components: {
    'star-info': StarInfo,
    'star': Star
  },
  computed: {
    ...mapGetters({
      user: 'user',
      githubStars: 'githubStars',
      currentTag: 'currentTag',
      tagFilter: 'tagFilter',
      searchQuery: 'tokenizedSearchQuery'
    }),
    starsWithCurrentTag () {
      return this.githubStars.filter(this.starHasCurrentTag)
    },
    starsList () {
      return galileo(this.starsWithCurrentTag, this.searchQuery)
    }
  },
  created () {
    this.$bus.$emit('STATUS', 'Loading stars...')

    this.fetchStars().then((res) => {
      this.$bus.$emit('STATUS', 'Cleaning up...')
      this.cleanupStars().then((res) => {
        this.$bus.$emit('STATUS', '')
      })
      Array.from(document.querySelectorAll('.repo')).forEach((repo) => {
        repo.addEventListener('dragstart', (e) => {
          const data = JSON.stringify(this.githubStars[parseInt(e.currentTarget.dataset.index, 10)])
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', data)
        }, false)
      })
    }).catch((errors) => {
      this.$bus.$emit('STATUS', '')
      this.$bus.$emit('NOTIFICATION', 'There was an error fetching your stars from GitHub.', 'error')
    })
  },
  methods: {
    ...mapActions([
      'fetchStars',
      'setCurrentTag',
      'cleanupStars'
    ]),
    setTag (tag) {
      this.$router.push(`/dashboard/tag/${tag.slug}`)
    },
    starHasCurrentTag (repo) {
      if (!Object.keys(this.currentTag).length) {
        if (this.tagFilter === 'UNTAGGED') {
          return repo.tags.length === 0
        } else {
          return true
        }
      }
      if (repo.tags.length) {
        return ~repo.tags.map(tag => tag.name).indexOf(this.currentTag.name)
      } else {
        return false
      }
    }
  }
}
</script>
