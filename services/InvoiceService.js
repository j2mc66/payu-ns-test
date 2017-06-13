/**
 * Created by USER on 13/04/2017.
 */



var invoices = [];
var referencia = 0;


module.exports.createInvoice = function (req, res) {
	referencia = referencia + 1;
    var dateFormat = require('dateformat');
	var now = new Date();

	
    var invoice =  { cliente: req.body.cliente, products: req.body.products, referencia: referencia, date: dateFormat(now, "isoDateTime")};

    invoices.push(invoice);

    var invoicesByClient = [];

    for(var i = 0 ;  i < invoices.length; i++){
        if(  invoices[i].cliente == req.body.cliente){
            invoicesByClient.push(invoices[i]);
        }
    }
    var data = {last: invoice, invoices: invoicesByClient }
    
    console.log("Body " + req.body);
    console.log("Invoices" + invoices);
    console.log("data" + data);

    //TODO send the data of the invoice as answer
    res.status(200).jsonp(data);

};

module.exports.printInvoice = function (req, res) {
	/*ar fs = require('fs');
	var pdf = require('html-pdf');
	var html = fs.readFileSync('/invoice.html', 'utf8');
	var options = { format: 'Letter' };
	 
	pdf.create(html, options).toFile('/invoice.pdf', function(err, res) {
	  if (err) return console.log(err);
	  console.log(res); // { filename: '/app/businesscard.pdf' } */
	  res.status(200).jsonp("hola");
	//});
};
