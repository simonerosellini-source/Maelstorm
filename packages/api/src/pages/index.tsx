export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '20px',
    }}>
      <h1 style={{ color: '#9d4edd', marginBottom: '20px' }}>
        🎲 Maelstorm RPG API
      </h1>
      <p style={{ color: '#94a1b2', fontSize: '18px', maxWidth: '600px', textAlign: 'center' }}>
        API server is running! Use the API endpoints to interact with the game.
      </p>
      <div style={{ marginTop: '40px', backgroundColor: '#16213e', padding: '20px', borderRadius: '8px', maxWidth: '600px' }}>
        <h2 style={{ color: '#9d4edd', marginBottom: '16px' }}>Available Endpoints:</h2>
        <ul style={{ color: '#94a1b2', lineHeight: '1.8' }}>
          <li><strong>Auth:</strong> /api/auth/login, /api/auth/register</li>
          <li><strong>Characters:</strong> /api/characters/create, /api/characters/list</li>
          <li><strong>Game Data:</strong> /api/game/races, /api/game/classes, /api/game/spells</li>
          <li><strong>Monsters:</strong> /api/game/monsters</li>
          <li><strong>Items:</strong> /api/game/items</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/api/game/races" style={{ color: '#9d4edd', marginRight: '20px' }}>View Races</a>
        <a href="/api/game/classes" style={{ color: '#9d4edd', marginRight: '20px' }}>View Classes</a>
        <a href="/api/game/monsters" style={{ color: '#9d4edd' }}>View Monsters</a>
      </div>
    </div>
  );
}
