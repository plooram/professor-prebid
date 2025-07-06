// IOID Tracking Type Definitions
// Simple data structures for displaying IOID information from prebid events

export interface IIoidBidderData {
  bidderCode: string;
  globalIoid: string | null;           // Value from ortb2.site.ext.data.ioids
  bidRequestIoid: string | null;       // Value from ortb2.site.keywords (parsed)
}

export interface IIoidAuctionData {
  auctionCycle: number;                // Sequential auction number (1, 2, 3...)
  auctionId: string;                   // Prebid auction ID
  adUnitCount: number;                 // Number of ad units in this auction
  timestamp: number;                   // Auction start timestamp
  bidders: IIoidBidderData[];          // IOID data for each bidder
}

export interface IIoidTrackingData {
  auctions: IIoidAuctionData[];        // All auction data for display
}

// Utility type for extracting IOID from keywords string
export interface IIoidExtractionResult {
  found: boolean;
  value: string | null;
} 