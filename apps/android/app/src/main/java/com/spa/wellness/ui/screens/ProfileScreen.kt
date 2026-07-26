package com.spa.wellness.ui.screens

import android.util.Log
import android.widget.Toast
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.Booking
import com.spa.wellness.data.NetworkClient
import com.spa.wellness.data.SessionManager
import com.spa.wellness.ui.theme.Charcoal
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.GoldenLeaf
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream
import kotlinx.coroutines.launch

data class BookingReminder(
    val id: String = java.util.UUID.randomUUID().toString(),
    val serviceName: String,
    val dateString: String,
    val interval: String,
    val customNote: String = "",
)

@Composable
fun ProfileScreen(
    bookings: List<Booking>,
    onCancelBooking: (Booking) -> Unit,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    // Auth track state
    var loggedInUser by remember { mutableStateOf(SessionManager.currentUser) }
    var isLoginMode by remember { mutableStateOf(true) }

    // Input States
    var emailInput by remember { mutableStateOf("") }
    var passwordInput by remember { mutableStateOf("") }
    var nameInput by remember { mutableStateOf("") }
    var authErrorMsg by remember { mutableStateOf("") }
    var isAuthenticating by remember { mutableStateOf(false) }

    // Real API Bookings States
    val apiBookings = remember { mutableStateListOf<Booking>() }
    var isLoadingBookings by remember { mutableStateOf(false) }

    // App Customization State Variables
    var pushNotificationsEnabled by remember { mutableStateOf(true) }
    var backgroundSoundsEnabled by remember { mutableStateOf(false) }
    var selectedTheme by remember { mutableStateOf("Sage Green") }

    // Scheduled Reminders State List
    val scheduledReminders =
        remember {
            mutableStateListOf(
                BookingReminder(
                    serviceName = "Swedish Massage",
                    dateString = "2026-09-01",
                    interval = "Monthly",
                    customNote = "Keep muscles relaxed.",
                ),
                BookingReminder(
                    serviceName = "Radiant Glow Facial",
                    dateString = "2026-08-15",
                    interval = "Bi-weekly",
                    customNote = "Maintain healthy skin.",
                ),
            )
        }

    // Reminder Scheduling Form State Variables
    var reminderServiceName by remember { mutableStateOf("") }
    var reminderDateString by remember { mutableStateOf("") }
    var reminderInterval by remember { mutableStateOf("Monthly") }
    var reminderCustomNote by remember { mutableStateOf("") }
    var formError by remember { mutableStateOf("") }

    // Fetch real bookings if logged in
    val fetchRealBookings =
        suspend {
            if (SessionManager.currentToken != null) {
                isLoadingBookings = true
                try {
                    val jsonArray = NetworkClient.getBookings()
                    apiBookings.clear()
                    for (i in 0 until jsonArray.length()) {
                        val obj = jsonArray.getJSONObject(i)
                        val serviceObj = obj.optJSONObject("service")
                        val serviceName = serviceObj?.optString("name") ?: "Premium Service"
                        val rawDateTime = obj.optString("dateTime", "")

                        // Format dateTime simply
                        val date = if (rawDateTime.length >= 10) rawDateTime.substring(0, 10) else "2026-08-01"
                        val time = if (rawDateTime.length >= 16) rawDateTime.substring(11, 16) else "10:00 AM"

                        val statusStr = obj.optString("status", "PENDING")
                        val mappedStatus = if (statusStr == "CANCELLED") "Cancelled" else "Confirmed"

                        apiBookings.add(
                            Booking(
                                id = obj.optString("id"),
                                serviceName = serviceName,
                                date = date,
                                timeSlot = time,
                                customerName = loggedInUser?.name ?: "Valued Member",
                                notes = "Booked via Android App",
                                pointsEarned = 50,
                                status = mappedStatus,
                            ),
                        )
                    }
                } catch (e: Exception) {
                    Log.e("ProfileScreen", "Failed to fetch bookings", e)
                } finally {
                    isLoadingBookings = false
                }
            }
        }

    LaunchedEffect(loggedInUser) {
        if (loggedInUser != null) {
            fetchRealBookings()
        }
    }

    val displayBookings = if (loggedInUser != null) apiBookings else bookings

    // If user is unauthenticated, show a beautiful, fully interactive Login/Register card
    if (loggedInUser == null) {
        LazyColumn(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = SoftCream),
                    elevation = CardDefaults.cardElevation(8.dp),
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 24.dp),
                ) {
                    Column(
                        modifier =
                            Modifier
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(SoftCream, SageGreen.copy(alpha = 0.1f)),
                                    ),
                                )
                                .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = null,
                            tint = DarkSage,
                            modifier =
                                Modifier
                                    .size(48.dp)
                                    .padding(bottom = 8.dp),
                        )

                        Text(
                            text = if (isLoginMode) "Welcome Back" else "Create Account",
                            style =
                                MaterialTheme.typography.headlineSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = Charcoal,
                                ),
                            textAlign = TextAlign.Center,
                        )

                        Text(
                            text =
                                if (isLoginMode) {
                                    "Sign in to manage bookings, track loyalty points, and explore exclusive experiences."
                                } else {
                                    "Join Aura Wellness Club to book personalized rituals and earn points."
                                },
                            fontSize = 12.sp,
                            color = Color.Gray,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(top = 4.dp, bottom = 16.dp),
                        )

                        if (authErrorMsg.isNotEmpty()) {
                            Text(
                                text = authErrorMsg,
                                color = Color.Red,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(bottom = 12.dp),
                            )
                        }

                        if (!isLoginMode) {
                            OutlinedTextField(
                                value = nameInput,
                                onValueChange = { nameInput = it },
                                label = { Text("Full Name") },
                                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = DarkSage) },
                                modifier = Modifier.fillMaxWidth(),
                                colors =
                                    OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = DarkSage,
                                        focusedLabelColor = DarkSage,
                                    ),
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                        }

                        OutlinedTextField(
                            value = emailInput,
                            onValueChange = { emailInput = it },
                            label = { Text("Email Address") },
                            leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = DarkSage) },
                            modifier = Modifier.fillMaxWidth(),
                            colors =
                                OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = DarkSage,
                                    focusedLabelColor = DarkSage,
                                ),
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = passwordInput,
                            onValueChange = { passwordInput = it },
                            label = { Text("Password") },
                            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = DarkSage) },
                            visualTransformation = PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth(),
                            colors =
                                OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = DarkSage,
                                    focusedLabelColor = DarkSage,
                                ),
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        if (isAuthenticating) {
                            CircularProgressIndicator(color = DarkSage, modifier = Modifier.size(24.dp))
                        } else {
                            Button(
                                onClick = {
                                    if (emailInput.isBlank() || passwordInput.isBlank() || (!isLoginMode && nameInput.isBlank())) {
                                        authErrorMsg = "Please fill in all fields."
                                        return@Button
                                    }
                                    isAuthenticating = true
                                    authErrorMsg = ""
                                    coroutineScope.launch {
                                        try {
                                            if (isLoginMode) {
                                                val res = NetworkClient.signIn(emailInput.trim(), passwordInput)
                                                val userObj = res.getJSONObject("user")
                                                val token = res.getString("token")
                                                SessionManager.saveSession(
                                                    context,
                                                    id = userObj.getString("id"),
                                                    name = userObj.getString("name"),
                                                    email = userObj.getString("email"),
                                                    role = userObj.optString("role", "CLIENT"),
                                                    token = token,
                                                )
                                                loggedInUser = SessionManager.currentUser
                                                Toast.makeText(context, "Welcome back, ${userObj.getString("name")}!", Toast.LENGTH_SHORT).show()
                                            } else {
                                                NetworkClient.signUp(nameInput.trim(), emailInput.trim(), passwordInput)
                                                isLoginMode = true
                                                authErrorMsg = ""
                                                passwordInput = ""
                                                Toast.makeText(context, "Registration successful! Please sign in.", Toast.LENGTH_LONG).show()
                                            }
                                        } catch (e: Exception) {
                                            authErrorMsg = e.message ?: "Authentication failed."
                                        } finally {
                                            isAuthenticating = false
                                        }
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                            ) {
                                Text(
                                    text = if (isLoginMode) "Sign In" else "Sign Up",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                )
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Text(
                                text = if (isLoginMode) "Don't have an account? Sign Up" else "Already have an account? Sign In",
                                color = DarkSage,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                modifier =
                                    Modifier
                                        .clickable {
                                            isLoginMode = !isLoginMode
                                            authErrorMsg = ""
                                        }
                                        .padding(8.dp),
                            )
                        }
                    }
                }
            }
        }
        return
    }

    // Loyalty logic: total points is active booking count * 50
    val activeBookings = displayBookings.filter { it.status == "Confirmed" }
    val totalPoints = activeBookings.sumOf { it.pointsEarned }
    val memberTier =
        when {
            totalPoints >= 300 -> "Platinum Lotus"
            totalPoints >= 150 -> "Golden Aura"
            else -> "Silver Sage"
        }

    LazyColumn(
        modifier =
            Modifier
                .fillMaxSize()
                .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        // --- SECTION 1: Loyalty Dashboard Header ---
        item {
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
                                text = loggedInUser?.name ?: "Valued Member",
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

                    Text(
                        text = "Earn 50 loyalty points with every premium treatment booked. Redeem 300 points for a free massage!",
                        fontSize = 11.sp,
                        color = Color.Gray,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }
        }

        // --- SECTION 2: App Customization ---
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(2.dp),
                colors = CardDefaults.cardColors(containerColor = SoftCream),
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = null,
                            tint = DarkSage,
                            modifier = Modifier.size(20.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "App Customization",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
                        )
                    }

                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = Color.Gray.copy(alpha = 0.2f),
                    )

                    // Accent Theme Picker
                    Text(
                        text = "Preferred Theme Accent:",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Charcoal,
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                    ) {
                        val themes = listOf("Sage Green", "Warm Sand", "Golden Aura")
                        themes.forEach { theme ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.clickable { selectedTheme = theme },
                            ) {
                                RadioButton(
                                    selected = selectedTheme == theme,
                                    onClick = { selectedTheme = theme },
                                    colors = RadioButtonDefaults.colors(selectedColor = DarkSage),
                                    modifier = Modifier.size(24.dp),
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = theme, fontSize = 12.sp, color = Charcoal)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Notification Toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Enable Push Notifications", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Charcoal)
                            Text(text = "Get notified about upcoming bookings", fontSize = 11.sp, color = Color.Gray)
                        }
                        Switch(
                            checked = pushNotificationsEnabled,
                            onCheckedChange = { pushNotificationsEnabled = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = DarkSage, checkedTrackColor = SageGreen.copy(alpha = 0.5f)),
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Sound Effects Toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Relaxing Sound Effects", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Charcoal)
                            Text(text = "Play calming sounds on interactions", fontSize = 11.sp, color = Color.Gray)
                        }
                        Switch(
                            checked = backgroundSoundsEnabled,
                            onCheckedChange = { backgroundSoundsEnabled = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = DarkSage, checkedTrackColor = SageGreen.copy(alpha = 0.5f)),
                        )
                    }
                }
            }
        }

        // --- SECTION 3: Schedule Reminders Form ---
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(2.dp),
                colors = CardDefaults.cardColors(containerColor = SoftCream),
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = null,
                            tint = DarkSage,
                            modifier = Modifier.size(20.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Schedule Booking Reminder",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
                        )
                    }

                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = Color.Gray.copy(alpha = 0.2f),
                    )

                    Text(
                        text = "Set a reminder for yourself to book an appointment so you never miss your self-care session.",
                        fontSize = 12.sp,
                        color = Color.Gray,
                        modifier = Modifier.padding(bottom = 12.dp),
                    )

                    // Service Input
                    OutlinedTextField(
                        value = reminderServiceName,
                        onValueChange = { reminderServiceName = it },
                        label = { Text("Service (e.g. Swedish Massage)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors =
                            OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DarkSage,
                                focusedLabelColor = DarkSage,
                            ),
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Date Input
                    OutlinedTextField(
                        value = reminderDateString,
                        onValueChange = { reminderDateString = it },
                        label = { Text("Target Date (e.g. YYYY-MM-DD)") },
                        placeholder = { Text("2026-09-01") },
                        modifier = Modifier.fillMaxWidth(),
                        colors =
                            OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DarkSage,
                                focusedLabelColor = DarkSage,
                            ),
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Frequency Interval
                    Text(
                        text = "Remind Me:",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Charcoal,
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                    ) {
                        val intervals = listOf("Weekly", "Bi-weekly", "Monthly")
                        intervals.forEach { interval ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.clickable { reminderInterval = interval },
                            ) {
                                RadioButton(
                                    selected = reminderInterval == interval,
                                    onClick = { reminderInterval = interval },
                                    colors = RadioButtonDefaults.colors(selectedColor = DarkSage),
                                    modifier = Modifier.size(24.dp),
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = interval, fontSize = 12.sp, color = Charcoal)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Note Input
                    OutlinedTextField(
                        value = reminderCustomNote,
                        onValueChange = { reminderCustomNote = it },
                        label = { Text("Custom Note (optional)") },
                        modifier = Modifier.fillMaxWidth(),
                        colors =
                            OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DarkSage,
                                focusedLabelColor = DarkSage,
                            ),
                    )

                    if (formError.isNotBlank()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = formError, color = Color.Red, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (reminderServiceName.isBlank() || reminderDateString.isBlank()) {
                                formError = "Please specify a service and target date."
                            } else {
                                scheduledReminders.add(
                                    BookingReminder(
                                        serviceName = reminderServiceName,
                                        dateString = reminderDateString,
                                        interval = reminderInterval,
                                        customNote = reminderCustomNote,
                                    ),
                                )
                                reminderServiceName = ""
                                reminderDateString = ""
                                reminderInterval = "Monthly"
                                reminderCustomNote = ""
                                formError = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SageGreen),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                    ) {
                        Text(text = "Schedule Reminder", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // --- SECTION 4: Active Appointment Reminders List ---
        item {
            Text(
                text = "Your Appointment Reminders",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
            )
        }

        if (scheduledReminders.isEmpty()) {
            item {
                Box(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "No reminders scheduled.\nUse the form above to add an appointment reminder!",
                        textAlign = TextAlign.Center,
                        color = Color.Gray,
                    )
                }
            }
        } else {
            items(scheduledReminders) { reminder ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = SoftCream),
                    elevation = CardDefaults.cardElevation(1.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = reminder.serviceName,
                                fontWeight = FontWeight.Bold,
                                color = Charcoal,
                                style = MaterialTheme.typography.bodyLarge,
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Next booking reminder: ${reminder.dateString} (${reminder.interval})",
                                style = MaterialTheme.typography.bodySmall.copy(color = Color.Gray),
                            )
                            if (reminder.customNote.isNotBlank()) {
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Note: ${reminder.customNote}",
                                    fontSize = 11.sp,
                                    color = DarkSage,
                                    fontWeight = FontWeight.Medium,
                                )
                            }
                        }
                        IconButton(
                            onClick = { scheduledReminders.remove(reminder) },
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Delete Reminder",
                                tint = Color.Red.copy(alpha = 0.8f),
                            )
                        }
                    }
                }
            }
        }

        // --- SECTION 5: Scheduled Treatments ---
        item {
            Text(
                text = "Your Scheduled Treatments",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Charcoal),
            )
        }

        if (isLoadingBookings) {
            item {
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = DarkSage)
                }
            }
        } else if (displayBookings.isEmpty()) {
            item {
                Box(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "No treatments scheduled yet.\nVisit 'Services' to start booking!",
                        textAlign = TextAlign.Center,
                        color = Color.Gray,
                    )
                }
            }
        } else {
            items(displayBookings) { booking ->
                BookingHistoryCard(
                    booking = booking,
                    onCancelClick = {
                        coroutineScope.launch {
                            try {
                                if (booking.id.isNotBlank() && booking.id != "mock_id") {
                                    NetworkClient.cancelBooking(booking.id)
                                    fetchRealBookings()
                                    Toast.makeText(context, "Booking successfully cancelled!", Toast.LENGTH_SHORT).show()
                                } else {
                                    onCancelBooking(booking)
                                }
                            } catch (e: Exception) {
                                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                            }
                        }
                    },
                )
            }
        }

        // --- SECTION 6: Sign Out Button ---
        item {
            Button(
                onClick = {
                    coroutineScope.launch {
                        NetworkClient.signOut()
                        SessionManager.clearSession(context)
                        loggedInUser = null
                        Toast.makeText(context, "Successfully signed out.", Toast.LENGTH_SHORT).show()
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color.Red.copy(alpha = 0.8f)),
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text(text = "Sign Out", color = Color.White, fontWeight = FontWeight.Bold)
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
