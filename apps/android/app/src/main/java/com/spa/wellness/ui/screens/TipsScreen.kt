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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.SampleData
import com.spa.wellness.ui.theme.Charcoal
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.GoldenLeaf
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream

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
