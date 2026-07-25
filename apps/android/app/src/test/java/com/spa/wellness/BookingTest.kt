package com.spa.wellness

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class BookingTest {
    @Test
    fun testSampleDataInitialization() {
        // Test that sample services are initialized correctly
        val services = SampleData.services
        assertNotNull(services)
        assertTrue(services.isNotEmpty())
        assertEquals(7, services.size)

        // Validate first service is Swedish Massage
        val firstService = services[0]
        assertEquals("Swedish Massage", firstService.name)
        assertEquals("Massages", firstService.category)
        assertEquals(95.0, firstService.price, 0.0)

        // Test that sample wellness tips are initialized correctly
        val tips = SampleData.wellnessTips
        assertNotNull(tips)
        assertEquals(3, tips.size)
        assertEquals("Box Breathing Exercise", tips[0].title)
    }

    @Test
    fun testBookingCreationAndStatus() {
        // Test creating a new booking with default status and points
        val booking =
            Booking(
                serviceName = "Swedish Massage",
                date = "2026-08-01",
                timeSlot = "10:00 AM",
                customerName = "Jane Doe",
                notes = "No special requests",
            )

        assertNotNull(booking.id)
        assertEquals("Swedish Massage", booking.serviceName)
        assertEquals("2026-08-01", booking.date)
        assertEquals("10:00 AM", booking.timeSlot)
        assertEquals("Jane Doe", booking.customerName)
        assertEquals("No special requests", booking.notes)
        assertEquals(50, booking.pointsEarned)
        assertEquals("Confirmed", booking.status)
    }

    @Test
    fun testLoyaltyTierCalculation() {
        // Simulate points tier mapping
        fun calculateTier(totalPoints: Int): String {
            return when {
                totalPoints >= 300 -> "Platinium Lotus"
                totalPoints >= 150 -> "Golden Aura"
                else -> "Silver Sage"
            }
        }

        assertEquals("Silver Sage", calculateTier(0))
        assertEquals("Silver Sage", calculateTier(100))
        assertEquals("Golden Aura", calculateTier(150))
        assertEquals("Golden Aura", calculateTier(250))
        assertEquals("Platinium Lotus", calculateTier(300))
        assertEquals("Platinium Lotus", calculateTier(500))
    }
}
