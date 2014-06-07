var shortid = require("shortid");

module.exports = {
    add: add
};

function add(parsed, res) {
    switch (parsed.kind) {
        case "region": addRegion(parsed.name, res); break;
        case "distillery": addDistillery(parsed.name, res); break;
        case "bottler": addBottler(parsed.name, res); break;
        case "whisky": addWhisky(parsed.definition, res); break;
        case "tasting": addTasting(parsed.name, parsed.date, res); break;
        case "tastingNote": addTastingNote(parsed.tasting, parsed.whisky, parsed.modifiers, res); break;
    }
}

function addRegion(name, res) {
    res.queryResponse( 
        "MERGE (n:Region {name: {name}}) " +
        "ON CREATE SET n.displayName = {displayName} " +
        "RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name});
}

function addDistillery(name, res) {
    res.queryResponse( 
        "MERGE (n:Distillery {name: {name}}) " +
        "ON CREATE SET n.displayName = {displayName} " +
        "RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name});
}

function addBottler(name, res) {
    res.queryResponse( 
        "MERGE (n:Bottler {name: {name}}) " +
        "ON CREATE SET n.displayName = {displayName} " +
        "RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name});
}

function addWhisky(def, res) {
    console.log(def);
    var name = getWhiskyName(def);
    var properties = {
        name: name.toLowerCase(),
        displayName: name,
        distillery: def.distillery,
        specialName: def.specialName,
        id: shortid.generate()
    };
    for (var mod in def.modifiers) properties[mod] = def.modifiers[mod];
    for (var key in properties) if (!properties[key]) delete properties[key];
    delete properties.bottler;

    var bottler = def.modifiers.bottler ? def.modifiers.bottler.toLowerCase() : null;
    var params = {distillery: def.distillery.toLowerCase(), whisky: properties, bottler: bottler};
    
    var query =
        "MATCH (d:Distillery {name:{distillery}}) " + 
        (bottler ? "MATCH (b:Bottler {name:{bottler}}) " : "" ) + 
        "CREATE (n:Whisky {whisky}) " +
        "MERGE (n)-[:DISTILLERY]->(d) " +
        (bottler ? "MERGE (n)-[:BOTTLER]->(b) " : "" ) + 
        (bottler ? "RETURN {item:n, bottler: b, kind:head(labels(n))} AS result" : "RETURN {item:n, kind:head(labels(n))} AS result" );
    
    res.queryResponse(
        query,
        params);
}

function addTasting(name, date, res) {
    res.queryResponse(
        "MERGE (n:Tasting {name: {name}}) ON CREATE SET n.displayName = {displayName}, n.date = {date} RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName":name, date:date});
}

function addTastingNote(tasting, whisky, modifiers, res) {
    var note = {id:shortid.generate()};

    var nose = modifiers["nose"];
    var palate = modifiers["palate"];
    var finish = modifiers["finish"];
    var overall = modifiers["overall"];
    var points = modifiers["points"];

    if (nose) {
        note.nose = nose[0];
        if (nose[1]) note.nosePoints = nose[1];
    }
    if (palate) {
        note.palate = palate[0];
        if (palate[1]) note.palatePoints = palate[1];
    }
    if (finish) {
        note.finish = finish[0];
        if (finish[1]) note.finishPoints = finish[1];
    }
    if (overall) {
        note.overall = overall[0];
        if (overall[1]) note.overallPoints = overall[1];
    }
    if (points) {
        note.points = points;
    }

    res.queryResponse(
        "MATCH (t:Tasting {name:{tasting}})-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky {id:{whisky}}) " +
            "CREATE (tn:TastingNote {note}) " +
            "MERGE (tn)-[:NOTE_FOR]->(tw) " +
            "RETURN {item:tn, kind:head(labels(tn))} AS result",
        {tasting:tasting.toLowerCase(), whisky:whisky, note:note});
}

function getWhiskyName(def) {
    return def.distillery + (def.specialName ? (" " + def.specialName) : "") +
        (def.modifiers.caskingBottling ? " " + def.modifiers.caskingBottling[0] + "/" + def.modifiers.caskingBottling[1] : "") + 
        (def.modifiers.age ? " " + def.modifiers.age + "yo" : "");
}
