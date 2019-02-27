//const globalX = 3;
//var globalY = 2;
//console.log(globalX);
//console.log(globalY);

function foo(condition){
	if(condition == 1){		
		console.log("block1 starts")
		var innerX = 8;
		const innerY = 9;
		console.log(globalX);
		console.log(globalY);
		console.log(innerX);
		console.log(innerY);
	}
	if(condition == 2){
		console.log("block2 starts")
		console.log(globalX);
		console.log(globalY);
		console.log(innerX);
		console.log(innerY);
	}
}

let a =4;
let b =1;
let c =10;
let d =9;

function f1() {
	return function (t,m,n) { 
		console.log(t)
		console.log(m)
		console.log(n)
	}
}

const f2 = f1();
f2(a,b);

