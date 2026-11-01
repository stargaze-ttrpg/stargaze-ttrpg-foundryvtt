export class Character extends Actor {
  getRollData() {
    return { ...super.getRollData() };
  }

  async rollSkill(skillId) {
    const total = this.system.skills?.[`${skillId}Total`];
    if (total === undefined) return;
    const roll = await new Roll(`1d20 + ${total}`).evaluate();
    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: skillId
    });
  }
}
