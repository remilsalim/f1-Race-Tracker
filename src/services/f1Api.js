import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

const api = axios.create({
  baseURL: BASE_URL,
});

export const f1Service = {
  // Get next race
  getNextRace: async () => {
    const response = await api.get('/current/next.json');
    return response.data.MRData.RaceTable.Races?.[0] || null;
  },

  // Get last race results
  getLastRaceResults: async () => {
    const response = await api.get('/current/last/results.json');
    return response.data.MRData.RaceTable.Races?.[0] || null;
  },

  // Get current season calendar
  getSeasonCalendar: async (year = 'current') => {
    const response = await api.get(`/${year}.json`);
    return response.data.MRData.RaceTable.Races || [];
  },

  // Get driver standings
  getDriverStandings: async (year = 'current') => {
    const response = await api.get(`/${year}/driverStandings.json`);
    const lists = response.data.MRData.StandingsTable.StandingsLists;
    return lists.length > 0 ? lists[0].DriverStandings : [];
  },

  // Get constructor standings
  getConstructorStandings: async (year = 'current') => {
    const response = await api.get(`/${year}/constructorStandings.json`);
    const lists = response.data.MRData.StandingsTable.StandingsLists;
    return lists.length > 0 ? lists[0].ConstructorStandings : [];
  },

  // Get specific race results
  getRaceResults: async (year, round) => {
    const response = await api.get(`/${year}/${round}/results.json`);
    return response.data.MRData.RaceTable.Races?.[0] || null;
  },

  // Get race schedule (including session timings)
  getRaceSchedule: async (year, round) => {
    const response = await api.get(`/${year}/${round}.json`);
    return response.data.MRData.RaceTable.Races?.[0] || null;
  },

  // Get qualifying results
  getQualifyingResults: async (year, round) => {
    const response = await api.get(`/${year}/${round}/qualifying.json`);
    return response.data.MRData.RaceTable.Races[0];
  },

  // Get historical data for a specific year
  getYearData: async (year) => {
    const [races, drivers, constructors] = await Promise.all([
      f1Service.getSeasonCalendar(year),
      f1Service.getDriverStandings(year),
      f1Service.getConstructorStandings(year)
    ]);
    return { races, drivers, constructors };
  }
};

export default api;
