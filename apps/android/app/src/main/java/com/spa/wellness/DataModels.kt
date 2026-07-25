package com.spa.wellness

import java.util.UUID

data class SpaService(
    val id: String,
    val name: String,
    val category: String,
    val durationMinutes: Int,
    val price: Double,
    val description: String,
    val benefits: String,
)

data class Booking(
    val id: String = UUID.randomUUID().toString(),
    val serviceName: String,
    val date: String,
    val timeSlot: String,
    val customerName: String,
    val notes: String = "",
    val pointsEarned: Int = 50,
    // Confirmed, Cancelled
    val status: String = "Confirmed",
)

data class WellnessTip(
    val id: String,
    val title: String,
    val duration: String,
    val category: String,
    val description: String,
    val steps: List<String>,
)

object SampleData {
    val services =
        listOf(
            SpaService(
                id = "s1",
                name = "Swedish Massage",
                category = "Massages",
                durationMinutes = 60,
                price = 95.0,
                description =
                    "A gentle full-body massage ideal for people who are new to massage, " +
                        "have a lot of tension, or are sensitive to touch.",
                benefits = "Improves circulation, eases muscle tension, promotes deep relaxation.",
            ),
            SpaService(
                id = "s2",
                name = "Deep Tissue Massage",
                category = "Massages",
                durationMinutes = 75,
                price = 120.0,
                description =
                    "Uses more pressure to reach deeper muscle layers. Best for chronic aches, " +
                        "pain, or rehabilitation.",
                benefits = "Alleviates chronic pain, releases deep muscle knots, enhances mobility.",
            ),
            SpaService(
                id = "s3",
                name = "Hot Stone Therapy",
                category = "Massages",
                durationMinutes = 90,
                price = 150.0,
                description =
                    "Heated flat stones are placed on specific parts of your body to deepen " +
                        "relaxation and ease tense muscles.",
                benefits = "Melts away stress, improves sleep quality, boosts overall energy.",
            ),
            SpaService(
                id = "s4",
                name = "Radiant Glow Facial",
                category = "Facials",
                durationMinutes = 45,
                price = 85.0,
                description =
                    "A classic deep cleansing facial combined with gentle exfoliation and a " +
                        "customized moisturizing mask.",
                benefits = "Restores natural radiance, hydrates dull skin, purifies pores.",
            ),
            SpaService(
                id = "s5",
                name = "Anti-Aging Collagen Facial",
                category = "Facials",
                durationMinutes = 60,
                price = 110.0,
                description =
                    "Infused with collagen and advanced serums to target fine lines and " +
                        "improve skin elasticity.",
                benefits = "Firms saggy skin, reduces appearance of wrinkles, provides youthful hydration.",
            ),
            SpaService(
                id = "s6",
                name = "Eucalyptus Steam & Sauna",
                category = "Sauna & Steam",
                durationMinutes = 30,
                price = 40.0,
                description =
                    "Relax in our state-of-the-art steam room infused with premium pure " +
                        "eucalyptus oils.",
                benefits = "Clears respiratory passages, detoxifies the body, relaxes minded senses.",
            ),
            SpaService(
                id = "s7",
                name = "Himalayan Salt Sauna",
                category = "Sauna & Steam",
                durationMinutes = 30,
                price = 45.0,
                description =
                    "Relax in dry heat surrounded by ancient pink salt crystals that emit " +
                        "negative ions.",
                benefits = "Enhances respiratory health, balances skin pH, reduces inflammation.",
            ),
        )

    val wellnessTips =
        listOf(
            WellnessTip(
                id = "t1",
                title = "Box Breathing Exercise",
                duration = "5 mins",
                category = "Relaxation",
                description =
                    "A powerful, simple tool to clear your mind, relax your body, and " +
                        "improve concentration.",
                steps =
                    listOf(
                        "Inhale slowly through your nose for 4 seconds.",
                        "Hold your breath inside for 4 seconds.",
                        "Exhale gently through your mouth for 4 seconds.",
                        "Hold your lungs empty for 4 seconds.",
                        "Repeat this cycle 4 to 5 times.",
                    ),
            ),
            WellnessTip(
                id = "t2",
                title = "Evening Decompression Routine",
                duration = "15 mins",
                category = "Sleep Preparation",
                description =
                    "Wind down your nervous system after a busy day to guarantee a deep and " +
                        "restorative sleep.",
                steps =
                    listOf(
                        "Dim all artificial lights in your room.",
                        "Unplug from all screens and digital devices.",
                        "Do 5 minutes of gentle neck and shoulder stretches.",
                        "Sip a cup of warm, caffeine-free chamomile tea.",
                        "Read a book or journal three things you are grateful for.",
                    ),
            ),
            WellnessTip(
                id = "t3",
                title = "Hydration & Detox Guide",
                duration = "Daily",
                category = "Nutrition",
                description =
                    "Water is key to flushing toxins released during saunas or massages. " +
                        "Maintain proper fluid levels.",
                steps =
                    listOf(
                        "Drink a tall glass of lukewarm water immediately upon waking.",
                        "Add fresh lemon slices to help alkalize and detoxify your body.",
                        "Aim for at least 2.5 liters of filtered water throughout the day.",
                        "Drink water before, during, and after any spa or steam treatment.",
                    ),
            ),
        )
}
