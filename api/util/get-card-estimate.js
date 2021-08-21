const getCardEstimate = (card) => {
  if (card) {
    const pluginData = card.pluginData
      .find(plugin => plugin.value.includes('estimate'));
    if (pluginData) {
      const { estimate } = JSON.parse(pluginData.value);
      return Number(estimate);
    }
    return 0;
  }
  return 0;
}

module.exports = getCardEstimate;