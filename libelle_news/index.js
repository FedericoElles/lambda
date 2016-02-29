var http = require('http');
var cheerio = require('cheerio');


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getData(callback) {
	var host = "www.libelle-magazin.de";
	var options = {
		host: host
	};
		
	if (process.env.HTTP_PROXY) {
		options = {
			host: process.env.HTTP_PROXY.split(':')[0],
			port: parseInt(process.env.HTTP_PROXY.split(':')[1],10),
			headers: {
				Host: host
			}
		}
    }

    return http.get(options, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(extractor(body));
        });
    });

};

function extractor(data){
	var r= {
		date: new Date(),
		status: 'OK',
		news: []
	};
	
	$ = cheerio.load(data);
	
	
	$('h1,h3').each(function(i, elem) {
		var prefix = 'http://www.libelle-magazin.de/';
		var newsItem = {
			link: prefix+$(this).children().first().attr('href'),
			title: $(this).children().first().text(),
			desc: $(this).siblings('p.teaser').text(),
			img: prefix+($(this).siblings('div.image_container').children('img').first().attr('src') || $(this).siblings('div.image_container').children('a').children('img').first().attr('src'))
		};
		console.log(
			'elem',
			 $(this).siblings('div.image_container').children('img').first().attr('src') || $(this).siblings('div.image_container').children('a').children('img').first().attr('src')
		);
		if (newsItem.desc && newsItem.link && newsItem.title){
			newsItem.hash = newsItem.link.hashCode();
			r.news.push(newsItem);
		}
	});

	return r;
}

if (!module.parent) {
	getData(function(data){
		http.createServer(function (req, res) {
		res.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods' : 'GET',
			'Access-Control-Allow-Headers' : 'Content-Type'
		});
		res.end(JSON.stringify(data,undefined,2));
		}).listen(process.env.PORT || 4000);
	});
else {
	exports = function(){
		getData(function(data){
			context.success(data);	
		});
	};
}
