# Implementing IOID Tracking Tab

## Overview

This document outlines the step-by-step work plan to implement a new "IOID Tracking" tab in the pre-bid analysis tool. The tab will track the functionality of the X-Chain Analytics Adapter, which inserts unique IOIDs into prebid auction data.

## Problem Statement

The X-Chain Analytics Adapter:
- Inserts a unique ID called IOID into `ortb2.site.ext.data.ioids` field
- Inserts the same IOID into `ortb2.site.keywords` array of each bid request
- Due to race conditions, the adapter currently fails to populate IOIDs in the first auction ID of a session
- Successfully populates IOIDs in subsequent auction IDs

## Requirements

- New tab called "IOID Tracking"
- Similar formatting to existing tabs (timeline-like headers)
- Table showing: Auction Cycle, Auction ID, Ad Units, Bidder Name, Global IOID, Bid Request IOID
- Track IOID presence/absence across auction cycles
- Identify race condition issues in first auctions

## Step-by-Step Work Plan

### Phase 1: Research & Data Structure (Steps 1-2)

#### Step 1: Research Data Structure
- **Goal**: Understand how IOID data appears in prebid events
- **Tasks**:
  - Examine `bidRequested` events to find `ortb2.site.ext.data.ioids` field
  - Locate `ortb2.site.keywords` array in bid request data
  - Identify the exact path to IOID data in the event structure
  - Document the data format and variations across different bidders
- **Expected Output**: Data mapping document showing where IOID appears in events

#### Step 2: Add TypeScript Interfaces
- **Goal**: Create type definitions for IOID tracking data
- **Tasks**:
  - Create `IIoidTrackingData` interface
  - Create `IIoidAuctionSummary` interface
  - Add interfaces to existing prebid types file
- **Files**: `src/pages/Injected/prebid.ts` or new `ioidTypes.d.ts`

### Phase 2: Data Processing (Steps 3-4)

#### Step 3: Add IOID Context Logic
- **Goal**: Extract and organize IOID data from prebid events
- **Tasks**:
  - Add IOID data extraction in `appStateContext.tsx`
  - Create `useEffect` hook to process events for IOID data
  - Group data by auction ID and bidder
  - Track presence/absence of IOID in both locations
- **Files**: `src/pages/Shared/contexts/appStateContext.tsx`

#### Step 4: Create IOID Component Structure
- **Goal**: Build main component for IOID tracking
- **Tasks**:
  - Create `IoidTrackingComponent.tsx` 
  - Add context consumption for IOID data
  - Create component structure similar to TimelineComponent
  - Add auction cycle headers (like timeline tab)
- **Files**: `src/pages/Shared/components/ioidTracking/IoidTrackingComponent.tsx`

### Phase 3: UI Components (Steps 5-6)

#### Step 5: Create IOID Table Component
- **Goal**: Build table to display IOID data
- **Tasks**:
  - Create `IoidTrackingTable.tsx` component
  - Implement table with columns: Auction Cycle, Auction ID, Ad Units, Bidder Name, Global IOID, Bid Request IOID
  - Add conditional styling for "Not present" vs actual IOID values
  - Use Material-UI components consistent with existing tables
- **Files**: `src/pages/Shared/components/ioidTracking/IoidTrackingTable.tsx`

#### Step 6: Style Components
- **Goal**: Apply consistent styling with existing tabs
- **Tasks**:
  - Match header styling from TimelineComponent
  - Use consistent Paper, Grid, Typography components
  - Apply theme colors for success/error states (present/not present)
  - Ensure responsive design
- **Files**: Update styling in component files

### Phase 4: Navigation Integration (Steps 7-8)

#### Step 7: Add IOID Tab to Navigation
- **Goal**: Add "IOID Tracking" tab to main navigation
- **Tasks**:
  - Add tab to `NavbarTabs.tsx`
  - Ensure proper tab ordering and styling
  - Add appropriate icon if needed
- **Files**: `src/pages/Shared/components/navBar/NavbarTabs.tsx`

#### Step 8: Update Routes
- **Goal**: Connect IOID component to routing system
- **Tasks**:
  - Add IOID tracking route in `RoutesComponent.tsx`
  - Ensure proper route path and component mapping
  - Test navigation between tabs
- **Files**: `src/pages/Shared/components/RoutesComponent.tsx`

### Phase 5: Testing & Refinement (Step 9)

#### Step 9: Test IOID Tracking
- **Goal**: Verify functionality with real adapter data
- **Tasks**:
  - Test on sites with X-Chain Analytics Adapter
  - Verify IOID detection in both locations
  - Test with multiple auction cycles
  - Validate race condition detection
  - Test UI responsiveness and data accuracy

## Expected Component Structure

```
src/pages/Shared/components/ioidTracking/
├── IoidTrackingComponent.tsx      (Main component)
├── IoidTrackingTable.tsx          (Table component)
├── IoidTrackingHeader.tsx         (Header component)
└── IoidTrackingTypes.d.ts         (Type definitions)
```

## Key Features to Implement

1. **Auction Cycle Tracking**: Group auctions chronologically
2. **Bidder-Level Analysis**: Show IOID status per bidder per auction
3. **Visual Indicators**: Color coding for present/missing IOIDs
4. **Race Condition Detection**: Highlight first auction issues
5. **Export Functionality**: Allow data export for analysis

## Data Structure Example

```typescript
interface IIoidAuctionSummary {
  auctionCycle: number;
  auctionId: string;
  adUnitCount: number;
  bidders: IIoidBidderData[];
  globalIoid: string | null;
  timestamp: number;
}

interface IIoidBidderData {
  bidderName: string;
  globalIoidPresent: boolean;
  bidRequestIoidPresent: boolean;
  ioidValue: string | null;
}
```

## Table Format

The IOID Tracking table will display data similar to this format:

| Auction Cycle | Auction ID | No. Ad Units | Bidder Name | ortb2.site.ext.data.ioids | ortb2.site.keywords...ioid |
|---------------|------------|--------------|-------------|---------------------------|----------------------------|
| 1 | 2b772034-6489-486c-9f1... | 3 | Appnexus | Not present | Not present |
| 1 | 2b772034-6489-486c-9f1... | 2 | Magnite | Not present | Not present |
| 2 | 9810161f-108e-43c7-979... | 3 | Appnexus | 27e71313-a5ec-428c-9af8... | 27e71313-a5ec-428c-9af8... |
| 2 | 9810161f-108e-43c7-979... | 3 | Magnite | 27e71313-a5ec-428c-9af8... | 27e71313-a5ec-428c-9af8... |

## Success Criteria

- [ ] IOID Tracking tab appears in main navigation
- [ ] Table displays auction cycle data with proper formatting
- [ ] Race condition detection works (first auction shows "Not present")
- [ ] Subsequent auctions show IOID values correctly
- [ ] Component styling matches existing tabs
- [ ] Data updates in real-time as new auctions occur
- [ ] Export functionality works for analysis

## Notes

- This implementation maintains consistency with existing codebase architecture
- Uses existing Material-UI components and styling patterns
- Integrates with current app state management system
- Follows TypeScript best practices established in the project 