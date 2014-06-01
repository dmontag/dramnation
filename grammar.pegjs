

start
  = listAllDistilleries
  / addDistillery
  / removeDistillery
  
  / listAllWhisky
  / addWhisky
  / removeWhisky


listAllDistilleries
  = "list"i WS "all"i WS "distilleries"i { return {operation:"listAll", kind:"distillery"}; }
addDistillery
  = "add"i WS "distillery"i WS name:stringWithSpaces { return {operation:"add", kind:"distillery", name:name}; }
removeDistillery
  = "remove"i WS "distillery"i WS name:stringWithSpaces { return {operation:"remove", kind:"distillery", name:name}; }
listAllWhisky
  = "list"i WS "all"i WS "whisky"i { return {operation:"listAll", kind:"whisky"}; }
addWhisky
  = "add"i WS "whisky"i WS def:whiskyDefinition { return {operation:"add", kind:"whisky", definition:def}; }
removeWhisky
  = "remove"i WS "whisky"i WS id:id { return {operation:"remove", kind:"whisky", id: id}; }

// Nikka Yoichi 1988/2013 62% OB Single Cask Peated
// Aberlour "Abunadh" 60,7% OB

whiskyDefinition
  = distillery:stringWithSpaces specialName:(WS qString)? age:(WS ageModifier)* mods:(WS whiskyModifier)*
  { 
    var modsObject = {};
    var modsArray = age.concat(mods).map(function(d) { return d[1]; });
    modsArray.forEach(
      function (d) {
        modsObject[d[0]] = d[1];
      });
    return {
      distillery: distillery,
      specialName: (specialName != null ? specialName[1] : null),
      modifiers: modsObject
    };
  }


ageModifier
  = whiskyCaskingBottling
  / whiskyAge
  / whiskyYear

whiskyAge
  = age:number "yo"i { return ["age", age]; }
whiskyYear
  = year:year { return ["year", year]; }
whiskyCaskingBottling
  = casking:year "/" bottling:year { return ["caskingBottling", [casking, bottling]]; }


whiskyPercentage
  = p:float "%" { return ["percentage", p]; }
whiskyBottler
  = "bottled by"i s:string { return ["bottler", s]; }
singleCask
  = "single cask"i { return ["singleCask", true]; }
whiskyPeated
  = "peated"i { return ["peated", true]; }
whiskyOriginalBottling
  = "ob"i { return ["originalBottling", true]; }

whiskyModifier
  = singleCask
  / whiskyPercentage
  / whiskyBottler
  / whiskyPeated
  / whiskyOriginalBottling


WS
  = [ \n\r\t]* { return null; }
nameWithSpaces
  = s:[a-öA-Ö ]+ { return s.join(""); }
year
  = n:(("19" / "20") [0-9][0-9]) { return parseInt(n.join(""), 10); }
qString
  = string
  / '"' first:string rest:( WS string )* '"' { return first + rest.map(function(d){return d.join("");}).join(""); }
stringWithSpaces
  = first:string rest:( WS string )* { var words = rest.map(function(d){return d.join("");}); words.unshift(first); return words.join(" "); }
string
  = s:[a-öA-Ö]+ { return s.join(""); }
number
  = n:[0-9]+ { return parseInt(n.join(""), 10); }
float
  = n:[0-9.,]+ { return parseFloat(n.join(""), 10); }
id
  = id:[a-zA-Z0-9-_]+ { return id.join(""); }

