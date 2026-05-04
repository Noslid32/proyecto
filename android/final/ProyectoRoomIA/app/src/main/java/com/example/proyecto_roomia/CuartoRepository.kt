package com.example.proyecto_roomia

import android.util.Log
import com.example.proyecto_roomia.CuartoRepository.BASE_URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import org.json.JSONArray

object CuartoRepository {

    private val client = OkHttpClient()
    private const val BASE_URL = "https://breeding-brute-antirust.ngrok-free.dev"
    private val JSON = "application/json; charset=utf-8".toMediaType()

    suspend fun getCuartos(): List<Cuarto> = withContext(Dispatchers.IO) {
        try {
            val url = "$BASE_URL/api/rooms"
            val request = Request.Builder()
                .url(url)
                .header("ngrok-skip-browser-warning", "true")
                .get()
                .build()
            val response = client.newCall(request).execute()

            if (!response.isSuccessful) {
                Log.e("API_ERROR", "Error en servidor: ${response.code}")
                return@withContext emptyList()
            }

            val body = response.body?.string() ?: return@withContext emptyList()
            Log.d("API_SUCCESS", "Datos recibidos: $body")
            val jsonArray = JSONArray(body)
            val cuartos = mutableListOf<Cuarto>()

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                cuartos.add(
                    Cuarto(
                        id = obj.optString("id", ""),
                        style = obj.optString("style", "Sin estilo"),
                        location = obj.optString("location", "Sin ubicación"),
                        price = obj.optString("price", "0"),
                        area = obj.optString("area", "0"),
                        aiDescription = obj.optString("aiDescription", ""),
                        imageUrls = buildList {
                            val arr = obj.optJSONArray("imageUrls") ?: return@buildList
                            for (j in 0 until arr.length()) add(arr.getString(j))
                        },
                        ownerId = obj.optString("ownerId", ""),
                        isPublished = obj.optBoolean("isPublished", false),
                        latitude = obj.optDouble("latitude", 0.0),
                        longitude = obj.optDouble("longitude", 0.0)
                    )
                )
            }
            cuartos
        } catch (e: Exception) {
            Log.e("API_EXCEPTION", "Error de conexión: ${e.message}")
            e.printStackTrace()
            emptyList()
        }
    }

    suspend fun registrarInteraccion(roomId: String, shares: Int = 0, contacts: Int = 0, views: Int = 0) = withContext(Dispatchers.IO) {
        try {
            // Construimos el JSON
            val json = JSONObject().apply {
                put("shares", shares)
                put("contacts", contacts)
                put("viewsCount", views)
            }

            val request = Request.Builder()
                .url("$BASE_URL/api/rooms/$roomId/interact")
                .header("ngrok-skip-browser-warning", "true")
                .post(json.toString().toRequestBody(JSON))
                .build()

            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    Log.e("API_INTERACT", "Error al registrar: ${response.code}")
                } else {
                    Log.d("API_INTERACT", "Interacción registrada con éxito")
                }
            }
        } catch (e: Exception) {
            Log.e("API_INTERACT", "Error de red: ${e.message}")
        }
    }

    suspend fun buscarCuartosConIA(userQuery: String): List<Cuarto> = withContext(Dispatchers.IO) {
        try {
            val jsonBody = JSONObject().apply {
                put("userQuery", userQuery)
            }

            val request = Request.Builder()
                .url("$BASE_URL/api/rooms/search")
                .header("ngrok-skip-browser-warning", "true")
                .post(jsonBody.toString().toRequestBody(JSON))
                .build()

            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: return@withContext emptyList()

            // Lógica de parseo
            val jsonArray = JSONArray(body)
            val cuartosFiltrados = mutableListOf<Cuarto>()

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                cuartosFiltrados.add(
                    Cuarto(
                        id = obj.optString("id", ""),
                        style = obj.optString("style", ""),
                        location = obj.optString("location", ""),
                        price = obj.optString("price", ""),
                        area = obj.optString("area", ""),
                        aiDescription = obj.optString("aiDescription", ""),
                        imageUrls = buildList {
                            val arr = obj.optJSONArray("imageUrls") ?: return@buildList
                            for (j in 0 until arr.length()) add(arr.getString(j))
                        },
                        latitude = obj.optDouble("latitude", 0.0),
                        longitude = obj.optDouble("longitude", 0.0)
                    )
                )
            }
            cuartosFiltrados
        } catch (e: Exception) {
            emptyList()
        }
    }

}
