"use strict";

var test = require("tape"),
    diff = require("assert-diff"),
    context = require("../index.js");

test("error short-cirguits", function(assert) {
    context({
        foo: 1
    }, function(ctx, next) {
        next("Error shortcirquits");
    }, function() {
        throw new Error("I will never be called");
    }, function(err, ctx) {

        assert.deepEqual(ctx, {
            foo: 1
        }, "Context is passed down");
        assert.equal(err, "Error shortcirquits", "Error shortcirquits");
        assert.end();
    });
});

test("initial context is optional", function(assert) {
    context(function one(ctx, next) {
        ctx.one = 2;
        next();
    }, function two(ctx, next) {
        ctx.two = 3;
        next();
    }, function end(err, ctx) {
        assert.equal(err, null);
        assert.deepEqual(ctx, {
            one: 2,
            two: 3
        }, "Context was optional");
        assert.end();
    });

});

test("context is passed", function(assert) {
    context({}, function first(ctx, next) {
        ctx.next = 42;
        next();
    }, function last(err, ctx) {
        assert.equal(err, null, "no error passed");
        assert.deepEqual(ctx, {
            next: 42
        }, "context looks like expected");
        assert.end();
    });
});


test("context is passed multiple objects", function(assert) {
    var i = 0;

    function next(ctx, next) {
        ctx[i++] = i;
        next();
    }

    context({},
        next, next, next, next, next,
        function last(err, ctx) {
            assert.equal(err, null, "no error passed");
            diff.deepEqual(ctx, {
                0: 1,
                1: 2,
                2: 3,
                3: 4,
                4: 5
            }, "context looks like expected");
            assert.end();
        });
});