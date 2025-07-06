import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { IIoidAuctionData } from './IoidTrackingTypes';

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

const IoidTrackingAuctionTable = ({ auctionData }: { auctionData: IIoidAuctionData }): JSX.Element => {
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
      <RenderGridPaperItem cols={2.4}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Bidder Name
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={4.8}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          ortb2.site.ext.data.ioids
        </Typography>
      </RenderGridPaperItem>
      <RenderGridPaperItem cols={4.8}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          ortb2.site.keywords...ioid
        </Typography>
      </RenderGridPaperItem>

      {/* Table Rows */}
      {auctionData.bidders.map((bidder, index) => {
        const globalIoidDisplay = getIoidDisplayValue(bidder.globalIoid);
        const bidRequestIoidDisplay = getIoidDisplayValue(bidder.bidRequestIoid);

        return (
          <React.Fragment key={index}>
            <RenderGridPaperItem cols={2.4}>
              <Typography variant="body2">{bidder.bidderCode}</Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={4.8}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: globalIoidDisplay.isPresent ? 'text.primary' : 'text.secondary',
                  fontStyle: globalIoidDisplay.isPresent ? 'normal' : 'italic'
                }}
                title={bidder.globalIoid || 'Not present'}
              >
                {globalIoidDisplay.value}
              </Typography>
            </RenderGridPaperItem>
            <RenderGridPaperItem cols={4.8}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: bidRequestIoidDisplay.isPresent ? 'text.primary' : 'text.secondary',
                  fontStyle: bidRequestIoidDisplay.isPresent ? 'normal' : 'italic'
                }}
                title={bidder.bidRequestIoid || 'Not present'}
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

export default IoidTrackingAuctionTable; 