# IOID Data Structure Research

## Overview
Research findings for implementing IOID tracking in the prebid analysis tool. This document maps where X-Chain Analytics Adapter IOID data appears in prebid events.

## IOID Data Locations

### Global ortb2.site.ext.data.ioids
**Location**: `prebid.config.ortb2.site.ext.data.ioids`
- **Event Source**: Available in `IPrebidDetails.config`
- **Access Path**: `events → prebid.config.ortb2.site.ext.data.ioids`
- **Data Type**: `string | undefined`
- **Purpose**: Global IOID set by X-Chain Analytics Adapter

### Bid Request ortb2.site.keywords
**Location**: Multiple possible locations in bidder requests
- **Primary Location**: `bidderDone` events → `args.ortb2.site.keywords`
- **Access Path**: `events → bidderDone → args.ortb2.site.keywords`
- **Data Type**: `string | undefined` (comma-separated keywords including IOID)
- **Purpose**: Per-bidder IOID in keywords array

## Event Structure Analysis

### IPrebidConfig Interface
```typescript
export interface IPrebidConfig {
  // ... other config fields
  [key: string]: unknown;  // ortb2 data stored here
}
```

### Global ortb2 Configuration
```typescript
// Access pattern for global IOID:
const globalIoid = prebid.config.ortb2?.site?.ext?.data?.ioids;
```

### IPrebidBidderDoneEventData
```typescript
export interface IPrebidBidderDoneEventData {
  args: {
    auctionId: string;
    bidderCode: string;
    ortb2: {
      [key: string]: any;  // Contains site.keywords with IOID
    };
    // ... other fields
  };
}
```

### Bid Request ortb2 Access
```typescript
// Access pattern for bid request IOID:
const bidRequestIoid = bidderDoneEvent.args.ortb2?.site?.keywords;
// Need to parse keywords string to extract IOID
```

## Data Extraction Strategy

### 1. Global IOID Extraction
```typescript
const extractGlobalIoid = (prebid: IPrebidDetails): string | null => {
  return prebid.config?.ortb2?.site?.ext?.data?.ioids || null;
};
```

### 2. Bid Request IOID Extraction
```typescript
const extractBidRequestIoid = (bidderDoneEvent: IPrebidBidderDoneEventData): string | null => {
  const keywords = bidderDoneEvent.args.ortb2?.site?.keywords;
  if (!keywords) return null;
  
  // Parse keywords string to find IOID
  const keywordArray = keywords.split(',');
  const ioidKeyword = keywordArray.find(k => k.includes('ioid'));
  return ioidKeyword ? ioidKeyword.split('=')[1] : null;
};
```

### 3. Simple Data Extraction
```typescript
const extractIoidDataForAuction = (auctionData: IAuctionData): IIoidAuctionData => {
  const globalIoid = extractGlobalIoid(auctionData.prebid);
  
  const bidders = auctionData.bidderDoneEvents.map(event => ({
    bidderCode: event.args.bidderCode,
    globalIoid,
    bidRequestIoid: extractBidRequestIoid(event)
  }));
  
  return {
    auctionId: auctionData.auctionId,
    auctionCycle: auctionData.cycle,
    adUnitCount: auctionData.adUnits.length,
    timestamp: auctionData.timestamp,
    bidders
  };
};
```

## Interface Updates Needed

### 1. Enhanced ortb2 Site Interface
```typescript
interface IOrtb2Site {
  id?: string;
  name?: string;
  domain?: string;
  // ... existing fields
  keywords?: string;  // Contains IOID in keywords
  ext?: {
    data?: {
      ioids?: string;  // Global IOID location
      [key: string]: any;
    };
    [key: string]: any;
  };
}
```

### 2. IOID-Specific Data Types
```typescript
interface IIoidBidderData {
  bidderCode: string;
  globalIoid: string | null;           // Value from ortb2.site.ext.data.ioids
  bidRequestIoid: string | null;       // Value from ortb2.site.keywords (parsed)
}

interface IIoidAuctionData {
  auctionCycle: number;                // Sequential auction number (1, 2, 3...)
  auctionId: string;                   // Prebid auction ID
  adUnitCount: number;                 // Number of ad units in this auction
  timestamp: number;                   // Auction start timestamp
  bidders: IIoidBidderData[];          // IOID data for each bidder
}

interface IIoidTrackingData {
  auctions: IIoidAuctionData[];        // All auction data for display
}
```

## Event Processing Flow

1. **Extract Global IOID**: From `prebid.config.ortb2.site.ext.data.ioids`
2. **Extract Bid Request IOIDs**: From `bidderDone` events' `ortb2.site.keywords`
3. **Parse Keywords**: Split keywords string and extract IOID values
4. **Display Data**: Show actual values found (or "Not present") for each auction/bidder combination

## Key Findings

### ✅ Confirmed Data Locations
- **Global IOID**: `prebid.config.ortb2.site.ext.data.ioids`
- **Bid Request IOID**: `bidderDone.args.ortb2.site.keywords` (parsed from string)

### ⚠️ Potential Issues
- **Keywords Parsing**: Need to parse comma-separated keywords string
- **Timing**: `bidderDone` events occur after `bidRequested` events
- **Data Variations**: IOID format may vary across different implementations

### 📝 Missing Interface Support
- Current `IPrebidBidderRequest` doesn't include `ortb2` field
- Need to verify if IOID data appears in `bidRequested` vs `bidderDone` events
- May need to update interfaces to properly type ortb2 structure

## Next Steps

1. ✅ **Update Interfaces**: Add proper typing for ortb2 site structure
2. ✅ **Implement Data Extraction**: Create utility functions for IOID extraction
3. **Test Keywords Parsing**: Verify keyword parsing logic with real data
4. **Create UI Components**: Build table component to display the extracted data
5. **Handle Edge Cases**: Account for missing or malformed IOID data 