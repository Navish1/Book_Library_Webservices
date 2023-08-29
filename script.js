document.addEventListener("DOMContentLoaded", function() {
    const fetchButton = document.getElementById("fetchButton");
    const fetchAllButton = document.getElementById("fetchAllButton");
    const isbnInput = document.getElementById("isbn");
    const reviewContainer = document.getElementById("reviewContainer");

    fetchButton.addEventListener("click", function() {
        const isbn = isbnInput.value.trim();
        if (isbn !== "") {
            fetchReviews(isbn);
        }
    });

    fetchAllButton.addEventListener("click", function() {
        fetchAllBooks();
    });

    function fetchAllBooks() {
        reviewContainer.innerHTML = "Fetching all books and reviews...";

        fetch("http://localhost/Assignment/Book_Library_Webservices/read.php")
            .then(response => response.json())
            .then(data => {
                reviewContainer.innerHTML = ""; // Clear previous content

                if (data.records && data.records.length > 0) {
                    data.records.forEach(book => {
                        const bookDiv = document.createElement("div");
                        bookDiv.classList.add("book");
                        let reviews = book.reviews.map(review => `<p>${review.review}</p>`).join("");
                        bookDiv.innerHTML = `
                            <h2>${book.book_name}</h2>
                            <p><strong>Author:</strong> ${book.author_name}</p>
                            <p><strong>ISBN:</strong> ${book.isbn}</p>
                            ${reviews}
                        `;
                        reviewContainer.appendChild(bookDiv);
                    });
                } else {
                    reviewContainer.innerHTML = "No books found.";
                }

                const backButton = document.createElement("button");
                backButton.textContent = "Back";
                backButton.addEventListener("click", function() {
                    reviewContainer.innerHTML = "";
                });
                reviewContainer.appendChild(backButton);
            })
            .catch(error => {
                console.error("Error fetching books:", error);
                reviewContainer.innerHTML = "An error occurred while fetching books.";
            });
    }

    function fetchReviews(isbn) {
        reviewContainer.innerHTML = "Fetching reviews...";

        fetch(`http://localhost/Assignment/Book_Library_Webservices/read.php?isbn=${isbn}`)
            .then(response => response.json())
            .then(data => {
                reviewContainer.innerHTML = ""; // Clear previous content

                if (data.records && data.records.length > 0) {
                    data.records.forEach(review => {
                        const reviewDiv = document.createElement("div");
                        reviewDiv.classList.add("review");
                        reviewDiv.innerHTML = `
                            <h2>${review.book_name}</h2>
                            <p><strong>Author:</strong> ${review.author_name}</p>
                            <p><strong>Review:</strong> ${review.review}</p>
                        `;
                        reviewContainer.appendChild(reviewDiv);
                    });
                } else {
                    reviewContainer.innerHTML = "No reviews found.";
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
                reviewContainer.innerHTML = "An error occurred while fetching reviews.";
            });
    }
});
