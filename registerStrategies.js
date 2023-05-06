"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Strategies_1 = require("@civ-clone/library-strategy/Strategies");
const StrategyRegistry_1 = require("@civ-clone/core-strategy/StrategyRegistry");
const ChooseResearchFromList_1 = require("@civ-clone/library-strategy/Strategies/ChooseResearchFromList");
StrategyRegistry_1.instance.register(new Strategies_1.BuildCity(), new Strategies_1.BuildDefender(), new Strategies_1.BuildExplorer(), new Strategies_1.BuildNavalTransportForAirUnits(), new Strategies_1.BuildNavalTransportForLandUnits(), new Strategies_1.BuildSettlers(), new Strategies_1.BuyDefender(), new Strategies_1.ChangeGovernment(), new Strategies_1.CheckForUndefendedCities(), new Strategies_1.ChooseResearch(), new ChooseResearchFromList_1.default(), new Strategies_1.ContinueOnPath(), new Strategies_1.DoNothingWithUnit(), new Strategies_1.FortifyDefender(), new Strategies_1.ImproveTile(), 
// new MoveToDefendCity(),
new Strategies_1.MoveToExploreMap(), new Strategies_1.MoveToGoodSiteForCity(), new Strategies_1.MoveToTileToImprove());
//# sourceMappingURL=registerStrategies.js.map