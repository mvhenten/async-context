# async-context
Provide a *middleware-like* context to a chain of async functions.

[![Build Status](https://drone.io/github.com/mvhenten/async-context/status.png)](https://drone.io/github.com/mvhenten/async-context/latest)

## Description

I am a big fan of `async.js` but ever so often I need something that allows
me to collect number of dependencies in a row.

This function combines the philosophy of `async.js` with a *middleware-like*
context passing to each continuation function.

I often feel it is easier to write functions in a more generic way then having
to think about how arguments get passed down when using `waterfall`, or retrieving
items from the result array using `async.each` & co.

## Install

    npm install async-context
    
## Usage

```javascript
var context = require("async-context");

// optionally pass in a context as the first argument -
// otherwise it will be provided
context({}, function loadUserFromDb(ctx, next) {
        db.User.load(123, function(err, user) {
            ctx.user = user;
            next(err, user);
        });
    }, function loadStuffForUser(ctx, next) {
        db.Stuff.load(ctx.user.id, function(err, stuff) {
            next(err, _.merge(ctx, {
                stuff: stuff
            }));
        });
    },
    function checkSanityOfUser(ctx, next) {
        if (!ctx.user.crazy)
            ctx.user.ok = true;

        next(null, ctx);
    },
    function done(err, ctx) {
        if (err) throw "tantrums";

        // ctx == { user: user, stuff: stuff, ok: true }
});
```