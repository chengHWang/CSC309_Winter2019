'use strict';
const log = console.log

log('Feb 27 - 10am')

const student = {
	name: 'Bob',
	year: 3,
	courses: ['csc301', 'csc309', 'csc343', 'phy207']
}

// log(student)
const studentString = JSON.stringify(student)
// log(studentString)

const fs = require('fs')
//writing a json string to a file
fs.writeFileSync('student.json', studentString)
//////////
// read a json string from a file
const studentJSONString = fs.readFileSync('student.json')

const studentParsed = JSON.parse(studentJSONString)

log(studentParsed)

///////

const students = [
	student,
	{  name: 'Kelly',
	   year: 2,
	   courses: ['csc207', 'csc209', 'csc301', 'csc309']
	}
]

const studentsString = JSON.stringify(students)
fs.writeFileSync('students.json', studentsString)

const studentsJSONString = fs.readFileSync('students.json')
const studentsParsed = JSON.parse(studentsJSONString)

log(studentsParsed)
log(studentsParsed[1].name)


// How do find the enrollment for every course?
const courseEnrollment = studentsParsed.reduce((enrollment, student) => {
	student.courses.map((course) => {
		if (course in enrollment) {
			enrollment[course] = enrollment[course] + 1
		} else {
			enrollment[course] = 1
		}
	})
	return enrollment
}, {})

log(courseEnrollment)









