// src/App.tsx
import React, { useState, useEffect } from 'react';
import { fetchQuestions, Question } from './api';

const App: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Flashcard state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuestions()
      .then(res => {
        /* handle success */
        setAllQuestions(res.data);
        setSubjects([...new Set(res.data.map(q => q.subject))]);
        setLoading(false);
      }).catch(err => {
        setError(err.message || 'Failed to fetch');
        setLoading(false)
      })
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  // when no subject chosen, show subject buttons
  if (!selectedSubject) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Select a Subject</h1>
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => {
              setSelectedSubject(subj);
              setCurrentIdx(0);
              setShowAnswer(false);
            }}
            style={{
              margin: '0.5rem',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
            }}
          >
            {subj}
          </button>
        ))}
      </div>
    );
  }

  // flashcards filtered by subject
  const cards = allQuestions.filter(q => q.subject === selectedSubject);
  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No questions for “{selectedSubject}”.</p>
        <button onClick={() => setSelectedSubject(null)}>← Back</button>
      </div>
    );
  }

  const card = cards[currentIdx];
  const next = () => {
    setShowAnswer(false);
    setCurrentIdx(i => (i + 1) % cards.length);
  };
  const prev = () => {
    setShowAnswer(false);
    setCurrentIdx(i => (i - 1 + cards.length) % cards.length);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
      <h1>{selectedSubject} Flashcards</h1>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: 8,
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '1.25rem' }}><strong>Q:</strong> {card.text}</p>
        {showAnswer
          ? <div style={{ marginTop: '1rem' }}>
              <p><strong>A:</strong> {card.choices[card.answerIndex]}</p>
              {card.explanation && (
                <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                  {card.explanation}
                </p>
              )}
            </div>
          : <button
              onClick={() => setShowAnswer(true)}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              Show Answer
            </button>
        }
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={prev} disabled={cards.length <= 1}>
          ← Prev
        </button>
        <button onClick={next} disabled={cards.length <= 1} style={{ marginLeft: '1rem' }}>
          Next →
        </button>
      </div>

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Card {currentIdx + 1} of {cards.length}
      </p>

      <button onClick={() => setSelectedSubject(null)} style={{ marginTop: '1rem' }}>
        ← Back to Subjects
      </button>
    </div>
  );
};

export default App;
