eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {

		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var correo =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

        //{"r":"edit_user","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiY2FybG9zQGdtYWlsLmNvbSIsImQiOiIwIiwiaWF0IjoxNTg0Njc0OTU0LCJleHAiOjE1ODQ3MTgxNTR9.28QYei47tj1D5N9mS9iFAZuSwHgZBijdT6NlzPMoG1U","netingbeta","112442"]}
                                 //token                                                                                                                                                                    //username   //password

		if (arrays.length==3){


            var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
                     //{"e":true,"d":[false,"1"]}
                     //no tiene token
				}else{

                    if(coment.test(arrays[1]) && coment.test(arrays[2]) ){

                        if(decoded.d=="1"){

                            redisClient.get('usuarios_'+arrays[1],function(err2,reply2){
                                var todo = JSON.parse(reply2);
                                todo.password = arrays[2];
                                todo.username = arrays[2];

                                    redisClient.set('usuarios_'+arrays[1],JSON.stringify(todo),function(err2,repl2){
                                        resolve([true,true]);
                                        //{"e":false,"d":[true,true]}
                                        //todo bien

                                    });

                             });

                        }else{

                            redisClient.get('usuarios_'+decoded.i,function(err2,reply2){
                                var todo = JSON.parse(reply2);
                                todo.password = arrays[2];
                                todo.username = arrays[2];

                                if(decoded.i == todo.email){

                                    redisClient.set('usuarios_'+decoded.i,JSON.stringify(todo),function(err2,repl2){
                                        resolve([true,true]);
                                        //{"e":false,"d":[true,true]}
                                        //todo bien

                                    });

                                }else{
                                    reject([false,"4"]);
                                     //{"e":true,"d":[false,"4"]}
                                     //no tiene permiso o no eres administrador
                                }

                            });
                        }
                    }else{
				        reject([false,"2"]);
                        //{"e":true,"d":[false,"2"]}
                        //datos mal escritos
			        }

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

