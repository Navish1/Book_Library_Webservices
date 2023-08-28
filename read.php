<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';
require_once 'functions.php';

$database = new Database();
$db = $database->getConnection();

$review = new Review($db);

$review->isbn = isset($_GET['isbn']) ? $_GET['isbn'] : '';

$result = $review->read();

if ($result->num_rows > 0) {
    $review_arr = array();
    $review_arr["records"] = array();
    
    while ($row = $result->fetch_assoc()) {
        extract($row);
        $review_item = array(
            "isbn" => $isbn,
            "book_name" => $book_name,
            "author_name" => $author_name,
            "review" => $review
        );
        array_push($review_arr["records"], $review_item);
    }
    
    http_response_code(200);
    echo json_encode($review_arr);
} else {
    http_response_code(404);
    echo json_encode(
        array("message" => "No review found for the provided ISBN.")
    );
}

?>



