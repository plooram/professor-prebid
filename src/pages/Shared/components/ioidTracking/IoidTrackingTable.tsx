import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { IIoidTrackingData } from './IoidTrackingTypes';

const gridStyle = {
  p: 0.5,
  '& .MuiGrid-item > .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const RenderGridPaperItem = ({ children, cols }: { children: React.ReactNode; cols: number }): JSX.Element => (
  <Grid item xs={cols}>
    <Paper sx={{ height: '100%', p: 1 }}>{children}</Paper>
  </Grid>
);

const IoidTrackingTable = ({ data }: { data: IIoidTrackingData }): JSX.Element => {
  // Flatten auction data to create rows for each bidder
  const tableRows = data.auctions.flatMap(auction => 
    auction.bidders.map(bidder => ({
      auctionCycle: auction.auctionCycle,
      auctionId: auction.auctionId,
      adUnitCount: auction.adUnitCount,
      bidderCode: bidder.bidderCode,
      globalIoid: bidder.globalIoid,
      bidRequestIoid: bidder.bidRequestIoid,
    }))
  );

  const truncateId = (id: string | null, maxLength: number = 20): string => {
    if (!id) return 'Not present';
    return id.length > maxLength ? `${id.substring(0, maxLength)}...` : id;
  };

  const getIoidDisplayValue = (ioid: string | null): { value: string; isPresent: boolean } => {
    if (!ioid) {
      return { value: 'Not present', isPresent: false };
    }
    return { value: truncateId(ioid), isPresent: true };
  };

  return (
    <Grid container direction="row" justifyContent="start" spacing={0.25} sx={gridStyle}>
      {/* Table Headers */}
      <RenderGridPaperItem cols={1.2}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Auction Cycle
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={2.3}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Auction ID
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={1.2}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          No. Ad Units
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={1.8}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Bidder Name
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={2.7}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          ortb2.site.ext.data.ioids
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={2.8}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          ortb2.site.keywords...ioid
        </Typography>
      </RenderGridPaperItem>

      {/* Table Rows */}
      {tableRows.map((row, index) => {
        const globalIoidDisplay = getIoidDisplayValue(row.globalIoid);
        const bidRequestIoidDisplay = getIoidDisplayValue(row.bidRequestIoid);

        return (
          <React.Fragment key={index}>
            <RenderGridPaperItem cols={1.2}>
              <Typography variant="body2">{row.auctionCycle}</Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={2.3}>
              <Typography variant="body2" title={row.auctionId}>
                {truncateId(row.auctionId)}
              </Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={1.2}>
              <Typography variant="body2">{row.adUnitCount}</Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={1.8}>
              <Typography variant="body2">{row.bidderCode}</Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={2.7}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: globalIoidDisplay.isPresent ? 'text.primary' : 'text.secondary',
                  fontStyle: globalIoidDisplay.isPresent ? 'normal' : 'italic'
                }}
                title={row.globalIoid || 'Not present'}
              >
                {globalIoidDisplay.value}
              </Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={2.8}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: bidRequestIoidDisplay.isPresent ? 'text.primary' : 'text.secondary',
                  fontStyle: bidRequestIoidDisplay.isPresent ? 'normal' : 'italic'
                }}
                title={row.bidRequestIoid || 'Not present'}
              >
                {bidRequestIoidDisplay.value}
              </Typography>
            </RenderGridPaperItem>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default IoidTrackingTable; 