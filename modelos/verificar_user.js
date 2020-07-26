eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {

		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var correo =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

        //{"r":"verificar_user","d":["carlos@gmail.com","800ca200"]}
                                      //correo         //password

		if (arrays.length==2){

			if(correo.test(arrays[0]) && coment.test(arrays[1]) ){

                redisClient.get('usuarios_'+arrays[0],function(err2,repoy2){
                    if(repoy2!==null){

                        var todo = JSON.parse(repoy2);
                        if(todo.password==arrays[1]){
                            var jwt = require('jsonwebtoken'),token = jwt.sign({"i":arrays[0],"d":"0"},'clWve-G*-9)1',{ expiresIn: 60 * 60 * 12 });
                           resolve([true,todo,token]);
                            //{"e":false,"d":[true,{"username":"netingbeta","password":"800ca200","email":"carlos@gmail.com","id":"J76A22","fecha":"2020-03-19 22:29:14"},"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiY2FybG9zQGdtYWlsLmNvbSIsImQiOiIwIiwiaWF0IjoxNTg0Njc0OTU0LCJleHAiOjE1ODQ3MTgxNTR9.28QYei47tj1D5N9mS9iFAZuSwHgZBijdT6NlzPMoG1U"]}
                        }else{
                            reject([false,"8"]);
                            //{"e":true,"d":[false,"8"]}
                            //constraseña invalida
                        }


                    }else{
                        reject([false,"7"]);
                        //{"e":true,"d":[false,"7"]}
                        //ya esta registrado
                    }
                });



			}else{
				reject([false,"2"]);
                //{"e":true,"d":[false,"2"]}
                //datos mal escritos
			}

		}else{
			reject([false,"3"]);
            //{"e":true,"d":[false,"3"]}
            //faltan datos
		}
	});
};

module.exports = eje;

