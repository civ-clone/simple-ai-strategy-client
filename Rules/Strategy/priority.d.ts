import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Priority from '@civ-clone/core-strategy/Rules/Priority';
export declare const getRules: (
  cityGrowthRegistry?: CityGrowthRegistry,
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry,
  unitImprovementRegistry?: UnitImprovementRegistry
) => Priority[];
export default getRules;
