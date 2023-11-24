let bookCollection = [];

const displayBooks = () => {
    const formattedBooks = bookCollection.map((book, index) => 
        `${index + 1}. ID: ${book.id} Tytuł: "${book.title}" Autor: "${book.author}" Rok: ${book.year}`
    ).join('<br>');
    document.getElementById('data').innerHTML = formattedBooks;
}

window.addEventListener('load', () => {
    const storedBooks = localStorage.getItem('bookCollection');
    bookCollection = storedBooks ? JSON.parse(storedBooks) : [];

    bookCollection = bookCollection.map((book, index) => {
        if (!book.id) {
            book.id = Date.now() + index;
        }
        return book;
    });

    localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
    displayBooks();
});

const swap = (array, index1, index2) => {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

const bubbleSort = async (array, key) => {
    const len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (array[j][key] > array[j + 1][key]) {
                const temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    return array;
}

const isBookArray = array => array.every(element => 
    element.hasOwnProperty('title') && element.hasOwnProperty('author') && element.hasOwnProperty('year')
);

document.getElementById('sortForm').addEventListener('submit', async event => {
    event.preventDefault();

    const dataArray = [...bookCollection];

    if (!isBookArray(dataArray)) {
        document.getElementById('result').textContent = 'Invalid data. Please enter book data in the correct format.';
        return;
    }

    const direction = document.getElementById('direction').value;
    const sortType = document.getElementById('sortType').value;

    let sortedArray = await bubbleSort(dataArray, sortType);

    if (direction === 'desc') {
        sortedArray.reverse();
    }

    const resultString = sortedArray.map((book, index) => 
        `${index + 1}. ID: ${book.id} Tytuł: "${book.title}" Autor: "${book.author}" Rok: ${book.year}<br>`
    ).join('');

    document.getElementById('result').innerHTML = resultString;
    localStorage.setItem('direction', direction);
});

const generateBookId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id;
    do {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        id = randomLetter + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    } while (bookCollection.find(book => book.id === id));
    return id;
}

document.getElementById('addBookForm').addEventListener('submit', event => {
    event.preventDefault();

    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const year = document.getElementById('year');

    const newBook = { id: generateBookId(), title: title.value, author: author.value, year: parseInt(year.value) };

    const duplicate = bookCollection.find(book => 
        book.title === newBook.title && book.author === newBook.author && book.year === newBook.year
    );

    if (!duplicate) {
        bookCollection.push(newBook);
        localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
        displayBooks();
    }

    title.value = "";
    author.value = "";
    year.value = "";
});

document.getElementById('deleteBookForm').addEventListener('submit', event => {
    event.preventDefault();

    const bookId = document.getElementById('bookId').value;
    const bookIndex = bookCollection.findIndex(book => book.id.toString() === bookId);

    if (bookIndex !== -1) {
        bookCollection.splice(bookIndex, 1);
        localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
        displayBooks();
    }

    document.getElementById('bookId').value = "";
});

document.getElementById('searchForm').addEventListener('submit', event => {
    event.preventDefault();

    const searchTitle = document.getElementById('searchTitle').value.toLowerCase();
    const searchAuthor = document.getElementById('searchAuthor').value.toLowerCase();
    const searchYear = document.getElementById('searchYear').value;

    const results = bookCollection.filter(book => 
        (searchTitle === '' || book.title.toLowerCase().includes(searchTitle)) &&
        (searchAuthor === '' || book.author.toLowerCase().includes(searchAuthor)) &&
        (searchYear === '' || book.year.toString() === searchYear)
    );

    const formattedResults = results.map(book => 
        `ID: ${book.id} Tytuł: "${book.title}" Autor: "${book.author}" Rok: ${book.year}`
    ).join('<br>');

    document.getElementById('searchResults').innerHTML = formattedResults;
});