package com.example.spamarket.data

import androidx.compose.ui.graphics.Color

data class Product(
    val name: String,
    val rating: Double,
    val reviewCount: Int,
    val price: Int,
    val strikePrice: Int? = null,
    val imageColor: Color // stand-in for a real product photo
)

data class SessionOption(
    val minutes: Int,
    val price: Int
)

val topCategories = listOf("Face", "Massages", "Body treatments", "Hydro treatment")

val mostPopular = listOf(
    Product("Bloom rose oil", 4.4, 1276, 49, 69, Color(0xFF6B4A2E)),
    Product("Argan oil", 4.4, 1276, 69, 99, Color(0xFFC98A3E)),
    Product("Swedish massage oil", 4.4, 1276, 59, 69, Color(0xFF3E7A5A)),
)

val topRated = listOf(
    Product("Hot stone set", 4.6, 980, 89, null, Color(0xFF5A3A2A)),
    Product("Citrus body scrub", 4.5, 640, 39, null, Color(0xFFE0A94A)),
)

val sessionOptions = listOf(
    SessionOption(30, 20),
    SessionOption(60, 40),
    SessionOption(90, 60),
    SessionOption(120, 80),
)
