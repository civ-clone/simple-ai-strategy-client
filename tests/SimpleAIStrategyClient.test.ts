import { Sail, Settlers, Warrior } from '@civ-clone/civ1-unit/Units';
import {
  TurnStart,
} from '@civ-clone/core-player/Rules/TurnStart';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import BasePathFinder from '@civ-clone/simple-world-path/BasePathFinder';
import BuildCity from "@civ-clone/base-strategy-build-city/BuildCity";
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry, {instance as cityGrowthRegistryInstance} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityNameRegistry from '@civ-clone/core-civilization/CityNameRegistry';
import CityRegistry, {instance as cityRegistryInstance} from '@civ-clone/core-city/CityRegistry';
import Civilization from '@civ-clone/core-civilization/Civilization';
import CivilizationRegistry from '@civ-clone/core-civilization/CivilizationRegistry';
import Client from '@civ-clone/core-client/Client';
import { Fortified } from '@civ-clone/civ1-unit/UnitImprovements';
import GoodyHutRegistry from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import LeaderRegistry from '@civ-clone/core-civilization/LeaderRegistry';
import PathFinderRegistry, {instance as pathFinderRegistryInstance} from '@civ-clone/core-world-path/PathFinderRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerTreasuryRegistry from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry, {instance as ruleRegistryInstance} from '@civ-clone/core-rule/RuleRegistry';
import StrategyAIClient from '@civ-clone/core-strategy-ai-client/StrategyAIClient';
import StrategyNoteRegistry from '@civ-clone/core-strategy/StrategyNoteRegistry';
import StrategyRegistry from '@civ-clone/core-strategy/StrategyRegistry';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TransportRegistry from '@civ-clone/core-unit-transport/TransportRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import UnitImprovement from '@civ-clone/core-unit-improvement/UnitImprovement';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import UnitRegistry, {instance as unitRegistryInstance} from '@civ-clone/core-unit/UnitRegistry';
import World from '@civ-clone/core-world/World';
import cityCreated from '@civ-clone/civ1-city/Rules/City/created';
import { expect } from 'chai';
import playerAction from '@civ-clone/civ1-unit/Rules/Player/action';
import playerUnitCreated from '@civ-clone/civ1-player/Rules/Unit/created';
import registerCivilizations from '@civ-clone/civ1-civilization/registerCivilizations';
import registerLeaders from '@civ-clone/civ1-civilization/registerLeaders';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import simpleRLELoader from '@civ-clone/simple-world-generator/tests/lib/simpleRLELoader';
import tileYields from '@civ-clone/civ1-world/Rules/Tile/yield';
import turnYear from '@civ-clone/civ1-game-year/Rules/Turn/year';
import unitAction from '@civ-clone/civ1-unit/Rules/Unit/action';
import unitActivate from '@civ-clone/civ1-unit/Rules/Unit/activate';
import unitCreated from '@civ-clone/civ1-unit/Rules/Unit/created';
import unitDestroyed from '@civ-clone/civ1-unit/Rules/Unit/destroyed';
import unitMoved from '@civ-clone/civ1-unit/Rules/Unit/moved';
import unitMovementCost from '@civ-clone/civ1-unit/Rules/Unit/movementCost';
import unitValidateMove from '@civ-clone/civ1-unit/Rules/Unit/validateMove';
import unitVisibility from '@civ-clone/civ1-player/Rules/Unit/visibility';
import unitYield from '@civ-clone/civ1-unit/Rules/Unit/yield';

describe('SimpleAIClient', (): void => {
  const advanceRegistry = new AdvanceRegistry(),
    availableGovernmentRegistry = new AvailableGovernmentRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityNameRegistry = new CityNameRegistry(),
    cityRegistry = new CityRegistry(),
    civilizationRegistry = new CivilizationRegistry(),
    goodyHutRegistry = new GoodyHutRegistry(),
    leaderRegistry = new LeaderRegistry(),
    pathFinderRegistry = new PathFinderRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    playerRegistry = new PlayerRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerTreasuryRegistry = new PlayerTreasuryRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    ruleRegistry = new RuleRegistry(),
    strategyNoteRegistry = new StrategyNoteRegistry(),
    strategyRegistry = new StrategyRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    transportRegistry = new TransportRegistry(),
    turn = new Turn(),
    unitImprovementRegistry = new UnitImprovementRegistry(),
    unitRegistry = new UnitRegistry(),
    simpleWorldLoader = simpleRLELoader(ruleRegistry),
    takeTurns = async (
      client: Client,
      n: number = 1,
      callable: () => void = () => {}
    ): Promise<void> => {
      while (n--) {
        const player = client.player();

        // ruleRegistry.process(Start);

        ruleRegistry.process(TurnStart, player);

        await client.takeTurn();

        callable();

        turn.increment();
      }
    },
    createClients = async (world: World, n: number = 1): Promise<Client[]> =>
      Promise.all(
        new Array(n).fill(0).map(async (): Promise<Client> => {
          const player = new Player(ruleRegistry),
            client = new StrategyAIClient(
              player,
              leaderRegistry,
              strategyRegistry
            ),
            availableCivilizations = civilizationRegistry.entries();

          await client.chooseCivilization(availableCivilizations);

          civilizationRegistry.unregister(
            player.civilization().constructor as typeof Civilization
          );

          playerRegistry.register(player);

          playerWorldRegistry.register(new PlayerWorld(player, world));

          playerGovernmentRegistry.register(
            new PlayerGovernment(
              player,
              availableGovernmentRegistry,
              ruleRegistry
            )
          );

          playerResearchRegistry.register(
            new PlayerResearch(player, advanceRegistry, ruleRegistry)
          );

          return client;
        })
      );

  ruleRegistry.register(
    ...unitAction(
      cityNameRegistry,
      cityRegistry,
      ruleRegistry,
      tileImprovementRegistry,
      unitImprovementRegistry,
      unitRegistry,
      terrainFeatureRegistry,
      transportRegistry,
      turn
    ),
    ...unitActivate(unitImprovementRegistry),
    ...unitDestroyed(unitRegistry),
    ...cityCreated(
      tileImprovementRegistry,
      cityBuildRegistry,
      cityGrowthRegistry,
      cityRegistry,
      playerWorldRegistry,
      ruleRegistry
    ),
    ...unitMovementCost(tileImprovementRegistry, transportRegistry),
    ...unitValidateMove(),
    ...unitCreated(unitRegistry),
    ...unitMoved(transportRegistry),
    ...tileYields(
      tileImprovementRegistry,
      terrainFeatureRegistry,
      playerGovernmentRegistry
    ),
    ...turnYear(),
    ...playerUnitCreated(),
    ...playerAction(unitRegistry),
    ...unitYield(unitImprovementRegistry, ruleRegistry),
    ...unitVisibility(playerWorldRegistry)
  );

  strategyRegistry.register(
    new BuildCity(
      cityRegistry,
      cityGrowthRegistry,
      pathFinderRegistry,
      ruleRegistry,
      strategyNoteRegistry,
      unitRegistry
    )
  );

  registerCivilizations(civilizationRegistry);
  registerLeaders(leaderRegistry);

  pathFinderRegistry.register(BasePathFinder);

  it('should build a city', async (): Promise<void> => {
    const world = await simpleWorldLoader('25G', 5, 5),
      [client] = await createClients(world),
      player = client.player(),
      unit = new Settlers(null, player, world.get(1, 1), ruleRegistry);

    await takeTurns(client, 1);

    expect(unit.destroyed()).true;
    expect(cityRegistry.getByPlayer(player).length).eq(1);
  });

  it('should move Settlers to a good site for a city', async (): Promise<void> => {
    const world = await simpleWorldLoader('3J7G3J7G3J7G70G', 10, 10),
      [client] = await createClients(world),
      player = client.player(),
      playerWorld = playerWorldRegistry.getByPlayer(player);

    expect(world.entries().length).to.equal(100);
    expect(playerWorld.entries().length).to.equal(0);

    const unit = new Settlers(null, player, world.get(1, 1), ruleRegistry);

    expect(playerWorld.entries().length).to.equal(9);

    expect(unit.visibility().value()).to.equal(1);

    await takeTurns(client, 3);

    expect(playerWorld.entries().length).to.equal(16);

    expect(cityRegistry.length).to.equal(1);
    expect(unitRegistry.length).to.equal(0);
  });

  // it('should move land units around to explore the available map', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('5O3GO3GO3G', 4, 4),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     playerWorld = playerWorldRegistry.getByPlayer(player);
  //
  //   expect(world.entries().length).to.equal(16);
  //   expect(playerWorld.entries().length).to.equal(0);
  //
  //   const unit = new Warrior(null, player, world.get(1, 1), ruleRegistry);
  //
  //   expect(playerWorld.entries().length).to.equal(9);
  //
  //   expect(unit.visibility().value()).to.equal(1);
  //
  //   await takeTurns(client, 3);
  //
  //   expect(playerWorld.entries().length).to.equal(16);
  // });
  //
  // it('should move naval units around to explore the available map', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('16O', 4, 4),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     playerWorld = playerWorldRegistry.getByPlayer(player);
  //
  //   new Sail(null, player, world.get(1, 1), ruleRegistry, transportRegistry);
  //
  //   expect(playerWorld.entries().length).to.equal(9);
  //
  //   await takeTurns(client);
  //
  //   expect(playerWorld.entries().length).to.equal(16);
  // });
  //
  // it('should embark land units onto naval transport units', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('6OG18O', 5, 5),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     unit = new Warrior(null, player, world.get(1, 1), ruleRegistry),
  //     transport = new Sail(
  //       null,
  //       player,
  //       world.get(2, 2),
  //       ruleRegistry,
  //       transportRegistry
  //     );
  //
  //   await takeTurns(client);
  //
  //   expect(unit.tile()).to.not.equal(world.get(1, 1));
  //   expect(transport.tile()).to.not.equal(world.get(2, 2));
  // });
  //
  // it('should disembark land units from naval transport units', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('5OG10O', 4, 4),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     unit = new Warrior(null, player, world.get(2, 2), ruleRegistry),
  //     transport = new Sail(
  //       null,
  //       player,
  //       world.get(2, 2),
  //       ruleRegistry,
  //       transportRegistry
  //     );
  //
  //   transport.stow(unit);
  //
  //   await takeTurns(client);
  //
  //   expect(unit.tile()).to.equal(world.get(1, 1));
  // });
  //
  // it('should set a path to a capturable enemy city', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('7O4G6OG2O3G2OG6O4G', 6, 6),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     enemy = new Player(ruleRegistry),
  //     unit = new Warrior(null, player, world.get(1, 1), ruleRegistry),
  //     playerWorld = playerWorldRegistry.getByPlayer(player);
  //
  //   playerWorldRegistry.register(new PlayerWorld(enemy, world));
  //
  //   const city = await setUpCity({
  //     cityGrowthRegistry,
  //     player: enemy,
  //     playerWorldRegistry,
  //     ruleRegistry: ruleRegistry,
  //     size: 2,
  //     tile: world.get(5, 5),
  //     tileImprovementRegistry,
  //     world,
  //   });
  //
  //   playerWorld.register(...world.entries());
  //
  //   cityRegistry.register(city);
  //
  //   await takeTurns(client, 13);
  //
  //   expect(unit.tile()).to.equal(city.tile());
  //   expect(city.player()).to.equal(player);
  // });
  //
  // it('should path to and fortify a fortifiable unit in an undefended friendly city', async (): Promise<void> => {
  //   const world = await simpleWorldLoader('7O4G6OG2O3G2OG6O4G', 6, 6),
  //     [client] = await createClients(world),
  //     player = client.player(),
  //     unit = new Warrior(null, player, world.get(1, 1), ruleRegistry),
  //     playerWorld = playerWorldRegistry.getByPlayer(player);
  //
  //   const city = await setUpCity({
  //     cityGrowthRegistry,
  //     player,
  //     playerWorldRegistry,
  //     ruleRegistry: ruleRegistry,
  //     size: 2,
  //     tile: world.get(5, 5),
  //     tileImprovementRegistry,
  //     world,
  //   });
  //
  //   playerWorld.register(...world.entries());
  //
  //   cityRegistry.register(city);
  //
  //   await takeTurns(client, 13);
  //
  //   expect(unit.tile()).to.equal(city.tile());
  //   expect(
  //     unitImprovementRegistry
  //       .getByUnit(unit)
  //       .some(
  //         (unitImprovement: UnitImprovement) =>
  //           unitImprovement instanceof Fortified
  //       )
  //   ).to.true;
  // });
});
