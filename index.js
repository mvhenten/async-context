"use strict";

var sliced = require("sliced");

function asyncContext(ctx) {
    var current, tasks = sliced(arguments, 1, -1),
        last = sliced(arguments, -1)[0];

    if (ctx instanceof Function) {
        tasks.unshift(ctx);
        ctx = {};
    }

    current = tasks.shift();

    process.nextTick(function() {
        current(ctx, function next(err) {
            if (err) return last(err, ctx);

            if (tasks.length == 0) return last(null, ctx);

            asyncContext.apply(null, [].concat(ctx, tasks, last));
        });
    });
}

module.exports = asyncContext;