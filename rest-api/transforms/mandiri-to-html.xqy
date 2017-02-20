xquery version "1.0-ml";
module namespace mandiriToHtml =
  "http://marklogic.com/rest-api/transform/mandiri-to-html";

import module namespace json = "http://marklogic.com/xdmp/json"
    at "/MarkLogic/json/json.xqy";

declare namespace ns = "http://bankmandiri.co.id/ml";
	
declare function mandiriToHtml:transform(
        $context as map:map,
        $params as map:map,
        $content as document-node()
) as document-node()
{

    if (fn:empty($content/*))
    then
        $content
    else
        let $_ := xdmp:log(concat("testing....", map:get($context,"uri")))
        let $uri := map:get($context, 'uri')
		(:
        let $xsl_file := concat('/', fn:tokenize($uri,'/')[2],'-html-output.xsl')
        let $_ := xdmp:log(concat("xsl file: ", $xsl_file))
		:)
		
        let $data := $content/node()
        let $_ := xdmp:log('>>>>>>>>>> data is: ')
        let $_ := xdmp:log($data)
		
		(: let $doc_custcc := fn:doc('/mandiri-custcc/WebLogic_Customer_CCdev/000000_0-0-1.json') :)
		let $doc_custcc := $data (: fn:doc('/mandiri-custcc/WebLogic_Customer_CCdev/000000_0-0-1.json') :)
		let $doc_edctrans := fn:collection('mandiri-edctrans')['Mid'="6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"]
		let $doc_transcc := fn:collection('mandiri-transcc')[credit_card_no = $doc_custcc/credit_card_no]
		let $obj := object-node { 
		  'account_cust_name' : $doc_custcc/CustomerName
		 ,'cust_class' : $doc_custcc/CustomerClass
		 ,'account_no' : $doc_custcc/NoRekCustomer
		 ,'country' : $doc_custcc/Country
		 ,'city' : $doc_custcc/City
		 ,'region' : $doc_custcc/Region
		 ,'age' : $doc_custcc/Umur
		 ,'category' : $doc_custcc/Category
		 ,'product_type' : $doc_custcc/TipeProduct
		 ,'trans_per_month' : $doc_custcc/TransPerMonth
		 ,'balance' : $doc_custcc/Balance
		 ,'salary' : $doc_custcc/SalaryPerMonth
		 ,'kids' : $doc_custcc/Kids
		 ,'houses' : $doc_custcc/Houses
		 ,'vehicles' : $doc_custcc/Vehicles
		 ,'last_login_date' : $doc_custcc/LastLoginDate

		}
		return xdmp:to-json($obj)
};

