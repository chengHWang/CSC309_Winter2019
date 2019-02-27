const log = console.log;
log("Feb 26th")

////JSON////
const student = {
	name: "Eric",
	year: 2
}

log(student)
////functional////
//array can be const using []
const students = [
	{name:"Bob",year:3},
	{name:"Nancy",year:2},
	{name:"Kenny",year:3},
]

//how to get all 3 year students?
//using for loop is too much codes, we can take advantage iof js's first class function to write it in easier way
const isThirdYear = function (student){
	return student.year == 3
}

//const thirdYearStudent = students.filter(isThirdYear)


//map

//arrow functions
const square = function(x){
	return x*x
}
const squareA = (x) => {return x * x}
const squareB = x => x * x

log(squareA(5))
log(squareB(5))

const thirdYearStudentArrow = students.filter((student) => student.year == 3)
log(thirdYearStudentArrow)