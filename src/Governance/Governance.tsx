import { getRealms, getVoteRecordsByVoter, getTokenOwnerRecordForRealm, getTokenOwnerRecordsByOwner, getGovernanceAccounts, pubkeyFilter, TokenOwnerRecord } from '@solana/spl-governance';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  Avatar,
  Skeleton,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableBody,
  TableRow
} from '@mui/material/';

import HowToVoteIcon from '@mui/icons-material/HowToVote';

const StyledTable = styled(Table)(({ theme }) => ({
    '& .MuiTableCell-root': {
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
}));

export function GovernanceView(props: any) {
    const [loading, setLoading] = React.useState(false);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [realms, setRealms] = React.useState(null);
    const [realmsArray, setRealmsArray] = React.useState(new Array);
    const [voteRecords, setVoteRecords] = React.useState(null);
    const [tokenOwnerRecords, setOwnerRecords] = React.useState(null);

    const getGovernance = async () => {
        if (!loading){
            setLoading(true);
            
            // FUTURE UPDATE: 
            // - ADD ALL POSITIONS A WALLET HAS
            // - ADD ABILITY TO SHOW OPEN VOTES WITHIN A REALM
            // - ADD ABILITY TO VOTE
            // - ADD ABILITY TO WITHDRAW FROM REALMS
            
            const programId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw');
            const realmId = new PublicKey('By2sVGZXwfQq6rAiAM3rNPJ9iQfb5e2QhnF4YjJ4Bip'); // Grape RealmId
            const governingTokenMint = new PublicKey('8upjSpvjcdpuzhfR1zriwg5NXkwDruejqNE9WNbPRtyA'); // Grape Mint
            const governingTokenOwner = publicKey;

            const ownerRecords = await getTokenOwnerRecordForRealm(
                connection, 
                programId,
                realmId,
                governingTokenMint,
                governingTokenOwner
            );
            setOwnerRecords(ownerRecords);

            const ownerRecordsAll = await getGovernanceAccounts(
                connection, 
                programId, 
                TokenOwnerRecord, [
                    pubkeyFilter(1 + 32 + 32, governingTokenOwner)!,
            ]);
            

            //console.log("Realms: "+JSON.stringify(ownerRecordsAll));

            setLoading(false);
        } else{

        }
    }
    
    React.useEffect(() => { 
        if (publicKey && !loading)
            getGovernance();
    }, [publicKey]);
    
    if(loading){
        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <Paper className="grape-paper-background">
                        <Paper
                        className="grape-paper"
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        >
                            <Box sx={{ p:1, width: "100%" }}>
                                <Skeleton />
                            </Box>
                        </Paper>
                    </Paper>
                </Grid>
            </React.Fragment>
        )
    } else{
        if (tokenOwnerRecords){
            return (
                <React.Fragment>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper className="grape-paper-background">
                            <Box className="grape-paper">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box className="grape-dashboard-component-header" sx={{ m: 0, position: 'relative' }}>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ m: 0, position: 'relative'}}>
                                        GOVERNANCE
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <div style={{width:'auto', overflowX: 'scroll'}}>
                                    <TableContainer>
                                        <StyledTable sx={{ minWidth: 500 }} size="small" aria-label="Portfolio Table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><Typography variant="caption">Realm</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="caption">Votes</Typography></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{ verticalAlign: 'middle' }}>
                                                        <Grid container direction="row" alignItems="center" sx={{ }}>
                                                            <Grid item>
                                                                <Avatar 
                                                                    component={Paper} 
                                                                    elevation={4}
                                                                    alt="Token" 
                                                                    src={'https://lh3.googleusercontent.com/y7Wsemw9UVBc9dtjtRfVilnS1cgpDt356PPAjne5NvMXIwWz9_x7WKMPH99teyv8vXDmpZinsJdgiFQ16_OAda1dNcsUxlpw9DyMkUk=s0'}
                                                                    sx={{ width: 28, height: 28, bgcolor: "#222" }}
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ ml: 1 }}>
                                                                    {'Grape Votes'}
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell align="right">{(parseInt(tokenOwnerRecords.account.governingTokenDepositAmount, 10))/1000000}</TableCell>
                                                    <TableCell align="right"><Button href='https://realms.today/dao/GRAPE' target='_blank'><HowToVoteIcon /></Button></TableCell>
                                                </TableRow> 
                                            </TableBody>
                                        </StyledTable>
                                    </TableContainer>
                                </div>
                            </Box>
                        </Paper>
                    </Grid>
                </React.Fragment>
            );
        }else{
            return (
                <React.Fragment>
                    <Paper className="grape-paper-background">
                        <Grid 
                            className="grape-paper" 
                            container
                            spacing={1}>
                            <Grid item>
                                <Typography 
                                    align="center"
                                    variant="h5">
                                    {'Nothing loaded...'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </React.Fragment>
            );
        }
        
    }
}
