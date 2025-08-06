import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router'
import {getActivityDetail} from '../services/api';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Chip,
    Paper,
    IconButton,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ActivityDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await getActivityDetail(id);
                setActivity(response.data);
                setError(null);
            } catch (error) {
                console.error(error);
                setError('Failed to load activity details');
            } finally {
                setLoading(false);
            }
        }

        fetchActivity();
    }, [id]);

    const activityConfig = {
        RUNNING: {icon: '🏃', color: '#3b82f6', bgColor: '#dbeafe'},
        WALKING: {icon: '🚶', color: '#10b981', bgColor: '#d1fae5'},
        CYCLING: {icon: '🚴', color: '#f59e0b', bgColor: '#fef3c7'}
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{py: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress/>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{py: 4}}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!activity) {
        return (
            <Container maxWidth="md" sx={{py: 4}}>
                <Alert severity="info">Activity not found</Alert>
            </Container>
        );
    }

    const config = activityConfig[activity.type] || activityConfig.RUNNING;

    return (
        <Container maxWidth="md" sx={{py: 4}}>
            {/* Header */}
            <Box sx={{mb: 4, display: 'flex', alignItems: 'center', gap: 2}}>
                <IconButton
                    onClick={() => navigate('/activities')}
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {boxShadow: 2}
                    }}
                >
                    <ArrowBackIcon/>
                </IconButton>
                <Typography variant="h4" sx={{fontWeight: 600, flex: 1}}>
                    Activity Details
                </Typography>
            </Box>

            {/* Activity Summary Card */}
            <Card sx={{mb: 4, borderRadius: 3, overflow: 'visible'}}>
                <CardContent sx={{p: 4}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 3, mb: 3}}>
                        <Box sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            backgroundColor: config.bgColor,
                            boxShadow: 2
                        }}>
                            {config.icon}
                        </Box>
                        <Box sx={{flex: 1}}>
                            <Typography variant="h5" sx={{fontWeight: 600, textTransform: 'capitalize', mb: 1}}>
                                {activity.type.toLowerCase()}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary'}}>
                                <CalendarTodayIcon fontSize="small"/>
                                <Typography variant="body2">
                                    {new Date(activity.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {/*<Grid xs={12} sm={4}>*/}
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'primary.50',
                                border: '1px solid',
                                borderColor: 'primary.200'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                    <AccessTimeIcon sx={{color: 'primary.main'}}/>
                                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                                </Box>
                                <Typography variant="h4" sx={{fontWeight: 600, color: 'primary.main'}}>
                                    {activity.duration}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">minutes</Typography>
                            </Paper>
                        </Grid>
                        {/*<Grid xs={12} sm={4}>*/}
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'error.50',
                                border: '1px solid',
                                borderColor: 'error.200'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                    <LocalFireDepartmentIcon sx={{color: 'error.main'}}/>
                                    <Typography variant="body2" color="text.secondary">Calories</Typography>
                                </Box>
                                <Typography variant="h4" sx={{fontWeight: 600, color: 'error.main'}}>
                                    {activity.caloriesBurned}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">kcal burned</Typography>
                            </Paper>
                        </Grid>
                        {/*<Grid xs={12} sm={4}>*/}
                        <Grid size={{xs: 12, sm: 4}}>
                            <Paper sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'success.50',
                                border: '1px solid',
                                borderColor: 'success.200'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                    <TrendingUpIcon sx={{color: 'success.main'}}/>
                                    <Typography variant="body2" color="text.secondary">Pace</Typography>
                                </Box>
                                <Typography variant="h4" sx={{fontWeight: 600, color: 'success.main'}}>
                                    {(activity.caloriesBurned / activity.duration).toFixed(1)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">kcal/min</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* AI Recommendations */}
            {activity.recommendation && (
                <Card sx={{borderRadius: 3, border: '2px solid', borderColor: 'primary.100', mb: 4}}>
                    <CardContent sx={{p: 4}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 3}}>
                            <AutoAwesomeIcon sx={{color: 'primary.main'}}/>
                            <Typography variant="h5" sx={{fontWeight: 600}}>
                                AI Analysis
                            </Typography>
                            <Chip
                                label="Powered by Gemini"
                                size="small"
                                sx={{
                                    bgcolor: 'primary.100',
                                    color: 'primary.main',
                                    fontWeight: 500
                                }}
                            />
                        </Box>

                        <Paper sx={{p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3}}>
                            <Typography variant="body1" sx={{lineHeight: 1.8}}>
                                {activity.recommendation}
                            </Typography>
                        </Paper>

                        {/* Improvements */}
                        {activity.improvements && activity.improvements.length > 0 && (
                            <Box sx={{mb: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                                    <TrendingUpIcon sx={{color: 'info.main'}}/>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        Areas for Improvement
                                    </Typography>
                                </Box>
                                {activity.improvements.map((improvement, index) => (
                                    <Paper key={index} sx={{
                                        p: 2,
                                        mb: 1.5,
                                        bgcolor: 'info.50',
                                        borderLeft: '4px solid',
                                        borderColor: 'info.main'
                                    }}>
                                        <Typography variant="body2">
                                            {improvement}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {/* Suggestions */}
                        {activity.suggestions && activity.suggestions.length > 0 && (
                            <Box sx={{mb: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                                    <TipsAndUpdatesIcon sx={{color: 'warning.main'}}/>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        Suggestions
                                    </Typography>
                                </Box>
                                {activity.suggestions.map((suggestion, index) => (
                                    <Paper key={index} sx={{
                                        p: 2,
                                        mb: 1.5,
                                        bgcolor: 'warning.50',
                                        borderLeft: '4px solid',
                                        borderColor: 'warning.main'
                                    }}>
                                        <Typography variant="body2">
                                            {suggestion}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {/* Safety Guidelines */}
                        {activity.safety && activity.safety.length > 0 && (
                            <Box>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                                    <SecurityIcon sx={{color: 'success.main'}}/>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        Safety Guidelines
                                    </Typography>
                                </Box>
                                {activity.safety.map((safety, index) => (
                                    <Paper key={index} sx={{
                                        p: 2,
                                        mb: 1.5,
                                        bgcolor: 'success.50',
                                        borderLeft: '4px solid',
                                        borderColor: 'success.main'
                                    }}>
                                        <Typography variant="body2">
                                            {safety}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default ActivityDetail