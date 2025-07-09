const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Parse rate confirmation from text content
 * @param {string} text - Text content to parse
 * @returns {Object} Extracted load information
 */
function parseRateConfirmationText(text) {
  const loadIdMatch = text.match(/Load ID:?\s*([\w-]+)/i) || 
                      text.match(/Load Number:?\s*([\w-]+)/i) ||
                      text.match(/Reference:?\s*([\w-]+)/i);
                      
  const pickupMatch = text.match(/Pickup:?\s*([^,\n]+)/i) || 
                      text.match(/Origin:?\s*([^,\n]+)/i) ||
                      text.match(/From:?\s*([^,\n]+)/i);
                      
  const deliveryMatch = text.match(/Delivery:?\s*([^,\n]+)/i) || 
                        text.match(/Destination:?\s*([^,\n]+)/i) ||
                        text.match(/To:?\s*([^,\n]+)/i);
                        
  const rateMatch = text.match(/Rate:?\s*\$?([\d,]+(?:\.\d+)?)/i) || 
                    text.match(/Amount:?\s*\$?([\d,]+(?:\.\d+)?)/i) ||
                    text.match(/Total:?\s*\$?([\d,]+(?:\.\d+)?)/i);
                    
  const pickupDateMatch = text.match(/Pickup Date:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i) ||
                          text.match(/Load Date:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
                          
  const deliveryDateMatch = text.match(/Delivery Date:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i) ||
                            text.match(/Unload Date:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  
  // Parse rate value, removing commas
  let rate = 0;
  if (rateMatch) {
    rate = parseFloat(rateMatch[1].replace(/,/g, ''));
  }
  
  return {
    loadId: loadIdMatch ? loadIdMatch[1] : 'N/A',
    pickupLocation: pickupMatch ? pickupMatch[1].trim() : 'N/A',
    deliveryLocation: deliveryMatch ? deliveryMatch[1].trim() : 'N/A',
    rate: rate,
    pickupDate: pickupDateMatch ? new Date(pickupDateMatch[1]) : null,
    deliveryDate: deliveryDateMatch ? new Date(deliveryDateMatch[1]) : null
  };
}

/**
 * Parse rate confirmation from PDF file
 * @param {Buffer|string} pdfBuffer - PDF file buffer or path to PDF file
 * @returns {Promise<Object>} Extracted load information
 */
async function parseRateConfirmationPDF(pdfBuffer) {
  try {
    // If pdfBuffer is a string (file path), read the file
    if (typeof pdfBuffer === 'string') {
      pdfBuffer = fs.readFileSync(pdfBuffer);
    }
    
    const pdfData = await pdfParse(pdfBuffer);
    return parseRateConfirmationText(pdfData.text);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF rate confirmation');
  }
}

/**
 * Parse rate confirmation from file or text
 * @param {string|Buffer} input - Text content or file path/buffer
 * @param {string} [type] - Type of input ('text', 'pdf', or auto-detect)
 * @returns {Promise<Object>} Extracted load information
 */
async function parseRateConfirmation(input, type = null) {
  // If input is a string path to a file
  if (typeof input === 'string' && (input.endsWith('.pdf') || type === 'pdf')) {
    return parseRateConfirmationPDF(input);
  } 
  // If input is a buffer and type is pdf
  else if (Buffer.isBuffer(input) && type === 'pdf') {
    return parseRateConfirmationPDF(input);
  }
  // Otherwise treat as text
  else {
    return parseRateConfirmationText(input);
  }
}

module.exports = { 
  parseRateConfirmation,
  parseRateConfirmationText,
  parseRateConfirmationPDF
};