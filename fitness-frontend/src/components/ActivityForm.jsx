import React, {useState} from 'react'
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Grid, Card, CardContent, Typography, InputAdornment} from "@mui/material";
import {addActivity} from "../services/api.js";

const ActivityForm = ({onActivitiesAdded}) => {
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: '',
        caloriesBurned: '',
        additionalMetric: {}
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        // Basic validation
        if (!activity.duration || !activity.caloriesBurned) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await addActivity(activity);
            onActivitiesAdded();
            setActivity({type: "RUNNING", duration: '', caloriesBurned: ''});
        } catch (e) {
            console.error(e);
            setError('Failed to add activity. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const activityIcons = {
        RUNNING: '🏃',
        WALKING: '🚶',
        CYCLING: '🚴'
    };

    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Log New Activity
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/*<Grid xs={12} md={4}>*/}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Activity Type</InputLabel>
                                <Select
                                    value={activity.type}
                                    label="Activity Type"
                                    onChange={(e) => setActivity({...activity, type: e.target.value})}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value="RUNNING">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span>{activityIcons.RUNNING}</span> Running
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="WALKING">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span>{activityIcons.WALKING}</span> Walking
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="CYCLING">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span>{activityIcons.CYCLING}</span> Cycling
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {/*<Grid xs={12} sm={6} md={4}>*/}
                            <TextField
                                fullWidth
                                label="Duration"
                                type="number"
                                value={activity.duration}
                                onChange={(e) => setActivity({...activity, duration: e.target.value})}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                    inputProps: { min: 1 }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>

                        {/*<Grid xs={12} sm={6} md={4}>*/}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Calories Burned"
                                type="number"
                                value={activity.caloriesBurned}
                                onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                    inputProps: { min: 1 }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                                }
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Activity'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default ActivityForm