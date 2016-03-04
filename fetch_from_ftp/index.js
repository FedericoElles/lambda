var Client = require('ftp');
//require('ssl-root-cas').inject();

exports.reqParams = ['user', 'pass', 'host', 'file'];

exports.fetch_from_ftp = function(context, data){
  console.log('fetch_from_ftp', data);

    var c = new Client();
    c.connect({
      host: data.host,
      user: data.user,
      password: data.pass,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false,
        checkServerIdentity: function(){
          return undefined;
        }
      }
    });
    
    c.on('ready', function() {
      c.get(data.file, function(err, stream) {
        if (err) {
          context.failure(err);
        };
        var str = '';
        stream.on('data', function(strPart){
          str += strPart;
        });
        stream.once('close', function() { 
          c.end(); 
          context.success(str);
        });
      });
    });
      
}
