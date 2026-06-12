import { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API}/books`);
        const data = await res.json();

        console.log("Livres reçus :", data);

        setBooks(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Nos livres</h1>

      {books.length === 0 ? (
        <p>Aucun livre disponible</p>
      ) : (
        books.map((book) => (
          <div key={book.id} style={{ marginBottom: "20px" }}>
            <h3>{book.title}</h3>
            <p><strong>Auteur :</strong> {book.author}</p>
            <p><strong>Prix :</strong> {book.price} €</p>

            {book.cover_image && (
              <img
                src={`${API}${book.cover_image}`}
                alt={book.title}
                width="120"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
