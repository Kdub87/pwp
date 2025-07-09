/**
 * Parse rate confirmation from text content
 * @param {string} text - Text content to parse
 * @returns {Object} Extracted load information
 */
function parseRateConfirmation(text) {
  if (!text || typeof text !== 'string') {
    return { loadId: 'N/A', pickupLocation: 'N/A', deliveryLocation: 'N/A', rate: 0 };
  }

  // Enhanced regex patterns for better matching
  const loadIdMatch = text.match(/(?:Load\s*ID|Load\s*Number|Reference):\s*([A-Za-z0-9\-_]+)/i) ||
                      text.match(/Load\s*([A-Za-z0-9\-_]+)/i);
                      
  const pickupMatch = text.match(/(?:Pickup|Origin|From):\s*([^,\n\r]+)/i) ||
                      text.match(/Pick\s*up\s*at:\s*([^,\n\r]+)/i);
                      
  const deliveryMatch = text.match(/(?:Delivery|Destination|To|Drop):\s*([^,\n\r]+)/i) ||
                        text.match(/Deliver\s*to:\s*([^,\n\r]+)/i);
                        
  const rateMatch = text.match(/(?:Rate|Amount|Total|Pay):\s*\$?([\d,]+(?:\.\d{2})?)/i) ||
                    text.match(/\$\s*([\d,]+(?:\.\d{2})?)/);

  // Parse and clean the rate value
  let rate = 0;
  if (rateMatch) {
    const rateStr = rateMatch[1].replace(/,/g, '');
    rate = parseFloat(rateStr) || 0;
  }

  return {
    loadId: loadIdMatch ? loadIdMatch[1].trim() : 'N/A',
    pickupLocation: pickupMatch ? pickupMatch[1].trim() : 'N/A',
    deliveryLocation: deliveryMatch ? deliveryMatch[1].trim() : 'N/A',
    rate: rate
  };
}

module.exports = { parseRateConfirmation };