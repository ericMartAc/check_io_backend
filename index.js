const { isNull } = require('util');

try { //autenticación redis
	/* CAMBIO DE REDIS
	//host: 'redis-19602.c1.us-central1-2.gce.cloud.redislabs.com', port: 19602, ba7gSdvf6atVezpQ3lDyXCqyUzVdEtcM
	var redis = require('redis'), redisClient = redis.createClient({ host: 'localhost', port: 6379 });
	redisClient.auth('', function (err, reply) { //ejecutar todo sólo si existe autenticación de redis
	*/

	var redis = require('redis'), redisClient = redis.createClient({ host: 'redis-19602.c1.us-central1-2.gce.cloud.redislabs.com', port: 19602 });
	redisClient.auth('ba7gSdvf6atVezpQ3lDyXCqyUzVdEtcM', function (err, reply) { //ejecutar todo sólo si existe autenticación de redis

		if (!err) { //proceder a conectar
			try {
				redisClient.on('ready', function () {
					console.log("conectado a redis");

					try {//PROCESANDO SERVIDOR

						//asignación para servidor websocket
						var WebSocketServer = require("ws").Server,
							http = require("http"),
							express = require("express"),
							app = express(),
							port = process.env.PORT || 5000;//puerto de escucha, default el que asigne el host

						//levantando servidor
						var server = http.createServer(app);
						server.listen(port, () => {
							console.log('server on port: ', port)
						});

						//web socket del servidor para la comunicación externa
						var wss = new WebSocketServer({ server })

						//opciones de protección de comunicación
						wss.options.maxPayload = 512 * 1024;
						wss.options.server.timeout = 120000;
						wss.options.server.keepAliveTimeout = 5000;

						try {//realizar conexión de web socket
							wss.on("connection", function (ws, req) {//cuando se establezca conexión -->
								ws.on('message', function incoming(data2) {
									try {
										var text = JSON.parse(data2); //convertir a JSON
										console.log('proceso a ejecutar: ', text.r);

										if (text.r == 'comprobar_enRedis') {
											let arr_card = [];

											console.log('paquete a procesar: ', text.d);
											//recoger numero limpio y de valor numerico unicamente
											try {

												for (let index = 0; index < text.c; index++) {

													//numero de cada linea para enviar a procesar
													let dato = text.d[index][0] + text.d[index][1] + text.d[index][2] + text.d[index][3] +
														text.d[index][4] + text.d[index][5] + text.d[index][6] + text.d[index][7] +
														text.d[index][8] + text.d[index][9] + text.d[index][10] + text.d[index][11] +
														text.d[index][12] + text.d[index][13] + text.d[index][14] + text.d[index][15];

													if (!isNaN(parseInt(dato))) {
														arr_card.push(dato)//agregamos cada numero de tarjeta (solo si es numero) al arreglo
													} else {
														console.log('valor ingresado es de tipo: ', typeof (dato_num));
													}
												}
											} catch (error) {
												console.log('capturados errores')
											}
											for (let index = 0; index < arr_card.length/*6*/; index++) {
												setTimeout(() => {

													//verificar estado consultado
													try {//consultar tarjeta en redis
														redisClient.exists(arr_card[index], function (err, reply) {
															if (reply == 1) {//si estado en redis es existente
																redisClient.get(arr_card[index], (err, reply) => {
																	if (err) {
																		console.log('error en consulta')
																	}
																	if (!err) {
																		// existente BIN/IIN o no existente BIN/IIN 
																		let res = {
																			a: text.d[index],
																			b: reply,
																			h: "consultado previo"
																		}
																		ws.send(JSON.stringify(res));// retorna al cliente	
																		console.log(arr_card[index], ' en redis como: ', reply);
																	}
																});
															} else {
																if (err) {
																	console.log('errorrrevrfv ')
																} else {

																	// inexistente en redis 0
																	let res = {
																		a: text.d[index],
																		b: reply,
																		h: "no consultado previo"
																	}
																	ws.send(JSON.stringify(res));// retorna al cliente	
																	console.log(arr_card[index], ' no existe en redis, respuesta: ', reply);
																}
															}
														})
													} catch (error) { console.log('error en consulta') }
												}, 200 * index);
											}

										}
										if (text.r == 'verificar_tarjeta_wSelenium') {
											try {
												console.log('recibiendo paquete: ', text)
												/*
												setTimeout(() => {
													console.log(text.d[0])
												}, 5000); 
												*/
												if (text.a == '' || isNull(text.a)) {
													console.log(text.a, ' is empty')
												} else {
													require('./modelos/selenium/verificar_tarjeta')(text, redisClient, ws)
												}
												
													

											} catch (error) {
												console.log('error consultando con selenium', error)
											}
										}
										if (text.r == 'verificar_tarjeta') {
											var arr_card = [];

											console.log('paquete a procesar: ', text.d);
											//recoger numero limpio y de valor numerico unicamente
											try {

												for (let index = 0; index < text.c; index++) {

													//numero de cada linea para enviar a procesar
													var dato = text.d[index][0] + text.d[index][1] + text.d[index][2] + text.d[index][3] +
														text.d[index][4] + text.d[index][5] + text.d[index][6] + text.d[index][7] +
														text.d[index][8] + text.d[index][9] + text.d[index][10] + text.d[index][11] +
														text.d[index][12] + text.d[index][13] + text.d[index][14] + text.d[index][15];

													if (!isNaN(parseInt(dato))) {
														arr_card.push(dato)//agregamos cada numero de tarjeta (solo si es numero) al arreglo
													} else {
														console.log('valor ingresado es de tipo: ', typeof (dato_num));
													}
												}
											} catch (error) {
												console.log(text, '----', error)
											}
											for (let index = 0; index < arr_card.length/*6*/; index++) {
												setTimeout(() => {

													//verificar estado consultado
													try {//consultar tarjeta en redis
														redisClient.exists(arr_card[index], function (err, reply) {
															if (reply == 1) {//si estado en redis es existente
																redisClient.get(arr_card[index], (err, reply) => {
																	if (err) {
																		console.log('errorrr')
																	}
																	if (!err) {

																		// existente BIN/IIN o no existente BIN/IIN 
																		let res = {
																			a: text.d[index],
																			b: reply,
																			h: "consultado previo"
																		}
																		ws.send(JSON.stringify(res));// retorna al cliente	
																		console.log(arr_card[index], ' en redis como: ', reply);
																	}
																});
															} else {
																if (err) {
																	console.log('errorrrevrfv ')
																} else {

																	// inexistente en redis 0
																	let res = {
																		a: text.d[index],
																		b: reply,
																		h: "no consultado previo"
																	}
																	ws.send(JSON.stringify(res));// retorna al cliente	
																	console.log(arr_card[index], ' no existe en redis, respuesta: ', reply);
																}
															}
															/*/si estado es inexistente en redis
																// valor no consultado es 0
																console.log('respuesta a ', arr_card[index], ': ', reply, 'procesando .....')
																//ws.send(reply);// retorna al cliente
																let pre = {
																	a: text.d[index],
																	b: arr_card[index],
																	c: text.c
																}
																try {
																	require('./modelos/selenium/verificar_tarjeta')(pre, redisClient, ws)
																} catch (error) {
																	console.log('no ejecutado verificacion')
																}*/
														})
													} catch (error) { console.log('error en consulta') }
												}, 200 * index);
											}

										}
										if (text.r == 'verificar_user' || text.r == 'create_user') {

											//enviamos a modelos según lo requerido(r)
											//con esto se define la función que requiere ejecutar
											var ejecucion = require('./modelos/' + text.r + '');

											//enviamos los datos recibidos y la coneción a redis
											//luego se asigna una info con el resultado
											//si se ejecuta devuelve falso error, si existe error asigana true a 'e'
											ejecucion(text.d, text.r, redisClient).then(function (info) {
												ws.send(JSON.stringify({ "e": false, "d": info }));
											}).catch(function (err) {
												ws.send(JSON.stringify({ "e": true, "d": err }));
											});
										}

									} catch (e) { ws.send(JSON.stringify({ "e": true, "d": e })); }//si existe error, devuelve el error

								});

							});
						} catch (error) { console.log('error en web socket') }

					} catch (error) { console.log('ERROR LEVANTANDO EL SERVIDOR', error) }
				});

				redisClient.on('error', function () {
					console.log("no conectado a redis: ", err);
				});
			} catch (error) { console.log('error intentando conexión: ', error) }
		} else { console.log('error en conexión: ', err); }
	});
} catch (error) { console.log('error en autenticación a redis') }





//componentes desactivadas
() => {//resetando contraseña administardor, desactivado por: no seguro aún
	/*
	app.get('/reset', function (req, res) {
		redisClient.set('adminadmin', JSON.stringify({ "password": "admin273564533" }), function (err2, reply2) {
			if (reply2) {
				console.log('restaurado user admin');
			} else {
				if(err2){
					console.log('no se pudo restaurar super usuario');
				}
			}
		});
		res.statusCode = 200;
		res.end('Reset active');
	});
	*/
}