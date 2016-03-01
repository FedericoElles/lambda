
var hello_world = require('./hello_world/index.js');
var libelle_news = require('./libelle_news/index.js');
var fetch_from_ftp = require('./fetch_from_ftp/index.js');

exports.uuid = hello_world.uuid;
exports.libelle_news = libelle_news.libelle_news;
exports.fetch_from_ftp = fetch_from_ftp.fetch_from_ftp;
