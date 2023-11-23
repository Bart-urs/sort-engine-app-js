var bookCollection = [];

function displayBooks() {
  var formattedBooks = bookCollection.map(function(book, index) {
    return (index + 1) + '. ID: ' + book.id + ' Tytuł: "' + book.title + '" Autor: "' + book.author + '" Rok: ' + book.year;
  }).join('<br>');
  document.getElementById('data').innerHTML = formattedBooks;
}

window.addEventListener('load', function() {
  var dataTypeSelect = document.getElementById('dataType');

  // wczytuje zbiór książek z localStorage
  var storedBooks = localStorage.getItem('bookCollection');
  bookCollection = storedBooks ? JSON.parse(storedBooks) : [];

  // dodaje unikalne ID do każdej książki, jeśli jeszcze go nie ma
  bookCollection = bookCollection.map(function(book, index) {
    if (!book.id) {
      book.id = Date.now() + index;
    }
    return book;
  });

  // zapisuje zbiór książek w localStorage
  localStorage.setItem('bookCollection', JSON.stringify(bookCollection));

  // aktualizuje wyświetlane dane
  displayBooks();
});

function updateData(dataType) {
  if (dataType === 'partiallySorted') {
    bookCollection = generatePartiallySortedData();
  } else {
    // wczytuje zbiór książek z localStorage
    var storedBooks = localStorage.getItem('bookCollection');
    bookCollection = storedBooks ? JSON.parse(storedBooks) : [];
  }
  displayBooks();
}

  function swap(array, index1, index2) {
    var temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  async function bubbleSort(array, key) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - i - 1; j++) {
        if (array[j][key] > array[j + 1][key]) {
          var temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }
  
  async function insertionSort(array, key) {
    var len = array.length;
    for (var i = 1; i < len; i++) {
      var keyVal = array[i][key];
      var j = i - 1;
      while (j >= 0 && array[j][key] > keyVal) {
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = array[i];
    }
    return array;
  }
  
  async function selectionSort(array, key) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
      var minIndex = i;
      for (var j = i + 1; j < len; j++) {
        if (array[j][key] < array[minIndex][key]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        swap(array, i, minIndex);
      }
    }
    return array;
  }
  
  function isBookArray(array) {
    return array.every(function(element) {
      return element.hasOwnProperty('title') && element.hasOwnProperty('author') && element.hasOwnProperty('year');
    });
  }
  
  function generatePartiallySortedData() {
    var data = generateRandomData();
    var sortedPart = data.slice(0, 50).sort(function(a, b) { return a.title.localeCompare(b.title); });
    return sortedPart.concat(data.slice(50));
  }
  
  document.getElementById('sortForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    var dataArray = [...bookCollection];
  
    if (!isBookArray(dataArray)) {
      document.getElementById('result').textContent = 'Invalid data. Please enter book data in the correct format.';
      return;
    }
  
    var direction = document.getElementById('direction').value;
  
    var sortedArray = await bubbleSort(dataArray, 'title');
  
    if (direction === 'desc') {
      sortedArray.reverse();
    }
  
    document.getElementById('result').textContent = 'Sorted data: ' + JSON.stringify(sortedArray) + '.';
  
    localStorage.setItem('direction', direction);
  });

  function generateBookId() {
    var id;
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    do {
      var randomLetter = letters[Math.floor(Math.random() * letters.length)];
      id = randomLetter + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    } while (bookCollection.find(book => book.id === id));
    return id;
  }

  document.getElementById('addBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var title = document.getElementById('title');
    var author = document.getElementById('author');
    var year = document.getElementById('year');
  
    var newBook = { id: generateBookId(), title: title.value, author: author.value, year: parseInt(year.value) };
  
    // sprawdza, czy książka już istnieje w kolekcji
    var duplicate = bookCollection.find(function(book) {
      return book.title === newBook.title && book.author === newBook.author && book.year === newBook.year;
    });
  
    if (!duplicate) {
      bookCollection.push(newBook); // dodaje nową książkę na końcu tablicy
  
      // zapisuje zbiór książek w localStorage
      localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
  
      displayBooks();
    }
  
    // czyszczenie pól formularza
    title.value = "";
    author.value = "";
    year.value = "";
  });
  
  document.getElementById('deleteBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var bookId = document.getElementById('bookId').value;
    var bookIndex = bookCollection.findIndex(function(book) {
      return book.id.toString() === bookId;
    });
  
    if (bookIndex !== -1) {
      bookCollection.splice(bookIndex, 1); // usuwa książkę
  
      // zapisuje zbiór książek w localStorage
      localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
  
      displayBooks(); // aktualizuje wyświetlane dane
    }
  
    // czyszczenie pola formularza
    document.getElementById('bookId').value = "";
  });

  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var searchTitle = document.getElementById('searchTitle').value.toLowerCase();
    var searchAuthor = document.getElementById('searchAuthor').value.toLowerCase();
    var searchYear = document.getElementById('searchYear').value;
  
    var results = bookCollection.filter(function(book) {
      return (searchTitle === '' || book.title.toLowerCase().includes(searchTitle)) &&
             (searchAuthor === '' || book.author.toLowerCase().includes(searchAuthor)) &&
             (searchYear === '' || book.year.toString() === searchYear);
    });
  
    var formattedResults = results.map(function(book) {
      return 'ID: ' + book.id + ' Tytuł: "' + book.title + '" Autor: "' + book.author + '" Rok: ' + book.year;
    }).join('<br>');
  
    document.getElementById('searchResults').innerHTML = formattedResults;
  });