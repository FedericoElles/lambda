var request = require('request');


exports.familynavi_temp = function(context, data){
  var options = {
    url: 'https://spreadsheets.google.com/feeds/list/0Am4JLs1yjIildFNWRUVialVJVktyQnQtMG5BSGtXRUE/1/public/values?alt=json'
  }
  
  if (process.env.proxystr) {
    options.proxy = process.env.proxystr;
  }
  
  
	request(options, function(error, response, body) {
    var json  = JSON.parse(body);
    var newJson = [];
    var rec;
    var newRec;
    var categories = {};
    var categoryList;
    var titleArray;
    var version = '0.0';
    
    try {
      titleArray = json.feed.title.$t.split('#');
      titleArray.forEach(function(part){
        if (part[0] === 'v'){
          version = part.substr(1);
        }
      });
    } catch (err){
      version = '-1';
    }
    
    function fixCaption(title){
      switch (title) {
        case 'Cafe':
          return 'Café';
          break;
        case 'Stillmoeglichkeit':
          return 'Stillmöglichkeit';
          break;      
        case 'Buecherei':
          return 'Bücherei';
          break;              
        default:
          return title;
          break;
      }
    }
    
    
    for (var i = json.feed.entry.length - 1; i >= 0; i--) {
      rec = json.feed.entry[i];
      newRec = {};
      for (var x in rec){
        if (x.substr(0,4) === 'gsx$'){

          if (rec[x]['$t']){
            //console.log(x.substr(4), rec[x]['$t']);
            newRec[x.substr(4)] = rec[x]['$t'];
          }
        }
        //console.log('newRec', newRec);
      }

      if (newRec.textopen){
        newRec.textopen = newRec.textopen.replace(/\s{2,}/g, ' ');
        newRec.textopen = newRec.textopen.replace(/und /g, 'und\n');
        ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'].forEach(function(day){
           newRec.textopen = newRec.textopen.replace(new RegExp(day+' ', 'gm'), day+'\n');
        });
      }


      if (newRec.category){
        categoryList = newRec.category.split('/');
        for (var j = 0, jj = categoryList.length;j<jj;j+=1){
          if (categories[categoryList[j]]){
            categories[categoryList[j]].count += 1; 
          } else {
            categories[categoryList[j]] = {
              count: 1,
              caption: fixCaption(categoryList[j])
            };
          }
        }
        newJson.push(newRec); 
      }
    };

    var resp = {
      status: 'update',
      version: version,
      pois: newJson,
      categories: categories
    };
	  context.success(JSON.stringify(resp));
  });
};
