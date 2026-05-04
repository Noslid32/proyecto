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
    // Asegúrate de que esta URL sea la que te da ngrok actualmente
    private const val BASE_URL = "https://breeding-brute-antirust.ngrok-free.dev"
    private val JSON = "application/json; charset=utf-8".toMediaType()

    suspend fun getCuartos(): List<Cuarto> = withContext(Dispatchers.IO) {
        try {
            // CORRECCIÓN 1: Apuntar al endpoint correcto /api/rooms
            val url = "$BASE_URL/api/rooms"

            val request = Request.Builder()
                .url(url)
                .header("ngrok-skip-browser-warning", "true") // CORRECCIÓN 2: Saltar aviso de ngrok
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

                // CORRECCIÓN 3: Si quieres ver TODO aunque no esté publicado para probar,
                // comenta la siguiente línea:
                // if (!obj.optBoolean("isPublished", false)) continue

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
            // Construimos el cuerpo del JSON
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

}
