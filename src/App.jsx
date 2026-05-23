import { useCallback, useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import CyberCity from './components/city/CyberCity';
import BootSequence from './components/BootSequence';
import RoleSelection from './components/RoleSelection';
import AnalystOnboarding from './components/AnalystOnboarding';
import HUD from './components/panels/HUD';
import MissionBoard from './components/panels/MissionBoard';
import AnalystProfile from './components/panels/AnalystProfile';
import ThreatFeed from './components/panels/ThreatFeed';
import SOCDashboard from './components/mission/SOCDashboard';
import AfterActionReport from './components/AfterActionReport';
import OrgDashboard from './components/org/OrgDashboard';
import AILoading from './components/AILoading';
import Minimap from './components/Minimap';
import { generateMission, generateDebrief } from './services/claude';
import { SEED_MISSIONS, buildSeedMission } from './data/seedData';
import { getRankFromXp } from './utils/scoring';

function AppShell() {
  const { state, dispatch, recordResponse, finishMission } = useGame();
  const [missions, setMissions] = useState([...SEED_MISSIONS]);
  const [missionLoading, setMissionLoading] = useState(false);

  const handleCityReady = useCallback(() => {
    dispatch({ type: 'CITY_READY' });
  }, [dispatch]);

  // If city is ready but screen stuck, force boot sequence
  useEffect(() => {
    if (state.cityReady && state.screen === 'city-loading') {
      dispatch({ type: 'SET_SCREEN', screen: 'boot' });
    }
  }, [state.cityReady, state.screen, dispatch]);

  // Fallback: always leave loading after 5s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!state.cityReady) dispatch({ type: 'CITY_READY' });
    }, 5000);
    return () => clearTimeout(t);
  }, [state.cityReady, dispatch]);

  const handleDistrictClick = useCallback(
    (district) => {
      dispatch({ type: 'SET_DISTRICT', district });
    },
    [dispatch]
  );

  const refreshMissions = useCallback(async () => {
    setMissionLoading(true);
    dispatch({ type: 'AI_LOADING', loading: true });
    const rank = getRankFromXp(state.xp);
    try {
      const mission = await generateMission({
        rank: rank.id,
        skills: state.skills,
        district: state.selectedDistrict,
      });
      setMissions((m) => [mission, ...m.filter((x) => x.mission_name !== mission.mission_name)].slice(0, 6));
    } catch {
      setMissions([buildSeedMission(state.selectedDistrict, rank.id), ...SEED_MISSIONS.slice(0, 4)]);
    } finally {
      setMissionLoading(false);
      dispatch({ type: 'AI_LOADING', loading: false });
    }
  }, [state.xp, state.skills, state.selectedDistrict, dispatch]);

  useEffect(() => {
    if (state.screen === 'city' && state.role === 'analyst') {
      refreshMissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when entering city
  }, [state.screen, state.role]);

  useEffect(() => {
    if (!state.missionMode || state.missionTimeLeft <= 0) return;
    const id = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000);
    return () => clearInterval(id);
  }, [state.missionMode, state.missionTimeLeft, dispatch]);

  const acceptMission = (mission) => {
    const full = mission.logs ? mission : { ...buildSeedMission(mission.district || state.selectedDistrict), ...mission };
    dispatch({ type: 'SET_MISSION', mission: full });
    dispatch({ type: 'SET_DISTRICT', district: full.district || state.selectedDistrict });
  };

  const handleResponse = async (alert, action, result) => {
    const count = await recordResponse(alert, action, result);
    const totalAlerts = state.activeMission?.alerts?.length || 5;
    if (count >= totalAlerts) {
      setTimeout(() => endMission(), 800);
    }
  };

  const endMission = async () => {
    dispatch({ type: 'AI_LOADING', loading: true });
    try {
      const debrief = await generateDebrief({
        decisions: state.missionDecisions,
        timeTaken: 300 - state.missionTimeLeft,
        score: state.sessionXp,
        skills: state.skills,
      });
      await finishMission(debrief);
    } finally {
      dispatch({ type: 'AI_LOADING', loading: false });
    }
  };

  const handleIntel = () => {
    dispatch({ type: 'HINT_USED' });
    dispatch({ type: 'APPLY_XP', delta: -100 });
  };

  const showOverlay = ['boot', 'role', 'onboard', 'login'].includes(state.screen);
  const showCityUI = state.role === 'analyst' && ['city', 'debrief'].includes(state.screen);
  const showOrg = state.role === 'organisation' && state.screen === 'org';

  return (
    <div className="nexus-app">
      {/* City always mounted — renders before UI overlays clear */}
      <CyberCity
        visible={state.cityReady}
        onDistrictClick={handleDistrictClick}
        onReady={handleCityReady}
        controlsEnabled={state.role === 'analyst' && state.screen === 'city' && !state.missionMode}
      />

      {!state.cityReady && (
        <div className="city-loading-screen">
          <div className="city-loading-spinner" />
          <p>INITIALISING CYBER CITY...</p>
        </div>
      )}

      {state.screen === 'boot' && state.cityReady && (
        <BootSequence onComplete={() => dispatch({ type: 'SET_SCREEN', screen: 'role' })} />
      )}

      {state.screen === 'role' && (
        <RoleSelection
          onSelect={(role) => {
            dispatch({ type: 'SET_ROLE', role });
            dispatch({ type: 'SET_SCREEN', screen: role === 'analyst' ? 'onboard' : 'org' });
          }}
        />
      )}

      {state.screen === 'onboard' && (
        <AnalystOnboarding
          onComplete={({ callsign, aura }) => {
            dispatch({ type: 'SET_ANALYST', callsign, aura });
            dispatch({ type: 'SET_SCREEN', screen: 'city' });
          }}
        />
      )}

      {showOrg && <OrgDashboard />}

      {showCityUI && (
        <>
          <HUD state={state} />
          {state.panels.left && (
            <MissionBoard
              missions={missions}
              loading={missionLoading}
              district={state.selectedDistrict}
              onAccept={acceptMission}
              onGenerate={refreshMissions}
            />
          )}
          {state.panels.right && <AnalystProfile state={state} />}
          {state.panels.bottom && (
            <ThreatFeed
              feed={state.threatFeed}
              onInvestigate={() => dispatch({ type: 'SET_THREAT', level: 'ORANGE' })}
            />
          )}
          <Minimap selected={state.selectedDistrict} avatarPosition={state.avatarPosition} />
          <div className="panel-toggles">
            {['left', 'right', 'bottom'].map((p) => (
              <button key={p} type="button" className="toggle-btn" onClick={() => dispatch({ type: 'TOGGLE_PANEL', panel: p })}>
                {p[0].toUpperCase()}
              </button>
            ))}
          </div>
          {!state.missionMode && (
            <button type="button" className="nexus-btn primary fab-mission" onClick={() => missions[0] && acceptMission(missions[0])}>
              QUICK DEPLOY
            </button>
          )}
        </>
      )}

      {state.missionMode && (
        <SOCDashboard
          mission={state.activeMission}
          threatLevel={state.threatLevel}
          selectedAlert={state.selectedAlert}
          onSelectAlert={(alert) => dispatch({ type: 'SELECT_ALERT', alert })}
          onResponse={handleResponse}
          onClose={endMission}
          aiLoading={state.aiLoading}
          setAiLoading={(loading) => dispatch({ type: 'AI_LOADING', loading })}
          onIntel={handleIntel}
        />
      )}

      {state.screen === 'debrief' && state.debrief && (
        <AfterActionReport
          debrief={state.debrief}
          skills={state.skills}
          rankUp={state.rankUpPending}
          newRank={state.newRank}
          callsign={state.callsign}
          xp={state.xp}
          onContinue={() => dispatch({ type: 'RETURN_CITY' })}
          onClearRankUp={() => dispatch({ type: 'CLEAR_RANK_UP' })}
        />
      )}

      <AILoading show={state.aiLoading} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
