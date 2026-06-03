import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';

export default function Catatan() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/catatan',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Judul dan isi catatan wajib diisi');
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/catatan/${editingId}`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/catatan',
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTitle('');
      setContent('');
      setEditingId(null);

      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Hapus catatan ini?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/catatan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

const filteredNotes = useMemo(() => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return notes;

  return notes.filter((note) => {
    return (
      String(note.title || '')
        .toLowerCase()
        .includes(keyword) ||
      String(note.content || '')
        .toLowerCase()
        .includes(keyword)
    );
  });
}, [notes, search]);

  const totalCharacters = notes.reduce(
    (total, note) => total + note.content.length,
    0
  );

  return (
    <div
      style={{
        display: 'flex',
        background: '#f5f7fb',
        minHeight: '100vh',
      }}
    >
      <Sidebar />

      <div
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: '32px',
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '6px',
            }}
          >
            📓 Catatan Belajar
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '15px',
            }}
          >
            Simpan rangkuman, ide, dan hal penting selama belajar
          </p>
        </div>

        {/* STATS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <StatsCard
            icon="📚"
            label="Total Catatan"
            value={notes.length}
            sub="Semua catatan"
          />

          <StatsCard
            icon="✍️"
            label="Sedang Ditulis"
            value={editingId ? 1 : 0}
            sub="Mode edit"
          />

          <StatsCard
            icon="📝"
            label="Total Karakter"
            value={totalCharacters}
            sub="Isi catatan"
          />
        </div>

        {/* MAIN */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '380px 1fr',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* FORM */}
          <div
            style={{
              background: '#fff',
              borderRadius: '22px',
              padding: '24px',
              boxShadow:
                '0 4px 20px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: '24px',
            }}
          >
            <h3
              style={{
                marginBottom: '18px',
                color: '#1e293b',
              }}
            >
              {editingId
                ? '✏️ Edit Catatan'
                : '➕ Catatan Baru'}
            </h3>

            <input
              type="text"
              placeholder="Judul Catatan"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border:
                  '1px solid #e2e8f0',
                marginBottom: '14px',
                outline: 'none',
              }}
            />

            <textarea
              rows={10}
              placeholder="Tulis catatanmu di sini..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border:
                  '1px solid #e2e8f0',
                resize: 'vertical',
                outline: 'none',
              }}
            />

            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
                color: '#94a3b8',
              }}
            >
              {content.length} karakter
            </div>

            <button
              onClick={saveNote}
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                background: '#6366f1',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {editingId
                ? '💾 Update Catatan'
                : '➕ Simpan Catatan'}
            </button>
          </div>

          {/* LIST */}
          <div>
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '22px',
                boxShadow:
                  '0 4px 20px rgba(0,0,0,0.05)',
                marginBottom: '20px',
              }}
            >
              <input
                type="text"
                placeholder="🔍 Cari catatan..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border:
                    '1px solid #e2e8f0',
                  outline: 'none',
                }}
              />
            </div>

            {filteredNotes.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  padding: '50px',
                  borderRadius: '22px',
                  textAlign: 'center',
                  boxShadow:
                    '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: '60px',
                    marginBottom: '16px',
                  }}
                >
                  📓
                </div>

                <h3
                  style={{
                    color: '#1e293b',
                    marginBottom: '8px',
                  }}
                >
                  Belum Ada Catatan
                </h3>

                <p
                  style={{
                    color: '#64748b',
                  }}
                >
                  Mulai tulis catatan
                  pertamamu sekarang
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '18px',
                }}
              >
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: '#fff',
                      borderRadius: '22px',
                      padding: '22px',
                      boxShadow:
                        '0 4px 20px rgba(0,0,0,0.05)',
                      transition:
                        'transform 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'start',
                        marginBottom: '12px',
                      }}
                    >
                      <h3
                        style={{
                          color: '#1e293b',
                        }}
                      >
                        {note.title}
                      </h3>

                      <span
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                        }}
                      >
                        {new Date(
                          note.created_at
                        ).toLocaleDateString(
                          'id-ID'
                        )}
                      </span>
                    </div>

                    <p
                      style={{
                        color: '#64748b',
                        lineHeight: '1.7',
                        whiteSpace:
                          'pre-wrap',
                      }}
                    >
                      {note.content}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '18px',
                      }}
                    >
                      <button
                        onClick={() =>
                          editNote(note)
                        }
                        style={{
                          border: 'none',
                          padding:
                            '10px 14px',
                          borderRadius:
                            '10px',
                          background:
                            '#f59e0b',
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteNote(
                            note.id
                          )
                        }
                        style={{
                          border: 'none',
                          padding:
                            '10px 14px',
                          borderRadius:
                            '10px',
                          background:
                            '#ef4444',
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}