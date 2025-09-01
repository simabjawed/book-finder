import React, { useState, useEffect } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [subject, setSubject] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggested, setSuggested] = useState([]);

  const searchBooks = async () => {
    if (!query.trim()) {
      setError("Please enter a book title.");
      return;
    }

    setError("");
    setLoading(true);
    setBooks([]);

    try {
      let url = `https://openlibrary.org/search.json?title=${query}`;

      if (language) url += `&language=${language}`;
      if (subject) url += `&subject=${subject}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No books found.");
      } else {
        setBooks(data.docs.slice(0, 10));
      }
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
    }

    setLoading(false);
  };

  // Fetch suggested books (static subject for demo)
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          "https://openlibrary.org/search.json?subject=fiction"
        );
        const data = await res.json();
        setSuggested(data.docs.slice(0, 10));
      } catch (err) {
        console.error("Failed to load suggestions", err);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        textAlign: "center",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "30px",
          borderRadius: "12px",
          display: "inline-block",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        <h1>📚 Book Finder for Alex</h1>
        <p>“A room without books is like a body without a soul.” – Cicero</p>

        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", width: "250px", margin: "10px" }}
        />
        <br />

        {/* Filters row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="">Select Language</option>
            <option value="eng">English</option>
            <option value="fre">French</option>
            <option value="ger">German</option>
            <option value="spa">Spanish</option>
            <option value="hin">Hindi</option>
          </select>

          <input
            type="text"
            placeholder="Enter subject/genre..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: "8px", width: "200px" }}
          />
        </div>

        <button
          onClick={searchBooks}
          style={{ padding: "10px 15px", marginTop: "15px" }}
        >
          Search
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}

        {/* Results */}
        <div style={{ marginTop: "20px" }}>
          {books.map((book) => (
            <div
              key={book.key}
              style={{
                marginBottom: "20px",
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <strong>{book.title}</strong> <br />
              by {book.author_name ? book.author_name.join(", ") : "Unknown"}
              {book.cover_i && (
                <div>
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                    style={{ marginTop: "10px", maxHeight: "150px" }}
                  />
                </div>
              )}
              <br />
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "cyan",
                }}
              >
                View More →
              </a>
            </div>
          ))}
        </div>

        {/* Suggested Books */}
        <h2 style={{ marginTop: "30px" }}>📖 Suggested Books</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          {suggested.map((book) => (
            <div
              key={book.key}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  style={{ maxHeight: "120px", marginBottom: "5px" }}
                />
              ) : (
                <div
                  style={{
                    height: "120px",
                    background: "#333",
                    borderRadius: "6px",
                  }}
                ></div>
              )}
              <p style={{ fontSize: "12px", color: "white" }}>{book.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
