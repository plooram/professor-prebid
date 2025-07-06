import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { IIoidAuctionData } from './IoidTrackingTypes';

interface IoidTrackingHeaderProps {
  auctionData: IIoidAuctionData;
}

const IoidTrackingHeader = ({ auctionData }: IoidTrackingHeaderProps): JSX.Element => {
  return (
    <Grid container direction="column" spacing={1}>
      {/* First Line: Auction Cycle + Full Auction ID */}
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Auction Cycle: {auctionData.auctionCycle}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Auction ID: {auctionData.auctionId}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Second Line: Ad Units + Start Time + Bidders */}
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Ad Units: {auctionData.adUnitCount}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Start: {new Date(auctionData.timestamp).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Bidders: {auctionData.bidders.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* Third Line: IOID Status */}
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Paper sx={{ p: 1 }} elevation={1}>
              <Typography variant="h2" component="span">
                Global IOID: {auctionData.bidders[0]?.globalIoid ? 'Present' : 'Not present'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default IoidTrackingHeader; 