function make2DArray(rows, columns) {
  var arr = [];
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
      arr[i][j] = "";
    }
  }
  return arr;
}

function generateTableData(rawData, columns, columnMap) {
  let dataMatrix = make2DArray(rawData.length, columns);

  for (let rowNo = 0; rowNo < rawData.length; rowNo++) {
    for (var key in rawData[rowNo]) {
      const column = columnMap[key];
      if (!(column === undefined)) {
        dataMatrix[rowNo][column] = rawData[rowNo][key];
      }
    }
  }

  return dataMatrix;
}

const fetchTableData = async (api_route, columns, columnMap, setTableData, setExtraData = null) => {
  try {
    const response = await fetch(api_route);
    const jsonData = await response.json();
    setTableData(generateTableData(jsonData["data"], columns, columnMap));

    if (!(setExtraData === undefined || setExtraData === null)) {
      let returnData = {};
      for (var key in jsonData) {
        if (key !== "data") returnData[key] = jsonData[key];
      }
      setExtraData(returnData);
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchButtonMatrix = async (api_route, buttonData, setButtonMatrix) => {
  try {
    const response = await fetch(api_route);
    const jsonData = await response.json();
    const rows = jsonData["data"].length;

    let buttonMatrix = [];
    for (let rowNo = 0; rowNo < rows; rowNo++) {
      buttonMatrix.push(buttonData);
    }

    setButtonMatrix(buttonMatrix);
  } catch (err) {
    console.log(err);
  }
};

exports.make2DArray = make2DArray;
exports.generateTableData = generateTableData;
exports.fetchTableData = fetchTableData;
exports.fetchButtonMatrix = fetchButtonMatrix;
