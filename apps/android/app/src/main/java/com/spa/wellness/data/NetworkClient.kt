package com.spa.wellness.data

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object SessionManager {
    private const val PREFS_NAME = "spa_wellness_prefs"
    private const val KEY_TOKEN = "session_token"
    private const val KEY_USER_ID = "user_id"
    private const val KEY_USER_NAME = "user_name"
    private const val KEY_USER_EMAIL = "user_email"
    private const val KEY_USER_ROLE = "user_role"

    var currentToken: String? = null
    var currentUser: UserSession? = null

    fun init(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val token = prefs.getString(KEY_TOKEN, null)
        val id = prefs.getString(KEY_USER_ID, null)
        val name = prefs.getString(KEY_USER_NAME, null)
        val email = prefs.getString(KEY_USER_EMAIL, null)
        val role = prefs.getString(KEY_USER_ROLE, "CLIENT")

        if (token != null && id != null && name != null && email != null) {
            currentToken = token
            currentUser = UserSession(id, name, email, role ?: "CLIENT", token)
        }
    }

    fun saveSession(
        context: Context,
        id: String,
        name: String,
        email: String,
        role: String,
        token: String,
    ) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().apply {
            putString(KEY_TOKEN, token)
            putString(KEY_USER_ID, id)
            putString(KEY_USER_NAME, name)
            putString(KEY_USER_EMAIL, email)
            putString(KEY_USER_ROLE, role)
            apply()
        }
        currentToken = token
        currentUser = UserSession(id, name, email, role, token)
    }

    fun clearSession(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
        currentToken = null
        currentUser = null
    }
}

data class UserSession(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val token: String,
)

object NetworkClient {
    private const val TAG = "NetworkClient"

    var baseUrl = "http://10.0.2.2:3001/api"

    private suspend fun performRequest(
        path: String,
        method: String,
        body: JSONObject? = null,
        token: String? = null,
    ): String =
        withContext(Dispatchers.IO) {
            val url = URL("$baseUrl$path")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = method
            conn.connectTimeout = 10000
            conn.readTimeout = 10000
            conn.setRequestProperty("Content-Type", "application/json")
            conn.setRequestProperty("Accept", "application/json")

            val activeToken = token ?: SessionManager.currentToken
            if (activeToken != null) {
                conn.setRequestProperty("Authorization", "Bearer $activeToken")
            }

            if (body != null && (method == "POST" || method == "PUT" || method == "PATCH")) {
                conn.doOutput = true
                val writer = OutputStreamWriter(conn.outputStream)
                writer.write(body.toString())
                writer.flush()
                writer.close()
            }

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()
                conn.disconnect()
                response.toString()
            } else {
                val errorStream = conn.errorStream
                val response = StringBuilder()
                if (errorStream != null) {
                    val reader = BufferedReader(InputStreamReader(errorStream))
                    var line: String?
                    while (reader.readLine().also { line = it } != null) {
                        response.append(line)
                    }
                    reader.close()
                }
                conn.disconnect()
                val errMessage =
                    if (response.isNotEmpty()) {
                        try {
                            JSONObject(response.toString()).optString("message", "Error $responseCode")
                        } catch (e: Exception) {
                            "Error $responseCode: $response"
                        }
                    } else {
                        "Error $responseCode"
                    }
                throw Exception(errMessage)
            }
        }

    suspend fun signUp(
        name: String,
        email: String,
        password: String,
    ): JSONObject {
        val body =
            JSONObject().apply {
                put("name", name)
                put("email", email)
                put("password", password)
                put("role", "CLIENT")
            }
        val response = performRequest("/auth/signup", "POST", body)
        return JSONObject(response)
    }

    suspend fun signIn(
        email: String,
        password: String,
    ): JSONObject {
        val body =
            JSONObject().apply {
                put("email", email)
                put("password", password)
            }
        val response = performRequest("/auth/signin", "POST", body)
        return JSONObject(response)
    }

    suspend fun signOut(): Boolean {
        return try {
            performRequest("/auth/signout", "POST")
            true
        } catch (e: Exception) {
            Log.e(TAG, "Signout request failed", e)
            false
        }
    }

    suspend fun getServices(): JSONArray {
        val response = performRequest("/services", "GET")
        return JSONArray(response)
    }

    suspend fun getProducts(): JSONArray {
        val response = performRequest("/products", "GET")
        return JSONArray(response)
    }

    suspend fun getBookings(): JSONArray {
        val response = performRequest("/bookings", "GET")
        return JSONArray(response)
    }

    suspend fun createBooking(
        serviceId: String,
        staffId: String,
        dateTime: String,
    ): JSONObject {
        val body =
            JSONObject().apply {
                put("serviceId", serviceId)
                put("staffId", staffId)
                put("dateTime", dateTime)
            }
        val response = performRequest("/bookings", "POST", body)
        return JSONObject(response)
    }

    suspend fun cancelBooking(bookingId: String): JSONObject {
        val body =
            JSONObject().apply {
                put("status", "CANCELLED")
            }
        val response = performRequest("/bookings/$bookingId/status", "PATCH", body)
        return JSONObject(response)
    }
}
