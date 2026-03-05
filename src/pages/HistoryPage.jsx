import React, { useState, useEffect } from 'react';
import { f1Service } from '../services/f1Api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from 'recharts';
import { History as HistoryIcon, Search, Trophy, TrendingUp } from 'lucide-react';
import { getTeamColor } from '../utils/colors';

const HistoryPage = () => {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const years = Array.from({ length: 11 }, (_, i) => (2026 - i).toString());

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const result = await f1Service.getYearData(selectedYear);
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [selectedYear]);

    // Process data for charts
    const getChartData = () => {
        if (!data?.drivers) return [];
        return data.drivers.slice(0, 8).map(d => ({
            name: d.Driver.familyName,
            points: parseInt(d.points),
            wins: parseInt(d.wins),
            constructorId: d.Constructors[0].constructorId
        }));
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Historical Data...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#e10600', padding: '10px', borderRadius: '12px' }}>
                        <HistoryIcon size={24} />
                    </div>
                    <h1 className="f1-title" style={{ fontSize: '2.5rem' }}>F1 History Explorer</h1>
                </div>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="glass-card"
                    style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                    {years.map(y => <option key={y} value={y} style={{ background: '#0b0b0b' }}>{y} Season</option>)}
                </select>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '2.5rem' }}>
                {/* Championship Card */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderTop: '5px solid #FFD700' }}>
                    <Trophy size={48} color="#FFD700" style={{ marginBottom: '1rem' }} />
                    <div style={{ fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '2px' }}>World Champion</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem' }}>
                        {data?.drivers[0]?.Driver.givenName} {data?.drivers[0]?.Driver.familyName}
                    </h2>
                    <div style={{ color: '#e10600', fontWeight: 'bold' }}>{data?.drivers[0]?.Constructors[0].name}</div>
                </div>

                {/* Stats Grid */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span opacity={0.6}>Total Races</span>
                        <span style={{ fontWeight: 900 }}>{data?.races.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span opacity={0.6}>Total Points</span>
                        <span style={{ fontWeight: 900 }}>{data?.drivers[0]?.points}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span opacity={0.6}>Total Wins</span>
                        <span style={{ fontWeight: 900 }}>{data?.drivers[0]?.wins}</span>
                    </div>
                </div>
            </div>

            {/* Analytics Visualization */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
                <div className="glass-card" style={{ padding: '2rem', minHeight: '400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <TrendingUp size={20} color="#e10600" />
                        <h3 className="f1-title">Driver Performance (Points)</h3>
                    </div>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getChartData()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    contentStyle={{ background: '#15151e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e10600' }}
                                />
                                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                                    {getChartData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getTeamColor(entry.constructorId)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', minHeight: '400px' }}>
                    <h3 className="f1-title" style={{ marginBottom: '2rem' }}>Constructor Standings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {data?.constructors.slice(0, 8).map((c, i) => (
                            <div key={c.Constructor.constructorId} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ width: '25px', fontWeight: 900, opacity: 0.5 }}>{c.position}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{c.Constructor.name}</span>
                                        <span>{c.points} PTS</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                background: getTeamColor(c.Constructor.constructorId),
                                                width: `${(parseInt(c.points) / parseInt(data.constructors[0].points)) * 100}%`,
                                                transition: 'width 1s ease-out'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
