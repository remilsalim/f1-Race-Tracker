import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Calendar, Clock, Target, Info, X } from 'lucide-react';

const EventsPage = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', location: '', date: '', time: '', type: 'Screening', isFree: true });

    useEffect(() => {
        const stored = localStorage.getItem('f1_events');
        if (stored) setEvents(JSON.parse(stored));

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Location access denied", err)
            );
        }
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1) return null;
        const R = 6371; // Radius of earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        const updated = [...events, { ...newEvent, id: Date.now(), lat: userLocation?.lat || 0, lng: userLocation?.lng || 0 }];
        setEvents(updated);
        localStorage.setItem('f1_events', JSON.stringify(updated));
        setShowForm(false);
        setNewEvent({ name: '', location: '', date: '', time: '', type: 'Screening', isFree: true });
    };

    return (
        <>
            <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="f1-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>F1 Screenings & Events</h1>
                        <p style={{ opacity: 0.7 }}>Find local F1 hangouts or add your own event to the community.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ background: '#e10600', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Plus size={20} /> Add Event
                    </button>
                </div>

                {userLocation ? (
                    <div style={{ background: 'rgba(225, 6, 0, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(225, 6, 0, 0.2)' }}>
                        <Target size={18} color="#e10600" />
                        <span>Location enabled. Showing events near you.</span>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Info size={18} opacity={0.6} />
                        <span style={{ opacity: 0.6 }}>Enable location access to see distances to events.</span>
                    </div>
                )}

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {events.map(event => {
                        const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng) : null;
                        return (
                            <div key={event.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span style={{ background: 'rgba(225, 6, 0, 0.2)', color: '#e10600', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {event.type}
                                        </span>
                                        <span style={{ background: event.isFree ? 'rgba(0, 225, 100, 0.2)' : 'rgba(255, 165, 0, 0.2)', color: event.isFree ? '#00e164' : '#ffa500', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {event.isFree ? 'FREE' : 'PAID'}
                                        </span>
                                    </div>
                                    {distance && <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{distance} km away</span>}
                                </div>
                                <h3 className="f1-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{event.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.7, fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MapPin size={16} /> {event.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={16} /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={16} /> {event.time}
                                    </div>
                                </div>
                                <button style={{ width: '100%', marginTop: '1.5rem', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    View Details
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(5, 5, 5, 0.9)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    overflowY: 'auto',
                    padding: '40px 20px'
                }}>
                    <div className="glass-card" style={{
                        width: '100%',
                        maxWidth: '550px',
                        padding: '3rem',
                        position: 'relative',
                        background: '#15151e',
                        border: '1px solid rgba(225, 6, 0, 0.3)',
                        flexShrink: 0,
                        margin: 'auto 0'
                    }}>
                        <button onClick={() => setShowForm(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}>
                            <X size={28} />
                        </button>
                        <h2 className="f1-title" style={{ marginBottom: '1.5rem' }}>Add New Event</h2>
                        <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Event Name</label>
                                <input
                                    required
                                    className="glass-card"
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    value={newEvent.name}
                                    onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                                    placeholder="e.g. Monaco GP Watch Party"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Location</label>
                                <input
                                    required
                                    className="glass-card"
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    value={newEvent.location}
                                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                    placeholder="e.g. The Red Bull Pub, City Center"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="glass-card"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="glass-card"
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.8rem', opacity: 0.8, fontSize: '0.9rem', fontWeight: 'bold', color: '#e10600', textTransform: 'uppercase', letterSpacing: '1px' }}>Event Type</label>
                                <div style={{ position: 'relative' }}>
                                    <div
                                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span>{newEvent.type === 'Screening' ? 'Race Screening' : newEvent.type === 'Meetup' ? 'F1 Meetup' : 'Motorsport Activity'}</span>
                                        <Plus size={18} style={{ transform: showTypeDropdown ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                                    </div>

                                    {showTypeDropdown && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 5px)',
                                            left: 0,
                                            right: 0,
                                            background: '#1a1a1a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            zIndex: 2100,
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                        }}>
                                            {[
                                                { val: 'Screening', lbl: 'Race Screening' },
                                                { val: 'Meetup', lbl: 'F1 Meetup' },
                                                { val: 'Activity', lbl: 'Motorsport Activity' }
                                            ].map(opt => (
                                                <div
                                                    key={opt.val}
                                                    onClick={() => {
                                                        setNewEvent({ ...newEvent, type: opt.val });
                                                        setShowTypeDropdown(false);
                                                    }}
                                                    style={{
                                                        padding: '12px 16px',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(225, 6, 0, 0.2)'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    {opt.lbl}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                onClick={() => setNewEvent({ ...newEvent, isFree: !newEvent.isFree })}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '24px',
                                    background: newEvent.isFree ? '#00e164' : '#38383f',
                                    borderRadius: '20px',
                                    position: 'relative',
                                    transition: 'background 0.3s'
                                }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '3px',
                                        left: newEvent.isFree ? '23px' : '3px',
                                        transition: 'left 0.3s'
                                    }} />
                                </div>
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: newEvent.isFree ? '#00e164' : 'rgba(255,255,255,0.6)' }}>
                                    {newEvent.isFree ? 'FREE ENTRY' : 'PAID ENTRY'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '1.5rem',
                                    padding: '16px',
                                    background: '#e10600',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: '900',
                                    fontSize: '1.1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(225, 6, 0, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#ff0700'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#e10600'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <Target size={20} /> Publish Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventsPage;
