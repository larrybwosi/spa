package com.spa.wellness

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.spa.wellness.ui.screens.BookServiceScreen
import com.spa.wellness.ui.screens.BookingScreen
import com.spa.wellness.ui.screens.CatalogScreen
import com.spa.wellness.ui.screens.DetailsScreen
import com.spa.wellness.ui.screens.MarketplaceScreen
import com.spa.wellness.ui.screens.ProfileScreen
import com.spa.wellness.ui.screens.TipsScreen
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.GoldenLeaf
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream
import com.spa.wellness.ui.theme.SpaWellnessTheme
import com.spa.wellness.ui.theme.WarmSand

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        com.spa.wellness.data.SessionManager.init(applicationContext)
        setContent {
            SpaWellnessTheme {
                MainAppScreen()
            }
        }
    }
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Catalog : Screen("catalog", "Services", Icons.Default.List)

    object Shop : Screen("shop", "Shop", Icons.Default.Star)

    object Booking : Screen("booking", "Book Now", Icons.Default.DateRange)

    object Tips : Screen("tips", "Wellness Tips", Icons.Default.Favorite)

    object Profile : Screen("profile", "Profile", Icons.Default.AccountCircle)
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
    var selectedProduct by remember { mutableStateOf<com.spa.wellness.data.Product?>(null) }

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
                        Screen.Shop,
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
                composable(Screen.Shop.route) {
                    MarketplaceScreen(
                        onProductClick = { product ->
                            selectedProduct = product
                            navController.navigate("details")
                        },
                    )
                }
                composable("details") {
                    DetailsScreen(
                        product = selectedProduct,
                        onBack = { navController.popBackStack() },
                        onBookSlot = { navController.navigate("book_service") },
                    )
                }
                composable("book_service") {
                    BookServiceScreen(
                        product = selectedProduct,
                        onBack = { navController.popBackStack() },
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
