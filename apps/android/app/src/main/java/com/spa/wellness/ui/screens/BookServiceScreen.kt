package com.example.spamarket.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.outlined.CalendarToday
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spamarket.data.SessionOption
import com.example.spamarket.data.sessionOptions
import com.example.spamarket.ui.components.PrimaryButton
import com.example.spamarket.ui.components.RatingLabel
import com.example.spamarket.ui.components.RoundIconButton
import com.example.spamarket.ui.theme.*

@Composable
fun BookServiceScreen(
    onBack: () -> Unit = {},
    onBookNow: () -> Unit = {}
) {
    var selectedSession by remember { mutableStateOf(sessionOptions.first()) }
    var atParlor by remember { mutableStateOf(true) }
    var date by remember { mutableStateOf("02/09/2022") }
    var time by remember { mutableStateOf("03:00 PM") }
    var phone by remember { mutableStateOf("+1 3323432234") }

    Scaffold(
        containerColor = CreamBackground,
        bottomBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CreamBackground)
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Total payable", fontSize = 12.sp, color = TextSecondary)
                    Text(
                        "$${selectedSession.price}",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary
                    )
                }
                Button(
                    onClick = onBookNow,
                    shape = RoundedCornerShape(26.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = DeepGreen, contentColor = White),
                    modifier = Modifier.height(50.dp).width(160.dp)
                ) {
                    Text("Book now", fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp)
        ) {
            Spacer(Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                RoundIconButton(
                    icon = { Icon(Icons.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary) },
                    onClick = onBack
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
                        .background(Color(0xFFB56A4A))
                )
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Full Body Massage", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    Spacer(Modifier.height(4.dp))
                    RatingLabel(rating = 4.4, reviewCount = 1276, starSize = 12.sp)
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
                        modifier = Modifier.weight(1f)
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
                    modifier = Modifier.weight(1f)
                )
                LocationChip(
                    label = "At Home",
                    selected = !atParlor,
                    onClick = { atParlor = false },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.height(20.dp))
            FieldLabel("Select date")
            InputField(value = date, trailingIcon = Icons.Outlined.CalendarToday)

            Spacer(Modifier.height(16.dp))
            FieldLabel("Select time")
            InputField(value = time, trailingIcon = Icons.Outlined.Info)

            Spacer(Modifier.height(16.dp))
            FieldLabel("Mobile number")
            InputField(value = phone, trailingIcon = null)

            Spacer(Modifier.height(12.dp))
        }
    }
}

@Composable
private fun SessionChip(
    option: SessionOption,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(if (selected) SoftGreenTint else CardCream)
            .border(
                width = if (selected) 1.5.dp else 0.dp,
                color = if (selected) DeepGreen else Color.Transparent,
                shape = RoundedCornerShape(14.dp)
            )
            .clickable { onClick() }
            .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (selected) {
                Box(
                    Modifier
                        .size(16.dp)
                        .clip(CircleShape)
                        .background(DeepGreen),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Filled.Check, contentDescription = null, tint = White, modifier = Modifier.size(11.dp))
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
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(if (selected) DeepGreen else CardCream)
            .clickable { onClick() }
            .padding(vertical = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            label,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = if (selected) White else TextPrimary
        )
    }
}

@Composable
private fun FieldLabel(text: String) {
    Text(text, fontSize = 13.sp, color = TextSecondary)
    Spacer(Modifier.height(8.dp))
}

@Composable
private fun InputField(value: String, trailingIcon: androidx.compose.ui.graphics.vector.ImageVector?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(CardCream)
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(value, fontSize = 14.sp, color = TextPrimary)
        trailingIcon?.let {
            Icon(it, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(18.dp))
        }
    }
}

