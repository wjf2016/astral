import Vue from "vue";
import Taggle from "taggle";
let taggle = null;
Vue.directive("tag-select", {
  params: ["tags", "autocomplete"],
  bind: function(){},
  update: function(val) {
    let self = this;
    setTimeout(function(){
      taggle = new Taggle(self.el.id, {
        tags: self.params.tags,
        preserveCase: true,
        onTagAdd: function(e, tag){
          let tagArray = taggle.getTagValues().map((t) => {
            return { name: t }
          });
          self.vm.$dispatch("CURRENT_TAGS_CHANGED", tagArray);
        },
        onTagRemove: function(e, tag){
          let tagArray = taggle.getTagValues().map((t) => {
            return { name: t }
          });
          self.vm.$dispatch("CURRENT_TAGS_CHANGED", tagArray);
        }
      });
    }, 10);
  },
  paramWatchers: {
    tags: function(val, oldVal){
      taggle.removeAll()
      setTimeout(function(){
        taggle.add(val);
      }, 0);
    }
  }
});
