package com.spa.wellness.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.Booking
import com.spa.wellness.data.Product
import com.spa.wellness.data.SessionOption
import com.spa.wellness.data.sessionOptions
import com.spa.wellness.ui.components.RatingLabel
import com.spa.wellness.ui.components.RoundIconButton
import com.spa.wellness.ui.theme.CardCream
import com.spa.wellness.ui.theme.CreamBackground
import com.spa.wellness.ui.theme.DeepGreen
import com.spa.wellness.ui.theme.SoftGreenTint
import com.spa.wellness.ui.theme.TextPrimary
import com.spa.wellness.ui.theme.TextSecondary
import com.spa.wellness.ui.theme.White

@Composable
fun BookServiceScreen(
    product: Product? = null,
    onBack: () -> Unit = {},
    onBookingConfirmed: (Booking) -> Unit = {},
) {
    val currentProduct = product ?: Product("Swedish massage oil", 4.4, 1276, 59, 69, Color(0xFF3E7A5A))
    var selectedSession by remember { mutableStateOf(sessionOptions.first()) }
    var atParlor by remember { mutableStateOf(true) }
    var name by remember { mutableStateOf("Jane Doe") }
    var date by remember { mutableStateOf("2026-08-02") }
    var time by remember { mutableStateOf("03:00 PM") }
    var phone by remember { mutableStateOf("+1 3323432234") }

    Scaffold(
        containerColor = CreamBackground,
        bottomBar = {
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .background(CreamBackground)
                        .padding(horizontal = 20.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Column {
                    Text("Total payable", fontSize = 12.sp, color = TextSecondary)
                    Text(
                        "$${selectedSession.price}",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                    )
                }
                Button(
                    onClick = {
                        val booking =
                            Booking(
                                serviceName = "${currentProduct.name} (${selectedSession.minutes} mins)",
                                date = date,
                                timeSlot = time,
                                customerName = name,
                                notes = "Phone: $phone. Location: ${if (atParlor) "At Parlor" else "At Home"}",
                                pointsEarned = 50,
                            )
                        onBookingConfirmed(booking)
                    },
                    shape = RoundedCornerShape(26.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = DeepGreen, contentColor = White),
                    modifier = Modifier.height(50.dp).width(160.dp),
                ) {
                    Text("Book now", fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        },
    ) { padding ->
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = 20.dp)
                    .verticalScroll(rememberScrollState()),
        ) {
            Spacer(Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RoundIconButton(
                    icon = { Icon(imageVector = Icons.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary) },
                    onClick = onBack,
                )
                Text("Book Service", fontSize = 17.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                Spacer(Modifier.size(38.dp))
            }

            Spacer(Modifier.height(18.dp))
            // Service summary row
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(currentProduct.imageColor),
                )
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(currentProduct.name, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Spacer(Modifier.height(4.dp))
                    RatingLabel(rating = currentProduct.rating, reviewCount = currentProduct.reviewCount, starSize = 12.sp)
                }
            }

            Spacer(Modifier.height(22.dp))
            Text("Session length", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                sessionOptions.forEach { option ->
                    SessionChip(
                        option = option,
                        selected = option == selectedSession,
                        onClick = { selectedSession = option },
                        modifier = Modifier.weight(1f),
                    )
                }
            }

            Spacer(Modifier.height(22.dp))
            Text("Where you want to get massage?", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                LocationChip(
                    label = "At Parlor",
                    selected = atParlor,
                    onClick = { atParlor = true },
                    modifier = Modifier.weight(1f),
                )
                LocationChip(
                    label = "At Home",
                    selected = !atParlor,
                    onClick = { atParlor = false },
                    modifier = Modifier.weight(1f),
                )
            }

            Spacer(Modifier.height(20.dp))
            FieldLabel("Your Full Name")
            InputField(value = name, onValueChange = { name = it }, trailingIcon = null)

            Spacer(Modifier.height(16.dp))
            FieldLabel("Select date")
            InputField(value = date, onValueChange = { date = it }, trailingIcon = Icons.Default.DateRange)

            Spacer(Modifier.height(16.dp))
            FieldLabel("Select time")
            InputField(value = time, onValueChange = { time = it }, trailingIcon = Icons.Default.Info)

            Spacer(Modifier.height(16.dp))
            FieldLabel("Mobile number")
            InputField(value = phone, onValueChange = { phone = it }, trailingIcon = null)

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SessionChip(
    option: SessionOption,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bgColor: Color = if (selected) SoftGreenTint else CardCream
    Box(
        modifier =
            modifier
                .clip(RoundedCornerShape(14.dp))
                .background(bgColor)
                .border(
                    width = if (selected) 1.5.dp else 0.dp,
                    color = if (selected) DeepGreen else Color.Transparent,
                    shape = RoundedCornerShape(14.dp),
                )
                .clickable { onClick() }
                .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (selected) {
                Box(
                    Modifier
                        .size(16.dp)
                        .clip(CircleShape)
                        .background(DeepGreen),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(imageVector = Icons.Filled.Check, contentDescription = null, tint = White, modifier = Modifier.size(11.dp))
                }
                Spacer(Modifier.height(4.dp))
            }
            Text("${option.minutes} mins", fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.Medium)
            Text("$${option.price}", fontSize = 13.sp, color = TextPrimary, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun LocationChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bgColor: Color = if (selected) DeepGreen else CardCream
    Box(
        modifier =
            modifier
                .clip(RoundedCornerShape(14.dp))
                .background(bgColor)
                .clickable { onClick() }
                .padding(vertical = 14.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            label,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = if (selected) White else TextPrimary,
        )
    }
}

@Composable
private fun FieldLabel(text: String) {
    Text(text, fontSize = 13.sp, color = TextSecondary)
    Spacer(Modifier.height(8.dp))
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun InputField(
    value: String,
    onValueChange: (String) -> Unit,
    trailingIcon: androidx.compose.ui.graphics.vector.ImageVector?,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        colors =
            OutlinedTextFieldDefaults.colors(
                focusedContainerColor = CardCream,
                unfocusedContainerColor = CardCream,
                focusedBorderColor = DeepGreen,
                unfocusedBorderColor = Color.Transparent,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary,
            ),
        shape = RoundedCornerShape(12.dp),
        modifier =
            Modifier
                .fillMaxWidth()
                .height(50.dp),
        trailingIcon =
            trailingIcon?.let {
                {
                    Icon(imageVector = it, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(18.dp))
                }
            },
    )
}
