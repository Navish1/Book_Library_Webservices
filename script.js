document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".links a");
    const sections = document.querySelectorAll(".section");
    const fetchButton = document.getElementById("fetchButton");
    const createButton = document.getElementById("createButton");
    const isbnInput = document.getElementById("isbn");
    const createIsbnInput = document.getElementById("createIsbn");
    const bookNameInput = document.getElementById("book_name");
    const authorNameInput = document.getElementById("author_name");
    const reviewInput = document.getElementById("review");
    const reviewContainer = document.getElementById("reviewContainer");
    const createMessage = document.getElementById("createMessage");

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
});
