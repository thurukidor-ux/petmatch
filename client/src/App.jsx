import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';
const GOOGLE_CLIENT_ID = '424057989582-tf0t5lqf14ov3tlitabs80v44hj1g8vk.apps.googleusercontent.com';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // Stavy formulářů a dat
  const [animals, setAnimals] = useState([]);
  const [animalForm, setAnimalForm] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    gender: 'MALE',
    birthDate: '',
    description: '',
  });

  const [docAnimalId, setDocAnimalId] = useState('');
  const [docType, setDocType] = useState('PEDIGREE');
  const [docFile, setDocFile] = useState(null);

  const [message, setMessage] = useState('');

  // 1. Inicializace Google Sign-In tlačítka
  useEffect(() => {
    /* global google */
    if (window.google && !token) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLoginResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', text: 'signin_with' }
      );
    }
  }, [token]);

  // 2. Načtení zvířat po přihlášení
  useEffect(() => {
    if (token) {
      loadAnimals();
    }
  }, [token]);

  // Zpracování odpovědi z Google tlačítka
  const handleGoogleLoginResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Úspěšně přihlášeno přes Google!');
      } else {
        setMessage(data.error || 'Přihlášení selhalo');
      }
    } catch (err) {
      setMessage(`Chyba serveru při přihlašování: ${err.message}`);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAnimals([]);
    setMessage('Byl jsi odhlášen.');
  };

  // Načtení seznamu zvířat chovatele
  const loadAnimals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/animals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.animals) {
        setAnimals(data.animals);
      }
    } catch (err) {
      console.error('Chyba při načítání zvířat:', err);
    }
  };

  // Odeslání formuláře pro vytvoření zvířete (US-02)
  const handleCreateAnimal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/animals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(animalForm),
      });
      const data = await res.json();

      if (res.status === 201) {
        setMessage(`Zvíře "${data.animal.name}" bylo úspěšně vytvořeno!`);
        setAnimalForm({
          name: '',
          species: 'DOG',
          breed: '',
          gender: 'MALE',
          birthDate: '',
          description: '',
        });
        loadAnimals();
      } else {
        setMessage(`Chyba: ${data.error || 'Zvíře se nepodařilo vytvořit'}`);
      }
    } catch (err) {
      setMessage(`Chyba: ${err.message}`);
    }
  };

  // Odeslání souboru / dokladu (US-03)
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile || !docAnimalId) {
      setMessage('Vyber prosím zvíře i soubor.');
      return;
    }

    const formData = new FormData();
    formData.append('file', docFile);
    formData.append('animalId', docAnimalId);
    formData.append('documentType', docType);

    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData automaticky nastaví multipart/form-data boundary
      });
      const data = await res.json();

      if (res.status === 201) {
        setMessage(`Doklad "${docFile.name}" byl úspěšně nahrán k vybranému zvířeti!`);
        setDocFile(null);
      } else {
        setMessage(`Chyba nahrávání: ${data.error || 'Nahrání selhalo'}`);
      }
    } catch (err) {
      setMessage(`Chyba uploadu: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>AniCo – Klientský portál</h1>

      {message && (
        <div style={{ padding: '10px', background: '#eef', border: '1px solid #99c', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {/* Autentizační panel */}
      <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>1. Přihlášení</h3>
        {!token ? (
          <div>
            <p>Pro správu zvířat a nahrávání dokladů se přihlas přes Google:</p>
            <div id="googleSignInDiv"></div>
          </div>
        ) : (
          <div>
            <p>
              Přihlášen jako: <b>{user?.name}</b> ({user?.email}) | Role: <b>{user?.role}</b>
            </p>
            <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Odhlásit se
            </button>
          </div>
        )}
      </section>

      {token && (
        <>
          {/* Formulář pro přidání zvířete */}
          <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>2. Založit zvíře (US-02)</h3>
            <form onSubmit={handleCreateAnimal} style={{ display: 'grid', gap: '10px' }}>
              <input
                type="text"
                placeholder="Jméno zvířete"
                value={animalForm.name}
                onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={animalForm.species}
                  onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
                >
                  <option value="DOG">Pes (DOG)</option>
                  <option value="CAT">Kočka (CAT)</option>
                </select>
                <select
                  value={animalForm.gender}
                  onChange={(e) => setAnimalForm({ ...animalForm, gender: e.target.value })}
                >
                  <option value="MALE">Samec (MALE)</option>
                  <option value="FEMALE">Samice (FEMALE)</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Plemeno (např. Border Kolie)"
                value={animalForm.breed}
                onChange={(e) => setAnimalForm({ ...animalForm, breed: e.target.value })}
                required
              />
              <input
                type="date"
                value={animalForm.birthDate}
                onChange={(e) => setAnimalForm({ ...animalForm, birthDate: e.target.value })}
                required
              />
              <textarea
                placeholder="Popis zvířete"
                value={animalForm.description}
                onChange={(e) => setAnimalForm({ ...animalForm, description: e.target.value })}
              />
              <button type="submit" style={{ padding: '8px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none' }}>
                Uložit zvíře
              </button>
            </form>
          </section>

          {/* Formulář pro nahrání dokladu */}
          <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>3. Nahrát doklad ke zvířeti (US-03)</h3>
            <form onSubmit={handleUploadDocument} style={{ display: 'grid', gap: '10px' }}>
              <label>Vyber zvíře:</label>
              <select value={docAnimalId} onChange={(e) => setDocAnimalId(e.target.value)} required>
                <option value="">-- Vyber zvíře --</option>
                {animals.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.breed})
                  </option>
                ))}
              </select>

              <label>Typ dokladu:</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="PEDIGREE">Rodokmen (PEDIGREE)</option>
                <option value="VET_REPORT">Veterinární zpráva (VET_REPORT)</option>
                <option value="BREEDING_LICENSE">Chovná licence (BREEDING_LICENSE)</option>
              </select>

              <label>Soubor (PDF, JPG, PNG):</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocFile(e.target.files[0])}
                required
              />

              <button type="submit" style={{ padding: '8px', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none' }}>
                Odeslat soubor na server
              </button>
            </form>
          </section>

          {/* Seznam existujících zvířat */}
          <section style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>4. Moje zaevidovaná zvířata</h3>
            {animals.length === 0 ? (
              <p>Zatím nemáš vytvořená žádná zvířata.</p>
            ) : (
              <ul>
                {animals.map((a) => (
                  <li key={a._id} style={{ marginBottom: '8px' }}>
                    <b>{a.name}</b> – {a.species === 'DOG' ? 'Pes' : 'Kočka'}, {a.breed} ({a.gender === 'MALE' ? 'Pes' : 'Fena'}) | <i>ID: {a._id}</i>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}