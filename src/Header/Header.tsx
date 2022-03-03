import * as React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useSnackbar } from 'notistack';

import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';


//import Wallet from '../../utils/wallet/Wallet';
//import PhantomWallet from '../../utils/wallet/Phantom';
//import SolflareWallet from '../../utils/wallet/Solflare';

//import { useSession } from "../../contexts/session";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import {
    MenuItem,
    Menu,
    Tooltip,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemText
} from '@mui/material';


import IconButton from '@mui/material/IconButton';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

require('@solana/wallet-adapter-react-ui/styles.css');

export interface State extends SnackbarOrigin {
    open: boolean;
}

function getParam(param: string) {
    //return new URLSearchParams(document.location.search).get(param);
    return new URLSearchParams(window.location.search).get(param);
}

interface HeaderProps{
    children?:React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
    ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Header(props: any) {
    const { open_menu } = props;
    const [open_snackbar, setSnackbarState] = React.useState(false);
    
    const [tokenParam, setTokenParam] = React.useState(getParam('token'));
    const [discordId, setDiscordId] = React.useState(getParam('discord_id'));
    const [userId, setUserId] = React.useState(getParam('user_id'));
    const [providers, setProviders] = React.useState(['Sollet', 'Sollet Extension', 'Phantom','Solflare']);
    const [open_wallet, setOpenWallet] = React.useState(false);
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isWalletOpen = Boolean(anchorEl);

    const location = useLocation();
    const currPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    //const currPath = location?.pathname ?? "";
    const { enqueueSnackbar } = useSnackbar();

    const routes = [
        { name: "Home", path: "/" },
        // { name: "Servers", path: "/servers" },

        // { name: "Settings", path: "/settings" }
    ]
    
    /*
    const toggleDrawer = () => {
        //setOpenDrawer(!open);
        open = !open;//setOpen(!open);
    };
    */

    
    /*
    async function connect() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => onWalletConnect(wallet);
        await wallet.connect();
    }

    async function connectPhantom() {
        let wallet = new PhantomWallet();
        wallet.onChange = (wallet: any) => onWalletConnect(wallet);
        await wallet.connect();
    }
    
    async function connectSolflare() {
        let wallet = new SolflareWallet();
        wallet.onChange = () => onWalletConnect(wallet);
        await wallet.connect();
    }
    
    async function onWalletConnect(wallet: any){
        if(wallet){
            let session = await wallet.signMessage('$GRAPE');
            if(session){
                setSession(session);
            }
        }
    }
    */
    

    //Menu
    const menuId = 'primary-wallet-account-menu';
    const menuWalletId = 'primary-fullwallet-account-menu';

    const handleProfileMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        // this.props.parentCallback("Data from child");
    };

    const handleWalletConnectClickOpen = (type: string, callback: any) => {
        /*
        switch(type) {
            case "sollet":
                connect();
                break;
            case "phantom":
                connectPhantom();
                break;
            case "solflare":
                connectSolflare();
                break;
            default:
                break;
        }
        */
       
        callback && callback();
    };

    const handleCloseWallet = (value: any) => {
        setOpenWallet(false);

    };

    function SimpleDialog(props: any) {
        const { onClose, selectedValue, open_wallet } = props;

        const handleCloseWallet = () => {
            onClose(selectedValue);
        };

        const handleListItemClick = (value: any) => {
            onClose(value);
        };

        return (
            <Dialog onClose={handleCloseWallet} aria-labelledby="simple-dialog-title" open={open_wallet}>
                <DialogTitle id="simple-dialog-title">Select Wallet</DialogTitle>
                <List>
                    {providers.map((provider) => (
                        <ListItem button onClick={() => handleListItemClick(provider)} key={provider}>
                            <ListItemText primary={provider} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    }

    const handleClickSnackbar = () => {
        enqueueSnackbar(`Copied...`,{ variant: 'success' });
        
        handleMenuClose();
        //setSnackbarState(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarState(false);
    };


    return (

        <Toolbar
            color="inherit"
            sx={{
                pr: '24px', // keep right padding when drawer closed
                background: 'none'
            }}
            >

            <Box display='flex' flexGrow={1}>
                <Button
                    variant="text"
                    component={NavLink} color="inherit" to="/"
                >
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        display='flex'
                    >

                        <img src="/grape_white_logo.svg" height="40px" className="header-logo" alt="Grape" />
                    </Typography>
                </Button>
            </Box>
            <div>
                <WalletModalProvider>
                    <WalletMultiButton />
                </WalletModalProvider>
            </div>
        </Toolbar>
        
    );
}

export default Header;
