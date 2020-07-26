eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {


        //{"r":"read_user","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiY2FybG9zQGdtYWlsLmNvbSIsImQiOiIwIiwiaWF0IjoxNTg0Njc0OTU0LCJleHAiOjE1ODQ3MTgxNTR9.28QYei47tj1D5N9mS9iFAZuSwHgZBijdT6NlzPMoG1U"]}
                                 //token

		if (arrays.length==1){


            var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
                     //{"e":true,"d":[false,"1"]}
                     //no tiene token
				}else{

                    redisClient.get('usuarios_'+decoded.i,function(err2,reply2){
                        var todo = JSON.parse(reply2);

                        if(decoded.i == todo.email || decoded.d=="1"){

                            resolve([true,todo]);
                                //{"e":false,"d":[true,{"username":"netingbeta","password":"800ca200","email":"carlos@gmail.com","id":"J4F635","fecha":"2020-03-19 22:53:24"}]}
                                //todo bien

                        }else{
                            reject([false,"4"]);
                             //{"e":true,"d":[false,"4"]}
                             //no tiene permiso o no eres administrador
                        }

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

