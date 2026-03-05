import React, { useState, useEffect } from 'react';
import { f1Service } from '../services/f1Api';
import { Zap, Timer, MapPin, Trophy } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

const Home = () => {
    const [nextRace, setNextRace] = useState(null);
    const [lastResults, setLastResults] = useState(null);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTour, setShowTour] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [next, last, drivers] = await Promise.all([
                    f1Service.getNextRace(),
                    f1Service.getLastRaceResults(),
                    f1Service.getDriverStandings()
                ]);
                setNextRace(next);
                setLastResults(last);
                setStandings(drivers.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading F1 Data...</div>;

    return (
        <div className="animate-fade-in">
            {/* Hero Section - Next Race */}
            {nextRace && (
                <div
                    className="glass-card"
                    style={{
                        padding: '3rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: showTour ? '1px solid rgba(225, 6, 0, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => setShowTour(!showTour)}
                >
                    <div style={{ position: 'absolute', right: '-50px', top: '-50px', fontSize: '15rem', opacity: 0.03, fontWeight: 900, pointerEvents: 'none' }}>NEXT</div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#e10600', marginBottom: '1rem' }}>
                        <Timer size={24} />
                        <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {showTour ? 'Track Insights' : 'Upcoming Grand Prix'}
                        </span>
                    </div>
                    <h1 className="f1-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{nextRace.raceName}</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={20} opacity={0.7} />
                            {nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.country}
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#e10600' }}>
                            {new Date(nextRace.date + 'T' + nextRace.time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    {showTour && (
                        <div className="animate-fade-in" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                    <iframe
                                        width="100%"
                                        height="250"
                                        src={`https://www.youtube.com/embed?listType=search&list=F1+Track+Tour+${nextRace.raceName}+2026`}
                                        title="F1 Track Tour"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div>
                                    <h3 className="f1-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Weekend Schedule</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { session: 'Free Practice 1', time: 'Friday, 11:30' },
                                            { session: 'Free Practice 2', time: 'Friday, 15:00' },
                                            { session: 'Qualifying', time: 'Saturday, 15:00' },
                                            { session: 'Grand Prix', time: 'Sunday, 14:00', highlight: true }
                                        ].map((s, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: s.highlight ? 'rgba(225, 6, 0, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: s.highlight ? '3px solid #e10600' : 'none' }}>
                                                <span style={{ opacity: s.highlight ? 1 : 0.7 }}>{s.session}</span>
                                                <span style={{ fontWeight: 'bold', color: s.highlight ? '#e10600' : 'inherit' }}>{s.time} Local</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>* Representative times shown. Click for official F1 broadcast details.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Last Race Results */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 className="f1-title" style={{ marginBottom: '1.5rem' }}>Last Race Results</h3>
                    {lastResults && (
                        <div>
                            <p style={{ opacity: 0.7, marginBottom: '1rem' }}>{lastResults.raceName}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {lastResults.Results.slice(0, 3).map((res, i) => (
                                    <div key={res.Driver.driverId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32' }}>{res.position}</span>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{res.Driver.givenName} {res.Driver.familyName}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{res.Constructor.name}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#e10600' }}>+{res.points} pts</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Top 5 Standings */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 className="f1-title" style={{ marginBottom: '1.5rem' }}>Driver Standings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {standings.length > 0 ? (
                            standings.map((stand) => (
                                <div key={stand.Driver.driverId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-12px', top: '20%', bottom: '20%', width: '4px', background: getTeamColor(stand.Constructors[0].constructorId), borderRadius: '4px' }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontWeight: 800, minWidth: '20px' }}>{stand.position}</span>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{stand.Driver.familyName}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{stand.Constructors[0].name}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>{stand.points} PTS</div>
                                </div>
                            ))
                        ) : (
                            <p style={{ opacity: 0.6 }}>Standings will be available after the first race of 2026.</p>
                        )}
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '4rem', padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <a
                        href="https://github.com/remilsalim"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#e10600',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 16px',
                            border: '1px solid rgba(225, 6, 0, 0.3)',
                            borderRadius: '30px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(225, 6, 0, 0.1)'; e.currentTarget.style.borderColor = '#e10600'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(225, 6, 0, 0.3)'; }}
                    >
                        <Zap size={18} fill="#e10600" /> Developed by Me
                    </a>
                </div>
                <p style={{ opacity: 0.6 }}>© 2026 F1 Race Tracker. Powered by Ergast API.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.4 }}>Formula 1, F1 and related marks are trademarks of Formula One Licensing BV.</p>
            </footer>
        </div>
    );
};

export default Home;
