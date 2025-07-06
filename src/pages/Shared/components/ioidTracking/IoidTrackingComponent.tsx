import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppStateContext from '../../contexts/appStateContext';
import IoidTrackingHeader from './IoidTrackingHeader';
import IoidTrackingAuctionTable from './IoidTrackingAuctionTable';

const IoidTrackingComponent = (): JSX.Element => {
  const { ioidTrackingData } = useContext(AppStateContext);

  // Check if we have any IOID tracking data
  if (!ioidTrackingData || ioidTrackingData.auctions.length === 0) {
    return (
      <Grid container direction="column" spacing={2} sx={{ p: 2 }}>
        <Grid item>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No IOID Tracking Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No X-Chain Analytics Adapter activity detected on this page.
              <br />
              The adapter inserts unique IOIDs into prebid auctions for tracking purposes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="column" spacing={2} sx={{ p: 1 }}>
      {/* Each auction with its header and table */}
      {ioidTrackingData.auctions.map((auction, index) => (
        <Grid item key={auction.auctionId}>
          <Grid container direction="column" spacing={1}>
            {/* Auction Header */}
            <Grid item>
              <IoidTrackingHeader auctionData={auction} />
            </Grid>
            
            {/* Auction Table */}
            <Grid item>
              <IoidTrackingAuctionTable auctionData={auction} />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default IoidTrackingComponent; 