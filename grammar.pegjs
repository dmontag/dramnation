

start
  = listAllRegions
  / addRegion
  / removeRegion

  / listAllDistilleries
  / addDistillery
  / setDistillery
  / removeDistillery

  / listAllBottlers
  / addBottler
  / removeBottler

  / listAllWhisky
  / addWhisky
  / setWhisky
  / unsetWhisky
  / removeWhisky


listAllRegions
  = "list"i WS "all"i WS "regions"i { return {operation:"listAll", kind:"region"}; }
addRegion
  = "add"i WS "region"i WS name:stringWithSpaces { return {operation:"add", kind:"region", name:name}; }
removeRegion
  = "remove"i WS "region"i WS name:stringWithSpaces { return {operation:"remove", kind:"region", name:name}; }


listAllDistilleries
  = "list"i WS "all"i WS "distilleries"i { return {operation:"listAll", kind:"distillery"}; }
addDistillery
  = "add"i WS "distillery"i WS name:stringWithSpaces { return {operation:"add", kind:"distillery", name:name}; }
setDistillery
  = "set"i WS "distillery"i WS name:qString WS mod:distilleryModifier { return {operation:"set", kind:"distillery", name:name, modifier:mod}; }
removeDistillery
  = "remove"i WS "distillery"i WS name:stringWithSpaces { return {operation:"remove", kind:"distillery", name:name}; }
distilleryModifier
  = distilleryClosed
  / distilleryRegion
distilleryClosed
  = "closed"i { return ["closed", true]; }
distilleryRegion
  = "region"i WS region:nameWithSpaces { return ["region", region]; }

listAllBottlers
  = "list"i WS "all"i WS "bottlers"i { return {operation:"listAll", kind:"bottler"}; }
addBottler
  = "add"i WS "bottler"i WS name:stringWithSpaces { return {operation:"add", kind:"bottler", name:name}; }
removeBottler
  = "remove"i WS "bottler"i WS name:stringWithSpaces { return {operation:"remove", kind:"bottler", name:name}; }


listAllWhisky
  = "list"i WS "all"i WS whisky { return {operation:"listAll", kind:"whisky"}; }
addWhisky
  = "add"i WS whisky WS def:whiskyDefinition { return {operation:"add", kind:"whisky", definition:def}; }
setWhisky
  = "set"i WS whisky WS id:id WS mod:(ageModifier / whiskyModifier) { return {operation:"set", kind:"whisky", id:id, modifier:mod}; }
unsetWhisky
  = "unset"i WS whisky WS id:id WS mod:(ageModifier / whiskyModifier) { return {operation:"unset", kind:"whisky", id:id, modifier:mod}; }
removeWhisky
  = "remove"i WS whisky WS id:id { return {operation:"remove", kind:"whisky", id: id}; }

whisky
  = "whisky"i

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
  = "bottled by"i WS s:qString { return ["bottler", s]; }
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
  / '"' s:stringWithSpaces '"' { return s; }
stringWithSpaces
  = first:string rest:( WS string )* { var words = rest.map(function(d){return d.join("");}); words.unshift(first); return words.join(" "); }
string
  = s:[a-öA-Ö]+ { return s.join(""); }
number
  = n:[0-9]+ { return parseInt(n.join(""), 10); }
float
  = n:[0-9.,]+ { return parseFloat(n.join("").replace(",","."), 10); }
id
  = id:[a-zA-Z0-9-_]+ { return id.join(""); }

