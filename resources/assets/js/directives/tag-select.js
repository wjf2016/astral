import Vue from "vue";
import Taggle from "taggle";
import autoComplete from "../libs/autocomplete";
let taggle = null;
Vue.directive("tag-select", {
  params: ["tags", "autocomplete"],
  bind: function(){},
  update: function(val) {
    let self = this;
    setTimeout(function(){
      const taggle = new Taggle(self.el.id, {
        tags: self.params.tags,
        saveOnBlur: true,
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
      const autocompleter = new autoComplete({
        selector: taggle.getInput(),
        appendTo: ".taggle_list",
        source: function(term, suggest){
          term = term.toLowerCase();
          var choices = self.params.autocomplete;
          var matches = [];
          for ( let i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) {
              matches.push(choices[i])
            };
          suggest(matches);
          if(matches.length === 1){
            
          }
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
