function generateRandomData() {
    var data = [];
    for (var i = 0; i < 100; i++) {
      data.push({
        title: 'Book ' + i,
        author: 'Author ' + i,
        year: Math.floor(Math.random() * 100) + 1900
      });
    }
    return data;
  }
  
  window.addEventListener('load', function() {
    var dataTypeSelect = document.getElementById('dataType');
    updateData(dataTypeSelect.value);
  
    dataTypeSelect.addEventListener('change', function() {
      updateData(this.value);
    });
  });
  
  function updateData(dataType) {
    var data;
    if (dataType === 'random') {
      data = generateRandomData();
    } else if (dataType === 'partiallySorted') {
      data = generatePartiallySortedData();
    }
    document.getElementById('data').innerHTML = JSON.stringify(data);
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
  
    var data = document.getElementById('data').innerHTML;
    var dataArray = JSON.parse(data);
  
    if (!isBookArray(dataArray)) {
      document.getElementById('result').textContent = 'Invalid data. Please enter book data in the correct format.';
      return;
    }
  
    var algorithm = document.getElementById('algorithm').value;
    var direction = document.getElementById('direction').value;
  
    var sortedArray;
    if (algorithm === 'bubble') {
      sortedArray = await bubbleSort(dataArray, 'title');
    } else if (algorithm === 'insertion') {
      sortedArray = await insertionSort(dataArray, 'title');
    } else if (algorithm === 'selection') {
      sortedArray = await selectionSort(dataArray, 'title');
    }
  
    if (direction === 'desc') {
      sortedArray.reverse();
    }
  
    document.getElementById('result').textContent = 'Sorted data: ' + JSON.stringify(sortedArray) + '.';
  
    localStorage.setItem('algorithm', algorithm);
    localStorage.setItem('direction', direction);
  });