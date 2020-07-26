module.exports = (pre, redisClient, ws) => {

    var t = parseInt(pre.card);
    if (t !== ' ' || t != '' || !isNaN(t) || !isNaN(t)) {
        console.log('ingresando: ', pre);

        console.log('consultando: ', t);

        //verificar estado consultado

        //--------asignaciones------------------------------------------------------------
        const { Builder, By, Key, until, promise } = require('selenium-webdriver');
        const { Storage } = require('@google-cloud/storage');
        const fs = require('fs');
        const path = require('path');

        const serviceAccount = path.join(__dirname, "../firebase/ctimbi-db-firebase-adminsdk-ruro0-04cf0e8885.json");
        const bucketName = 'gs://ctimbi-db.appspot.com';
        const fileName = 'C:/Users/Eric Martinez/Documents/Menco/checker timbi/checker-backend/miscelaneos/evidencias/' + t + '.png';

        //asignacion base de datos google
        var storageDB = new Storage({
            projectId: 'ctimbi-db',
            keyFilename: serviceAccount
        });

        // personalización de la carga google
        const opcionesUpLoadFileDB = {
            resumable: true,

            validation: 'crc32c'
        };

        //-------final de asignaciones-----------------------------------------------------

        //consultando con selenium

        const driver = new Builder().forBrowser('chrome').build();

        driver.get("https://bincheck.io/");
        driver.manage().window().setRect(1382, 744);
        driver.findElement(By.id("bin")).click();
        driver.findElement(By.id("bin")).sendKeys(t);
        driver.findElement(By.css(".btn-primary")).click();
        driver.executeScript("window.scrollTo(0,890)");
        console.log('consultado')


        //dectando si existen en seleniun
        setTimeout(() => {

            try {//detectando success
                driver.findElement(By.css(".alert-success")).then(function (webElement) {
                    //almacenando en redis
                    try {
                        //obteniendo fecha
                        let fecha = new Date();
                        let dia = fecha.getDay();
                        let mes = fecha.getMonth();
                        let año = fecha.getFullYear();

                        //valores a almacenar
                        let dateQ = dia + '/' + mes + '/' + año;
                        let card = pre.a;
                        let v = "existente BIN/IIN";
                        let marca = '';
                        let tipo = '';
                        let nivel = '';
                        let banco = '';
                        let pais = '';
                        let detalle = '';

                        let dato = {//paquete a almacenar en redis
                            card, // todo dato tarjeta
                            v, //valor de tarjeta
                            marca,
                            tipo,
                            nivel,
                            banco,
                            pais,
                            detalle,
                            dateQ
                        };

                        redisClient.set(t, JSON.stringify(dato));//almacenando en redis

                        ws.send(JSON.stringify(dato));//retorno a clientess
                        driver.quit();//cerrando driver selenium
                        console.log('almacenado en redis ', dato);
                    } catch (error) { console.log('error en almacenamiento ', t, ': ', error); }

                    //realizando captura de selenium
                    try {
                        driver.findElement(By.css(".col-lg-7")).takeScreenshot().then(function (data) {
                            //almacenando imagen en firebase
                            fs.writeFile(fileName, data, 'base64', function (err) {
                                if (!err) {//si la captura se efectúa
                                    try {
                                        //almacenar captura en firebase
                                        storageDB.bucket(bucketName).upload(fileName, {
                                            gzip: true,
                                            metadata: {
                                                cacheControl: 'public, max-age=31536000',
                                            },
                                        });
                                        driver.quit();
                                    } catch (error) { console.log("error almacenando captura: ", error); driver.quit(); }
                                } else { console.log("error en captura: ", err); driver.quit(); }
                            });
                        });

                    } catch (error) { console.log("error, captura no realizada!!! "); driver.quit(); }

                }, function (err) {////BIN/IIN no encontrado
                    if (err.state && err.state === 'no such element') {//no existe 
                        console.log('BIN/IIN no encontrado');
                    }
                    //detectando alert-danger

                    try {
                        driver.findElement(By.css(".alert-danger")).then(function (webElement) {
                            console.log('proceso almacenar como no existente BIN/IIN....')
                            //almacenando en redis
                            try {
                                //obteniendo fecha
                                let fecha = new Date();
                                let dia = fecha.getDay();
                                let mes = fecha.getMonth();
                                let año = fecha.getFullYear();

                                //valores a almacenar
                                let dateQ = dia + '/' + mes + '/' + año;
                                let card = pre.a;
                                let v = "no existente BIN/IIN";
                                let marca = '';
                                let tipo = '';
                                let nivel = '';
                                let banco = '';
                                let pais = '';
                                let detalle = '';

                                let dato = {//paquete a almacenar en redis
                                    card, // todo dato tarjeta
                                    v, //valor de tarjeta
                                    marca,
                                    tipo,
                                    nivel,
                                    banco,
                                    pais,
                                    detalle,
                                    dateQ
                                };

                                redisClient.set(t, JSON.stringify(dato));//almacenando en redis

                                ws.send(JSON.stringify(dato));//retorno a cliente
                                driver.quit();//cerrando driver selenium
                                console.log('almacenado en redis ', dato, t, ': ', dato.v);
                            } catch (error) { console.log('error en almacenatr ', t, ' : --> ', error); driver.quit(); }

                        }, function (err) {//capturando error de detección
                            if (err.state && err.state === 'no such element') {//no existe 
                                console.log('Element not found'); driver.quit();
                            } else {
                                console.log('error de consulta: ', err); driver.quit();
                            }//error en proceso
                        });

                    } catch (error) { console.log("error interno, danger no encontrado"); driver.quit(); };
                })
            } catch (error) { //BIN/IIN no encontrado
                try {//detectando alert-danger
                    driver.findElement(By.css(".alert-danger")).then(function (webElement) {
                        console.log('proceso almacenar como no existente BIN/IIN....')
                        //almacenando en redis
                        try {
                            //obteniendo fecha
                            let fecha = new Date();
                            let dia = fecha.getDay();
                            let mes = fecha.getMonth();
                            let año = fecha.getFullYear();

                            //valores a almacenar
                            let dateQ = dia + '/' + mes + '/' + año;
                            let card = pre.a;
                            let v = "no existente BIN/IIN";
                            let marca = '';
                            let tipo = '';
                            let nivel = '';
                            let banco = '';
                            let pais = '';
                            let detalle = '';

                            let dato = {//paquete a almacenar en redis
                                card, // todo dato tarjeta
                                v, //valor de tarjeta
                                marca,
                                tipo,
                                nivel,
                                banco,
                                pais,
                                detalle,
                                dateQ
                            };

                            redisClient.set(t, JSON.stringify(dato));//almacenando en redis

                            ws.send(JSON.stringify(dato));//retorno a cliente
                            driver.quit();//cerrando driver selenium
                            console.log('almacenado en redis ', dato, t, ': ', dato.v);
                        } catch (error) { console.log('error en almacenatr ', t); driver.quit(); }

                    }, function (err) {//capturando error de detección
                        if (err.state && err.state === 'no such element') {//no existe 
                            console.log('Element not found'); driver.quit();
                        } else {
                            console.log('error de consulta: ', err); driver.quit();
                        }//error en proceso
                    });

                } catch (error) { console.log("error interno, danger no encontrado"); driver.quit(); };
            };

        }, 10000);

    }

}