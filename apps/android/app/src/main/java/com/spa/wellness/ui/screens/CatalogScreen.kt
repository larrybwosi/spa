package com.spa.wellness.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.SampleData
import com.spa.wellness.SpaService
import com.spa.wellness.ui.theme.Charcoal
import com.spa.wellness.ui.theme.DarkSage
import com.spa.wellness.ui.theme.SageGreen
import com.spa.wellness.ui.theme.SoftCream

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
