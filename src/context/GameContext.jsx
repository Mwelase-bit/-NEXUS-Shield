import { createContext, useContext, useReducer, useCallback } from 'react';
import { INITIAL_SKILLS, SEED_ORG_EMPLOYEES, SEED_ORG_STATS, SEED_THREAT_FEED } from '../data/seedData';
import { getRankFromXp, updateSkill, evaluateXpChange, computeMissionBonus } from '../utils/scoring';

const GameContext = createContext(null);

const initialState = {
  screen: 'city-loading',
  cityReady: false,
  role: null,
  callsign: '',
  aura: 'cyan',
  xp: 0,
  skills: { ...INITIAL_SKILLS },
  badges: [],
  missionTypesCompleted: [],
  activeMission: null,
  selectedDistrict: 'CORE',
  playerPosition: [0, 0, 4],
  avatarPosition: { x: 0, z: 8 },
  avatarTarget: null,
  threatLevel: 'GREEN',
  sessionXp: 0,
  health: 100,
  shield: 100,
  panels: { left: true, right: true, bottom: true },
  missionMode: false,
  missionDecisions: [],
  missionStartTime: null,
  missionTimeLeft: 300,
  hintsUsed: 0,
  selectedAlert: null,
  threatFeed: [...SEED_THREAT_FEED],
  cityEffect: null,
  rankUpPending: false,
  debrief: null,
  aiLoading: false,
  org: {
    company: 'Sandton Financial Group',
    stats: { ...SEED_ORG_STATS },
    employees: [...SEED_ORG_EMPLOYEES],
    simulations: [],
    riskAnalysis: null,
  },
  showCinematic: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'CITY_READY':
      return { ...state, cityReady: true, screen: state.screen === 'city-loading' ? 'boot' : state.screen };
    case 'SET_ROLE':
      return { ...state, role: action.role };
    case 'SET_ANALYST':
      return { ...state, callsign: action.callsign, aura: action.aura };
    case 'TOGGLE_PANEL':
      return { ...state, panels: { ...state.panels, [action.panel]: !state.panels[action.panel] } };
    case 'SET_DISTRICT':
      return { ...state, selectedDistrict: action.district };
    case 'SET_AVATAR_TARGET':
      return { ...state, avatarTarget: action.target };
    case 'SET_AVATAR_POSITION':
      return { ...state, avatarPosition: action.position, avatarTarget: state.avatarTarget };
    case 'CLEAR_AVATAR_TARGET':
      return { ...state, avatarTarget: null };
    case 'SET_MISSION':
      return {
        ...state,
        activeMission: action.mission,
        missionMode: true,
        missionDecisions: [],
        missionStartTime: Date.now(),
        missionTimeLeft: 300,
        hintsUsed: 0,
        selectedAlert: null,
        threatLevel: 'YELLOW',
      };
    case 'END_MISSION':
      return {
        ...state,
        missionMode: false,
        debrief: action.debrief,
        screen: 'debrief',
        activeMission: null,
        selectedAlert: null,
      };
    case 'SET_THREAT':
      return { ...state, threatLevel: action.level };
    case 'SET_CITY_EFFECT':
      return { ...state, cityEffect: action.effect };
    case 'CLEAR_CITY_EFFECT':
      return { ...state, cityEffect: null };
    case 'SELECT_ALERT':
      return { ...state, selectedAlert: action.alert };
    case 'ADD_DECISION':
      return { ...state, missionDecisions: [...state.missionDecisions, action.decision] };
    case 'AI_LOADING':
      return { ...state, aiLoading: action.loading };
    case 'APPLY_XP': {
      const newXp = Math.max(0, state.xp + action.delta);
      const oldRank = getRankFromXp(state.xp);
      const newRank = getRankFromXp(newXp);
      const rankUp = newRank.id > oldRank.id;
      const badges = rankUp && newRank.badge ? [...state.badges, newRank.badge] : state.badges;
      return {
        ...state,
        xp: newXp,
        sessionXp: state.sessionXp + action.delta,
        skills: action.skills || state.skills,
        badges,
        rankUpPending: rankUp,
        newRank: rankUp ? newRank : null,
      };
    }
    case 'HINT_USED':
      return { ...state, hintsUsed: state.hintsUsed + 1 };
    case 'TICK_TIMER':
      return { ...state, missionTimeLeft: Math.max(0, state.missionTimeLeft - 1) };
    case 'SET_DEBRIEF':
      return { ...state, debrief: action.debrief };
    case 'CLEAR_RANK_UP':
      return { ...state, rankUpPending: false, newRank: null };
    case 'COMPLETE_TYPES':
      return { ...state, missionTypesCompleted: action.types };
    case 'SET_ORG':
      return { ...state, org: { ...state.org, ...action.org } };
    case 'ADD_SIMULATION':
      return { ...state, org: { ...state.org, simulations: [...state.org.simulations, action.sim] } };
    case 'SHOW_CINEMATIC':
      return { ...state, showCinematic: action.show };
    case 'RETURN_CITY':
      return { ...state, screen: 'city', debrief: null, threatLevel: 'GREEN' };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const recordResponse = useCallback(async (alert, action, evalResult) => {
    const xpDelta = evalResult.xp_change ?? evaluateXpChange(alert.severity, evalResult.correct);
    const skills = updateSkill(state.skills, alert, evalResult.correct);
    const decisionCount = state.missionDecisions.length + 1;
    dispatch({
      type: 'ADD_DECISION',
      decision: {
        alertDescription: alert.description,
        action,
        correct: evalResult.correct,
        explanation: evalResult.explanation,
      },
    });
    dispatch({ type: 'APPLY_XP', delta: xpDelta, skills });
    dispatch({
      type: 'SET_CITY_EFFECT',
      effect: { type: evalResult.correct ? 'shield' : 'breach', district: state.selectedDistrict },
    });
    setTimeout(() => dispatch({ type: 'CLEAR_CITY_EFFECT' }), 900);
    if (!evalResult.correct) {
      dispatch({ type: 'SET_THREAT', level: 'RED' });
    }
    return decisionCount;
  }, [state.skills, state.selectedDistrict, state.missionDecisions.length]);

  const finishMission = useCallback(async (debrief) => {
    const allCorrect = state.missionDecisions.every((d) => d.correct);
    const bonus = computeMissionBonus({
      allCorrect,
      noHints: state.hintsUsed === 0,
      timeRemaining: state.missionTimeLeft,
      firstTimeType: true,
      missionTypesCompleted: state.missionTypesCompleted,
      type: state.activeMission?.mission_type,
    });
    if (bonus > 0) dispatch({ type: 'APPLY_XP', delta: bonus });
    const types = state.activeMission?.mission_type
      ? [...new Set([...state.missionTypesCompleted, state.activeMission.mission_type])]
      : state.missionTypesCompleted;
    dispatch({ type: 'COMPLETE_TYPES', types });
    dispatch({ type: 'END_MISSION', debrief });
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch, recordResponse, finishMission }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
