//mongoose.connect('mongodb://uhasoshxfidsfm3:VWT69vaueZBwHL7sO0jZ@brynr3osgrcc1g5-mongodb.services.clever-cloud.com:27017/brynr3osgrcc1g5');
const port = process.env.port || 443;                                                   // porta a escutar

module.exports = {                                                                      // Ao exportar os 
                                                                                        // objectos estamos a 
                                                                                        // permitir que estes
                                                                                        // sejam usados dentro 
                                                                                        // de outros ficheiros
                                                                                        // usando o 
                                                                                        // require('./config');
                                                                                        
  'url' : 'mongodb://Goldenheaven:sdistribuidos@ds062919.mlab.com:62919/futebol',       // url do mlab
  'port' : port,                                                                        // porta a escutar
  'ip': '13.81.108.99',                                                               // ip do azure
  'clientSecret': '_Vku0atp3Bm9W9AZg-p4bWzDx2AEnlZ1vcFut6ZBhhdkjihyB6uoBR3CMQlu6OOX'    // segredo do auth0
};