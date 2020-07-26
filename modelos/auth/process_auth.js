module.exports = (email, psw) => {
    try { //autenticación redis
        var redis = require('redis'), redisClient = redis.createClient({ host: 'redis-19602.c1.us-central1-2.gce.cloud.redislabs.com', port: 19602 });
        redisClient.auth('ba7gSdvf6atVezpQ3lDyXCqyUzVdEtcM', function (err, reply) { //ejecutar todo sólo si existe autenticación de redis
            if (!err) { //proceder a conectar
                try {
                    redisClient.on('ready', function () {
                        console.log("conectado a redis");

                    });

                    redisClient.on('error', function () {
                        console.log("no conectado a redis: ", err);
                    });
                } catch (error) { console.log('error intentando conexión: ', error) }
            } else { console.log('error en conexión: ', err); }
        });
    } catch (error) { console.log('error en autenticación a redis') }

}