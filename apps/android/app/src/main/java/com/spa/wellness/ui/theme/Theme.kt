package com.spa.wellness.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ---- Spa Wellness Colors ----
val SageGreen = Color(0xFF6E8E75)
val DarkSage = Color(0xFF4C6A53)
val WarmSand = Color(0xFFF7F4EF)
val SoftCream = Color(0xFFFCFAF6)
val GoldenLeaf = Color(0xFFD4AF37)
val Charcoal = Color(0xFF2E332E)

@Composable
fun SpaWellnessTheme(content: @Composable () -> Unit) {
    val colors =
        MaterialTheme.colorScheme.copy(
            primary = SageGreen,
            onPrimary = Color.White,
            background = WarmSand,
            onBackground = Charcoal,
            surface = SoftCream,
            onSurface = Charcoal,
        )
    MaterialTheme(
        colorScheme = colors,
        content = content,
    )
}

// ---- Marketplace Theme Colors ----
val CreamBackground = Color(0xFFF5F1E7) // app background
val CardCream = Color(0xFFEFEAE0) // subtle card / search bar fill
val DeepGreen = Color(0xFF1E3D2B) // primary buttons, active nav, price highlight
val DeepGreenDark = Color(0xFF16301F) // pressed / darker shade
val SoftGreenTint = Color(0xFFE7EDE7) // "At Parlor" unselected chip bg
val TextPrimary = Color(0xFF1C1C1C)
val TextSecondary = Color(0xFF8A8A82)
val TextMuted = Color(0xFFB0AC9F)
val StarGold = Color(0xFFF5A623)
val DividerColor = Color(0xFFE3DDCF)
val White = Color(0xFFFFFFFF)
val ChipBorder = Color(0xFFD8D2C2)

private val SpaColorScheme =
    lightColorScheme(
        primary = DeepGreen,
        onPrimary = White,
        background = CreamBackground,
        onBackground = TextPrimary,
        surface = CreamBackground,
        onSurface = TextPrimary,
        secondary = SoftGreenTint,
    )

val SpaTypography =
    Typography(
        headlineSmall =
            TextStyle(
                fontWeight = FontWeight.SemiBold,
                fontSize = 20.sp,
                color = TextPrimary,
            ),
        titleLarge =
            TextStyle(
                fontWeight = FontWeight.SemiBold,
                fontSize = 18.sp,
                color = TextPrimary,
            ),
        titleMedium =
            TextStyle(
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp,
                color = TextPrimary,
            ),
        bodyLarge =
            TextStyle(
                fontWeight = FontWeight.Normal,
                fontSize = 14.sp,
                color = TextPrimary,
            ),
        bodyMedium =
            TextStyle(
                fontWeight = FontWeight.Normal,
                fontSize = 13.sp,
                color = TextSecondary,
            ),
        labelSmall =
            TextStyle(
                fontWeight = FontWeight.Medium,
                fontSize = 11.sp,
                color = TextSecondary,
            ),
    )

@Composable
fun SpaMarketTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SpaColorScheme,
        typography = SpaTypography,
        content = content,
    )
}
