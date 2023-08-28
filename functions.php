<?php
class Review{   
    
    private $reviewTable = "book_review";      
    public $isbn;
    public $book_name;
    public $author_name;
    public $review;
      
    private $conn;
	
    public function __construct($db){
        $this->conn = $db;
    }	
	
	function read() {	
        if ($this->isbn) {
            $stmt = $this->conn->prepare("
                SELECT * FROM ".$this->reviewTable." 
                WHERE isbn = ?");
            $stmt->bind_param("s", $this->isbn);					
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM ".$this->reviewTable);		
        }		
        $stmt->execute();			
        $result = $stmt->get_result();		
        return $result;	
    }

    function create(){
		# SQL INSERT statement using a prepared statement to avoid SQL injection.
        $stmt = $this->conn->prepare("
            INSERT INTO ".$this->reviewTable."(isbn, book_name, author_name, review)
            VALUES(?,?,?,?)");
        
        $this->isbn = htmlspecialchars(strip_tags($this->isbn));
        $this->book_name = htmlspecialchars(strip_tags($this->book_name));
        $this->author_name = htmlspecialchars(strip_tags($this->author_name));
        $this->review = htmlspecialchars(strip_tags($this->review));
        
        #The purpose of binding variables is to pass values safely into the SQL query while also handling data types and preventing SQL injection.
        $stmt->bind_param("ssss", $this->isbn, $this->book_name, $this->author_name, $this->review);
        
        if($stmt->execute()){
            return true;
        }
     
        return false;		 
    }

    function update() {
        $stmt = $this->conn->prepare("
            UPDATE ".$this->reviewTable." 
            SET book_name = ?, author_name = ?, review = ? 
            WHERE isbn = ?");
     
        $this->book_name = htmlspecialchars(strip_tags($this->book_name));
        $this->author_name = htmlspecialchars(strip_tags($this->author_name));
        $this->review = htmlspecialchars(strip_tags($this->review));
     
        $stmt->bind_param("ssss", $this->book_name, $this->author_name, $this->review, $this->isbn);
        
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }
    
}
