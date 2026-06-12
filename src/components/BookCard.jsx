import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/bookcard.css";

const API = "http://localhost:8080";

export default function BookCard({ book }) {

  const { user } = useAuth();
  const { addToCart } = useCart();

  const addCart = async () => {

    if (!user) {
      alert("Connectez-vous");
      return;
    }

    await fetch(`${API}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        bookId: book.id
      })
    });

    addToCart(book);

  };

  const imageUrl = book.cover_image
    ? `${API}${book.cover_image}`
    : "/placeholder-book.png";

  return (

    <div className="book-card">

      <Link to={`/book/${book.id}`}>
        <div className="card-image-container">
          <img
            src={imageUrl}
            alt={book.title}
            className="book-card-image"
          />
          {book.isBestseller && <div className="badge-bestseller">Best-seller</div>}
        </div>
      </Link>

      <h3>{book.title}</h3>

      <p>{book.author}</p>

      <p>{book.price?.toFixed(2)} €</p>

      <button onClick={addCart}>
        Ajouter au panier
      </button>

    </div>

  );

}