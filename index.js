var traverse = require("traverse"),
    JSONSelect = require("JSONSelect");

module.exports = function(obj, sel) {
   sel = JSONSelect._parse(sel || "*")[1];

   return {
      nodes: function() {
         var nodes = [];
         this.forEach(function(node) {
            nodes.push(node);
         });
         return nodes;
      },

      forEach: function(cb) {
         traverse(obj).forEach(function(node) {
            if (isMatch(sel, this)) {
               this.matches = function(sel) {
                  return isMatch(JSONSelect._parse(sel)[1], this);
               };
               // inherit context from js-traverse
               cb.call(this, node);            
            }
         });
      }
   };
}

function isMatch(sel, context) {
   var path = [""].concat(context.path),
       i = path.length - 1,
       j = sel.length - 1;

   // walk up the ancestors
   var must = true;
   while(j >= 0 && i >= 0) {
      var part = sel[j],
          key = path[i];

      if (part == ">") {
         j--;
         must = true;
         continue;
      }

      if (matchesKey(part, key)) {
         j--;
      }
      else if(must) {
         return false;
      }

      i--;
      must = false;
   }
   return j == -1;
}

function matchesKey(part, key) {
   if (part.id && part.id != key) {
      return false;
   }
   if (part.pf == ":nth-child") {
      if (part.a == 0
          && (parseInt(key) + 1) !== part.b) {
         return false;
      }
      else if (part.a == 2
               && (parseInt(key) % 2) != part.b) {
         return false ;
      }
   }
   if (part.pc == ":root" && key != "") {
      return false;
   }
   return true;
}
