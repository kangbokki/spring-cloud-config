cost indent = 4;
const uppercase = true;
const PARAM = '{{PARAM}}';
const SUB_QUERY = '{{SUB_QUERY}}';
const arrOperator = ['+', '-', '/', '*', '='];
const arrNewLine = ['SELECT', 'FROM', 'WHERE', 'AND', 'ORDER BY', 'GROUP BY', 'INNER', 'LEFT'
                  , 'WHEN', 'ELSE', 'END', 'UNION ALL', 'INSERT INTO', 'UPDATE', 'DELETE', 'SET', 'VALUES', 'LIMIT'];

const getParentisParser = function (data = '') {
  const arrParentisData = [];
  const arrLeftparentis = [];
  const arrRightParentis = [];
  const arrParentis = [];
  const parentisPoint = [];
  
  data.split('').forEach((el, idx) => {
    if ( el == '(' ) {
      arrParentis.push({left: idx});
      
      parentisPoint.push(arrParentis.length -1);
    } else if ( el == ')' ) {
      arrParentis[parentisPoint.pop()].right = idx;
    }
  });
  
  arrParentis.forEach(el => {
    if ( el.left + 1 == el.right ) {
      return;
    }
    
    arrParentisData.push(data.substring(el.left, el.right +1));
  });
  
  arrParentisData.forEach((el, idx, arr) => {
    if ( arrParentisData.length > (idx + 1) ) {
      arr[idx] = el.replace(arr[idx + 1], SUB_QUERY);
    }
  });
  
  console.log(arrParentisData);
  
  return {parentis: arrParentis, parentisData: arrParentisData};
)

const getQuoteParser = function (data = '') {
  const arrQuoteData = [];
  const arrQuote = [];
  
  data.split('').forEach((el, idx) => {
    if ( el == "'" ) {
      arrQuote.push(idx);
    }
  });
  
  if ( arrQuote.length % 2 != 0 ) {
    console.log('짝 안 맞음');
  }

  for (let i = 0; i < arrQuote.length; i += 2) {
    if ( arrQuote[i] + 1 == arrQuote[i]) {
      continue;
    }
    
    arrQuoteData.push(data.substring(arrQuote[i], arrQuote[i + 1] + 1));
  }
  
  return arrQuoteData; 
}

const replaceData = function (data = '') {
  let tmpData = data.replace(/\t/gi, ' ').replace(/\r/gi, '').replace(/\n/gi, '');
  
  arrOperator.forEach(el => {
    tmpData = tmpData.replace(new ReqExp(`\\${el}`, 'gi'), ` ${el} `);
  });
  
  arrNewLine.forEach(el => {
    tmpData = tmpData.replace(new ReqExp(` ${el} `, 'gi'), `\n${el} `);
  });
  
  tmpData = tmpData.replace(/\s{1,},/gi, ',')
                   .replace(/\( {1,}/gi, '(')
                   .replace(/ {1,}\)/gi, ')')
                   .replace(/\|\|/gi, ' || ')
                   .replace(/\&\&/gi, ' && ')
                   .replace(/,/gi, '\n, ')
                   .replace(/ {1,}/gi, ' ')
                   .replace(/ {1,}\n/gi, '\n')
                   .replace(/\(SELECT/gi, '(SELECT')
                   .toUpperCase();

  tmpData = tmpData.split('\n').map(el => {
    const colIdx = el.indexOf(' ');
    
    return ''.padStart(6 - colIdx, ' ') + el;
  }).join('\n');
  
  return tmpData.trim();
}


function () {
  const orgData = '원본데이타';
  const data = orgData;
  let replaceData = data;
  
  const arrParamQuote = getQuoteParser(replaceData);
  
  arrParamQuote.forEach(el => {
    replaceData = replaceData.replace(el, PARAM);
  });
  
  const parentis = getParentisParser(data);
  
  parentis.parentisData.reverse().forEach(el => {
    replaceData = replaceData.replace(el, SUB_QUERY);
  });
  
  replaceData = replaceData(replaceData);
  
  console.log(String(replaceData));
  
  parentis.parentisData.forEach((el, idx, arr) => {
    arr[idx] = replaceData(arr[idx]);
    
    const arrQuote = getQuoteParser(el);
    
    arrQuote.forEach(subEl => {
      arr[idx] = el.replace(subEl, PARAM);
    });
    
    arrQuote.forEach(subEl => {
      arr[idx] = arr[idx].replace(PARAM, subEl);
    });
  });
  
  console.log(parentis);
  
  parentis.applyParentis = [];
  parentis.parentisData.reverse();
  
  while (parentis.parentisData.length) {
    let val = parentis.parentisData.pop();
    
    if ( val.indexOf(SUB_QUERY) > -1 ) {
      val = val.replace(SUB_QUERY, parentis.applyParentis.pop());
    }
    
    parentis.applyParentis.push(val);
  }
  
  parentis.applyParentis.reverse();
  
  console.log('조립');
  console.log(parentis.applyParentis);
  
  parentis.applyParentis.forEach(el => {
    replaceData = replaceData.replace(SUB_QUERY, el);
  });
  
  arrParamQuote.forEach(el =>  {
    replaceData = replaceData.replace(PARAM, el);
  ));
  
  console.log(replaceData);
}










