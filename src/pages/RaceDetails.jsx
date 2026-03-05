import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { f1Service } from '../services/f1Api';
import { ArrowLeft, Trophy, Timer, Flag, Info } from 'lucide-react';

const RaceDetails = () => {
    const { year, round } = useParams();
    const navigate = useNavigate();
    const [raceResults, setRaceResults] = useState(null);
    const [raceSchedule, setRaceSchedule] = useState(null);
    const [qualifying, setQualifying] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [results, schedule, qualy] = await Promise.all([
                    f1Service.getRaceResults(year, round),
                    f1Service.getRaceSchedule(year, round),
                    f1Service.getQualifyingResults(year, round)
                ]);
                setRaceResults(results);
                setRaceSchedule(schedule);
                setQualifying(qualy);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching race details:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [year, round]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Race Details...</div>;

    // Use schedule as the base if results aren't available yet
    const baseInfo = raceResults || raceSchedule;
    if (!baseInfo) return <div style={{ textAlign: 'center', padding: '5rem' }}>No data found for this race.</div>;

    const hasResults = !!raceResults?.Results;

    return (
        <div className="animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', opacity: 0.7 }}
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid #e10600' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ color: '#e10600', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                            {baseInfo.season} Round {baseInfo.round}
                        </div>
                        <h1 className="f1-title" style={{ fontSize: '3rem' }}>{baseInfo.raceName}</h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.7, marginTop: '0.5rem' }}>
                            {baseInfo.Circuit.circuitName}, {baseInfo.Circuit.Location.locality}, {baseInfo.Circuit.Location.country}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                            {new Date(baseInfo.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div style={{ opacity: 0.6 }}>{baseInfo.time?.replace('Z', '')} UTC</div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Main Content Area */}
                <div style={{ gridColumn: hasResults ? 'span 2' : 'span 1' }}>
                    {hasResults ? (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Trophy size={20} color="#e10600" />
                                <h3 className="f1-title">Race Results</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '1rem' }}>Pos</th>
                                            <th style={{ padding: '1rem' }}>Driver</th>
                                            <th style={{ padding: '1rem' }}>Constructor</th>
                                            <th style={{ padding: '1rem' }}>Laps</th>
                                            <th style={{ padding: '1rem' }}>Time/Status</th>
                                            <th style={{ padding: '1rem' }}>Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raceResults.Results.map((res) => (
                                            <tr key={res.Driver.driverId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem', fontWeight: 900 }}>{res.position}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: 'bold' }}>{res.Driver.givenName} {res.Driver.familyName}</div>
                                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>#{res.number}</div>
                                                </td>
                                                <td style={{ padding: '1rem', opacity: 0.8 }}>{res.Constructor.name}</td>
                                                <td style={{ padding: '1rem' }}>{res.laps}</td>
                                                <td style={{ padding: '1rem' }}>{res.Time?.time || res.status}</td>
                                                <td style={{ padding: '1rem', fontWeight: 'bold', color: '#e10600' }}>{res.points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                <Timer size={24} color="#e10600" />
                                <h3 className="f1-title">Weekend Schedule</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Free Practice 1', date: baseInfo.FirstPractice?.date, time: baseInfo.FirstPractice?.time },
                                    { label: 'Free Practice 2', date: baseInfo.SecondPractice?.date, time: baseInfo.SecondPractice?.time },
                                    { label: 'Free Practice 3', date: baseInfo.ThirdPractice?.date, time: baseInfo.ThirdPractice?.time },
                                    { label: 'Qualifying', date: baseInfo.Qualifying?.date, time: baseInfo.Qualifying?.time, bold: true },
                                    { label: 'Grand Prix', date: baseInfo.date, time: baseInfo.time, highlight: true },
                                ].filter(s => s.date).map((s, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '1.5rem',
                                        background: s.highlight ? 'rgba(225, 6, 0, 0.1)' : 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        borderLeft: s.highlight ? '4px solid #e10600' : '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: s.highlight ? '#e10600' : 'inherit' }}>{s.label}</div>
                                            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>{new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{s.time?.replace('Z', '') || '--:--'}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>UTC</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Side Info / Secondary Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {hasResults && (
                        <>
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 className="f1-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Fastest Lap</h3>
                                {raceResults.Results[0]?.FastestLap ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{raceResults.Results.find(r => r.FastestLap?.rank === "1")?.Driver.familyName || 'N/A'}</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#e10600' }}>{raceResults.Results.find(r => r.FastestLap?.rank === "1")?.FastestLap?.Time.time}</div>
                                        </div>
                                        <Timer size={32} opacity={0.2} />
                                    </div>
                                ) : <p style={{ opacity: 0.6 }}>No fastest lap data</p>}
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 className="f1-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Qualifying Top 3</h3>
                                {qualifying?.QualifyingResults ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {qualifying.QualifyingResults.slice(0, 3).map(q => (
                                            <div key={q.Driver.driverId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span>{q.position}. {q.Driver.familyName}</span>
                                                <span style={{ fontWeight: 'bold' }}>{q.Q3 || q.Q2 || q.Q1}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p style={{ opacity: 0.6 }}>Qualifying data unavailable</p>}
                            </div>
                        </>
                    )}

                    {!hasResults && (
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <Info size={18} color="#e10600" />
                                <h3 className="f1-title" style={{ fontSize: '1rem' }}>Race Info</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
                                Results will be updated live as the race weekend progresses. Check back after qualifying for the starting grid!
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                tr:nth-child(even) { background: rgba(255,255,255,0.02); }
                tr:hover { background: rgba(225,6,0,0.05); }
            `}</style>
        </div>
    );
};

export default RaceDetails;
