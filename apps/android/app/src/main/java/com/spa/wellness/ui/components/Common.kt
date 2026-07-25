package com.example.spamarket.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spamarket.ui.theme.*

/** Small "★ 4.4 (1276)" rating readout used on cards and detail headers. */
@Composable
fun RatingLabel(
    rating: Double,
    reviewCount: Int,
    starSize: androidx.compose.ui.unit.TextUnit = 12.sp,
    textColor: Color = TextPrimary
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Filled.Star,
            contentDescription = null,
            tint = StarGold,
            modifier = Modifier.size(with(androidx.compose.ui.platform.LocalDensity.current) { starSize.toDp() })
        )
        Spacer(Modifier.width(3.dp))
        Text(
            text = "$rating",
            fontSize = starSize,
            fontWeight = FontWeight.Medium,
            color = textColor
        )
        Spacer(Modifier.width(2.dp))
        Text(
            text = "($reviewCount)",
            fontSize = starSize,
            color = TextSecondary
        )
    }
}

/** Full-width dark green rounded call-to-action button. */
@Composable
fun PrimaryButton(
    text: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp),
        shape = RoundedCornerShape(26.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = DeepGreen,
            contentColor = White
        )
    ) {
        Text(text, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
    }
}

/** Circular back / icon button with a soft cream background, used in top bars. */
@Composable
fun RoundIconButton(
    icon: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .size(38.dp)
            .clip(CircleShape)
            .background(CardCream),
        contentAlignment = Alignment.Center
    ) {
        IconButton(onClick = onClick, modifier = Modifier.size(38.dp)) {
            icon()
        }
    }
}
