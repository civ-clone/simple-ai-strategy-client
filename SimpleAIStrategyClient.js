"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStrategyAIClient = void 0;
const StrategyAIClient_1 = require("@civ-clone/core-strategy-ai-client/StrategyAIClient");
const PreProcessTurn_1 = require("@civ-clone/library-strategy/PlayerActions/PreProcessTurn");
class SimpleStrategyAIClient extends StrategyAIClient_1.default {
    async takeTurn() {
        this.attempt(new PreProcessTurn_1.PreProcessTurn(this.player(), null));
        return super.takeTurn();
    }
}
exports.SimpleStrategyAIClient = SimpleStrategyAIClient;
exports.default = SimpleStrategyAIClient;
//# sourceMappingURL=SimpleAIStrategyClient.js.map