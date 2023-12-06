import React from 'react';
import { Button, Container, List, Divider, TextField, Box, Typography, Avatar, Tooltip, IconButton, Menu, MenuItem, ListItemIcon  } from '@material-ui/core'; 
import { Settings} from '@material-ui/icons';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home'
import Router from 'next/router';
import Cookies from 'js-cookie';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

const Header = (props: any) =>{
    const [itemsCart, setItemsCart] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleCartButton(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
    }

    function handleAddItem(event: React.MouseEvent<HTMLButtonElement>){
      event.preventDefault();
      Router.push({
        pathname: "/home/"+props.username+"/addItem", 
    }, "/home/"+props.username+"/addItem");
  }

    const handleLogout = () =>{
      Router.push("/");
    }
    //bisogna aggiungere il saldo nel portafoglio della moneta dataCellarCrypto

    return(
        <React.Fragment>
        <Box style={{display: 'fixed', alignItems: 'right', textAlign: 'right', backgroundColor: "#23C7FC", padding: 5 }}>
        <Typography style={{float: "left", fontSize: 30, fontFamily: "sans-serif"}}> Data Cellar Portal</Typography>
        <IconButton aria-label="cart" style={{marginRight: 10}} onClick={(event) => {handleAddItem(event)}}>
            <StyledBadge color="secondary">
                <AddCircleOutlineIcon />
            </StyledBadge>
        </IconButton>
        <IconButton aria-label="cart" style={{marginRight: 10}} onClick={(event) => {handleCartButton}}>
            <StyledBadge badgeContent={itemsCart} color="secondary">
                <ShoppingCartIcon />
            </StyledBadge>
        </IconButton>
        <IconButton aria-label="cart" style={{marginRight: 10}} onClick={() => Router.push("/home/"+props.username)}>
            <StyledBadge color="secondary">
                <HomeIcon />
            </StyledBadge>
        </IconButton>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar style={{width: 32, height: 32}}>{(props.username as string)}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        style: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          /*mt: 1.5,
          '& .MuiAvatarRoot': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },*/
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      //anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleClose}>
        <Avatar /> Personal Dataset and Services
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
    </React.Fragment>
    );
}

export default Header;