"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Strategies_1 = require("@civ-clone/library-strategy/Strategies");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const PlayerActions_1 = require("@civ-clone/library-unit/PlayerActions");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const Priority_1 = require("@civ-clone/core-strategy/Rules/Priority");
const Priority_2 = require("@civ-clone/core-rule/Priority");
const cityDetails_1 = require("@civ-clone/library-strategy/lib/cityDetails");
const unitDetails_1 = require("@civ-clone/library-strategy/lib/unitDetails");
const actionIs = (...actions) => new Criterion_1.default((action) => actions.some((ActionType) => action instanceof ActionType));
const strategyIs = (...strategies) => new Criterion_1.default((action, strategy) => strategies.some((StrategyType) => strategy instanceof StrategyType));
const getRules = (cityGrowthRegistry = CityGrowthRegistry_1.instance, cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) => [
    new Priority_1.default(new Criterion_1.default((action, strategy) => strategy instanceof Strategies_1.MoveToGoodSiteForCity), actionIs(PlayerActions_1.ActiveUnit, PlayerActions_1.InactiveUnit), new Criterion_1.default((action) => cityRegistry.getByPlayer(action.player()).length === 0), new Effect_1.default(() => new High_1.default())),
    new Priority_1.default(strategyIs(Strategies_1.BuildCity), actionIs(PlayerActions_1.ActiveUnit, PlayerActions_1.InactiveUnit), new Criterion_1.default((action) => cityRegistry.getByPlayer(action.player()).length === 0), new Effect_1.default(() => new Priority_2.default(-Infinity))),
    new Priority_1.default(new Low_1.default(), strategyIs(Strategies_1.BuildCity, Strategies_1.BuildDefender, Strategies_1.BuildExplorer, Strategies_1.BuildNavalTransportForAirUnits, Strategies_1.BuildNavalTransportForLandUnits, Strategies_1.BuildSettlers, Strategies_1.BuyDefender, Strategies_1.ChangeGovernment, Strategies_1.CheckForUndefendedCities, Strategies_1.ChooseResearch, Strategies_1.ContinueOnPath, 
    // DoNothingWithUnit,
    Strategies_1.FortifyDefender, Strategies_1.ImproveTile, Strategies_1.MoveToDefendCity, Strategies_1.MoveToExploreMap, Strategies_1.MoveToGoodSiteForCity, Strategies_1.MoveToTileToImprove), new Effect_1.default(() => new Priority_2.default(1000000))),
    new Priority_1.default(strategyIs(Strategies_1.MoveToExploreMap), actionIs(PlayerActions_1.ActiveUnit, PlayerActions_1.InactiveUnit), new Effect_1.default(() => new Low_1.default())),
    new Priority_1.default(strategyIs(Strategies_1.BuildDefender, Strategies_1.MoveToDefendCity), actionIs(PlayerActions_1.ActiveUnit, PlayerActions_1.InactiveUnit), new Criterion_1.default((action) => cityRegistry.getByPlayer(action.player()).some((city) => {
        const defendingUnits = unitRegistry
            .getByTile(city.tile())
            .filter((unit) => (0, unitDetails_1.isCityDefender)(unit, ruleRegistry, unitImprovementRegistry)), cityGrowth = cityGrowthRegistry.getByCity(city);
        return !(0, cityDetails_1.isCityDefended)(defendingUnits.length, cityGrowth.size());
    })), new Effect_1.default(() => new High_1.default())),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=priority.js.map