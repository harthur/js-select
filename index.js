var traverse = require("traverse"),
    JSONSelect = require("JSONSelect");

module.exports = function(obj, sel) {
   sel = sel || "*";

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
                  return isMatch(sel, this);
               };
               // inherit context from js-traverse
               cb.call(this, node);            
            }
         });
      }
   };
}

function isMatch(sel, context) {
   var parts = JSONSelect._parse(sel)[1],
       path = traverse.clone(context.path),
       i = 0;
   parts.reverse();
   path.reverse();
   path.push("");

   // walk up the ancestors
   var must = true;
   while(parts.length && path.length) {
      var part = parts[0],
          key = path[0];

      if (part == ">") {
         parts.shift();
         must = true;
         continue;
      }

      if (matchesKey(part, key)) {
         parts.shift();
      }
      else if(must) {
         return false;
      }

      path.shift();
      must = false;
   }
   return parts.length == 0;
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
