import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router";
import {Box, Button, ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "react-oauth2-code-pkce";
import {useDispatch} from "react-redux";
import {setCredentials} from "./store/authSlice.js";
import ActivityForm from "./components/ActivityForm.jsx";
import ActivityDetail from "./components/ActivityDetail.jsx";
import ActivityList from "./components/ActivityList.jsx";

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        secondary: {
            main: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                    padding: '10px 20px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    borderRadius: 12,
                },
            },
        },
    },
});

const ActivitiesPage = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                    My Activities
                </Typography>
                <ActivityForm onActivitiesAdded={() => window.location.reload()}/>
                <ActivityList/>
            </Box>
        </Container>
    );
}

function App() {
    const {token, tokenData, logIn, logOut} = useContext(AuthContext);
    const dispatch = useDispatch();
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        if(token) {
            dispatch(setCredentials({token, user: tokenData}))
            setAuthReady(true);
        }
    }, [token, tokenData, dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                {!token ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                    >
                        <Box sx={{
                            bgcolor: 'white',
                            p: 6,
                            borderRadius: 2,
                            boxShadow: 3,
                            textAlign: 'center',
                            minWidth: 300
                        }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                                AI Fitness Tracker
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                                Track your fitness journey with AI-powered insights
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => logIn()}
                                sx={{
                                    background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                                    }
                                }}
                            >
                                Login to Get Started
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
                                    AI Fitness Tracker
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {tokenData?.name || tokenData?.preferred_username}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            {tokenData?.email}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => logOut()}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            </Toolbar>
                        </AppBar>

                        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                            <Routes>
                                <Route path="/activities" element={<ActivitiesPage/>}/>
                                <Route path="/activities/:id" element={<ActivityDetail/>}/>
                                <Route path="/" element={<Navigate to="/activities" replace/>}/>
                            </Routes>
                        </Box>
                    </Box>
                )}
            </Router>
        </ThemeProvider>
    );
}

export default App