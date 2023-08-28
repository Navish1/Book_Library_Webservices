<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("message" => "Invalid request method. Only POST requests are allowed."));
    exit(); // Terminate script execution
}

require_once('db.php');
require_once ('functions.php');

$database = new Database();
$db = $database->getConnection();

$review = new Review($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->isbn) && !empty($data->book_name) &&
    !empty($data->author_name) && !empty($data->review)) {

    $review->isbn = $data->isbn;
    $review->book_name = $data->book_name;
    $review->author_name = $data->author_name;
    $review->review = $data->review;

    if ($review->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Review was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create review."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create review. Data is incomplete."));
}
?>
