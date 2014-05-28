

start
  = whiskyListing
  / addOwner
  / addWhisky
  / addDistillery
  / addBottler
  / updateWhisky
  / removeWhisky


whiskyListing
  = "list" WS whisky WS "for" WS 
    type:( ownerLabel / distillery / bottler ) WS
    name:name { return ["list", type, name]; }

addOwner
  = "add" WS "owner" WS n:name { return ["add", "owner", n]}

addWhisky
  = "add" WS n:owner WS whisky WS spec:whiskySpec { return ["add", "whisky", n, spec]; }

addDistillery
  = "add" WS distillery WS n:name { return ["add", "distillery", n]}

addBottler
  = "add" WS bottler WS n:name { return ["add", "bottler", n]}



updateWhisky
  = "update" WS name:owner WS whisky WS spec:whiskySpec WS op:updateOperation { return ["update", name, spec, op]; }

updateOperation
  = updateSetOperation
  / updateRemoveOperation

updateSetOperation
  = "set" WS mod:whiskyModifier { return ["set", mod]; }

updateRemoveOperation
  = "remove" WS mod:whiskyModifier { return ["remove", mod]; }


removeWhisky
  = "remove" WS name:owner WS whisky WS spec:whiskySpec { return ["remove", name, spec]; }



owner
  = p:name "'s" { return p; }

name
  = qString

thing
  = name

whisky
  = "whisky" / "whiskey" / "whiskies"

ownerLabel
  = "owner"

distillery
  = "distillery" / "distiller" { return "distillery"; }

bottler
  = "bottler" / "independent bottler" { return "bottler"; }



whiskySpec
  = name:whiskyName
    mods:( WS whiskyModifier )* { return {name: name, mods: mods.map(function(d){return d[1];})};}

whiskyName 
  = name

whiskyAge
  = age:number "yo" { return ["age", age]; }

whiskyYear
  = year:number { return ["year", year]; }

whiskyPercentage
  = p:number "%" { return ["percentage", p]; }

whiskyBottler
  = "by" s:string { return ["bottler", s]; }

whiskyModifier
  = "cask strength"
  / "single cask"
  / whiskyPercentage
  / whiskyAge 
  / whiskyYear 
  / whiskyBottler

WS
  = [ \n\r\t]*

qString
  = string
  / '"' first:string rest:( WS string )* '"' { return first + rest.map(function(d){return d.join("");}).join(""); }

string
  = s:[a-öA-Ö]+ { return s.join(""); }

number
  = n:[0-9]+ { return parseInt(n.join(""), 10); }