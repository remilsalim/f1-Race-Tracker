import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { f1Service } from '../services/f1Api';
import { Calendar as CalendarIcon, ChevronRight, CheckCircle, Clock } from 'lucide-react';

const CalendarPage = () => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const today = new Date();

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const data = await f1Service.getSeasonCalendar();
                setRaces(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching calendar:", error);
                setLoading(false);
            }
        };
        fetchRaces();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Season Calendar...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#e10600', padding: '10px', borderRadius: '12px' }}>
                    <CalendarIcon size={24} />
                </div>
                <h1 className="f1-title" style={{ fontSize: '2.5rem' }}>2026 Season Calendar</h1>
            </div>

            <div className="grid">
                {races.map((race) => {
                    const raceDate = new Date(race.date);
                    const isCompleted = raceDate < today;

                    return (
                        <div
                            key={race.round}
                            className="glass-card"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                opacity: isCompleted ? 0.8 : 1,
                                borderLeft: isCompleted ? '4px solid #38383f' : '4px solid #e10600'
                            }}
                            onClick={() => navigate(`/race/${race.season}/${race.round}`)}
                        >
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase' }}>Round</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{race.round}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{race.raceName}</div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{race.Circuit.circuitName}, {race.Circuit.Location.country}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold' }}>{raceDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
                                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: isCompleted ? '#949498' : '#e10600' }}>
                                        {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {isCompleted ? 'Completed' : 'Upcoming'}
                                    </div>
                                </div>
                                <ChevronRight size={20} opacity={0.5} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarPage;
