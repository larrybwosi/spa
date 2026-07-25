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
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.data.Product
import com.spa.wellness.ui.components.PrimaryButton
import com.spa.wellness.ui.components.RatingLabel
import com.spa.wellness.ui.components.RoundIconButton
import com.spa.wellness.ui.theme.CreamBackground
import com.spa.wellness.ui.theme.DeepGreen
import com.spa.wellness.ui.theme.TextPrimary
import com.spa.wellness.ui.theme.TextSecondary

private val highlights =
    listOf(
        "Take a well-deserved break from the city life as you experience Balinese Holistic care",
        "Lowers stress and anxiety",
        "Improve blood circulation",
    )

@Composable
fun DetailsScreen(
    product: Product? = null,
    onBack: () -> Unit = {},
    onBookSlot: () -> Unit = {},
) {
    val currentProduct = product ?: Product("Swedish massage oil", 4.4, 1276, 59, 69, Color(0xFF3E7A5A))

    Scaffold(
        containerColor = CreamBackground,
        bottomBar = {
            Box(Modifier.background(CreamBackground).padding(20.dp)) {
                PrimaryButton(text = "Book a slot", onClick = onBookSlot)
            }
        },
    ) { padding ->
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState()),
        ) {
            // Top bar
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RoundIconButton(
                    icon = { Icon(imageVector = Icons.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary) },
                    onClick = onBack,
                )
                Text("Details", fontSize = 17.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                RoundIconButton(
                    icon = { Icon(imageVector = Icons.Outlined.FavoriteBorder, contentDescription = "Favorite", tint = TextPrimary) },
                    onClick = {},
                )
            }

            // Hero image placeholder
            Box(
                modifier =
                    Modifier
                        .padding(horizontal = 20.dp)
                        .fillMaxWidth()
                        .height(190.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(currentProduct.imageColor),
            )

            Spacer(Modifier.height(18.dp))

            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(
                    currentProduct.name,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                )
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("From ", fontSize = 13.sp, color = TextSecondary)
                        Text("$${currentProduct.price}", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                    }
                    RatingLabel(rating = currentProduct.rating, reviewCount = currentProduct.reviewCount, starSize = 14.sp)
                }

                Spacer(Modifier.height(22.dp))
                Text("Highlights", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                Spacer(Modifier.height(12.dp))
                highlights.forEach { line ->
                    HighlightRow(text = line)
                    Spacer(Modifier.height(10.dp))
                }

                Spacer(Modifier.height(12.dp))
                Text("Details", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                Spacer(Modifier.height(8.dp))
                Text(
                    buildAnnotatedString {
                        append(
                            "This premium treatment uses organic elements to guarantee high comfort and relaxation. " +
                                "A professional therapist will adjust pressure according to your preferences. " +
                                "Warm stones and pure oils help relieve stress and chronic tension from the body. ",
                        )
                        withStyle(SpanStyle(color = DeepGreen, fontWeight = FontWeight.Medium)) {
                            append("Read More")
                        }
                    },
                    fontSize = 13.sp,
                    lineHeight = 20.sp,
                    color = TextSecondary,
                )
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun HighlightRow(text: String) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(
            imageVector = Icons.Filled.CheckCircle,
            contentDescription = null,
            tint = DeepGreen,
            modifier = Modifier.size(16.dp),
        )
        Spacer(Modifier.width(10.dp))
        Text(text, fontSize = 13.sp, lineHeight = 19.sp, color = TextSecondary)
    }
}
