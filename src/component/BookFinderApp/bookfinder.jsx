import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons

function BookFinder() {
  // ------------------ STATES ------------------
  const [query, setQuery] = useState(""); // Search input
  const [results, setResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [watchlist, setWatchlist] = useState([]); // Saved books
  const [showWatchlist, setShowWatchlist] = useState(false); // Toggle watchlist

  // ------------------ LOCAL STORAGE ------------------
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(savedList);
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // ------------------ API CALL ------------------
  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await res.json();
      setResults(data.docs); // Limit results
    } catch (e) {
      console.error("Error fetching books", e);
    }

    setLoading(false);
  };

  // ------------------ WATCHLIST FUNCTIONS ------------------
  const addToWatchlist = (book) => {
    if (!watchlist.some((b) => b.key === book.key)) {
      setWatchlist([...watchlist, book]);
    }
  };

  const removeFromWatchlist = (key) => {
    setWatchlist(watchlist.filter((b) => b.key !== key));
  };

  // ------------------ RENDER ------------------
  return (
    <div>
      {/* ------------------ NAVBAR ------------------ */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        {/* Brand Name */}
        <a className="navbar-brand" href="/">
          📚 Book Finder
        </a>

        {/* Search bar inside Navbar */}
        {!showWatchlist && (
          <form
            className="d-flex mx-auto"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent page reload
              searchBooks();
            }}
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "300px" }}
            />
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search"></i>
            </button>
          </form>
        )}

        {/* Right side buttons */}
        <div className="ms-auto d-flex gap-2">
          {/* Home button (only visible when inside watchlist) */}
          {showWatchlist && (
            <button
              className="btn btn-outline-light"
              onClick={() => setShowWatchlist(false)}
            >
              <i className="bi bi-house-door me-2"></i>Home
            </button>
          )}

          {/* Watchlist Button */}
          <button
            className="btn btn-outline-light position-relative"
            disabled={watchlist.length === 0}
            onClick={() => setShowWatchlist(true)}
          >
            <i className="bi bi-bookmark-star me-2"></i>
            Watchlist
            {watchlist.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ------------------ MAIN CONTAINER ------------------ */}
      <div className="container mt-4">
        {/* Loading */}
        {loading && <p className="text-center">Loading books...</p>}

        {/* ------------------ SEARCH RESULTS ------------------ */}
        {!showWatchlist && (
          <>
            
            <div className="d-flex flex-wrap justify-content-center">
              {results.map((book, idx) => (
                <div key={idx} className="card m-2" style={{ width: "280px" }}>
                  {/* Book cover */}
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{ height: "200px" }}
                    >
                      <span>No Image</span>
                    </div>
                  )}

                  {/* Book details */}
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong>{" "}
                      {book.author_name
                        ? book.author_name.join(", ")
                        : "Unknown"}
                      <br />
                      <strong>First Published:</strong>{" "}
                      {book.first_publish_year || "N/A"}
                    </p>

                    {/* Add to Watchlist */}
                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => addToWatchlist(book)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add to Watchlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ WATCHLIST SECTION ------------------ */}
        {showWatchlist && (
          <>
            <h3 className="mt-4">📌 My Watchlist</h3>
            <div className="d-flex flex-wrap justify-content-center">
              {watchlist.map((book, idx) => (
                <div key={idx} className="card m-2" style={{ width: "250px" }}>
                  {/* Book cover */}
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{ height: "180px" }}
                    >
                      <span>No Image</span>
                    </div>
                  )}

                  {/* Title + Remove button */}
                  <div className="card-footer">
                    <h6 className="card-title">{book.title}</h6>
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => removeFromWatchlist(book.key)}
                    >
                      <i className="bi bi-trash me-2"></i>Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookFinder;
