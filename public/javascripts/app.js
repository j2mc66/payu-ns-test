/**
 * Created by USER
 */


(function(){

    var myApp =  angular.module("GeekStore", []);

    //controllers

    myApp.controller("ProductsController" , ProductsController);

    ProductsController.$inject = ['$scope' , '$http'];
    function ProductsController($scope, $http) {
        var articles = [];
        $scope.cliente = "";
        $scope.invoices = [];
        $scope.invoice = "";
        $scope.invoiceProducts = [];
        $scope.products = [];
        $scope.referencia = 0;
        var URL = "/api/matrix";
        $scope.product = "";
        $scope.quantity = 0;
        $scope.value = 0;

        $scope.message = "Usted no ha realizado ninguna compra aún";

        articles.push(  {name: "Maestro Yoda", value: 75000 , coin: "COP", exchange: 1 });
        articles.push(  {name: "Sable laser de plástico", value: 35.00, coin: "USD", exchange: 3000});
        articles.push(  {name: "Nave espacial Halcón Milenario", value: 125000, coin:"COP", exchange: 1});
        articles.push(  {name: "Estrella de la muerte", value: 200.00, coin:"USD", exchange: 3000});
        articles.push(  {name: "R2D2 en fichas de Lego", value: 450, coin: "MXN", exchange: 2000});
        articles.push(  {name: "Jar Jar Binks Gobernador", value: 800, coin: "MXN", exchange: 2000});

        $scope.addProduct =  function(){

            for(var i = 0 ;  i < articles.length; i++){
                if(  articles[i].name == $scope.product){
                    var item = articles[i];            
                    var quantity = $scope.quantity;
                    var iva = item.value * item.exchange * 0.19;
                    var value = item.value * item.exchange;
                    var total = quantity * value * 1.19;
                    $scope.products.push(  {name: item.name, quantity: quantity, value: value, iva: iva, total: total });
                }
            }

            //$scope.products.push(  {name: $scope.product, quantity: $scope.quantity, value: 0 });         

            $scope.product = "";
            $scope.quantity = 0;
            $scope.value = 0;

        };


        $scope.removeProduct =  function(productName){
            for(var i = 0 ;  i < $scope.products.length; i++){
                if(  $scope.products[i].name == productName){
                    $scope.products.splice(i, 1);
                }
            }
        };

        $scope.buyProducts =  function(){
            
            $scope.invoice = "";            
            var URL = "/api/invoice";
            var jsondata =  {cliente: $scope.cliente, products: $scope.products };

            $http.post(URL, jsondata).
            success(function(data, status, headers, config) {
                $scope.products = [];
                $scope.invoice = data.last;
                $scope.invoiceProducts = data.last.products;
                $scope.invoices = data.invoices;

                $scope.cliente = "";

            }).
            error(function(data, status, headers, config) {
                console.log("Error " + data + " " + status);
                $scope.message = "There was an error creating the matrix";
            });
        };

        $scope.printInvoice = function (uuid){
            var dataInvoice = $scope.invoice;
            var docDefinition = {
                  content: [
                    {text: 'Factura de Venta No: ' + dataInvoice.referencia},
                    {text: 'Cliente: '+ dataInvoice.cliente},
                    table(JSON.parse(angular.toJson($scope.invoiceProducts)), ['name','quantity', 'value', 'iva','total'])
                  ],
                  styles: {
                    header: {
                      bold: true,
                      color: '#000',
                      fontSize: 11
                    },
                    demoTable: {
                      color: '#666',
                      fontSize: 10
                    }
                  }
                };


              pdfMake.createPdf(docDefinition).open();
            

            
        };

        $scope.downloadPdf = function() {
            $pdfMake.createPdf(docDefinition).download();
        };

        function table(data, columns) {
            return {
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns)
                }
            };
        }

    }

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
            var dataRow = [];

            columns.forEach(function(column) {
                dataRow.push(row[column] =="" || row[column] == null || row[column] == undefined ? "casa": row[column].toString());
            })

            body.push(dataRow);
        });

        return body;
    }


})();