let success = 0, fail = 0;

const checkStatus = (status) => {
    if(status === 'failure'){
        fail++;
        return'<tr class = "error">';
    }else{
        success++;
        return '<tr class = "success">';
    }
}

const convertTable = (() => {
    return (output) => {
        let css = '<link rel="stylesheet" href="style.css">';
        let html = '<table class="center">';
        html += '<caption>TEST RUN RESULTS</caption>';
        html += '<tr>';
        html += '<th>name</th><th>result</th><th>expected</th><th>actual</th>'
        html += '</tr>';
        for( let i = 0; i < output.length; i++) {
            html += checkStatus(output[i].result);
            html += `<td>${output[i].name}</td>`;
            html += `<td>${output[i].result || ""}</td>`;
            html += `<td>${output[i].expected || ""}</td>`;
            html += `<td>${output[i].actual || ""}</td>`;
            html += '</tr>';
        }
        html += '</table>';

        let consolidatedCount = '<h1>DASHBOARD FOR API TESTING RESULTS</h1>';
        consolidatedCount +=`<h2>Total test cases run :${output.length}</h2>`;
        consolidatedCount +=`<h3>Success count :${success} Failure count :${fail}</h3>`;
      
        return css + consolidatedCount +html; 
    };
})();

module.exports = convertTable;