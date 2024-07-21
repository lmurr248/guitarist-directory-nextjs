"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Link from "next/link";
import Image from "next/image";

const logoBlue = "gtnm-logo-blue.svg";
const logoWhite = "/gtnm-logo-white.svg";

const pages = [
  { text: "Find a Teacher", href: "/search" },
  { text: "Add a Listing", href: "/add-listing" },
];
const loggedInSettings = ["Profile", "Account", "Dashboard", "Logout"];
const loggedOutSettings = [
  { text: "Log In", href: "/login" },
  { text: "Sign Up", href: "/sign-up" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting) => {
    if (setting === "Logout") {
      setIsLoggedIn(false);
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" passHref>
            <Image
              style={{ display: { xs: "none", md: "flex" }, marginRight: 8 }}
              src={logoWhite}
              alt="GTNM Logo White"
              width={120}
              height={60}
            />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                  <Link href={page.href} passHref>
                    <Typography
                      textAlign="center"
                      sx={{ color: "white", textDecoration: "none" }}
                    >
                      {page.text}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link href={page.href} passHref>
                  <Typography
                    component="a"
                    textAlign="center"
                    sx={{ color: "white", textDecoration: "none" }}
                  >
                    {page.text}
                  </Typography>
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <PermIdentityIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {(isLoggedIn ? loggedInSettings : loggedOutSettings).map(
                (setting) => (
                  <MenuItem
                    key={setting.text || setting}
                    onClick={() => handleMenuItemClick(setting.text || setting)}
                  >
                    {setting.href ? (
                      <Link href={setting.href} passHref>
                        <Typography
                          textAlign="center"
                          sx={{ color: "black", textDecoration: "none" }}
                        >
                          {setting.text}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography textAlign="center">{setting}</Typography>
                    )}
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
