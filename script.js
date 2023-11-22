document.getElementById('sortForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var data = document.getElementById('data').value;
    var dataArray = data.split(',').map(Number);
  
    var sortedArray = bubbleSort(dataArray);
  
    document.getElementById('result').textContent = 'Sorted data: ' + sortedArray.join(', ');
  });

  function bubbleSort(array) {
    var len = array.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          var temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }