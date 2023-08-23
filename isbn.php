<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $wsdl = 'http://webservices.daehosting.com/services/isbnservice.wso?WSDL';
    $client = new SoapClient($wsdl, array('trace' => 1)); // The trace param will show you errors

    $ISBN = $_POST['ISBN'];
    $isbn_type = $_POST['ISBNtype'];

    $request_param = array(
        'sISBN' => $ISBN
    );

    try {
        switch ($isbn_type) {
            case 'ISBN13':
                $response_param = $client->IsValidISBN13($request_param);
                $validationResult = $response_param->IsValidISBN13Result;
                break;
            case 'ISBN10':
                $response_param = $client->IsValidISBN10($request_param);
                $validationResult = $response_param->IsValidISBN10Result;
                break;
        }

        if ($validationResult === true) {
            echo "Status: Valid " . $isbn_type;
        } else {
            echo "Status: Invalid " . $isbn_type;
        }
    } catch (Exception $e) {
        echo "<h2>Exception Error</h2>";
        echo $e->getMessage();
    }
}
?>
