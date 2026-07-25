package com.spa.wellness.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.Booking
import com.spa.wellness.ui.theme.Charcoal
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.GoldenLeaf
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream

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
