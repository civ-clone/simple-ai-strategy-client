import StrategyAIClient from '@civ-clone/core-strategy-ai-client/StrategyAIClient';
import { PreProcessTurn } from '@civ-clone/library-strategy/PlayerActions/PreProcessTurn';

export class SimpleStrategyAIClient extends StrategyAIClient {
  async takeTurn(): Promise<void> {
    this.attempt(new PreProcessTurn(this.player(), null));

    return super.takeTurn();
  }
}

export default SimpleStrategyAIClient;
