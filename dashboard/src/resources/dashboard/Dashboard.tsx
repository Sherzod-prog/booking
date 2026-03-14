import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const API_URL = "http://localhost:3000/api";
const BASE_URL = "http://localhost:3000";

type Stats = {
    totalUsers: number;
    totalListings: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    totalRevenue: number;
};

type ChartData = {
    bookingsByMonth: { month: string; bookings: number }[];
    bookingsByStatus: { name: string; value: number }[];
};

type RecentBooking = {
    id: string;
    status: string;
    totalPrice: number;
    user?: {
        fullName: string;
        email: string;
    };
    listing?: {
        title: string;
        location: string;
    };
};

type TopListing = {
    id: string;
    title: string;
    location: string;
    pricePerNight: number;
    image: string | null;
    bookingsCount: number;
};

const StatCard = ({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) => (
    <Card sx={{ borderRadius: 4, height: "100%" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 52, height: 52 }}>{icon}</Avatar>
            <Box>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                    {value}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

export const Dashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [charts, setCharts] = useState<ChartData | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [topListings, setTopListings] = useState<TopListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            const token = localStorage.getItem("token");

            try {
                setLoading(true);
                setError("");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [statsRes, chartsRes, recentRes, topRes] = await Promise.all([
                    fetch(`${API_URL}/dashboard/stats`, { headers }),
                    fetch(`${API_URL}/dashboard/charts`, { headers }),
                    fetch(`${API_URL}/dashboard/recent-bookings`, { headers }),
                    fetch(`${API_URL}/dashboard/top-listings`, { headers }),
                ]);

                if (!statsRes.ok || !chartsRes.ok || !recentRes.ok || !topRes.ok) {
                    throw new Error("Dashboard ma’lumotlarini yuklab bo‘lmadi");
                }

                const [statsJson, chartsJson, recentJson, topJson] = await Promise.all([
                    statsRes.json(),
                    chartsRes.json(),
                    recentRes.json(),
                    topRes.json(),
                ]);

                setStats(statsJson);
                setCharts(chartsJson);
                setRecentBookings(recentJson);
                setTopListings(topJson);
            } catch (err: any) {
                setError(err.message || "Xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    if (loading) {
        return <Box p={3}>Loading dashboard...</Box>;
    }

    if (error) {
        return <Box p={3}>Xatolik: {error}</Box>;
    }

    if (!stats || !charts) {
        return <Box p={3}>Ma’lumot topilmadi</Box>;
    }

    return (
        <Box p={3}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Booking Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Overview of bookings, listings, revenue and recent activity
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value={stats.totalUsers} icon={<PeopleIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Listings" value={stats.totalListings} icon={<HomeWorkIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Bookings" value={stats.totalBookings} icon={<BookOnlineIcon />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon={<AttachMoneyIcon />} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 4, height: 360 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Bookings
                            </Typography>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={charts.bookingsByMonth}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="bookings" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, height: 360 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Booking Status
                            </Typography>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={charts.bookingsByStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        label
                                    >
                                        {charts.bookingsByStatus.map((entry, index) => (
                                            <Cell key={index} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Bookings
                            </Typography>
                            <List>
                                {recentBookings.map((booking, index) => (
                                    <Box key={booking.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <BookOnlineIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={booking.listing?.title || "Listing"}
                                                secondary={`${booking.user?.fullName || "User"} • ${booking.status} • $${booking.totalPrice}`}
                                            />
                                        </ListItem>
                                        {index < recentBookings.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Listings
                            </Typography>
                            <List>
                                {topListings.map((listing, index) => (
                                    <Box key={listing.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={listing.image ? `${BASE_URL}${listing.image}` : undefined}
                                                >
                                                    <HomeWorkIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={listing.title}
                                                secondary={`${listing.location} • ${listing.bookingsCount} bookings • $${listing.pricePerNight}/night`}
                                            />
                                        </ListItem>
                                        {index < topListings.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};