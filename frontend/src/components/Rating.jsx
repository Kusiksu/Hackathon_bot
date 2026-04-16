import React, { useState, useEffect } from 'react';

// Функция для определения статуса на основе баллов
const getStatusInfo = (points) => {
  if (points >= 5501) return { name: 'Пламенное Сердце', range: 'от 5 501 балла' };
  if (points >= 2501) return { name: 'Благотворитель', range: '2 501 — 5 500 баллов' };
  if (points >= 501) return { name: 'Хранитель Надежды', range: '501 — 2 500 баллов' };
  return { name: 'Друг Платформы', range: '5 — 500 баллов' };
};

const Rating = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRating] = useState({
    name: 'Ваш рейтинг',
    status: 'Начните помогать, чтобы получить статус',
    totalPoints: 0,
    rankPosition: '—',
    totalDonated: '0 ₽'
  });

  useEffect(() => {
    // Загрузка данных рейтинга (пока заглушка)
    const mockLeaderboard = [
      { id: 1, name: 'Иван Иванов', points: 12500, rank: 1 },
      { id: 2, name: 'Мария Петрова', points: 8500, rank: 2 },
      { id: 3, name: 'Алексей Сидоров', points: 3200, rank: 3 },
    ];
    // Вычисляем статусы на основе баллов
    const leaderboardWithStatuses = mockLeaderboard.map(user => ({
      ...user,
      status: getStatusInfo(user.points).name
    }));
    setLeaderboard(leaderboardWithStatuses);
  }, []);

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  const userStatus = getStatusInfo(userRating.totalPoints);

  return (
    <div className="content-section active" id="rating">
      <div className="rating-container">
        <div className="header" style={{ marginBottom: '24px' }}>
          <div className="header-content">
            <div className="icon-wrapper">
              <svg className="user-icon" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div>
              <h1>Рейтинг благотворителей</h1>
              <p className="subtitle">Топ пользователей, которые помогают другим</p>
            </div>
          </div>
        </div>

        <div className="info-box">
          <h3>
            <svg style={{ width: '20px', height: '20px', stroke: 'currentColor' }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Как работает система рейтинга
          </h3>
          <div style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            <strong style={{ color: '#f1f5f9' }}>50 рублей = 5 баллов.</strong> За каждое пожертвование вы получаете баллы, которые определяют ваш статус и место в рейтинге. 
            Значки 🥇 🥈 🥉 присваиваются топ-3 пользователям и обновляются ежедневно.
          </div>
          <div className="info-content">
            <div className="status-info">
              <div className="status-name">Друг Платформы</div>
              <div className="status-points">5 — 500 баллов</div>
            </div>
            <div className="status-info">
              <div className="status-name">Хранитель Надежды</div>
              <div className="status-points">501 — 2 500 баллов</div>
            </div>
            <div className="status-info">
              <div className="status-name">Благотворитель</div>
              <div className="status-points">2 501 — 5 500 баллов</div>
            </div>
            <div className="status-info">
              <div className="status-name">Пламенное Сердце</div>
              <div className="status-points">от 5 501 балла</div>
            </div>
          </div>
        </div>

        <div className="user-rating-card" id="userRatingCard">
          <div className="user-rating-avatar">
            <svg viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="user-rating-info">
            <div className="user-rating-header">
              <div className="user-rating-name" id="userRatingName">{userRating.name}</div>
              {userRating.rankPosition <= 3 && userRating.rankPosition !== '—' && (
                <div className={`rank-badge ${getRankBadgeClass(userRating.rankPosition)}`}>
                  {userRating.rankPosition}
                </div>
              )}
            </div>
            <div className="user-rating-status" id="userRatingStatus">{userStatus.name}</div>
            <div className="user-rating-stats">
              <div className="rating-stat">
                <div className="rating-stat-label">Всего баллов</div>
                <div className="rating-stat-value" id="userTotalPoints">{userRating.totalPoints}</div>
              </div>
              <div className="rating-stat">
                <div className="rating-stat-label">Место в рейтинге</div>
                <div className="rating-stat-value" id="userRankPosition">{userRating.rankPosition}</div>
              </div>
              <div className="rating-stat">
                <div className="rating-stat-label">Пожертвовано</div>
                <div className="rating-stat-value" id="userTotalDonated">{userRating.totalDonated}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="leaderboard">
          <h2 className="leaderboard-title">Топ благотворителей</h2>
          <div id="leaderboardList">
            {leaderboard.map((user) => {
              // Вычисляем статус на основе баллов для каждого пользователя
              const userStatus = getStatusInfo(user.points);
              return (
                <div key={user.id} className="leaderboard-item">
                  <div className="leaderboard-position">{user.rank}</div>
                  <div className="leaderboard-avatar">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">{user.name}</div>
                    <div className="leaderboard-status">{userStatus.name}</div>
                  </div>
                  <div className="leaderboard-points">{user.points.toLocaleString('ru-RU')}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;

