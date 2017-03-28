var PriceStrategy = function() {
  var strategy = {
    // 满 100 返 30
    return30: function(price) {
      return price + parseInt(price/100)*30;
    },
    // 满 100 返 50
    return50: function(price) {
      return price + parseInt(price/100)*50;
    },
    // 9 折
    percent90: function(price) {
      // js 在处理小数乘除法方面有 bug
      return price*100*90/10000
    },
    // 8 折
    percent80: function(price) {
      // js 在处理小数乘除法方面有 bug
      return price*100*80/10000
    },
    // 9 折
    percent50: function(price) {
      // js 在处理小数乘除法方面有 bug
      return price*100*50/10000
    }
  }
  return function(type, price) {
    if(strategy[type]) {
      return strategy[type](price);
    }
  }
}();

var price = PriceStrategy('percent80', 340);
console.log('price', price);