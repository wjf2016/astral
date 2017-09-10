<template>
  <div class="dashboard-star-container absolute overflow-y-auto bottom-0 br b--light-gray">
    <ul class="repos list ma0 pa0">
      <star
        v-for="(repo, index) in starsList"
        :key="repo.id"
        :repo="repo"
        :class="{ 'active': currentStar.id == repo.id }"
        :data-id="repo.id"
        @click.native="starClicked(repo)"
        @dragstart.native="starDragged($event)"
        @dragend.native="clearClonedRepoNodes($event)"
        draggable="true"
        ref="repo"
      >
      </star>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Star from './star.vue'
import galileo from './../filters/galileo.js'

export default {
  name: 'StarList',
  components: {
    'star': Star
  },
  computed: {
    ...mapGetters({
      user: 'user',
      githubStars: 'githubStars',
      currentTag: 'currentTag',
      tagFilter: 'tagFilter',
      currentStar: 'currentStar',
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
          const data = JSON.stringify(
            this.githubStars.find(repo => repo.id === parseInt(e.currentTarget.dataset.id, 10))
          )
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
      'setCurrentStar',
      'setCurrentTag',
      'cleanupStars'
    ]),
    starClicked (repo) {
      if (repo.id === this.currentStar.id) {
        return false
      }
      this.setCurrentStar(repo)
      this.$bus.$emit('STAR_CHANGED')
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
    },
    starDragged (e) {
      const el = e.currentTarget
      const clone = el.cloneNode(true)
      clone.classList.add('repo-clone')
      document.body.appendChild(clone)
      const width = clone.offsetWidth
      const height = clone.offsetHeight
      e.dataTransfer.setDragImage(clone, width / 2, height / 2)
    },
    clearClonedRepoNodes () {
      [].forEach.call(document.querySelectorAll('.repo-clone'), (e) => {
        e.parentNode.removeChild(e)
      })
    }
  }
}
</script>
<style lang="scss">
.dashboard-star-container {
  transform: translate3d(0, 0, 0);
  top: 150px;
  left: 280px;
  width: 400px;
}
.repo-clone {
  transform: translate3d(-50%, -50%, 0);
  border-radius: .375rem;
  position: absolute; top: -9999px; left: -9999px;
  list-style-type: none;
  padding: .875rem;
  h3 {
    margin: 0;
  }
  &::before { display: none; }
  *:not(.repo-name) { display: none; }
}
</style>
