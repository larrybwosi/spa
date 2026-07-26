package com.spa.wellness.ui.screens

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.Booking
import com.spa.wellness.SpaService
import com.spa.wellness.data.NetworkClient
import com.spa.wellness.data.SessionManager
import com.spa.wellness.ui.theme.Charcoal
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream
import kotlinx.coroutines.launch

@Composable
fun BookingScreen(
    preselectedService: SpaService?,
    onClearPreselectedService: () -> Unit,
    onBookingConfirmed: (Booking) -> Unit,
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    val activeUser = SessionManager.currentUser
    var customerName by remember { mutableStateOf(activeUser?.name ?: "") }

    if (activeUser != null && customerName.isEmpty()) {
        customerName = activeUser.name
    }

    var serviceInput by remember { mutableStateOf(preselectedService?.name ?: "Swedish Massage") }
    var bookingDate by remember { mutableStateOf("2026-08-02") }
    var bookingTime by remember { mutableStateOf("11:00 AM") }
    var notes by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

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

        // Show Auth warning if not logged in
        if (activeUser == null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.Red.copy(alpha = 0.05f)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.Red.copy(alpha = 0.3f)),
                shape = RoundedCornerShape(12.dp),
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Authentication Required",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Color.Red),
                    )
                    Text(
                        text = "Please navigate to the 'Profile' tab to sign in or create an account before completing a reservation.",
                        fontSize = 13.sp,
                        color = Charcoal,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
            }
        }

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
            enabled = activeUser != null,
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

        if (isSubmitting) {
            Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = DarkSage)
            }
        } else {
            Button(
                onClick = {
                    if (activeUser == null) {
                        errorMessage = "Please sign in on the 'Profile' tab first."
                        return@Button
                    }
                    if (customerName.isBlank()) {
                        errorMessage = "Please enter your name to complete booking."
                        return@Button
                    }

                    isSubmitting = true
                    errorMessage = ""

                    // Map local selections to correct Service ID
                    val serviceId =
                        preselectedService?.id ?: when {
                            serviceInput.contains("swedish", ignoreCase = true) -> "s1"
                            serviceInput.contains("deep", ignoreCase = true) -> "s2"
                            serviceInput.contains("glow", ignoreCase = true) -> "s4"
                            serviceInput.contains("himalayan", ignoreCase = true) -> "s7"
                            else -> "s1"
                        }

                    coroutineScope.launch {
                        try {
                            val isoDateTime = "${bookingDate}T${if (bookingTime.contains("PM") && !bookingTime.startsWith("12")) "22" else "10"}:00:00.000Z"
                            NetworkClient.createBooking(serviceId, "staff1", isoDateTime)
                            Toast.makeText(context, "Reservation Confirmed!", Toast.LENGTH_SHORT).show()
                            onBookingConfirmed(
                                Booking(
                                    serviceName = preselectedService?.name ?: serviceInput,
                                    date = bookingDate,
                                    timeSlot = bookingTime,
                                    customerName = customerName,
                                    notes = notes,
                                    status = "Confirmed",
                                ),
                            )
                            onClearPreselectedService()
                            customerName = ""
                            notes = ""
                        } catch (e: Exception) {
                            errorMessage = e.message ?: "Failed to save booking in cloud."
                        } finally {
                            isSubmitting = false
                        }
                    }
                },
                colors =
                    ButtonDefaults.buttonColors(
                        containerColor = if (activeUser != null) SageGreen else Color.Gray,
                    ),
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                shape = RoundedCornerShape(8.dp),
            ) {
                Text(
                    text = if (activeUser != null) "Complete My Reservation" else "Sign In to Complete Reservation",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                )
            }
        }
    }
}
