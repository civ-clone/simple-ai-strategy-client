import {
  BuildCity,
  BuildDefender,
  BuildExplorer,
  BuildNavalTransportForAirUnits,
  BuildNavalTransportForLandUnits,
  BuildSettlers,
  BuyDefender,
  ChangeGovernment,
  CheckForUndefendedCities,
  ChooseResearch,
  ContinueOnPath,
  DoNothingWithUnit,
  FortifyDefender,
  ImproveTile,
  MoveToDefendCity,
  MoveToExploreMap,
  MoveToGoodSiteForCity,
  MoveToTileToImprove,
} from '@civ-clone/library-strategy/Strategies';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import {
  ActiveUnit,
  InactiveUnit,
} from '@civ-clone/library-unit/PlayerActions';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import High from '@civ-clone/core-rule/Priorities/High';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Low from '@civ-clone/core-rule/Priorities/Low';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-strategy/Rules/Priority';
import PriorityValue from '@civ-clone/core-rule/Priority';
import Strategy from '@civ-clone/core-strategy/Strategy';
import { isCityDefended } from '@civ-clone/library-strategy/lib/cityDetails';
import { isCityDefender } from '@civ-clone/library-strategy/lib/unitDetails';

const actionIs = (...actions: IConstructor<PlayerAction>[]) =>
  new Criterion((action: PlayerAction) =>
    actions.some((ActionType) => action instanceof ActionType)
  );

const strategyIs = (...strategies: IConstructor<Strategy>[]) =>
  new Criterion((action: PlayerAction, strategy: Strategy) =>
    strategies.some((StrategyType) => strategy instanceof StrategyType)
  );

export const getRules = (
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
): Priority[] => [
  new Priority(
    new Criterion(
      (action: PlayerAction, strategy: Strategy) =>
        strategy instanceof MoveToGoodSiteForCity
    ),
    actionIs(ActiveUnit, InactiveUnit),
    new Criterion(
      (action: PlayerAction) =>
        cityRegistry.getByPlayer(action.player()).length === 0
    ),
    new Effect(() => new High())
  ),

  new Priority(
    strategyIs(BuildCity),
    actionIs(ActiveUnit, InactiveUnit),
    new Criterion(
      (action: PlayerAction) =>
        cityRegistry.getByPlayer(action.player()).length === 0
    ),
    new Effect(() => new PriorityValue(-Infinity))
  ),

  new Priority(
    new Low(),
    strategyIs(
      BuildCity,
      BuildDefender,
      BuildExplorer,
      BuildNavalTransportForAirUnits,
      BuildNavalTransportForLandUnits,
      BuildSettlers,
      BuyDefender,
      ChangeGovernment,
      CheckForUndefendedCities,
      ChooseResearch,
      ContinueOnPath,
      // DoNothingWithUnit,
      FortifyDefender,
      ImproveTile,
      MoveToDefendCity,
      MoveToExploreMap,
      MoveToGoodSiteForCity,
      MoveToTileToImprove
    ),
    new Effect(() => new PriorityValue(1000000))
  ),

  new Priority(
    strategyIs(MoveToExploreMap),
    actionIs(ActiveUnit, InactiveUnit),
    new Effect(() => new Low())
  ),

  new Priority(
    strategyIs(BuildDefender, MoveToDefendCity),
    actionIs(ActiveUnit, InactiveUnit),
    new Criterion((action: PlayerAction) =>
      cityRegistry.getByPlayer(action.player()).some((city) => {
        const defendingUnits = unitRegistry
            .getByTile(city.tile())
            .filter((unit) =>
              isCityDefender(unit, ruleRegistry, unitImprovementRegistry)
            ),
          cityGrowth = cityGrowthRegistry.getByCity(city);

        return !isCityDefended(defendingUnits.length, cityGrowth.size());
      })
    ),
    new Effect(() => new High())
  ),
];

export default getRules;
