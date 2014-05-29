module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = "list",
        peg$c2 = { type: "literal", value: "list", description: "\"list\"" },
        peg$c3 = "for",
        peg$c4 = { type: "literal", value: "for", description: "\"for\"" },
        peg$c5 = function(type, name) { return ["list", type, name]; },
        peg$c6 = "add",
        peg$c7 = { type: "literal", value: "add", description: "\"add\"" },
        peg$c8 = "owner",
        peg$c9 = { type: "literal", value: "owner", description: "\"owner\"" },
        peg$c10 = function(n) { return ["add", "owner", n]},
        peg$c11 = function(n, spec) { return ["add", "whisky", n, spec]; },
        peg$c12 = function(n) { return ["add", "distillery", n]},
        peg$c13 = function(n) { return ["add", "bottler", n]},
        peg$c14 = "update",
        peg$c15 = { type: "literal", value: "update", description: "\"update\"" },
        peg$c16 = function(name, spec, op) { return ["update", name, spec, op]; },
        peg$c17 = "set",
        peg$c18 = { type: "literal", value: "set", description: "\"set\"" },
        peg$c19 = function(mod) { return ["set", mod]; },
        peg$c20 = "remove",
        peg$c21 = { type: "literal", value: "remove", description: "\"remove\"" },
        peg$c22 = function(mod) { return ["remove", mod]; },
        peg$c23 = function(name, spec) { return ["remove", name, spec]; },
        peg$c24 = "'s",
        peg$c25 = { type: "literal", value: "'s", description: "\"'s\"" },
        peg$c26 = function(p) { return p; },
        peg$c27 = "whisky",
        peg$c28 = { type: "literal", value: "whisky", description: "\"whisky\"" },
        peg$c29 = "whiskey",
        peg$c30 = { type: "literal", value: "whiskey", description: "\"whiskey\"" },
        peg$c31 = "whiskies",
        peg$c32 = { type: "literal", value: "whiskies", description: "\"whiskies\"" },
        peg$c33 = "distillery",
        peg$c34 = { type: "literal", value: "distillery", description: "\"distillery\"" },
        peg$c35 = "distiller",
        peg$c36 = { type: "literal", value: "distiller", description: "\"distiller\"" },
        peg$c37 = function() { return "distillery"; },
        peg$c38 = "bottler",
        peg$c39 = { type: "literal", value: "bottler", description: "\"bottler\"" },
        peg$c40 = "independent bottler",
        peg$c41 = { type: "literal", value: "independent bottler", description: "\"independent bottler\"" },
        peg$c42 = function() { return "bottler"; },
        peg$c43 = [],
        peg$c44 = function(name, mods) { return {name: name, mods: mods.map(function(d){return d[1];})};},
        peg$c45 = "yo",
        peg$c46 = { type: "literal", value: "yo", description: "\"yo\"" },
        peg$c47 = function(age) { return ["age", age]; },
        peg$c48 = function(year) { return ["year", year]; },
        peg$c49 = "%",
        peg$c50 = { type: "literal", value: "%", description: "\"%\"" },
        peg$c51 = function(p) { return ["percentage", p]; },
        peg$c52 = "by",
        peg$c53 = { type: "literal", value: "by", description: "\"by\"" },
        peg$c54 = function(s) { return ["bottler", s]; },
        peg$c55 = "cask strength",
        peg$c56 = { type: "literal", value: "cask strength", description: "\"cask strength\"" },
        peg$c57 = "single cask",
        peg$c58 = { type: "literal", value: "single cask", description: "\"single cask\"" },
        peg$c59 = /^[ \n\r\t]/,
        peg$c60 = { type: "class", value: "[ \\n\\r\\t]", description: "[ \\n\\r\\t]" },
        peg$c61 = "\"",
        peg$c62 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c63 = function(first, rest) { return first + rest.map(function(d){return d.join("");}).join(""); },
        peg$c64 = /^[a-\xF6A-\xD6]/,
        peg$c65 = { type: "class", value: "[a-\\xF6A-\\xD6]", description: "[a-\\xF6A-\\xD6]" },
        peg$c66 = function(s) { return s.join(""); },
        peg$c67 = /^[0-9]/,
        peg$c68 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c69 = function(n) { return parseInt(n.join(""), 10); },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsewhiskyListing();
      if (s0 === peg$FAILED) {
        s0 = peg$parseaddOwner();
        if (s0 === peg$FAILED) {
          s0 = peg$parseaddWhisky();
          if (s0 === peg$FAILED) {
            s0 = peg$parseaddDistillery();
            if (s0 === peg$FAILED) {
              s0 = peg$parseaddBottler();
              if (s0 === peg$FAILED) {
                s0 = peg$parseupdateWhisky();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseremoveWhisky();
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsewhiskyListing() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c1) {
        s1 = peg$c1;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsewhisky();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c3) {
                s5 = peg$c3;
                peg$currPos += 3;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c4); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWS();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseownerLabel();
                  if (s7 === peg$FAILED) {
                    s7 = peg$parsedistillery();
                    if (s7 === peg$FAILED) {
                      s7 = peg$parsebottler();
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseWS();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseqString();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c5(s7, s9);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseaddOwner() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c8) {
            s3 = peg$c8;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseqString();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c10(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseaddWhisky() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseowner();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsewhisky();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWS();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsewhiskySpec();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c11(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseaddDistillery() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsedistillery();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseqString();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c12(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseaddBottler() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c6) {
        s1 = peg$c6;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsebottler();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseqString();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c13(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseupdateWhisky() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c14) {
        s1 = peg$c14;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c15); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseowner();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsewhisky();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWS();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsewhiskySpec();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseWS();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseupdateOperation();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c16(s3, s7, s9);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseupdateOperation() {
      var s0;

      s0 = peg$parseupdateSetOperation();
      if (s0 === peg$FAILED) {
        s0 = peg$parseupdateRemoveOperation();
      }

      return s0;
    }

    function peg$parseupdateSetOperation() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c17) {
        s1 = peg$c17;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsewhiskyModifier();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c19(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseupdateRemoveOperation() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsewhiskyModifier();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c22(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseremoveWhisky() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseowner();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsewhisky();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWS();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsewhiskySpec();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c23(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseowner() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseqString();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c24) {
          s2 = peg$c24;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsewhisky() {
      var s0;

      if (input.substr(peg$currPos, 6) === peg$c27) {
        s0 = peg$c27;
        peg$currPos += 6;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c29) {
          s0 = peg$c29;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c31) {
            s0 = peg$c31;
            peg$currPos += 8;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
        }
      }

      return s0;
    }

    function peg$parseownerLabel() {
      var s0;

      if (input.substr(peg$currPos, 5) === peg$c8) {
        s0 = peg$c8;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }

      return s0;
    }

    function peg$parsedistillery() {
      var s0, s1;

      if (input.substr(peg$currPos, 10) === peg$c33) {
        s0 = peg$c33;
        peg$currPos += 10;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 9) === peg$c35) {
          s1 = peg$c35;
          peg$currPos += 9;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c37();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsebottler() {
      var s0, s1;

      if (input.substr(peg$currPos, 7) === peg$c38) {
        s0 = peg$c38;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 19) === peg$c40) {
          s1 = peg$c40;
          peg$currPos += 19;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c42();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsewhiskySpec() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseqString();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseWS();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsewhiskyModifier();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhiskyModifier();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c44(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsewhiskyAge() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsenumber();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c45) {
          s2 = peg$c45;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c47(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsewhiskyYear() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsenumber();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c48(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsewhiskyPercentage() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsenumber();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 37) {
          s2 = peg$c49;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c50); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c51(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsewhiskyBottler() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c52) {
        s1 = peg$c52;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c53); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsestring();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c54(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsewhiskyModifier() {
      var s0;

      if (input.substr(peg$currPos, 13) === peg$c55) {
        s0 = peg$c55;
        peg$currPos += 13;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c57) {
          s0 = peg$c57;
          peg$currPos += 11;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parsewhiskyPercentage();
          if (s0 === peg$FAILED) {
            s0 = peg$parsewhiskyAge();
            if (s0 === peg$FAILED) {
              s0 = peg$parsewhiskyYear();
              if (s0 === peg$FAILED) {
                s0 = peg$parsewhiskyBottler();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseWS() {
      var s0, s1;

      s0 = [];
      if (peg$c59.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c59.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c60); }
        }
      }

      return s0;
    }

    function peg$parseqString() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$parsestring();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c61;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c62); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsestring();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$currPos;
            s5 = peg$parseWS();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsestring();
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c0;
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = peg$parseWS();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsestring();
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c0;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c0;
              }
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s4 = peg$c61;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c62); }
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c63(s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c64.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c64.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c65); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c66(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c67.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c67.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c69(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();