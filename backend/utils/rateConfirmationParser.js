function parseRateConfirmation(text) {
  const loadIdMatch = text.match(/Load ID:\s*([\w-]+)/i);
  const pickupMatch = text.match(/Pickup:\s*([^,]+)/i);
  const deliveryMatch = text.match(/Delivery:\s*([^,]+)/i);
  const rateMatch = text.match(/Rate:\s*\$?(\d+(?:\.\d+)?)/i);
  return {
    loadId: loadIdMatch ? loadIdMatch[1] : 'N/A',
    pickupLocation: pickupMatch ? pickupMatch[1].trim() : 'N/A',
    deliveryLocation: deliveryMatch ? deliveryMatch[1].trim() : 'N/A',
    rate: rateMatch ? parseFloat(rateMatch[1]) : 0
  };
}

module.exports = { parseRateConfirmation };
