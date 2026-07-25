package com.spa.wellness.ui.screens

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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.spa.wellness.data.Product
import com.spa.wellness.data.mostPopular
import com.spa.wellness.data.topCategories
import com.spa.wellness.data.topRated
import com.spa.wellness.ui.components.RatingLabel
import com.spa.wellness.ui.theme.CardCream
import com.spa.wellness.ui.theme.CreamBackground
import com.spa.wellness.ui.theme.DeepGreen
import com.spa.wellness.ui.theme.TextMuted
import com.spa.wellness.ui.theme.TextPrimary
import com.spa.wellness.ui.theme.TextSecondary

@Composable
fun MarketplaceScreen(onProductClick: (Product) -> Unit = {}) {
    Box(
        modifier =
            Modifier
                .fillMaxSize()
                .background(CreamBackground),
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp),
        ) {
            Spacer(Modifier.height(20.dp))
            Text(
                "Marketplace",
                fontSize = 20.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary,
                modifier = Modifier.fillMaxWidth(),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )

            Spacer(Modifier.height(16.dp))
            SearchBar()

            Spacer(Modifier.height(18.dp))
            CategoryTabs()

            Spacer(Modifier.height(22.dp))
            SectionHeader(title = "Most Popular")
            Spacer(Modifier.height(12.dp))
            ProductRow(products = mostPopular, onProductClick = onProductClick)

            Spacer(Modifier.height(22.dp))
            SectionHeader(title = "Top Rated")
            Spacer(Modifier.height(12.dp))
            ProductRow(products = topRated, onProductClick = onProductClick)

            Spacer(Modifier.height(12.dp))
        }
    }
}

@Composable
private fun SearchBar() {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .height(46.dp)
                .clip(RoundedCornerShape(23.dp))
                .background(CardCream)
                .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            "Search for creams, oils etc",
            color = TextMuted,
            fontSize = 14.sp,
            modifier = Modifier.weight(1f),
        )
        Icon(imageVector = Icons.Filled.Search, contentDescription = "Search", tint = TextSecondary)
    }
}

@Composable
private fun CategoryTabs() {
    var selected = "Massages"
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(22.dp),
    ) {
        topCategories.forEach { category ->
            val isSelected = category == selected
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    category,
                    fontSize = 14.sp,
                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                    color = if (isSelected) TextPrimary else TextMuted,
                )
                Spacer(Modifier.height(6.dp))
                if (isSelected) {
                    Box(
                        Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(DeepGreen),
                    )
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(title: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(title, fontSize = 17.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
        Text("See all", fontSize = 13.sp, color = TextSecondary)
    }
}

@Composable
private fun ProductRow(
    products: List<Product>,
    onProductClick: (Product) -> Unit,
) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
        items(products) { product ->
            ProductCard(product, onClick = { onProductClick(product) })
        }
    }
}

@Composable
private fun ProductCard(
    product: Product,
    onClick: () -> Unit,
) {
    Column(
        modifier =
            Modifier
                .width(140.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(Color.Transparent)
                .clickable { onClick() },
    ) {
        Box(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(product.imageColor.copy(alpha = 0.85f)),
        )
        Spacer(Modifier.height(8.dp))
        Text(
            product.name,
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
            color = TextPrimary,
            maxLines = 1,
        )
        Spacer(Modifier.height(4.dp))
        RatingLabel(rating = product.rating, reviewCount = product.reviewCount)
        Spacer(Modifier.height(4.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "$${product.price}",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary,
            )
            product.strikePrice?.let {
                Spacer(Modifier.width(6.dp))
                Text(
                    "$$it",
                    fontSize = 12.sp,
                    color = TextMuted,
                    textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough,
                )
            }
        }
    }
}
