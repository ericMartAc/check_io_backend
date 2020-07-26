eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {

		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var correo =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

        //{"r":"recover_user","d":["carlos@gmail.com"]}
                                      //correo

		if (arrays.length==1){

			if(correo.test(arrays[0]) ){

                redisClient.get('usuarios_'+arrays[0],function(err2,reply2){

                    if(reply2!==null){
                        var todo = JSON.parse(reply2);
                        const sgMail = require('@sendgrid/mail');
                        sgMail.setApiKey("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");
                        const msg = {
                          to: todo.email,
                          from: 'contacto@fundacioncibei.org',
                          subject: 'Olvido su contraseña en Cibei?',
                          html: '<br><div align="center"> <img src="https://fundacioncibei.org/wp-content/uploads/2013/11/cibei_nuevo_logo_351x96.png"> <br><br> <h2>Su contraseña actual es: <strong>'+todo.password+'</strong></h2> </div>',
                        };
                        sgMail.send(msg);
                        resolve([true,true]);
                    }else{
                        reject([false,"5"]);
                        //{"e":true,"d":[false,"5"]}
                        //no existe usuario
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

