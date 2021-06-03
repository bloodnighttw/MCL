function Latch(limit) {
  this.limit = limit;
  this.count = 0;
  this.waitBlock = function () {};
};

Latch.prototype.async = function (fn, ctx) {
  var _this = this;
  setTimeout(function () {
    fn.call(ctx, function () {
      _this.count = _this.count + 1;
      if(_this.limit <= _this.count){
        _this.waitBlock.call(_this.waitBlockCtx);
      }
    });
  }, 0);
};

Latch.prototype.await = function (callback, ctx) {
  console.log("lalalala")
  this.waitBlock = callback;
  this.waitBlockCtx = ctx;
};

export {Latch};