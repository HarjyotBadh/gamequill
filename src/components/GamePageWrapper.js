import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GamePage from '../pages/GamePage';

function GamePageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('game_id');

  useEffect(() => {
    if (!gameId) {
      navigate('/home');
    }
  }, [gameId, navigate]);

  return gameId ? <GamePage /> : null;
}

export default GamePageWrapper;
