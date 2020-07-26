eje = function(arrays,origen,redisClient) {
    return new Promise(function(resolve, reject) {


        //{"r":"change_admin","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiYWRtaW4iLCJkIjoiMSIsImlhdCI6MTU4ODM2NDUxOSwiZXhwIjoxNTg4NDA3NzE5fQ.L-NRj0TBW3OVTW3gCgElwfPZdJTfoSL_XFDNaNVtTlM","admin273564533","19210511"]}
        //token

        if (arrays.length==3){

            var jwt = require('jsonwebtoken');
            jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
                if (err) {
                    reject([false,"1"]);
                    //{"e":true,"d":[false,"1"]}
                    //no tiene token
                }else{

                    redisClient.get('adminadmin',function(err2,reply2){
                        var todo = JSON.parse(reply2);

                        if(arrays[1] == todo.password){

                            redisClient.set('adminadmin',JSON.stringify({"password":arrays[2]}),function(err2,reply2){

                                resolve([true,true]);
                                //{"e":false,"d":[true,true}]}
                                //todo bien

                            });

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

