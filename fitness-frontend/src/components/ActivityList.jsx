import React, {useEffect, useState} from 'react'
import {Card, CardContent, Grid, Typography, Box, Chip, CircularProgress, Alert} from "@mui/material";
import {useNavigate} from "react-router";
import {getActivities} from "../services/api.js";

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await getActivities();
            setActivities(response.data);
            setError(null);
        } catch (e) {
            console.error(e);
            setError('Failed to load activities');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchActivities();
    }, [])

    const activityConfig = {
        RUNNING: {icon: '🏃', color: '#3b82f6', bgColor: '#dbeafe'},
        WALKING: {icon: '🚶', color: '#10b981', bgColor: '#d1fae5'},
        CYCLING: {icon: '🚴', color: '#f59e0b', bgColor: '#fef3c7'}
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
        }
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{mb: 2}}>
                {error}
            </Alert>
        );
    }

    if (activities.length === 0) {
        return (
            <Card sx={{textAlign: 'center', p: 4, borderRadius: 3}}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No activities yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start by logging your first activity above!
                </Typography>
            </Card>
        );
    }

    return (
        <Grid container spacing={3}>
            {activities.map(activity => {
                const config = activityConfig[activity.type] || activityConfig.RUNNING;

                return (
                    // <Grid xs={12} sm={6} md={4} key={activity.id}>
                    <Grid size={{xs: 12, sm: 6, md: 4}} key={activity.id}>
                        <Card
                            sx={{
                                cursor: "pointer",
                                transition: 'all 0.3s ease',
                                borderRadius: 3,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                }
                            }}
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <CardContent sx={{p: 3}}>
                                <Box
                                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2}}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        backgroundColor: config.bgColor
                                    }}>
                                        {config.icon}
                                    </Box>
                                    <Chip
                                        label={formatDate(activity.createdAt)}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#f3f4f6',
                                            color: '#6b7280',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>

                                <Typography variant="h6" sx={{fontWeight: 600, mb: 1, textTransform: 'capitalize'}}>
                                    {activity.type.toLowerCase()}
                                </Typography>

                                <Box sx={{display: 'flex', gap: 3}}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Duration
                                        </Typography>
                                        <Typography variant="body1" sx={{fontWeight: 500}}>
                                            {activity.duration} min
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Calories
                                        </Typography>
                                        <Typography variant="body1" sx={{fontWeight: 500}}>
                                            {activity.caloriesBurned} kcal
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default ActivityList