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

   if (!matchesPart(parts.shift(), path.shift())) {
      // last part of selector should match node
      return false;
   }

   // walk up the ancestors
   while(parts.length && i < path.length) {
      if (matchesPart(parts[0], path[i])) {
         parts.pop();
      }
      i++;
   }
   return parts.length == 0;
}

function matchesPart(part, key) {
   return traverse.deepEqual(part, {})
       || (part.id && part.id == key);
}
