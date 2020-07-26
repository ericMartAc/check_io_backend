eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {


        //{"r":"all_user","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiY2FybG9zQGdtYWlsLmNvbSIsImQiOiIwIiwiaWF0IjoxNTg0Njc0OTU0LCJleHAiOjE1ODQ3MTgxNTR9.28QYei47tj1D5N9mS9iFAZuSwHgZBijdT6NlzPMoG1U"]}
                                 //token

		if (arrays.length==1){


            var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
                     //{"e":true,"d":[false,"1"]}
                     //no tiene token
				}else{


                    if(decoded.d=="1"){

                        redisClient.keys('usuarios_*',function(err2,rely2){

                            var datos = [];
                            function mostrar(arras,indice){
                                if(arras.length==indice){
                                    resolve([true,datos]);

                                    //{"e":false,"d":[true,[{"username":"netingbeta","password":"","email":"carlos@gmail.com","id":"J4F635","fecha":"2020-03-19 22:53:24"},{"username":"netingbeta","password":"","email":"carlosgmail.com","id":"JFBB0A","fecha":"2020-03-19 22:21:10"}]]}

                                }else{

                                    redisClient.get(arras[indice],function(err2,resly2){
                                        var tido = JSON.parse(resly2);
                                        tido.password = "";
                                        datos.push(tido);
                                        indice++;
                                        mostrar(arras,indice);
                                    });
                                }
                            }

                            mostrar(rely2,0);
                        });

                    }else{

                        redisClient.get('usuarios_'+decoded.i,function(err2,reply2){

                            if(reply2!==null){

                                redisClient.keys('usuarios_*',function(err2,rely2){

                                    var datos = [];
                                    function mostrar(arras,indice){
                                        if(arras.length==indice){
                                            resolve([true,datos]);

                                            //{"e":false,"d":[true,[{"username":"netingbeta","password":"","email":"carlos@gmail.com","id":"J4F635","fecha":"2020-03-19 22:53:24"},{"username":"netingbeta","password":"","email":"carlosgmail.com","id":"JFBB0A","fecha":"2020-03-19 22:21:10"}]]}

                                        }else{

                                            redisClient.get(arras[indice],function(err2,resly2){
                                                var tido = JSON.parse(resly2);
                                                tido.password = "";
                                                datos.push(tido);
                                                indice++;
                                                mostrar(arras,indice);
                                            });
                                        }
                                    }

                                    mostrar(rely2,0);
                                });

                            }else{
                               resolve([true,[]]);
                            }

                        });

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

