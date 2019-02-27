/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;
	this.bookEverLoaned = 0;
	this.bookReturnOntime = 0;
	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/

/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
// Done
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const newBookName = document.getElementById("newBookName").value;
	const newBookAuthor = document.getElementById("newBookAuthor").value;
	const newBookGenre = document.getElementById("newBookGenre").value;

 	//const newBook = new Book()
	const newBook = new Book(newBookName,newBookAuthor,newBookGenre);
	libraryBooks.push(newBook);
	
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
// Done
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const loanedBookNumber = document.getElementById("loanBookId").value
	const loaningPatronNumber = document.getElementById("loanCardNum").value
	const loanedBook = libraryBooks.find(x => x.bookId == loanedBookNumber);
	const loaningPatron = patrons.find(x => x.cardNumber == loaningPatronNumber)
	
	//Check the inputs is valid or not
	if(loanedBookNumber >= numberOfBooks){
		alert("Invalid bookId, please try again")
		return
	}else if(loaningPatronNumber >= numberOfPatrons){
		alert("Invalid patronCardNumber, please try again")
		return
	}
	
	//Check if this book has been loaned
	const hasBeenLoaned = (loanedBook.patron != null);
	if(hasBeenLoaned){
		alert("This book is not available now, find another book you want :)")
		return
	}
	
	//Check if this patron already loaned 4 book
	const allPatrons = document.getElementById("patrons")
	const loanersBox = allPatrons.children[loaningPatronNumber]
	const tempTablebody = loanersBox.children[3].children[0]
	if(tempTablebody.childElementCount >= 5){
		alert("You can only borrow at most 4 books at same time")
		return
	}
	
	//Check if having three books overdue
	var index
	var numOfOverDue = 0
	for(index = 1;index < tempTablebody.childElementCount; index++){
		const tempStatus = tempTablebody.children[index].children[2].children[0].children[0].innerHTML
		if (tempStatus == "OverDue"){
			numOfOverDue = parseInt(numOfOverDue) + 1
		}
	}
	if(numOfOverDue == 3){
		alert("You have 3 OverDue books, please return them first:)")
		return
	}
	
	// Add patron to the book's patron property
	loanedBook.patron = loaningPatron
	const tablebody = document.querySelector('tbody')
	const rowNum = parseInt(loanedBookNumber) + 1
	const tdOfLoanerOfThisBook = tablebody.children[rowNum].children[2]
	const loanerText = document.createTextNode(loaningPatronNumber)
	tdOfLoanerOfThisBook.appendChild(loanerText)

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(loanedBook)

	// Start the book loan timer.
	loanedBook.setLoanTime()

}

// Changes book patron information and calls returnBookToLibraryTable()
// Done
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	var returnButtonClicked = false
	if(e.target.innerHTML == "return"){
		returnButtonClicked = true
	}

	if(returnButtonClicked){
		// Call removeBookFromPatronTable()
		const returnedBookId = e.target.parentElement.parentElement.children[0].innerHTML
		const returnedBook = libraryBooks.find(x => x.bookId == returnedBookId)
		returnedBook.patron.bookEverLoaned = parseInt(returnedBook.patron.bookEverLoaned) + 1;
		returnedBook.patron.bookReturnOntime = parseInt(returnedBook.patron.bookReturnOntime) + 1;
		removeBookFromPatronTable(returnedBook)
		
		// Check number of return and ontime return
		if(returnedBook.patron.bookEverLoaned == 15){
			alert(returnedBook.patron.name+': "Excellent Student" Achievement accomplished (loan and return 15 books), nextLevel: You are the top of world!')
		}else if(returnedBook.patron.bookEverLoaned == 10){
			alert(returnedBook.patron.name+': "HardWorking Student" Achievement accomplished (loan and return 10 books), nextLevel: 5 more books loaned')
		}else if(returnedBook.patron.bookEverLoaned == 5){
			alert(returnedBook.patron.name+': "Good Student" Achievement accomplished (loan and return 5 books), nextLevel: 5 more books loaned')
		}
		
		if(returnedBook.patron.bookReturnOntime == 10){
			alert(returnedBook.patron.name+': "You Never Late!" Achievement accomplished (return book before dueTime 10 times), nextLevel: You are the top of world!')
		}else if(returnedBook.patron.bookReturnOntime == 7){
			alert(returnedBook.patron.name+': "Early Bird" Achievement accomplished (return book before dueTime 7 times), nextLevel: 3 more books returned on time')
		}else if(returnedBook.patron.bookReturnOntime == 3){
			alert(returnedBook.patron.name+': "Time Keeper" Achievement accomplished (return book before dueTime 3 times), nextLevel: 4 more books returned on time')
		}
		
		
		// Change the book object to have a patron of 'null'
		returnedBook.patron = null
	}
}

// Creates and adds a new patron
// Done
function addNewPatron(e) {
	e.preventDefault();
	// Add a new patron to global array
	const newPatronName = document.getElementById("newPatronName").value
	const newPatron = new Patron(newPatronName)
	patrons.push(newPatron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron)
}

// Gets book info and then displays
// Done
function getBookInfo(e) {
	e.preventDefault();
	// Get correct book
	const wantedBookId = document.getElementById("bookInfoId").value;
	if(wantedBookId >= numberOfBooks){
		alert("Invalid bookId input, please check and try again")
		return
	}
	const wantedBook = libraryBooks.find(x => x.bookId == wantedBookId);
	// Call displayBookInfo()	
	displayBookInfo(wantedBook)
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
// Done
function addBookToLibraryTable(book) {
	//First fetch the table body
	const tablebody = document.querySelector('tbody');
	
	//Second create a new row for the new book
	const newRow = document.createElement('tr');
	
	//implement the newbookid
	const newBookId = document.createElement('td');
	const newBookIdText = document.createTextNode(book.bookId);
	newBookId.appendChild(newBookIdText);
	
	//implement the newbooktitle
	const newBookTitle = document.createElement('td');
	const newBookTitleText = document.createTextNode(book.title);
	const boldText = document.createElement("B");
	boldText.appendChild(newBookTitleText);
	newBookTitle.appendChild(boldText);
	
	//implement the newBookPatron
	const newBookPatron = document.createElement('td');
	
	//add 3 td into the tr
	newRow.appendChild(newBookId);
	newRow.appendChild(newBookTitle);
	newRow.appendChild(newBookPatron);
	
	//Now we have a completed new row for the new book
	tablebody.appendChild(newRow);
}


// Displays deatiled info on the book in the Book Info Section
// Done
function displayBookInfo(book) {
	//First fetch the div we want
	const wantedBookInfo = document.querySelector('#bookInfo');
	wantedBookInfo.children[0].children[0].innerHTML = book.bookId
	wantedBookInfo.children[1].children[0].innerHTML = book.title
	wantedBookInfo.children[2].children[0].innerHTML = book.author
	wantedBookInfo.children[3].children[0].innerHTML = book.genre
	if(book.patron != null){
		wantedBookInfo.children[4].children[0].innerHTML = book.patron.cardNumber
	}else{
		wantedBookInfo.children[4].children[0].innerHTML = "N/A"
	}
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
// Done
function addBookToPatronLoans(book) {
	// First we need to know who loaned this book
	const loanerId = book.patron.cardNumber
	
	//Then we fetch the table of this people's loaning box
	const allPatrons = document.getElementById("patrons")
	const loanersBox = allPatrons.children[loanerId]
	const tablebody = loanersBox.children[3].children[0]
	
	//Check if there already has books with same Genre
	var index
	var numOfSameGenre = 0
	for(index = 1;index < tablebody.childElementCount; index++){
		const tempBookId = tablebody.children[index].children[0].innerHTML
		const loanedBook = libraryBooks.find(x => x.bookId == tempBookId)
		if (loanedBook.genre == book.genre){
			numOfSameGenre = parseInt(numOfSameGenre) + 1
		}
	}
	if(numOfSameGenre >= 2){
		alert("You have borrowed 3 books of same genre: "+book.genre+", we highly recommend you read some other books to extend your knowledge :)")
	}
	
	// Add a new row
	const newRow = document.createElement('tr');
	
	// And in this new row(tr) we need 4 td 
	// First is BookId
	const bookId = document.createElement('td')
	const bookIdText = document.createTextNode(book.bookId)
	bookId.appendChild(bookIdText)
	
	// Sencond is Title, need to be bold
	const title = document.createElement('td')
	const titleText = document.createTextNode(book.title)
	const titleTextBold = document.createElement('b')
	titleTextBold.appendChild(titleText)
	title.appendChild(titleTextBold)
	
	// Third one is Status and need to be green and bold
	const statusOfBook = document.createElement('td')
	const statusOfBookText = document.createTextNode("Within due date")
	const statusOfBookTextBold = document.createElement('b')
	statusOfBookTextBold.appendChild(statusOfBookText)
	const statusOfBookTextBoldGreen = document.createElement('span')
	statusOfBookTextBoldGreen.style.color = "green"
	statusOfBookTextBoldGreen.appendChild(statusOfBookTextBold)
	statusOfBook.appendChild(statusOfBookTextBoldGreen)
	
	// Last one is a return button
	const returnButtonTd = document.createElement('td')
	const returnButton = document.createElement('button')
	returnButton.className = 'return'
	returnButton.appendChild(document.createTextNode('return'))
	returnButtonTd.appendChild(returnButton)
	
	// Put 4 td inside tr
	newRow.appendChild(bookId);
	newRow.appendChild(title);
	newRow.appendChild(statusOfBook);
	newRow.appendChild(returnButtonTd);

	//Finally
	tablebody.appendChild(newRow);
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
// Done
function addNewPatronEntry(patron) {
	const patrons = document.getElementById("patrons")
	const firstPatronBox = patrons.children[0]
	const newPatronBox = firstPatronBox.cloneNode(true)
	
	newPatronBox.children[0].children[0].innerHTML = patron.name
	newPatronBox.children[1].children[0].innerHTML = patron.cardNumber
	const tbody = newPatronBox.children[3].children[0]
	while (tbody.children[1]){
		tbody.removeChild(tbody.children[1])
	}
	patrons.appendChild(newPatronBox)
}


// Removes book from patron's book table and remove patron card number from library book table
// Done
function removeBookFromPatronTable(book) {
	const Booktablebody = document.querySelector('tbody');
	const rowNum = parseInt(book.bookId)+1;
	const tempTd = Booktablebody.children[rowNum].children[2]
	tempTd.innerHTML = ""
		
	const oldPatron = book.patron
	const oldPatronNum = oldPatron.cardNumber
	const patrons = document.getElementById("patrons")
	const tempTableBody = patrons.children[oldPatronNum].children[3].children[0]

		
	var index
	for(index = 1;index < tempTableBody.childElementCount; index++){
		if(tempTableBody.children[index].children[0].innerHTML == book.bookId){
			tempTableBody.removeChild(tempTableBody.children[index])
		}
	}
}

// Set status to red 'Overdue' in the book's patron's book table.
// Done
function changeToOverdue(book) {
	if(book.patron != null){
		book.patron.bookReturnOntime = book.patron.bookReturnOntime - 1;
		const currentPatron = book.patron
		const currentPatronId = currentPatron.cardNumber
		const patrons = document.getElementById("patrons")
		const tablebody = patrons.children[currentPatronId].children[3].children[0]
		var index
		for(index = 1;index < tablebody.childElementCount; index++){
			if(book.bookId == tablebody.children[index].children[0].innerHTML){
				const statusOfBookText = document.createTextNode("OverDue")
				const statusOfBookTextBold = document.createElement('b')
				statusOfBookTextBold.appendChild(statusOfBookText)
				const statusOfBookTextBoldRed = document.createElement('span')
				statusOfBookTextBoldRed.style.color = "red"
				statusOfBookTextBoldRed.appendChild(statusOfBookTextBold)
				const tempTd = tablebody.children[index].children[2]
				tempTd.innerHTML = ""
				tempTd.appendChild(statusOfBookTextBoldRed)
			}
		}
	}		
}



