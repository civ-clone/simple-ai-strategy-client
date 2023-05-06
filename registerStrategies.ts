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
import { instance as strategyRegistryInstance } from '@civ-clone/core-strategy/StrategyRegistry';
import ChooseResearchFromList from '@civ-clone/library-strategy/Strategies/ChooseResearchFromList';

strategyRegistryInstance.register(
  new BuildCity(),
  new BuildDefender(),
  new BuildExplorer(),
  new BuildNavalTransportForAirUnits(),
  new BuildNavalTransportForLandUnits(),
  new BuildSettlers(),
  new BuyDefender(),
  new ChangeGovernment(),
  new CheckForUndefendedCities(),
  new ChooseResearch(),
  new ChooseResearchFromList(),
  new ContinueOnPath(),
  new DoNothingWithUnit(),
  new FortifyDefender(),
  new ImproveTile(),
  // new MoveToDefendCity(),
  new MoveToExploreMap(),
  new MoveToGoodSiteForCity(),
  new MoveToTileToImprove()
);
