let buyer1 =60  ;
let seller1 = 50;
let max=Math.min(buyer1,seller1)
let min=Math.max(buyer1,seller1)

 buyer1-=max

 seller1-=max
console.log(buyer1)
console.log(seller1)

buyer1-=min
 seller1-=min

 console.log(buyer1)
console.log(seller1)