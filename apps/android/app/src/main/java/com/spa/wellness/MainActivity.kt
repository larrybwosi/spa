package com.spa.wellness

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SpaWellnessTheme {
                MainAppScreen()
            }
        }
    }
}

// Custom Premium Spa & Wellness Theme Colors
val SageGreen = Color(0xFF6E8E75)
val DarkSage = Color(0xFF4C6A53)
val WarmSand = Color(0xFFF7F4EF)
val SoftCream = Color(0xFFFCFAF6)
val GoldenLeaf = Color(0xFFD4AF37)
val Charcoal = Color(0xFF2E332E)

@Composable
fun SpaWellnessTheme(content: @Composable () -> Unit) {
    val colors =
        MaterialTheme.colorScheme.copy(
            primary = SageGreen,
            onPrimary = Color.White,
            background = WarmSand,
            onBackground = Charcoal,
            surface = SoftCream,
            onSurface = Charcoal,
        )
    MaterialTheme(
        colorScheme = colors,
        content = content,
    )
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Catalog : Screen("catalog", "Services", Icons.Default.List)

    object Booking : Screen("booking", "Book Now", Icons.Default.DateRange)

    object Tips : Screen("tips", "Wellness Tips", Icons.Default.Favorite)

    object Profile : Screen("profile", "Loyalty", Icons.Default.AccountCircle)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen() {
    val navController = rememberNavController()
    val bookings =
        remember {
            mutableStateListOf(
                Booking(
                    serviceName = "Swedish Massage",
                    date = "2026-08-01",
                    timeSlot = "10:00 AM",
                    customerName = "Jane Doe",
                    notes = "Prefers light pressure and lavender oil.",
                ),
            )
        }
    var preselectedService by remember { mutableStateOf<SpaService?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = GoldenLeaf,
                            modifier = Modifier.size(24.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "AURA SPA & WELLNESS",
                            style =
                                MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 2.sp,
                                    color = Color.White,
                                ),
                        )
                    }
                },
                colors =
                    TopAppBarDefaults.topAppBarColors(
                        containerColor = DarkSage,
                    ),
            )
        },
        bottomBar = {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

            NavigationBar(
                containerColor = SoftCream,
                tonalElevation = 8.dp,
            ) {
                val screens =
                    listOf(
                        Screen.Catalog,
                        Screen.Booking,
                        Screen.Tips,
                        Screen.Profile,
                    )
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, fontSize = 11.sp, fontWeight = FontWeight.Medium) },
                        selected = currentRoute == screen.route,
                        colors =
                            NavigationBarItemDefaults.colors(
                                selectedIconColor = DarkSage,
                                selectedTextColor = DarkSage,
                                unselectedIconColor = Color.Gray,
                                unselectedTextColor = Color.Gray,
                                indicatorColor = SageGreen.copy(alpha = 0.2f),
                            ),
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                    )
                }
            }
        },
    ) { paddingValues ->
        Box(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(WarmSand),
        ) {
            NavHost(
                navController = navController,
                startDestination = Screen.Catalog.route,
            ) {
                composable(Screen.Catalog.route) {
                    CatalogScreen(
                        onServiceSelectedForBooking = { service ->
                            preselectedService = service
                            navController.navigate(Screen.Booking.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                    )
                }
                composable(Screen.Booking.route) {
                    BookingScreen(
                        preselectedService = preselectedService,
                        onClearPreselectedService = { preselectedService = null },
                        onBookingConfirmed = { booking ->
                            bookings.add(0, booking)
                            navController.navigate(Screen.Profile.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                    )
                }
                composable(Screen.Tips.route) {
                    TipsScreen()
                }
                composable(Screen.Profile.route) {
                    ProfileScreen(
                        bookings = bookings,
                        onCancelBooking = { booking ->
                            val index = bookings.indexOfFirst { it.id == booking.id }
                            if (index != -1) {
                                bookings[index] = booking.copy(status = "Cancelled", pointsEarned = 0)
                            }
                        },
                    )
                }
            }
        }
    }
}

// ---------------------- CATALOG SCREEN ----------------------
@Composable
fun CatalogScreen(onServiceSelectedForBooking: (SpaService) -> Unit) {
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Massages", "Facials", "Sauna & Steam")

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .padding(16.dp),
    ) {
        Text(
            text = "Rejuvenate Your Mind & Body",
            style =
                MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = Charcoal,
                ),
        )
        Text(
            text = "Select from our signature treatments below to start your wellness journey.",
            style = MaterialTheme.typography.bodyMedium.copy(color = Color.Gray),
            modifier = Modifier.padding(vertical = 4.dp),
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Categories Tab Row
        ScrollableTabRow(
            selectedTabIndex = categories.indexOf(selectedCategory),
            containerColor = Color.Transparent,
            edgePadding = 0.dp,
            divider = {},
        ) {
            categories.forEach { category ->
                Tab(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    text = {
                        Text(
                            text = category,
                            fontWeight = if (selectedCategory == category) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 14.sp,
                        )
                    },
                    selectedContentColor = DarkSage,
                    unselectedContentColor = Color.Gray,
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val filteredServices =
            if (selectedCategory == "All") {
                SampleData.services
            } else {
                SampleData.services.filter { it.category == selectedCategory }
            }

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(filteredServices) { service ->
                ServiceCard(
                    service = service,
                    onBookClick = { onServiceSelectedForBooking(service) },
                )
            }
        }
    }
}

@Composable
fun ServiceCard(
    service: SpaService,
    onBookClick: () -> Unit,
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SoftCream),
        elevation = CardDefaults.cardElevation(2.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = service.name,
                    style =
                        MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = Charcoal,
                        ),
                    modifier = Modifier.weight(1f),
                )
                Text(
                    text = "$${service.price}",
                    style =
                        MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            color = SageGreen,
                        ),
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = null,
                    tint = Color.Gray,
                    modifier = Modifier.size(14.dp),
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${service.durationMinutes} mins | ${service.category}",
                    style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray),
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = service.description,
                style = MaterialTheme.typography.bodyMedium.copy(color = Charcoal.copy(alpha = 0.8f)),
            )

            Spacer(modifier = Modifier.height(8.dp))

            Column(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .background(SageGreen.copy(alpha = 0.08f), RoundedCornerShape(8.dp))
                        .padding(8.dp),
            ) {
                Text(
                    text = "Key Benefits:",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, color = DarkSage),
                )
                Text(
                    text = service.benefits,
                    style = MaterialTheme.typography.bodySmall.copy(color = Charcoal),
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = onBookClick,
                colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text("Reserve Appointment", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ---------------------- BOOKING SCREEN ----------------------
@Composable
fun BookingScreen(
    preselectedService: SpaService?,
    onClearPreselectedService: () -> Unit,
    onBookingConfirmed: (Booking) -> Unit,
) {
    var customerName by remember { mutableStateOf("") }
    var serviceInput by remember { mutableStateOf(preselectedService?.name ?: "Swedish Massage") }
    var bookingDate by remember { mutableStateOf("2026-08-02") }
    var bookingTime by remember { mutableStateOf("11:00 AM") }
    var notes by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf("") }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
    ) {
        Text(
            text = "Schedule Appointment",
            style =
                MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = Charcoal,
                ),
        )
        Text(
            text = "Fill in the details below to reserve your custom relaxation experience.",
            style = MaterialTheme.typography.bodyMedium.copy(color = Color.Gray),
            modifier = Modifier.padding(vertical = 4.dp),
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (preselectedService != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = SageGreen.copy(alpha = 0.1f)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Selected Service:",
                            style = MaterialTheme.typography.bodySmall.copy(color = DarkSage, fontWeight = FontWeight.Bold),
                        )
                        Text(
                            text = preselectedService.name,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
                        )
                        Text(
                            text = "$${preselectedService.price} - ${preselectedService.durationMinutes} mins",
                            style = MaterialTheme.typography.bodyMedium.copy(color = SageGreen, fontWeight = FontWeight.SemiBold),
                        )
                    }
                    Button(
                        onClick = onClearPreselectedService,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent, contentColor = Color.Red),
                        modifier = Modifier.padding(start = 8.dp),
                    ) {
                        Text("Change", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        } else {
            // Dropdown substitute or selection list
            Text(
                text = "Select Treatment:",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.bodyMedium,
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .background(SoftCream, RoundedCornerShape(8.dp))
                        .padding(4.dp)
                        .verticalScroll(rememberScrollState(), enabled = false),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                // To keep it simple, choose from some service options
                listOf("Swedish Massage", "Deep Tissue", "Radiant Glow", "Himalayan Sauna").forEach { opt ->
                    Box(
                        modifier =
                            Modifier
                                .background(
                                    if (serviceInput.contains(opt, ignoreCase = true)) SageGreen else Color.Transparent,
                                    RoundedCornerShape(6.dp),
                                )
                                .clickable { serviceInput = opt }
                                .padding(8.dp),
                    ) {
                        Text(
                            text = opt,
                            color = if (serviceInput.contains(opt, ignoreCase = true)) Color.White else Charcoal,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Customer Name input
        Text("Your Full Name:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(6.dp))
        OutlinedTextField(
            value = customerName,
            onValueChange = { customerName = it },
            placeholder = { Text("Jane Doe") },
            colors =
                OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SoftCream,
                    unfocusedContainerColor = SoftCream,
                    focusedBorderColor = SageGreen,
                    unfocusedBorderColor = Color.LightGray,
                ),
            modifier = Modifier.fillMaxWidth(),
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Date & Time Selectors
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Select Date:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = bookingDate,
                    onValueChange = { bookingDate = it },
                    placeholder = { Text("YYYY-MM-DD") },
                    colors =
                        OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = SoftCream,
                            unfocusedContainerColor = SoftCream,
                            focusedBorderColor = SageGreen,
                            unfocusedBorderColor = Color.LightGray,
                        ),
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text("Select Time:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = bookingTime,
                    onValueChange = { bookingTime = it },
                    placeholder = { Text("10:00 AM") },
                    colors =
                        OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = SoftCream,
                            unfocusedContainerColor = SoftCream,
                            focusedBorderColor = SageGreen,
                            unfocusedBorderColor = Color.LightGray,
                        ),
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Special notes
        Text("Special Instructions / Health Conditions:", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(6.dp))
        OutlinedTextField(
            value = notes,
            onValueChange = { notes = it },
            placeholder = { Text("E.g., Prefers lavender oil, shoulder injury caution...") },
            colors =
                OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SoftCream,
                    unfocusedContainerColor = SoftCream,
                    focusedBorderColor = SageGreen,
                    unfocusedBorderColor = Color.LightGray,
                ),
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(100.dp),
        )

        Spacer(modifier = Modifier.height(16.dp))

        if (errorMessage.isNotEmpty()) {
            Text(
                text = errorMessage,
                color = Color.Red,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp),
            )
        }

        Button(
            onClick = {
                if (customerName.isBlank()) {
                    errorMessage = "Please enter your name to complete booking."
                } else {
                    errorMessage = ""
                    val finalService = preselectedService?.name ?: serviceInput
                    onBookingConfirmed(
                        Booking(
                            serviceName = finalService,
                            date = bookingDate,
                            timeSlot = bookingTime,
                            customerName = customerName,
                            notes = notes,
                        ),
                    )
                    onClearPreselectedService()
                    customerName = ""
                    notes = ""
                }
            },
            colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(50.dp),
            shape = RoundedCornerShape(8.dp),
        ) {
            Text("Complete My Reservation", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

// ---------------------- WELLNESS TIPS SCREEN ----------------------
@Composable
fun TipsScreen() {
    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
    ) {
        Text(
            text = "Daily Wellness & Relaxation",
            style =
                MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = Charcoal,
                ),
        )
        Text(
            text = "Integrate these holistic exercises into your schedule to foster wellness and calm.",
            style = MaterialTheme.typography.bodyMedium.copy(color = Color.Gray),
            modifier = Modifier.padding(vertical = 4.dp),
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Breathing exercise simulator card
        Card(
            colors = CardDefaults.cardColors(containerColor = SageGreen),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = GoldenLeaf,
                        modifier = Modifier.size(28.dp),
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "BREATHING TIMER",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        letterSpacing = 1.sp,
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                var breathingState by remember { mutableStateOf("Ready to Start") }
                var isBreathingActive by remember { mutableStateOf(false) }

                Text(
                    text = if (isBreathingActive) breathingState else "Take a deep breath and begin.",
                    style =
                        MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center,
                        ),
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                )

                Button(
                    onClick = {
                        isBreathingActive = !isBreathingActive
                        if (isBreathingActive) {
                            breathingState = "Inhale slowly..."
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    modifier = Modifier.align(Alignment.CenterHorizontally),
                    shape = RoundedCornerShape(30.dp),
                ) {
                    Text(
                        text = if (isBreathingActive) "Stop" else "Start Exercise",
                        color = DarkSage,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Curated Wellness Guides",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
        )

        Spacer(modifier = Modifier.height(8.dp))

        SampleData.wellnessTips.forEach { tip ->
            Card(
                colors = CardDefaults.cardColors(containerColor = SoftCream),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(2.dp),
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp),
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = tip.title,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = DarkSage),
                        )
                        Box(
                            modifier =
                                Modifier
                                    .background(SageGreen.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                        ) {
                            Text(
                                text = tip.duration,
                                fontSize = 11.sp,
                                color = DarkSage,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Category: ${tip.category}",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray, fontWeight = FontWeight.SemiBold),
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = tip.description,
                        style = MaterialTheme.typography.bodyMedium.copy(color = Charcoal),
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "How to practice:",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, color = SageGreen),
                    )

                    tip.steps.forEachIndexed { idx, step ->
                        Row(
                            modifier =
                                Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 3.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Text(
                                text = "${idx + 1}. ",
                                fontWeight = FontWeight.Bold,
                                color = DarkSage,
                                fontSize = 14.sp,
                            )
                            Text(
                                text = step,
                                style = MaterialTheme.typography.bodyMedium.copy(color = Charcoal.copy(alpha = 0.9f)),
                            )
                        }
                    }
                }
            }
        }
    }
}

// ---------------------- PROFILE & LOYALTY SCREEN ----------------------
@Composable
fun ProfileScreen(
    bookings: List<Booking>,
    onCancelBooking: (Booking) -> Unit,
) {
    // Loyalty logic: total points is active booking count * 50
    val activeBookings = bookings.filter { it.status == "Confirmed" }
    val totalPoints = activeBookings.sumOf { it.pointsEarned }
    val memberTier =
        when {
            totalPoints >= 300 -> "Platinium Lotus"
            totalPoints >= 150 -> "Golden Aura"
            else -> "Silver Sage"
        }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .padding(16.dp),
    ) {
        // Loyalty Dashboard Header
        Card(
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(4.dp),
            colors = CardDefaults.cardColors(containerColor = SoftCream),
        ) {
            Column(
                modifier =
                    Modifier
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(SoftCream, SageGreen.copy(alpha = 0.15f)),
                            ),
                        )
                        .padding(20.dp),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column {
                        Text(
                            text = "Aura Wellness Club",
                            style =
                                MaterialTheme.typography.bodySmall.copy(
                                    color = Color.Gray,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp,
                                ),
                        )
                        Text(
                            text = "Valued Member",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Charcoal),
                        )
                    }
                    Box(
                        modifier =
                            Modifier
                                .background(GoldenLeaf.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                    ) {
                        Text(
                            text = memberTier,
                            color = DarkSage,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column {
                        Text("TOTAL POINTS", fontSize = 10.sp, color = Color.Gray)
                        Text(
                            text = "$totalPoints pts",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = DarkSage,
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("ACTIVE BOOKINGS", fontSize = 10.sp, color = Color.Gray)
                        Text(
                            text = "${activeBookings.size}",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Charcoal,
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Points status visual guide
                Text(
                    text = "Earn 50 loyalty points with every premium treatment booked. Redeem 300 points for a free massage!",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Your Scheduled Treatments",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (bookings.isEmpty()) {
            Box(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "No treatments scheduled yet.\nVisit 'Services' to start booking!",
                    textAlign = TextAlign.Center,
                    color = Color.Gray,
                )
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                items(bookings) { booking ->
                    BookingHistoryCard(
                        booking = booking,
                        onCancelClick = { onCancelBooking(booking) },
                    )
                }
            }
        }
    }
}

@Composable
fun BookingHistoryCard(
    booking: Booking,
    onCancelClick: () -> Unit,
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SoftCream),
        elevation = CardDefaults.cardElevation(1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Column {
                    Text(
                        text = booking.serviceName,
                        fontWeight = FontWeight.Bold,
                        color = Charcoal,
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    Text(
                        text = "For: ${booking.customerName}",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray),
                    )
                }
                Box(
                    modifier =
                        Modifier
                            .background(
                                if (booking.status == "Confirmed") SageGreen.copy(alpha = 0.15f) else Color.Red.copy(alpha = 0.1f),
                                RoundedCornerShape(8.dp),
                            )
                            .padding(horizontal = 8.dp, vertical = 4.dp),
                ) {
                    Text(
                        text = booking.status,
                        fontSize = 11.sp,
                        color = if (booking.status == "Confirmed") DarkSage else Color.Red,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = null,
                        tint = DarkSage,
                        modifier = Modifier.size(16.dp),
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${booking.date} at ${booking.timeSlot}",
                        fontSize = 13.sp,
                        color = Charcoal,
                    )
                }

                if (booking.status == "Confirmed") {
                    Text(
                        text = "+${booking.pointsEarned} pts",
                        color = GoldenLeaf,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                    )
                }
            }

            if (booking.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Instructions: ${booking.notes}",
                    fontSize = 12.sp,
                    color = Color.Gray,
                )
            }

            if (booking.status == "Confirmed") {
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                ) {
                    IconButton(
                        onClick = onCancelClick,
                        modifier =
                            Modifier
                                .height(28.dp)
                                .background(Color.Red.copy(alpha = 0.05f), RoundedCornerShape(4.dp)),
                    ) {
                        Text(
                            text = "Cancel Booking",
                            color = Color.Red,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp),
                        )
                    }
                }
            }
        }
    }
}
