var traverse = require("traverse"),
    JSONSelect = require("JSONSelect");

module.exports = function(obj, string) {
   sels = parseSelectors(string);

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
            if (matchesAny(sels, this)) {
               this.matches = function(string) {
                  return matchesAny(parseSelectors(string), this);
               };
               // inherit context from js-traverse
               cb.call(this, node);            
            }
         });
      }
   };
}

function parseSelectors(string) {
   var parsed = JSONSelect._parse(string || "*")[1];
   if (parsed[0] == ",") {
      return parsed.slice(1);
   }
   return [parsed];
}

function matchesAny(sels, context) {
   for (var i = 0; i < sels.length; i++) {
      if (matches(sels[i], context)) {
         return true;
      }
   }
   return false;
}

function matches(sel, context) {
   var path = context.parents.concat([context]),
       i = path.length - 1,
       j = sel.length - 1;

   // walk up the ancestors
   var must = true;
   while(j >= 0 && i >= 0) {
      var part = sel[j],
          context = path[i];

      if (part == ">") {
         j--;
         must = true;
         continue;
      }

      if (matchesKey(part, context)) {
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

function matchesKey(part, context) {
   var key = context.key;

   if (part.id && key != part.id) {
      return false;
   }
   if (part.type) {
      if (part.type == "null") {
         if (context.node !== null) {
            return false;
         }
      }
      else if (part.type == "array") {
         if (!isArray(context.node)) {
            return false;
         }
      }
      else if (part.type == "object") {
         if (typeof context.node != "object"
             || context.node === null || isArray(context.node)) {
             return false;
         }
      }
      else if (part.type != typeof context.node) {
         return false;
      }
   }
   if (part.pf == ":nth-child") {
      var index = parseInt(key);
      if ((part.a == 0 && (index + 1) !== part.b)     // :nth-child(i)
        || (part.a == 1 && !(index + 1 >= -part.b))   // :nth-child(n)
        || (part.a == -1 && !(index < part.b))        // :nth-child(-n + 1)
        || (part.a == 2 && (index % 2) != part.b)) {  // :nth-child(even)
         return false;
      }
   }
   else if (part.pf == ":nth-last-child") {
      var n = context.parent && context.parent.node.length;
      if (!n || !(n - part.b == key)) {
         return false;
      }
   }
   else if (part.pc == ":root" && key !== undefined) {
      return false;
   }
   return true;
}

var isArray = Array.isArray || function(obj) {
    return toString.call(obj) === '[object Array]';
}
