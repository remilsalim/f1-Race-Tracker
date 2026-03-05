export const TEAM_COLORS = {
    mercedes: '#00D2BE',
    red_bull: '#0600EF',
    ferrari: '#DC0000',
    mclaren: '#FF8700',
    alpine: '#0090FF',
    aston_martin: '#006F62',
    williams: '#005AFF',
    alpha_tauri: '#2B4562',
    rb: '#6692FF',
    sauber: '#00E701',
    alfa: '#900000',
    haas: '#B6BABD',
    lotus_f1: '#FFB800',
    force_india: '#F596C8',
    toro_rosso: '#469BFF',
    manor: '#ED1C24',
    caterham: '#005030',
    renault: '#FFF500',
    racing_point: '#F596C8',
    benetton: '#008860',
    jordan: '#FFFB00',
    minardi: '#E9FF00',
};

export const getTeamColor = (constructorId) => {
    return TEAM_COLORS[constructorId] || '#949498'; // Default grey
};
