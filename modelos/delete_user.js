eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {


        //{"r":"delete_user","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiY2FybG9zQGdtYWlsLmNvbSIsImQiOiIwIiwiaWF0IjoxNTg0NzY5NzA3LCJleHAiOjE1ODQ4MTI5MDd9.uP0_F73wg5CG3uEi6F51fSWLEV6z79aKT0PNy9VJ4-0","neto@gmail.com"]}
                                 //token

		if (arrays.length==2){

            var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
                     //{"e":true,"d":[false,"1"]}
                     //no tiene token
				}else{

                    redisClient.del('usuarios_'+arrays[1],function(err2,repl2){
                        console.log(err2,repl2);
                        resolve([true,true]);
                        //{"e":false,"d":[true,true]}
                        //todo bien

                    });

                }
            });

		}else{
			reject([false,"3"]);
            //{"e":true,"d":[false,"3"]}
            //faltan datos
		}
	});
};

module.exports = eje;

