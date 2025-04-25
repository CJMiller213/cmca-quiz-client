// src/App.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import {
  fetchQuestions,
  createQuestion,
  Question,
} from './api';

const App: React.FC = () => {
  // State for loading, error, and question list
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // State for the new-question form
  const [form, setForm] = useState<Omit<Question, '_id'>>({
    subject: '',
    text: '',
    choices: ['', '', '', ''],
    answerIndex: 0,
    explanation: '',
  });

  // Fetch all questions on mount
  useEffect(() => {
    fetchQuestions()
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch');
        setLoading(false);
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await createQuestion(form);
      setQuestions(prev => [...prev, res.data]);
      // Reset form
      setForm({
        subject: '',
        text: '',
        choices: ['', '', '', ''],
        answerIndex: 0,
        explanation: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p>Loading questions…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>CMCA® Quiz Questions</h1>

      <section>
        <h2>Existing Questions</h2>
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          <ul>
            {questions.map(q => (
              <li key={q._id}>
                <strong>[{q.subject}]</strong> {q.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      <section>
        <h2>Create New Question</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Subject:<br />
              <input
                required
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Question Text:<br />
              <textarea
                required
                rows={3}
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
              />
            </label>
          </div>
          <div>
            <p>Choices (exactly 4):</p>
            {form.choices.map((choice, idx) => (
              <div key={idx}>
                <label>
                  Choice {idx + 1}:&nbsp;
                  <input
                    required
                    type="text"
                    value={choice}
                    onChange={e => {
                      const newChoices = [...form.choices];
                      newChoices[idx] = e.target.value;
                      setForm({ ...form, choices: newChoices });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <div>
            <label>
              Correct Answer Index (0–3):&nbsp;
              <input
                required
                type="number"
                min={0}
                max={3}
                value={form.answerIndex}
                onChange={e =>
                  setForm({ ...form, answerIndex: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <div>
            <label>
              Explanation:<br />
              <textarea
                rows={2}
                value={form.explanation}
                onChange={e =>
                  setForm({ ...form, explanation: e.target.value })
                }
              />
            </label>
          </div>
          <button type="submit">Submit Question</button>
        </form>
      </section>
    </div>
  );
};

export default App;
