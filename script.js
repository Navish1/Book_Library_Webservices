document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".links a");
    const sections = document.querySelectorAll(".section");
    const fetchButton = document.getElementById("fetchButton");
    const createButton = document.getElementById("createButton");
    const updateButton = document.getElementById("updateButton");
    const deleteButton = document.getElementById("deleteButton");
    const isbnInput = document.getElementById("isbn");
    const createIsbnInput = document.getElementById("createIsbn");
    const updateIsbnInput = document.getElementById("updateIsbn");
    const deleteIsbnInput = document.getElementById("deleteIsbn");
    const bookNameInput = document.getElementById("book_name");
    const authorNameInput = document.getElementById("author_name");
    const reviewInput = document.getElementById("review");
    const reviewContainer = document.getElementById("reviewContainer");
    const createMessage = document.getElementById("createMessage");
    const updateMessage = document.getElementById("updateMessage");
    const deleteMessage = document.getElementById("deleteMessage");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetSectionId = this.getAttribute("href");
            sections.forEach(section => {
                section.style.display = "none";
            });
            document.querySelector(targetSectionId).style.display = "block";
        });
    });

    fetchButton.addEventListener("click", function() {
        const isbn = isbnInput.value.trim();
        if (isbn !== "") {
            fetchReviews(isbn);
        }
    });

    createButton.addEventListener("click", function() {
        const isbn = createIsbnInput.value.trim();
        const bookName = bookNameInput.value.trim();
        const authorName = authorNameInput.value.trim();
        const review = reviewInput.value.trim();

        if (isbn !== "" && bookName !== "" && authorName !== "" && review !== "") {
            createReview(isbn, bookName, authorName, review);
        } else {
            createMessage.textContent = "Please fill in all fields.";
        }
    });

    updateButton.addEventListener("click", function() {
        const isbn = updateIsbnInput.value.trim();
        const bookName = updateBookNameInput.value.trim();
        const authorName = updateAuthorNameInput.value.trim();
        const review = updateReviewInput.value.trim();

        if (isbn !== "") {
            updateReview(isbn, bookName, authorName, review);
        } else {
            updateMessage.textContent = "Please enter an ISBN.";
        }
    });

    deleteButton.addEventListener("click", function() {
        const isbn = deleteIsbnInput.value.trim();

        if (isbn !== "") {
            deleteReview(isbn);
        } else {
            deleteMessage.textContent = "Please enter an ISBN.";
        }
    });

    function fetchReviews(isbn) {
        reviewContainer.innerHTML = "Fetching reviews...";
    
        fetch("http://localhost/Assignment/Book_Library_Webservices/read.php?isbn=" + isbn)
            .then(response => response.json())
            .then(data => {
                if (data.records) {
                    const reviews = data.records;
                    let reviewHtml = ""; 
                    reviews.forEach(review => {
                        reviewHtml += `
                            <div class="review-item">
                                <p><strong>Book Name:</strong> ${review.book_name}</p>
                                <p><strong>Author:</strong> ${review.author_name}</p>
                                <p><strong>Review:</strong> ${review.review}</p>
                            </div>
                        `;
                    });
                    reviewContainer.innerHTML = reviewHtml;
                } else {
                    reviewContainer.innerHTML = "No reviews found.";
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
                reviewContainer.innerHTML = "An error occurred while fetching reviews.";
            });
    }

    function createReview(isbn, bookName, authorName, review) {
        const data = {
            isbn: isbn,
            book_name: bookName,
            author_name: authorName,
            review: review
        };

        createMessage.textContent = "Creating review...";

        fetch("http://localhost/Assignment/Book_Library_Webservices/create.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === "Review was created.") {
                createMessage.textContent = "Review created successfully.";
            } else {
                createMessage.textContent = "Failed to create review.";
            }
        })
        .catch(error => {
            console.error("Error creating review:", error);
            createMessage.textContent = "An error occurred while creating the review.";
        });
    }

    function updateReview(isbn, bookName, authorName, review) {
        const data = {
            isbn: isbn,
            book_name: bookName,
            author_name: authorName,
            review: review
        };

        updateMessage.textContent = "Updating review...";

        fetch("http://localhost/Assignment/Book_Library_Webservices/update.php", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === "Review was updated.") {
                updateMessage.textContent = "Review updated successfully.";
            } else {
                updateMessage.textContent = "Failed to update review.";
            }
        })
        .catch(error => {
            console.error("Error updating review:", error);
            updateMessage.textContent = "An error occurred while updating the review.";
        });
    }

    function deleteReview(isbn) {
        deleteMessage.textContent = "Deleting review...";
    
        const data = {
            isbn: isbn
        };
    
        fetch("http://localhost/Assignment/Book_Library_Webservices/delete.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === "Review was deleted.") {
                deleteMessage.textContent = "Review deleted successfully.";
            } else {
                deleteMessage.textContent = "Failed to delete review.";
            }
        })
        .catch(error => {
            console.error("Error deleting review:", error);
            deleteMessage.textContent = "An error occurred while deleting the review.";
        });
    }
});
