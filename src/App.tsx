// src/App.tsx
import React, { useState, useEffect } from 'react';
import { fetchQuestions, Question } from './api';

const App: React.FC = () => {
  const [cards, setCards] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuestions()
      .then(res => {
        setCards(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch');
        setLoading(false);
      });
  }, []);

  // Helpers to navigate cards
  const next = () => {
    setShowAnswer(false);
    setCurrentIdx(i => (i + 1) % cards.length);
  };
  const prev = () => {
    setShowAnswer(false);
    setCurrentIdx(i => (i - 1 + cards.length) % cards.length);
  };

  if (loading) return <p>Loading cards…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (cards.length === 0) return <p>No cards available.</p>;

  const card = cards[currentIdx];

  return (
    <div style={{
      maxWidth: 500,
      margin: '2rem auto',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1>Flashcards</h1>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '1.25rem' }}><strong>Q:</strong> {card.text}</p>
        {showAnswer ? (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>A:</strong> {card.choices[card.answerIndex]}</p>
            {card.explanation && (
              <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                {card.explanation}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Show Answer
          </button>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={prev}
          disabled={cards.length <= 1}
          style={{ marginRight: '1rem' }}
        >
          ← Prev
        </button>
        <button
          onClick={next}
          disabled={cards.length <= 1}
        >
          Next →
        </button>
      </div>

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Card {currentIdx + 1} of {cards.length}
      </p>
    </div>
  );
};

export default App;
