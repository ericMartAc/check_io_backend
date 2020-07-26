eje = function(arrays,origen,redisClient) {
    return new Promise(function(resolve, reject) {

        //{"r":"login_admin","d":["admin","admin273564533"]}

        if (arrays.length===2){

            redisClient.get('admin'+arrays[0],function(err2,reply2){
                if(reply2!==null) {
                    var todo = JSON.parse(reply2);

                    if (todo.password == arrays[1]) {

                        var jwt = require('jsonwebtoken'),
                            token = jwt.sign({"i": arrays[0], "d": "1"}, 'clWve-G*-9)1', {expiresIn: 60 * 60 * 12});

                        resolve([true, token]);
                        //{"e":false,"d":[true,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiYWRtaW4iLCJkIjoiMSIsImlhdCI6MTU4ODM2NDUxOSwiZXhwIjoxNTg4NDA3NzE5fQ.L-NRj0TBW3OVTW3gCgElwfPZdJTfoSL_XFDNaNVtTlM"]}
                        //todo bien

                    } else {
                        reject([false, "7"]);
                        //{"e":true,"d":[false,"7"]}
                        //no tiene permiso o no eres administrador
                    }
                }else{
                    reject([false, "4"]);
                    //{"e":true,"d":[false,"4"]}
                    //no tiene permiso o no eres administrador
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

