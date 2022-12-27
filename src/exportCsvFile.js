const createCsvWriter = require('csv-writer').createObjectCsvWriter

async function exportCsv(data){
    const newFileName = Date.now() + Math.round(Math.random()*1000)+".csv";
    const csvWriter = createCsvWriter({
        path: './public/csv/'+ newFileName ,
        header: [
            {id: 'username', title: 'Username'},
            {id: 'avartar', title: 'Image'},
            {id: 'date', title: 'Date'},
            {id: 'review', title: 'Review'},
            {id: 'vote', title: 'Vote'},
        ]
    });
    
    csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
        console.log('The CSV file was written successfully');
    });
}

module.exports = exportCsv
