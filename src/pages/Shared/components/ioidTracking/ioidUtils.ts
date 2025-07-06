import { IPrebidDetails, IPrebidBidderDoneEventData, IPrebidConfigWithOrtb2 } from '../../../Injected/prebid';
import { IIoidExtractionResult } from './IoidTrackingTypes';

/**
 * Extract global IOID from prebid configuration
 * 
 * NOTE: This function is NOT RECOMMENDED for auction-specific IOID extraction.
 * Use extractGlobalIoidFromBidderDone() instead for auction-specific IOIDs.
 * 
 * This function extracts from prebid.config.ortb2.site.ext.data.ioids which is
 * a global configuration that gets updated over time, so it will always return
 * the most recent IOID value, not the IOID that was active during a specific auction.
 */
export const extractGlobalIoid = (prebid: IPrebidDetails): string | null => {
  const config = prebid.config as IPrebidConfigWithOrtb2;
  return config.ortb2?.site?.ext?.data?.ioids || null;
};

/**
 * Extract global IOID from bidderDone event
 * This is the CORRECT way to get the global IOID for a specific auction.
 * 
 * Important: We extract from bidderDone events rather than prebid.config because:
 * - prebid.config.ortb2 is a global configuration that gets updated over time
 * - When a new IOID is set, it overwrites the previous value in global config
 * - bidderDone events contain the IOID that was active during that specific auction
 * - This ensures historical auctions show the correct IOID, not the most recent one
 */
export const extractGlobalIoidFromBidderDone = (bidderDoneEvent: IPrebidBidderDoneEventData): string | null => {
  return bidderDoneEvent.args.ortb2?.site?.ext?.data?.ioids || null;
};

/**
 * Extract IOID from keywords string
 * Keywords format: "keyword1,keyword2,ioid=27e71313-a5ec-428c-9af8,keyword3"
 */
export const extractIoidFromKeywords = (keywords: string): IIoidExtractionResult => {
  if (!keywords || typeof keywords !== 'string') {
    return { found: false, value: null };
  }

  try {
    // Split keywords by comma and look for ioid
    const keywordArray = keywords.split(',').map(k => k.trim());
    const ioidKeyword = keywordArray.find(keyword => 
      keyword.toLowerCase().includes('ioid=') || 
      keyword.toLowerCase().includes('ioid:')
    );

    if (!ioidKeyword) {
      return { found: false, value: null };
    }

    // Extract value after = or :
    const separator = ioidKeyword.includes('=') ? '=' : ':';
    const ioidValue = ioidKeyword.split(separator)[1]?.trim();

    return {
      found: true,
      value: ioidValue || null
    };
  } catch (error) {
    console.warn('Error parsing keywords for IOID:', error);
    return { found: false, value: null };
  }
};

/**
 * Extract IOID from bid request (bidderDone event)
 */
export const extractBidRequestIoid = (bidderDoneEvent: IPrebidBidderDoneEventData): string | null => {
  const keywords = bidderDoneEvent.args.ortb2?.site?.keywords;
  if (!keywords) return null;

  const result = extractIoidFromKeywords(keywords);
  return result.value;
};

/**
 * Check if a string looks like an IOID (basic validation)
 */
export const isValidIoidFormat = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  // Basic check for UUID-like format (8-4-4-4-12 characters)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(value);
}; 