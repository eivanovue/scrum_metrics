module.exports = card => {
  if (card.pluginData) {
    const pluginData = card.pluginData
      .find(plugin => plugin.value.includes('estimate'));
    if (pluginData) {
      const valueArray = pluginData.value.split(',');
      const estimateValue = valueArray.find(element => element.includes('estimate'));
      const estimate = estimateValue.match(/(\d+)/);
      return Number(estimate[0]);
    }
    return 0;
  }
  return 0;
}