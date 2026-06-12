import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useComments } from "../context/CommentsContext";
import "../styles/comments.css";

export default function Comments({ bookId }) {
  const { user } = useAuth();
  const { getBookComments, addComment } = useComments();
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);

  const comments = getBookComments(bookId);

  const handleAddComment = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Vous devez vous connecter pour laisser un commentaire");
      return;
    }

    if (!commentText.trim()) {
      alert("Veuillez écrire un commentaire");
      return;
    }

    const newComment = {
      user: user.name || user.email,
      rating: rating,
      text: commentText,
      date: new Date().toISOString().split("T")[0],
    };

    addComment(bookId, newComment);
    setCommentText("");
    setRating(5);
    setShowForm(false);
  };

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "");
  };

  return (
    <section className="comments-section">
      <h2>Commentaires ({comments.length})</h2>

      {/* Formulaire d'ajout de commentaire */}
      {!showForm ? (
        <button 
          className="btn-add-comment"
          onClick={() => setShowForm(true)}
        >
          ✍️ Ajouter un commentaire
        </button>
      ) : (
        <form className="comment-form" onSubmit={handleAddComment}>
          <div className="form-group">
            <label>Votre note:</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="rating-select"
            >
              <option value={5}>★★★★★ Excellent</option>
              <option value={4}>★★★★ Très bon</option>
              <option value={3}>★★★ Bon</option>
              <option value={2}>★★ Moyen</option>
              <option value={1}>★ Pas recommandé</option>
            </select>
          </div>

          <div className="form-group">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Partagez votre avis sur ce livre..."
              rows="5"
              className="comment-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-comment">
              Publier le commentaire
            </button>
            <button 
              type="button" 
              className="btn-cancel-comment"
              onClick={() => {
                setShowForm(false);
                setCommentText("");
                setRating(5);
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste des commentaires */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <div className="comment-user-info">
                  <h4 className="comment-user">{comment.user}</h4>
                  <span className="comment-rating">{renderStars(comment.rating)}</span>
                  <span className="comment-date">{comment.date}</span>
                </div>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">Aucun commentaire pour le moment. Soyez le premier !</p>
        )}
      </div>
    </section>
  );
}
