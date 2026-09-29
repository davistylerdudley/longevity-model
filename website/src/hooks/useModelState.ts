'use client';

import { createContext, useContext, useReducer, useState, Dispatch, SetStateAction } from 'react';
import type { ModelParameters, UserProfile } from '../lib/types';
import { DEFAULT_PARAMS, DEFAULT_COUNTRY_CODE } from '../lib/constants';

type Action =
  | { type: 'SET_P0'; value: number }
  | { type: 'SET_AGING_SCENARIO'; value: ModelParameters['agingScenario'] }
  | { type: 'SET_BIOLOGICAL_AGE'; value: number }
  | { type: 'SET_AGING_SLOW_FACTOR'; value: number }
  | { type: 'SET_ADVANCEMENT_SCENARIO'; value: ModelParameters['advancementScenario'] }
  | { type: 'SET_RISK_PROFILE'; value: ModelParameters['riskProfileId'] }
  | { type: 'SET_WEALTH_QUINTILE'; value: ModelParameters['wealthQuintile'] }
  | { type: 'SET_MAX_ACCESS_DELAY'; value: number }
  | { type: 'RESET' };

function reducer(state: ModelParameters, action: Action): ModelParameters {
  switch (action.type) {
    case 'SET_P0': return { ...state, p0: action.value };
    case 'SET_AGING_SCENARIO': return { ...state, agingScenario: action.value };
    case 'SET_BIOLOGICAL_AGE': return { ...state, biologicalAge: action.value };
    case 'SET_AGING_SLOW_FACTOR': return { ...state, agingSlowFactor: action.value };
    case 'SET_ADVANCEMENT_SCENARIO': return { ...state, advancementScenario: action.value };
    case 'SET_RISK_PROFILE': return { ...state, riskProfileId: action.value };
    case 'SET_WEALTH_QUINTILE': return { ...state, wealthQuintile: action.value };
    case 'SET_MAX_ACCESS_DELAY': return { ...state, maxAccessDelayYears: action.value };
    case 'RESET': return DEFAULT_PARAMS;
    default: return state;
  }
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  countryCode: DEFAULT_COUNTRY_CODE,
  currentAge: 35,
  incomePercentile: 50,
  riskAppetite: 50,
  treatmentYear: 2045,
};

export interface ModelContextValue {
  params: ModelParameters;
  dispatch: Dispatch<Action>;
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  hasProfile: boolean;
  setHasProfile: Dispatch<SetStateAction<boolean>>;
}

export const ModelContext = createContext<ModelContextValue>({
  params: DEFAULT_PARAMS,
  dispatch: () => undefined,
  profile: DEFAULT_PROFILE,
  setProfile: () => undefined,
  hasProfile: false,
  setHasProfile: () => undefined,
});

export function useModelState() {
  const [params, dispatch] = useReducer(reducer, DEFAULT_PARAMS);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [hasProfile, setHasProfile] = useState(false);
  return { params, dispatch, profile, setProfile, hasProfile, setHasProfile };
}

export function useModel() {
  return useContext(ModelContext);
}
