<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
require_once ('db.php');
require_once ('functions.php');
 
$database = new Database();
$db = $database->getConnection();
 
$review = new Review($db);
 
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->isbn)) {
	$review->isbn = $data->isbn;
	if($review->delete()){    
		http_response_code(200); 
		echo json_encode(array("message" => "Review was deleted."));
	} else {    
		http_response_code(503);   
		echo json_encode(array("message" => "Unable to delete review."));
	}
} else {
	http_response_code(400);    
    echo json_encode(array("message" => "Unable to delete review. Data is incomplete."));
}
?>