<template>
  <div class="tag-editor dropdown">
    <div id="tags-editor" v-tag-select :tags="tags"></div>
    <button type="button" name="button" class="tag-editor--save-tags btn-flat" @click="syncTags">Save Tags</button>
  </div>
</template>
<script>
import Vue from "vue";
import "../directives/tag-select.js";
export default {
  name: "TagEditor",
  props: ["tags"],
  data(){
    return {
      tagsToSync: []
    }
  },
  ready(){
    this.tagsToSync = this.tags;
  },
  methods: {
    syncTags(){
      this.$dispatch("SYNC_TAGS", this.tagsToSync);
    }
  },
  events: {
    "CURRENT_TAGS_CHANGED": function(tags){
      this.tagsToSync = tags;
    }
  }
}
</script>
<style>
#tags-editor {
  min-height: 37px;
  overflow: hidden;
}
.taggle_list {
  background: #fcfcfc;
  background-clip: padding-box;
  border-radius: 3px;
  border: 1px solid rgba(#000,0.15);
  box-shadow: inset 0 1px 2px rgba(#000,0.1);
  display: flex;
  flex-wrap: wrap;
  min-height: 37px;
  width: 100%;
  margin: 0; padding: 0;
}

.taggle_input {
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 300;
}

.taggle_list li {
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 26px;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 6px 0 6px 6px;
  line-height: 1;
}

.taggle_list .taggle {
  background: #708EA3;
  color: #fff;
  padding: 5px 22px 5px 10px;
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  transition: all .3s;
  -webkit-animation-duration: 1s;
          animation-duration: 1s;
  -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
}

.taggle_list .taggle_hot {
  background: #990033;
}

.taggle_list .taggle .close {
  font-size: 1.1rem;
  position: absolute;
  top: 4px;
  right: 0;
  text-decoration: none;
  line-height: 1;
  color: rgba(0, 0, 0, 0.2);
  padding: 0 5px;
  display: block;
  border: 0;
  background: none;
  cursor: pointer;
  outline: none;
}

.taggle_placeholder {
  position: absolute;
  color: #CCC;
  font-size: 0.8rem;
  top: 12px;
  left: 20px;
  transition: opacity, .25s;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.taggle_input {
  font-size: 0.8rem;
  padding: 8px;
  padding-left: 0;
  background: none;
  width: 10px;
  max-width: 100%;
}

.taggle_sizer {
  padding: 0;
  margin: 0;
  position: absolute;
  top: -500px;
  z-index: -1;
  visibility: hidden;
}
</style>
