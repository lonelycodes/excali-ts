#! /usr/bin/env node
var esprima = require('esprima');
const args = process.argv.slice(2);
const fs = require("fs");

let inFile=outFile='let a = f(1+2)';
if (args.length !== 2) {
    console.log("excali-ts: generate excalidraw docs from ts(x) files\n\nUsage: excali-ts file.ts out.excalidraw");
    console.error("🤔 please provide all arguments");
    return -1;
} else {
    inFile = args[0];
    outFile = args[1];
}


const code = fs.readFileSync(inFile).toString();
console.log({code});

const ast = esprima.parse(code);
console.log({ast});

function traverse(root, options) {
    "use strict";

    options = options || {};
    var pre = options.pre;
    var post = options.post;
    var skipProperty = options.skipProperty;

    function visit(node, parent, prop, idx) {
        if (!node || typeof node.type !== "string") {
            return;
        }

        var res = undefined;
        if (pre) {
            res = pre(node, parent, prop, idx);
        }

        if (res !== false) {
            for (var prop in node) {
                if (skipProperty ? skipProperty(prop, node) : prop[0] === "$") {
                    continue;
                }

                var child = node[prop];

                if (Array.isArray(child)) {
                    for (var i = 0; i < child.length; i++) {
                        visit(child[i], node, prop, i);
                    }
                } else {
                    visit(child, node, prop);
                }
            }
        }

        if (post) {
            post(node, parent, prop, idx);
        }
    }

    visit(root, null);
};

traverse(ast, {pre: function(node, parent, prop, idx) {
    console.log(node.type + (parent ? " from parent " + parent.type +
        " via " + prop + (idx !== undefined ? "[" + idx + "]" : "") : ""));
}});
console.log();