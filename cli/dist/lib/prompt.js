"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = confirm;
const readline_1 = __importDefault(require("readline"));
/**
 * Prompts the user with a yes/no question.
 * Returns true only if the user types "y" or "Y".
 */
function confirm(question) {
    return new Promise((resolve) => {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}
//# sourceMappingURL=prompt.js.map