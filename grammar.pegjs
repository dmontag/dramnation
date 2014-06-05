

start
  = listEverything

  / listAllRegions
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

  / listAllUsers
  / listAllBottles
  / setUser
  / unsetBottle

  / listTastingNotes
  / addTastingNote
  / setTastingNote
  / removeTastingNote
  / listTastings
  / addTasting
  / setTastingDate
  / addWhiskyToTasting
  / setWhiskyOrderInTasting
  / removeWhiskyFromTasting
  / removeTasting

  / findWhisky


listEverything
  = "list"i WS "everything"i { return {operation:"listEverything"}; }


listAllRegions
  = "list"i WS "regions"i { return {operation:"listAll", kind:"region"}; }
addRegion
  = "add"i WS "region"i WS name:stringWithSpaces { return {operation:"add", kind:"region", name:name}; }
removeRegion
  = "remove"i WS "region"i WS name:stringWithSpaces { return {operation:"remove", kind:"region", name:name}; }


listAllDistilleries
  = "list"i WS "distilleries"i { return {operation:"listAll", kind:"distillery"}; }
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
  = "region"i WS region:stringWithSpaces { return ["region", region]; }

listAllBottlers
  = "list"i WS "bottlers"i { return {operation:"listAll", kind:"bottler"}; }
addBottler
  = "add"i WS "bottler"i WS name:stringWithSpaces { return {operation:"add", kind:"bottler", name:name}; }
removeBottler
  = "remove"i WS "bottler"i WS name:stringWithSpaces { return {operation:"remove", kind:"bottler", name:name}; }


listAllWhisky
  = "list"i WS whisky { return {operation:"listAll", kind:"whisky"}; }
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


listTastings
  = "list"i WS "tastings"i { return {operation:"listAll", kind:"tasting"}; }
addTasting
  = "add"i WS "tasting"i WS name:qString WS "on"i WS date:date { return {operation:"add", kind:"tasting", name:name, date:date}; }
addWhiskyToTasting
  = "set"i WS "tasting"i WS name:qString WS "includes"i WS whisky WS id:id { return {operation:"set", kind:"tasting", name:name, whisky:id}; }
setWhiskyOrderInTasting
  = "set"i WS "tasting"i WS name:qString WS "order"i WS whisky WS id:id WS order:number { return {operation:"set", kind:"tasting", name:name, whisky:id, order:order}; }
setTastingDate
  = "set"i WS "tasting"i WS name:qString WS "on"i WS date:date { return {operation:"set", kind:"tasting", name:name, date:date}; }
removeWhiskyFromTasting
  = "unset"i WS "tasting"i WS name:qString WS "includes"i WS whisky WS id:id { return {operation:"unset", kind:"tasting", name:name, whisky:id}; }
removeTasting
  = "remove"i WS "tasting"i WS name:qString { return {operation:"remove", kind:"tasting", name:name}; }


listTastingNotes
  = "list"i WS "tasting"i WS "notes"i { return {operation:"listAll", kind:"tastingNote"}; }
addTastingNote
  = "add"i WS "tasting"i WS "note"i WS "for"i WS whisky WS id:id WS "in"i WS "tasting"i WS name:qString mods:(WS tastingNoteModifier)+
    { 
      var modsObject = {};
      var modsArray = mods.map(function(d) { return d[1]; });
      modsArray.forEach(
        function (d) {
          modsObject[d[0]] = d[1];
        });

      return {operation:"add", kind:"tastingNote", whisky:id, tasting:name, modifiers:modsObject}; 
    }
setTastingNote
  = "set"i WS "tasting"i WS "note"i WS id:id WS "user"i WS username:username { return {operation:"set", kind:"tastingNote", id:id, user:username}; }
removeTastingNote
  = "remove"i WS "tasting"i WS "note"i WS id:id { return {operation:"remove", kind:"tastingNote", id:id}; }
tastingNoteModifier
  = tastingNose
  / tastingPalate
  / tastingFinish
  / tastingOverall
  / tastingPoints
tastingNose
  = "nose"i WS points:tastingPointsNumber ? WS desc:qString { return ["nose", [desc, points]]; }
tastingPalate
  = "palate"i WS points:tastingPointsNumber ? WS desc:qString { return ["palate", [desc, points]]; }
tastingFinish
  = "finish"i WS points:tastingPointsNumber ? WS desc:qString { return ["finish", [desc, points]]; }
tastingOverall
  = "overall"i WS points:tastingPointsNumber ? WS desc:qString { return ["overall", [desc, points]]; }
tastingPoints
  = num:tastingPointsNumber { return ["points", num]; }
tastingPointsNumber
  = points:number "p"i { return points; }


listAllUsers
  = "list"i WS "users" { return {operation:"listAll", kind:"user"}; }
listAllBottles
  = "list"i WS "bottles" { return {operation:"listAll", kind:"bottle"}; }
setUser
  = "set"i WS "user"i WS user:username WS "owns"i WS whisky WS id:id { return {operation:"set", kind:"user", user:user, whisky:id}; }
unsetBottle
  = "unset"i WS "user"i WS user:username WS "owns"i WS "bottle"i WS id:id { return {operation:"unset", kind:"user", user:user, bottle:id}; }


// Nikka Yoichi 1988/2013 62% OB Single Cask Peated
// Aberlour "Abunadh" 60,7% OB

whiskyDefinition
  = distillery:stringWithSpaces specialName:(WS qqString)? age:(WS ageModifier)* (WS "," WS)? mods:(WS whiskyModifier)*
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

whiskyAge
  = age:number "yo"i { return ["age", age]; }
whiskyCaskingBottling
  = casking:year "/" bottling:year { return ["caskingBottling", [casking, bottling]]; }


singleCaskLiteral = "single"i WS "cask"i
singleCask
  = singleCaskLiteral { return ["singleCask", true]; }
caskStrengthLiteral = "cask"i WS "strength"i
caskStrength
  = caskStrengthLiteral { return ["caskStrength", true]; }
peatedLiteral = "peated"i
peated
  = peatedLiteral { return ["peated", true]; }
blendedLiteral = "blended"i
blended
  = blendedLiteral { return ["blended", true]; }

whiskyPercentage
  = p:float "%" { return ["percentage", p]; }
whiskyBottler
  = "bottled"i WS "by"i WS s:qString { return ["bottler", s]; }
whiskyOriginalBottling
  = "ob"i { return ["originalBottling", true]; }
bottleSize
  = size:number WS "cl"i { return ["bottleSize", size]; }
bottledYear
  = "bottled"i WS year:year { return ["bottledYear", year]; }
caskNumbers
  = "cask"i WS cask:number total:(WS ("/" / "of"i) WS number)? { return ["caskNumbers", [cask, (total ? total[3] : 0)]]; }

caskFinish
  = finish:finishWoodType WS "finish"i { return ["finish", finish]; }
finishWoodType
  = sherryFinish
  / portFinish
  / madeiraFinish
  / redWineFinish
sherryFinish
  = sherryWood
portFinish
  = "port"i { return "port"; }
madeiraFinish
  = "madeira"i { return "madeira"; }
redWineFinish
  = "red"i WS "wine"i { return "redWine"; }

caskType
  = type:caskWoodType WS "cask"i { return ["caskType", type]; }
caskWoodType
  = oakWood
  / bourbonRefillWood
  / sherryRefillWood
  / sherryWood
  / bourbonWood
oakWood
  = "oak"i { return "oak"; }
sherryWood
  = "sherry"i { return "sherry"; }
bourbonWood
  = "bourbon"i { return "bourbon"; }
bourbonRefillWood
  = "bourbon"i WS "refill"i { return "bourbonRefill"; }
sherryRefillWood
  = "sherry"i WS "refill"i {return "sherryRefill"; }

whiskyModifier
  = singleCask
  / caskStrength
  / peated
  / blended
  / whiskyOriginalBottling
  / caskType
  / caskFinish
  / whiskyPercentage
  / whiskyBottler
  / bottleSize
  / bottledYear
  / caskNumbers


findWhisky
  = "find"i WS whisky WS "where"i WS ast:orExpression { return {operation:"find", kind:"whisky", ast:ast}; }
orExpression
  = left:andExpression WS "or"i WS right:orExpression { return {kind:"or", input:[left, right]}; }
  / andExpression
andExpression
  = left:atomExpression WS "and"i WS right:andExpression { return {kind:"and", input:[left, right]}; }
  / atomExpression
atomExpression
  = realAtomExpression
  / "(" WS exp:orExpression WS ")" { return exp; }
realAtomExpression
  = unaryExpression
  / operatorExpression
unaryExpression
  = not:"not"i ? WS
  literal:( 
    caskStrength
    / singleCask
    / blended
    / peated 
    / whiskyOriginalBottling
  ) 
  {
    var exp = {kind:"is", input:literal[0]}; 
    if (not) return {kind:"not", input:exp};
    return exp;
  }
operatorExpression
  = ageExpression
  / percentageExpression
  / caskTypeExpression
  / bottlerExpression
  / finishExpression
percentageExpression
  = op:gtLtEq ? WS wp:whiskyPercentage
  { 
    return {kind:(op || "="), input:wp};
  }
caskTypeExpression
  = ct:caskType { return {kind:"=", input:ct}; }
finishExpression
  = cf:caskFinish { return {kind:"=", input:cf}; }
bottlerExpression
  = wb:whiskyBottler { return {kind:"=", input:wb}; }
ageExpression
  = op:gtLtEq ? WS age:whiskyAge 
  {
    return {kind:(op || "="), input:age};
  }
gtLtEq
  = ">" / "<" / "="


WS
  = [ \n\r\t]* { return null; }
year
  = n:(("19" / "20") [0-9][0-9]) { return parseInt(n.join(""), 10); }
month
  = n:[0123][0-9] { return parseInt(n.join(""), 10); }
day 
  = month
qString
  = string
  / qqString
qqString
  = '"' s1:alphaChar s2:textChar* '"' { return s1+s2.join(""); }
stringWithSpaces
  = first:string rest:( WS string )* { var words = rest.map(function(d){return d.join("");}); words.unshift(first); return words.join(" "); }
string
  = s1:alphaChar s2:alphanumChar* { return s1 + s2.join(""); }
alphanum
  = s:alphanumChar* { return s.join(""); }
number
  = n:[0-9]+ { return parseInt(n.join(""), 10); }
float
  = n:[0-9.,]+ { return parseFloat(n.join("").replace(",","."), 10); }
id
  = id:[a-zA-Z0-9-_]+ { return id.join(""); }
username 
  = string
date
  = s:([12][90][0-9][0-9] "-" [01][0-9] "-" [0123][0-9]) { return s.join(""); }

textChar
  = [a-öA-Ö0-9 ,.\-':&%]
alphaChar
  = [a-öA-Ö]
alphanumChar
  = [a-öA-Ö0-9]

